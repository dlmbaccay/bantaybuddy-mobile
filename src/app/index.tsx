import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from '@react-native-firebase/auth';

export default function Index() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const handleAuthStateChanged = auth().onAuthStateChanged(user => {
      if (initializing) {
        setInitializing(false);
        if (user) {
          router.push('home');
        } else {
          router.push('(auth)/sign-in');
        }
      }
    });

    return () => handleAuthStateChanged();
  }, [initializing]);

  if (initializing) {
    return (
      <SafeAreaView className="flex items-center justify-center h-full">
        <Text className="text-xl">
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return null;
}