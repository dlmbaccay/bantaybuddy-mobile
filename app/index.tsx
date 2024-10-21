import { router } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  useEffect(() => {
    setTimeout(() => {
      router.replace("sign-up");
    }, 0);
  }, []);

  return (
    <SafeAreaView className="flex items-center justify-center h-full">
      <Text className="text-xl">
        Loading...
      </Text>
    </SafeAreaView>
  );
}