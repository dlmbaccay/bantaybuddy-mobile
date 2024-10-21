import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Divider, useTheme } from 'react-native-paper';

export default function SignUp() {
  const theme = useTheme();

  const [form, setForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <SafeAreaView className='h-full flex justify-center items-center'>

      <TextInput
        value={form.username}
        mode="outlined"
        label="Username"
        className="h-[50px] w-[90%] mt-4"
        left={<TextInput.Icon icon="account" />}
        onChangeText={(e: string) => setForm({ ...form, username: e })}
        style={{ backgroundColor: theme.colors.surface }}
      />

      <View className='h-[50px] w-[90%] mt-4 flex flex-row items-center justify-between'>
        <TextInput
          value={form.firstName}
          mode="outlined"
          label="First Name"
          className="h-[50px] w-[48.5%]"
          // left={<TextInput.Icon icon="alpha-f-box" />}
          onChangeText={(e: string) => setForm({ ...form, firstName: e })}
          style={{ backgroundColor: theme.colors.surface }}
        />

        <TextInput
          value={form.lastName}
          mode="outlined"
          label="Last Name"
          className="h-[50px] w-[48.5%]"
          // left={<TextInput.Icon icon="alpha-l-box" />}
          onChangeText={(e: string) => setForm({ ...form, lastName: e })}
          style={{ backgroundColor: theme.colors.surface }}
        />
      </View>

      <TextInput
        value={form.email}
        mode="outlined"
        label="Email"
        className="h-[50px] w-[90%] mt-4"
        left={<TextInput.Icon icon="email" />}
        onChangeText={(e: string) => setForm({ ...form, email: e })}
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

      <TextInput
        value={form.confirmPassword}
        mode="outlined"
        label="Confirm Password"
        className="h-[50px] w-[90%] mt-4"
        onFocus={() => setConfirmPasswordFocused(true)}
        onBlur={() => setConfirmPasswordFocused(false)}
        secureTextEntry={!confirmPasswordVisible}
        left={<TextInput.Icon icon={confirmPasswordFocused ? "key" : "key-outline"} />}
        right={
          <TextInput.Icon
            icon={confirmPasswordVisible ? "eye-off" : "eye"}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          />
        }
        onChangeText={(e: string) => setForm({ ...form, confirmPassword: e })}
        style={{ backgroundColor: theme.colors.surface }}
      />

      <Button
        mode='contained'
        className='h-[50px] w-[90%] mt-4 rounded-md flex justify-center'
        onPress={() => console.log('Pressed')}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Text className='font-bold text-base' style={{ color:theme.colors.onPrimary }}>Sign Up</Text>
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
  );
}