import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, TextInput, useTheme, Divider } from 'react-native-paper';
import { View, Image } from 'react-native';

export default function SignIn() {
  const theme = useTheme();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView className='h-full flex justify-center items-center'>

      <View className='flex flex-row items-center justify-center pr-1'>
        <Image
          source={require('../../assets/logo.png')}
          resizeMode='contain'
          style={{ width: 75, height: 75 }}
        />

        {/* <Text className='font-bold text-4xl mt-1 ml-1 mr-2'>BantayBuddy</Text> */}
      </View>

      <TextInput
        value={form.username}
        mode="outlined"
        label="Username"
        className="h-[50px] w-[90%] mt-4"
        left={<TextInput.Icon icon="account" />}
        onChangeText={(e: string) => setForm({ ...form, username: e })}
        style={{ backgroundColor: theme.colors.surface }}
      />

      <TextInput
        value={form.password}
        mode="outlined"
        label="Password"
        className="h-[50px] w-[90%] mt-4"
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        secureTextEntry={!passwordVisible}
        left={<TextInput.Icon icon={passwordFocused ? "key" : "key-outline"} />}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye-off" : "eye"}
            onPress={() => setPasswordVisible(!passwordVisible)} 
          />
        }
        onChangeText={(e: string) => setForm({ ...form, password: e })}
        style={{ backgroundColor: theme.colors.surface }}
      />

      <Button
        mode='contained'
        className='h-12 w-[90%] mt-4 rounded-md flex justify-center'
        onPress={() => console.log('Pressed')}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Text className='font-bold text-base' style={{ color:theme.colors.onPrimary }}>Sign In</Text>
      </Button>

      <View className='flex flex-row items-center justify-center w-[90%] mt-3'>
        <Divider className='w-[45%] mt-1 ' style={{ backgroundColor:theme.colors.outline }}/>
        <Text className='w-fit px-2'>or</Text>
        <Divider className='w-[45%] mt-1 ' style={{ backgroundColor:theme.colors.outline }}/>
      </View>

      {/* Continue with Google */}
      <Button
        mode='contained'
        className='h-12 w-[90%] mt-4 rounded-md flex justify-evenly'
        onPress={() => console.log('Pressed')}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Text className='font-bold text-base' style={{ color:theme.colors.onPrimary }}>Continue with Google&nbsp;&nbsp;</Text>
        <Image
          source={require('../../assets/google-icon.png')}
          resizeMode='contain'
          style={{ width: 18, height: 18 }}
        />
      </Button>
    </SafeAreaView>
  )
}