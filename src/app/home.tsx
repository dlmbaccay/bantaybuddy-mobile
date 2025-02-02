import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "@services/authService";
import { Alert } from "react-native";
import { useUser } from "@context/UserContext";

export default function HomePage() {
  const { currentUser, userData, refreshUserData } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser) {
        await refreshUserData();
      }
      setLoading(false);
    };
    fetchUser();
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('(auth)/sign-in');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex items-center justify-center h-full">
        <Text className="text-xl">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex items-center justify-center h-full">
      <Text className="text-xl">Home Page</Text>
      {userData && (
        <>
          <Text className="text-lg mt-2">Welcome, {userData.displayName || "User"}!</Text>
          <Text className="text-lg mt-2">Username: {userData.username}</Text>
        </>
      )}

      <Button mode="contained" onPress={() => router.push(`(profile)/(user)/${userData.uid}`)}>
        Go to User Profile
      </Button>

      <Button mode="contained" onPress={handleSignOut}>
        Sign Out
      </Button>
    </SafeAreaView>
  );
}