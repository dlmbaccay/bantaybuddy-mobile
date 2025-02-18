import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { View, Image, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function EditPetProfile() {

  return (
    <SafeAreaView className='h-full flex justify-center items-center px-4'>
      <Text>
        Edit Pet Profile
      </Text>
    </SafeAreaView>
  );
}