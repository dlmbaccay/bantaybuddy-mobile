import { useEffect, useState } from "react";
import { router } from "expo-router";
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { hasUsername } from "@services/userService";
import { useUser } from "@context/UserContext";

export default function RootPage() {
  const [initializing, setInitializing] = useState(true);
  const { setCurrentUser } = useUser();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (initializing) {
        if (user) {
          hasUsername(user.uid)
          .then(hasUsername => {
            if (hasUsername) {
              router.push('(home)');
            } else {
              router.push('(auth)/account-setup');
            }
          }).catch(error => {
            console.error(error);
          });

          setCurrentUser(user);
        } else {
          router.push('(auth)/sign-in');
        }
      }

      setInitializing(false);
    });

    return () => unsubscribe();
  }, [initializing, setCurrentUser]);

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