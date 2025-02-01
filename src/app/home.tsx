import { router } from "expo-router";
import { useEffect } from "react";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "@services/firebase";
import { Alert } from "react-native";
import { useUser } from "@context/UserContext";

export default function HomePage() {
  const { currentUser } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('(auth)/landing');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  return (
    <SafeAreaView className="flex items-center justify-center h-full">
      <Text className="text-xl">
        {currentUser?.displayName}
        Home Page
      </Text>

      <Button
        mode="contained"
        onPress={handleSignOut}
      >
        Sign Out
      </Button>
    </SafeAreaView>
  );
}