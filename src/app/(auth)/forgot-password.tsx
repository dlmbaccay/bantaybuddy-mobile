import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { View, Image, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { handleForgotPassword } from '@services/authService';

export default function ForgotPassword() {
  const theme = useTheme();

  // form state
  const [email, setEmail] = useState('');

  const handleForgotPasswordSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await handleForgotPassword(email);
      Alert.alert('Success', `Password reset link sent to ${email}`);
      router.push('(auth)/sign-in');
    } catch (error: any) {
      if (error.message === 'user-not-found') {
        Alert.alert('Error', 'No user found with this email');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Please enter a valid email');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  }

  return (
    <SafeAreaView className='h-full flex justify-center items-center px-4'>
      <View className='flex flex-col gap-4 items-center justify-center mb-8'>
        <Image
          source={require('../../assets/logo.png')}
          resizeMode='contain'
          style={{ width: 80, height: 80 }}
        />
      </View>

      <View className='flex flex-col itemsc-center justify-center w-full'>
        <Text className='text-base font-semibold text-center mb-2'>
          Enter your email to reset your password
        </Text>

        <TextInput
          autoCapitalize='none'
          label='Email'
          value={email}
          onChangeText={setEmail}
          mode='outlined'
          className='mb-4'
          left={<TextInput.Icon icon='email' />}
          theme={{ roundness: 10 }}
        />

        <Button
          mode='contained'
          onPress={handleForgotPasswordSubmit}
          className='h-12 rounded-[10px] flex items-center justify-center'
        >
          <Text className='text-white font-semibold text-base'>
            Reset Password
          </Text>
        </Button>

        <TouchableOpacity onPress={() => router.push('(auth)/sign-in')} className='mt-3'> 
          <Text className='font-semibold text-sm text-right' style={{ color: theme.colors.primary }}>
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}