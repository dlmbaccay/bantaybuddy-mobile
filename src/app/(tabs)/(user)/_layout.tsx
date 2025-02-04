import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="[user]" options={{ headerShown: false, gestureEnabled: true }} />
      <Stack.Screen name="edit" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
};