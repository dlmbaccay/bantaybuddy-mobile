import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Text, TextInput, HelperText, Avatar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from "@context/UserContext";;
// import { check, getUserInfo } from '@services/firebase';
import { checkUsernameAvailability, getUser } from '@services/userService';
import { handleAccountSetup, signOut } from '@services/authService';
import { uploadUserProfilePhoto } from '@services/storageService';
import * as ImagePicker from 'expo-image-picker';

import debounce from 'lodash.debounce';

const AccountSetup = () => {
  const theme = useTheme();
  const { currentUser, setCurrentUser } = useUser();
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameHelper, setUsernameHelper] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    photoURL: '',
  });

  useEffect(() => {
    if (currentUser) {
      const getUserData = async () => {
        try {
          const user = await getUser(currentUser.uid);
          if (user) {
            setForm((prev) => ({
              ...prev,
              username: user.username ?? '',
              displayName: user.displayName ?? '',
              photoURL: user.photoURL ?? '',
            }));
          }
        } catch (error) {
          console.error('Error getting user data:', error);
        }
      };

      getUserData();
    }
  }, [currentUser]);

  const handleUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      const trimmedUsername = username.trim();

      if (!trimmedUsername) {
        setUsernameHelper("Username cannot be empty.");
        setIsAvailable(false);
        return;
      }

      // Regex for valid usernames: 3-20 characters, only letters, numbers, and underscores
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

      if (!usernameRegex.test(trimmedUsername) || /\s/.test(username)) {
        setUsernameHelper("Username must be 3-20 characters, and contain only letters, numbers, or underscores.");
        setIsAvailable(false);
        return;
      }

      try {
        setCheckingUsername(true);
        const isAvailable = await checkUsernameAvailability(trimmedUsername);
        setIsAvailable(isAvailable);
        setUsernameHelper(isAvailable ? "Username is available!" : "Username is already taken.");
      } catch (error) {
        setUsernameHelper("Error checking username.");
      } finally {
        setCheckingUsername(false);
      }
    }, 500),
    []
  );

  const handleFinishAccountSetup = async () => {
    if (currentUser) {
      try {

        // if username is not available, return
        if (!isAvailable) {
          Alert.alert('Error', 'Username is already taken.');
          return;
        }

        let finalPhotoURL = form.photoURL;

        if (!form.photoURL) {
          // If user hasn't uploaded a photo, upload the default avatar
          const uploadedPhotoURL = await uploadUserProfilePhoto(currentUser.uid);
          if (uploadedPhotoURL) {
            finalPhotoURL = uploadedPhotoURL;
          } else {
            throw new Error('Failed to upload default avatar.');
          }
          setForm((prev) => ({ ...prev, photoURL: finalPhotoURL })); // Update UI
        }

        await handleAccountSetup(currentUser.uid, form.username, form.displayName);
        router.replace('(home)');
      } catch (error) {
        console.error('Error setting up account:', error);
        Alert.alert('Error', 'Failed to set up account.');
      }
    }
  };


  const handleUserPhotoURLChange = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to allow access to your gallery.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        if (currentUser) {
          const downloadURL = await uploadUserProfilePhoto(currentUser.uid, imageUri);
          if (downloadURL) {
            setForm((prev) => ({ ...prev, photoURL: downloadURL })); // Update UI instantly
          }
        }
      }
    } catch (error) {
      console.error('Error changing profile picture:', error);
      Alert.alert('Error', 'Failed to upload photo.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      router.replace('(auth)/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  }

  return (
    <SafeAreaView className='h-full flex justify-center items-center px-4'>

      {/* Logo & Title */}
      <View className='flex flex-row items-center justify-center mb-6'>
        <Image source={require('@assets/logo.png')} style={{ width: 35, height: 35 }} />
        <Text className='pl-1 text-2xl font-bold'>Complete Your Profile</Text>
      </View>

      {/* display name, username, photoURL */}
      <View className='flex flex-col items-center justify-center w-full mb-4'>
          <TouchableOpacity
            onPress={handleUserPhotoURLChange}
            className='mb-4'
          >
            <Avatar.Image
              size={100}
              source={form.photoURL ? { uri: form.photoURL } : require('@assets/default-user-avatar.png')}
              className='mb-4'
            />
          </TouchableOpacity>

        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          label='Display Name'
          mode='outlined'
          value={form.displayName}
          onChangeText={(text) => setForm((prev) => ({ ...prev, displayName: text }))}
          className='mb-2'
          theme={{ roundness: 10 }}
          style={{ width: '100%' }}
        />

        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          label='Username'
          mode='outlined'
          value={form.username}
          onChangeText={(text) => {
            if (text.length === 0 || text.trim().length !== 0) {
              setForm((prev) => ({ ...prev, username: text }));
              handleUsernameAvailability(text);
            }
          }}
          className='mb-2'
          theme={{ roundness: 10 }}
          style={{ width: '100%' }}
        />

        {form.username.trim() && (
          <HelperText
          type={checkingUsername ? 'info' : isAvailable ? 'info' : 'error'}
          visible={true}
          className='w-full text-left mb-2'
          >
          {checkingUsername ? 'Checking username...' : usernameHelper}
          </HelperText>
        )}

        <Button
          onPress={handleFinishAccountSetup}
          mode="contained"
          disabled={!form.username || !form.displayName || !isAvailable}
          className='mt-4 w-full h-12 flex justify-center'
          theme={{ roundness: 2 }}
        >
          <Text 
            style={{ color: theme.colors.surface }}
            className='font-bold text-base'
          >Finish</Text>
        </Button>
      </View>



      <Button
        onPress={handleSignOut}
        mode="text"
        className='mt-2 w-full h-12 flex items-center justify-center'
        theme={{ roundness: 2 }}
      >
        Sign Out
      </Button>
    </SafeAreaView>
  );
};

export default AccountSetup;
