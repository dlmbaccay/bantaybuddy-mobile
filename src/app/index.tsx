import { useEffect, useState } from "react";
import { router } from "expo-router";
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { handleUsernameCheck } from "@services/firebase";

export default function Index() {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const handleAuthStateChanged = auth().onAuthStateChanged(user => {
      if (initializing) {
        if (user) {
          handleUsernameCheck(user.uid).then(hasUsername => {
            if (hasUsername) {
              router.push('(app)/home');
            } else {
              router.push('(auth)/account-setup');
            }
          });
        } else {
          router.push('(auth)/sign-in');
        }
      }

      setInitializing(false);
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