import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, useTheme } from 'react-native-paper';
import { View, Image, Alert } from 'react-native';
import { handleGoogleSignIn } from '../../services/firebase';
import { useUser } from '../../context/UserContext';
import { router } from 'expo-router'

export default function AuthLanding() {
  const theme = useTheme();
  const { setCurrentUser } = useUser();

  const handleContinueWithGoogle = async () => {
    try {
      const { isNewUser } = await handleGoogleSignIn(setCurrentUser);
      if (isNewUser) {
        router.push('account-setup');
      } else {
        router.push('home');
      }
      
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className='h-full flex justify-center items-center'>
      <View className='flex flex-row items-center justify-center mb-4 pr-1'>
        <Image
          source={require('../../assets/logo.png')}
          resizeMode='contain'
          style={{ width: 75, height: 75 }}
        />
      </View>

      {/* Continue with Google */}
      <Button
        mode='contained'
        className='h-12 w-[90%] mt-4 rounded-md flex justify-evenly'
        onPress={handleContinueWithGoogle}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Text className='font-bold text-base' style={{ color: theme.colors.onPrimary }}>
          Continue with Google&nbsp;&nbsp;
        </Text>
        <Image
          source={require('../../assets/google-icon.png')}
          resizeMode='contain'
          style={{ width: 18, height: 18 }}
        />
      </Button>
    </SafeAreaView>
  );
}