import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { View, Image, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { signOut } from '@services/authService';

export default function UserProfile() {

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('(auth)/sign-in');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <SafeAreaView className='h-full flex justify-center items-center px-4'>
      <Text className="text-xl">
        User Profile
      </Text>

       <Button mode="contained" onPress={handleSignOut}>
        Sign Out
      </Button>
    </SafeAreaView>
  );
}