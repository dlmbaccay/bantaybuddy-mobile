import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Button, Avatar, ActivityIndicator, AnimatedFAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "@services/authService";
import { Alert, TouchableOpacity, View } from "react-native";
import { useUser } from "@context/UserContext";
import AddPetModal from "@components/AddPetModal";
import { fetchUserPetsId } from "@services/userService";
import { fetchOwnersPetsInfo } from "@services/petService";
import { Pet } from "@models/Pet";

export default function PetPage() {
  const { userData } = useUser();
  const [ addPostModalVisible, setAddPostModalVisible ] = useState(false);
  const [isAddPetButtonExtended, setIsAddPetButtonExtended] = useState(true);
  setTimeout(() => setIsAddPetButtonExtended(false), 1000);

  const [ pets, setPets ] = useState<Pet[]>([]);

  // fetch user pets id, then fetch pets info, then setPets
  useEffect(() => {
    if (!userData) return;

    fetchUserPetsId(userData.uid)
    .then(petsId => {
      fetchOwnersPetsInfo(petsId)
      .then(pets => setPets(pets));
    });
  }, [userData]);

  return (
    <SafeAreaView className="flex items-center justify-center h-full">

      {/* add pet button */}
      <AnimatedFAB  
        animateFrom="right"
        extended={isAddPetButtonExtended}
        label="Add Pet"
        icon="plus"
        onPress={() => setAddPostModalVisible(true)}
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
      />

      { pets.length === 0 && (
        <Text className="text-sm">
          You have no pets yet.
        </Text>
      )}

      <View className="w-full flex flex-wrap flex-row justify-evenly">
        {pets.map((pet, index) => (
          <TouchableOpacity
            key={pet.uid}
            className="w-[30%] p-2 flex items-center justify-center"
            onPress={() => router.push(`/(pets)/${pet.uid}`)}
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
    </SafeAreaView>
  );
}