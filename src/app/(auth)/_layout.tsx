import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="account-setup" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
};