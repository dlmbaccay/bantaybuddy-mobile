import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Button, Text, TextInput, useTheme, Avatar } from 'react-native-paper';
import { View, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { signOut } from '@services/authService';
import { useUser } from '@context/UserContext';
import { getUserDocument } from '@services/userService';

export default function UserProfile() {
  const { currentUser, setCurrentUser, userData } = useUser();

  const params = useLocalSearchParams();
  const userID = params.user as string;
  const [ user, setUser ] = useState(userData);

  useEffect(() => {
    if (userID === currentUser?.uid) {
      setUser(userData);
      return;
    }

    getUserDocument(userID)
    .then((data) => setUser(data))
    .catch(() => Alert.alert('Error', 'User not found'));
  }, [userID, userData]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      router.push('(auth)/sign-in');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <SafeAreaView className='h-full flex justify-center items-center px-4'>
      {/* instagram twitter profile fusion, no cover photo */}
      <View className='flex flex-row items-center w-full mb-8'>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon source='chevron-left' size={30}/>
        </TouchableOpacity>
        <Text className='font-bold text-2xl pl-1'>{user?.username}</Text>
      </View>

      <ScrollView className='w-full'>
        <View className='flex flex-row w-full items-center px-2 mb-4'>
          <Avatar.Image size={80} source={{ uri: user?.photoURL }} />
          
          <View className='pl-6'>
            {/* displayname */}
            <Text className='font-bold text-base mb-1'>{user?.displayName}</Text>

            {/* posts, followers, following */}
            <View className='flex flex-row items-center justify-center'>
              <View className='flex flex-col pr-6'>
                <Text className='font-bold text-lg'>{user?.posts?.length ?? 0}&nbsp;</Text>
                <Text className='text-base -mt-1'>posts</Text>
              </View>

              <View className='flex flex-col pr-6'>
                <Text className='font-bold text-lg'>{user?.followers?.length ?? 0}&nbsp;</Text>
                <Text className='text-base -mt-1'>followers</Text>
              </View>

              <View className='flex flex-col'>
                <Text className='font-bold text-lg'>{user?.following?.length ?? 0}&nbsp;</Text>
                <Text className='text-base -mt-1'>following</Text>
              </View>
            </View>
         </View>
        </View>

        <View className='flex flex-col'>
          <Text className='text-base pl-2 w-full break-words'>
            {/* {user?.bio} */}
            test bio
          </Text>

          <View className='flex flex-row justify-between items-center w-full mt-4'>
            { currentUser?.uid === userID && (
              <Button 
                mode='contained'
                theme={{ roundness: 2 }}
                className='w-full'
                onPress={() => {}}
              >Edit Profile</Button>
            )}

            { currentUser?.uid !== userID && (
              <Button 
                mode='outlined'
                theme={{ roundness: 2 }}
                className='w-full'
                onPress={() => {}}
              >Follow</Button>
            )}
          </View>
        </View>
        
        
      </ScrollView>
    </SafeAreaView>
  );
}