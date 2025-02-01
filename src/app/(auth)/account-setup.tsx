import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { signOut } from '@services/firebase';
import { Alert } from 'react-native';
import { router } from 'expo-router';

const AccountSetup = () => {
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('(auth)/sign-in');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <View className='flex items-center justify-center h-full'>
      <Text>Account Setup</Text>
      
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default AccountSetup;