import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "@services/authService";
import { Alert } from "react-native";
import { useUser } from "@context/UserContext";

export default function ExplorePage() {
  return (
    <SafeAreaView className="flex items-center justify-center h-full">
      <Text className="text-xl">Explore Page</Text>
    </SafeAreaView>
  );
}