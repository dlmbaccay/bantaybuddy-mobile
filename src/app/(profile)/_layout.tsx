import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="(user)/[user]" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(user)/edit" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(pet)/[pet]" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(pet)/edit" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
};