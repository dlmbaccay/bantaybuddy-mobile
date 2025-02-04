import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "@services/authService";
import { Alert } from "react-native";
import { useUser } from "@context/UserContext";
import { getIDfromUsername, getAllUsernames } from "@services/userService";

export default function HomePage() {
  const { currentUser, userData, refreshUserData } = useUser();
  const [loading, setLoading] = useState(true);

  const [allUsernames, setAllUsernames] = useState<string[]>([]);

  useEffect(() => {
    getAllUsernames()
      .then((usernames) => {
        setAllUsernames(usernames);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);
  
  const handleUsernameClick = async (username: string) => {
    try {
      const uid = await getIDfromUsername(username);
      router.push(`(tabs)/(user)/${uid}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'User not found');
    }
  }

  return (
    <SafeAreaView className="flex items-center justify-center h-full">
      <Text className="text-xl">Home Page</Text>

      { allUsernames.map((username) => (
        <Button
          key={username}
          onPress={() => handleUsernameClick(username)}
        > { username } </Button>
      )) }
    </SafeAreaView>
  );
}