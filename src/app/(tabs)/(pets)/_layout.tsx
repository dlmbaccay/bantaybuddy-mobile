import { Stack } from "expo-router";

export default function PetLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="edit" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="[pet]" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
};