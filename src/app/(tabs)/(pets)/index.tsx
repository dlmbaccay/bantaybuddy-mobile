import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Button, Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "@services/authService";
import { Alert, TouchableOpacity, View } from "react-native";
import { useUser } from "@context/UserContext";
import AddPetModal from "@components/AddPetModal";
import { fetchUserPetsId } from "@services/userService";
import { fetchPetsInfo } from "@services/petService";
import { Pet } from "@models/Pet";

export default function PetPage() {
  const { userData } = useUser();
  const [ addPostModalVisible, setAddPostModalVisible ] = useState(false);

  const [ pets, setPets ] = useState<Pet[]>([]);

  // fetch user pets id, then fetch pets info, then setPets
  useEffect(() => {
    if (!userData) return;

    fetchUserPetsId(userData.uid)
    .then(petsId => {
      fetchPetsInfo(petsId)
      .then(pets => setPets(pets));
    });
  }, [userData]);

  return (
    <SafeAreaView className="flex items-center justify-center h-full">

      { pets.length === 0 && (
        <Text className="text-sm">
          You have no pets yet.
        </Text>
      )}

      <View className="w-full flex flex-wrap flex-row justify-evenly">
        {pets.map((pet, index) => (
          <TouchableOpacity
            key={pet.uid}
            className="w-1/2 p-2 flex items-center justify-center"
            onPress={() => router.push(`/pet/${pet.uid}`)}  
          >
            <Avatar.Image size={80} source={{ uri: pet.photoURL }} />
            <Text className="mt-2 font-bold text-base">{pet.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      
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