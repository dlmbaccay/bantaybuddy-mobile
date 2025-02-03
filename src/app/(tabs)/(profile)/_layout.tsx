import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="[user]" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="edit" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
};