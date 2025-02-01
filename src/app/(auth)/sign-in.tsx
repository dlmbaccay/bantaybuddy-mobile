import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, useTheme } from 'react-native-paper';
import { View, Image, Alert, TouchableOpacity } from 'react-native';
import { handleEmailPasswordSignIn, handleGoogleAuth } from "@services/firebase"
import { useUser } from '@context/UserContext';
import { router } from 'expo-router'
import { TextInput } from 'react-native-paper';

export default function SignIn() {
  const theme = useTheme();
  const { setCurrentUser } = useUser();

  // form state
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!signInForm.email || !signInForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    try {
      const { user, hasUsername } = await handleEmailPasswordSignIn(signInForm.email, signInForm.password);
      setCurrentUser(user);
  
      if (hasUsername) router.push('home');
      else router.push('account-setup');
    
    } catch (error: any) {
      if (error.message === 'not-email-verified') Alert.alert('Error', 'Please verify your email first');
      else Alert.alert('Error', error.message);
    }
  };

  const handleContinueWithGoogle = async () => {
    try {
      const { isNewUser } = await handleGoogleAuth(setCurrentUser);
      if (isNewUser) router.push('account-setup');
      else router.push('home');
    } catch (error: any) {
      if (error.message === 'email-in-use') Alert.alert('Error', 'This email is already in use');
      console.log(error);
    }
  };

  return (
    <SafeAreaView className='h-full flex justify-center items-center px-4'>
      <View className='flex flex-col gap-4 items-center justify-center mb-8'>
        <Image
          source={require('../../assets/logo.png')}
          resizeMode='contain'
          style={{ width: 80, height: 80 }}
        />
      </View>

      <View className='flex flex-col itemsc-center justify-center w-full mb-4'>
        <TextInput
          autoCapitalize='none'
          label='Email'
          left={<TextInput.Icon icon='email' />}
          value={signInForm.email}
          onChangeText={(email) => setSignInForm({ ...signInForm, email })}
          mode='outlined'
          className='mb-4'
          theme={{ roundness: 10 }}
        />

        <TextInput
          autoCapitalize='none'
          label='Password'
          left={<TextInput.Icon icon={showPassword ? 'lock-open' : 'lock'} />}
          value={signInForm.password}
          onChangeText={(password) => setSignInForm({ ...signInForm, password })}
          mode='outlined'
          secureTextEntry={!showPassword}
          right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
          className='mb-4'
          theme={{ roundness: 10 }}
        />

        <TouchableOpacity onPress={() => router.push('forgot-password')}>
          <Text className='font-semibold text-sm text-right' style={{ color: theme.colors.primary }}>
            Forgot Password
          </Text>
        </TouchableOpacity>
      </View>

      <View className='flex flex-col items-center justify-center w-full'>
        {/* Traditional Sign In */}
        <Button
          mode='contained'
          className='h-12 w-full mt-4 rounded-[10px]'
          onPress={handleSignIn}
          style={{ backgroundColor: theme.colors.primary }}
          >
          <Text className='font-semibold text-base' style={{ color: theme.colors.onPrimary }}>
            Sign In
          </Text>
        </Button>

        {/* horizontal or horizontal*/}
        <View className='flex flex-row items-center justify-center mt-4'>
          <View className='h-px bg-gray-300 w-[41%]'></View>
          <Text className='mx-5 font-semibold text-xs'>OR</Text>
          <View className='h-px bg-gray-300 w-[41%]'></View>
        </View>

        {/* Continue with Google */}
        <Button
          mode='contained'
          onPress={handleContinueWithGoogle}
          className='h-12 w-full mt-4 rounded-[10px] bg-black flex items-center justify-center'
          icon={({ size }) => (
            <Image source={require('@assets/google-icon.png')} style={{ width: size, height: size }} />
          )}
        >
          <Text className='font-semibold text-base ' style={{ color: theme.colors.onPrimary }}>
            Continue with Google&nbsp;&nbsp;
          </Text>
        </Button>

        {/* Create an Account */}
        <View className='flex flex-row items-center justify-center w-full mt-4'>
          <Text className='text-center text-sm'>
            Don't have an account?&nbsp;
          </Text>
          <TouchableOpacity onPress={() => router.push('sign-up')}>
          <Text className='font-semibold text-sm' style={{ color: theme.colors.primary }}>
            Sign Up
          </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}