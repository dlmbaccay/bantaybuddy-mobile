import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, useTheme } from 'react-native-paper';
import { View, Image, Alert, TouchableOpacity } from 'react-native';
import { handleEmailPasswordSignUp, handleGoogleAuth } from "@services/firebase"
import { useUser } from '@context/UserContext';
import { router } from 'expo-router'
import { TextInput } from 'react-native-paper';
import { User } from '@models/User';

export default function SignUp() {
  const theme = useTheme();
  const { setCurrentUser } = useUser();

  // form state
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {  
    if (!signUpForm.email || !signUpForm.password || !signUpForm.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    } else if (signUpForm.password !== signUpForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    try {
      setSubmitting(true);
      await handleEmailPasswordSignUp(signUpForm.email, signUpForm.password);
      Alert.alert('Success', `You're signed up. Please verify your email to continue`);
      router.push('(auth)/sign-in');
    } catch (error: any) {
      if (error.message === 'email-in-use') Alert.alert('Error', 'This email is already in use');
      else Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
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

      <View className='flex flex-col itemsc-center justify-center w-full mb-2'>
        <TextInput
          autoCapitalize='none'
          label='Email'
          left={<TextInput.Icon icon='email' />}
          value={signUpForm.email}
          onChangeText={(email) => setSignUpForm({ ...signUpForm, email })}
          mode='outlined'
          className='mb-4'
          theme={{ roundness: 10 }}
        />

        <TextInput
          autoCapitalize='none'
          label='Password'
          left={<TextInput.Icon icon={showPassword ? 'lock-open' : 'lock'} />}
          value={signUpForm.password}
          onChangeText={(password) => setSignUpForm({ ...signUpForm, password })}
          mode='outlined'
          secureTextEntry={!showPassword}
          right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
          className='mb-4'
          theme={{ roundness: 10 }}
        />

        <TextInput
          autoCapitalize='none'
          label='Confirm Password'
          left={<TextInput.Icon icon={showConfirmPassword ? 'lock-open' : 'lock'} />}
          value={signUpForm.confirmPassword}
          onChangeText={(confirmPassword) => setSignUpForm({ ...signUpForm, confirmPassword })}
          mode='outlined'
          secureTextEntry={!showConfirmPassword}
          right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
          className='mb-4'
          theme={{ roundness: 10 }}
        />
      </View>

      <View className='flex flex-col items-center justify-center w-full'>
        {/* Traditional Sign In */}
        <Button
          mode='contained'
          disabled={submitting}
          className='h-12 w-full mt-4 rounded-[10px]'
          onPress={handleSignUp}
          style={{ backgroundColor: theme.colors.primary }}
          >
          <Text className='font-semibold text-base' style={{ color: theme.colors.onPrimary }}>
            Sign Up
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
            Already have an account?&nbsp;
          </Text>
          <TouchableOpacity onPress={() => router.push('sign-in')}>
          <Text className='font-semibold text-sm' style={{ color: theme.colors.primary }}>
            Sign In
          </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}