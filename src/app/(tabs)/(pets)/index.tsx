import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "@services/authService";
import { Alert } from "react-native";
import { useUser } from "@context/UserContext";
import AddPetModal from "@components/AddPetModal";

export default function PetPage() {
  const { userData } = useUser();
  const [ addPostModalVisible, setAddPostModalVisible ] = useState(false);

  return (
    <SafeAreaView className="flex items-center justify-center h-full">
      <Text className="text-sm">
        You have no pets yet.
      </Text>

      <AddPetModal 
        visible={addPostModalVisible} 
        userData={userData}
        onClose={() => setAddPostModalVisible(false)} 
        />

      <Button 
        onPress={() => setAddPostModalVisible(true)}
        mode="contained"
        icon={"paw"}
        className="mt-4"  
      >
        Add a pet
      </Button>
    </SafeAreaView>
  );
}