import React, { useState, useEffect } from "react";
import { Alert, Platform, TouchableOpacity, Modal, Pressable, ScrollView } from "react-native";
import { Portal, Button, Text, useTheme, TextInput, Chip, Avatar } from "react-native-paper";
import { View } from "react-native";
import { Asset } from 'expo-asset';
import DateTimePicker from "@react-native-community/datetimepicker";
import { User } from "@models/User";
import * as ImagePicker from "expo-image-picker";
import { getIDfromUsername, getAllUsernames } from "@services/userService";
import { addPetToFirestore, updatePetProfile } from "@services/petService";
import { uploadPetProfilePhoto } from "@services/storageService";

interface AddPetModalProps {
  visible: boolean;
  userData: User;
  onClose: () => void;
}

const AddPetModal = ({ visible, userData, onClose }: AddPetModalProps) => {
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const usernames = await getAllUsernames();
        setUserOptions(usernames);

        // Ensure current user is always in the owners list
        if (userData.username && !addPetForm.owners.includes(userData.username)) {
          if (userData.username) {
            setAddPetForm((prev) => ({
              ...prev,
              owners: [...prev.owners, userData.username!],
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
    };

    fetchUsernames();
  }, []);

  const initialFormState = {
    uid: "",
    name: "",
    owners: [userData.username || ""],
    breed: "",
    sex: "",
    photoURL: "",
    birthdate: "",
    birthplace: "",
    favoriteFood: [] as string[],
    hobbies: [] as string[],
  };

  const theme = useTheme();
  const [addPetForm, setAddPetForm] = useState(initialFormState);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hobbyInput, setHobbyInput] = useState("");
  const [foodInput, setFoodInput] = useState("");
  const [ownerInput, setOwnerInput] = useState("");
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null); // Local photo before upload
  const [isUploading, setIsUploading] = useState(false);
  const filteredUsernames = userOptions.filter((user) =>
    user.toLowerCase().includes(ownerInput.toLowerCase()) &&
    !addPetForm.owners.includes(user)
  );

  const handleDateChange = (_event: any, date?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);

    if (date && _event.type === "set") {
      setSelectedDate(date);
      setAddPetForm((prev) => ({
        ...prev,
        birthdate: date.toLocaleDateString("en-PH")
      }));
    }
  };

  const handleAddHobby = () => {
    const newHobby = hobbyInput.trim();
    if (newHobby && !addPetForm.hobbies.includes(newHobby)) {
      setAddPetForm((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby],
      }));
    }
    
    setHobbyInput(""); // Clear input
  };

  const handleAddFood = () => {
    const newFood = foodInput.trim();
    if (newFood && !addPetForm.favoriteFood.includes(newFood)) {
      setAddPetForm((prev) => ({
        ...prev,
        favoriteFood: [...prev.favoriteFood, newFood],
      }));
    }
    
    setFoodInput(""); // Clear input
  };

  const removeItem = (item: string, field: "hobbies" | "favoriteFood") => {
    setAddPetForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((i) => i !== item),
    }));
  };
  
  const handleAddOwner = (username: string) => {
    setAddPetForm((prev) => ({
      ...prev,
      owners: [...prev.owners, username],
    }));
    setOwnerInput(""); // Clear input
    setDropdownVisible(false); // Hide dropdown
  };

  const removeOwner = (owner: string) => {
    if (owner !== userData.username) {
      setAddPetForm((prev) => ({
        ...prev,
        owners: prev.owners.filter((o) => o !== owner),
      }));
    }
  };

  // Handle selecting a pet photo (local only, no upload yet)
  const handlePetPhotoChange = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "You need to allow access to your gallery.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setLocalPhotoUri(result.assets[0].uri); // Store locally, not uploaded yet
      }
    } catch (error) {
      console.error("Error selecting pet photo:", error);
      Alert.alert("Error", "Failed to select photo.");
    }
  };

  // Handle adding pet
  const handleAddPet = async () => {
    try {
      setIsUploading(true);
      
      const ownerUids = await Promise.all(addPetForm.owners.map(getIDfromUsername));

      const newPet = { ...addPetForm, owners: ownerUids, };

      const petRef = await addPetToFirestore(newPet);

      let finalPhotoURL = addPetForm.photoURL;

      if (!localPhotoUri) {
        const uploadedPhotoURL = await uploadPetProfilePhoto(petRef.id);
        if (uploadedPhotoURL) finalPhotoURL = uploadedPhotoURL;
        else throw new Error("Failed to upload default avatar.");
      } else {
        const uploadedPhotoURL = await uploadPetProfilePhoto(petRef.id, localPhotoUri);
        if (uploadedPhotoURL) finalPhotoURL = uploadedPhotoURL;
        else throw new Error("Failed to upload pet photo.");
      }

      // Reset form and close modal
      setAddPetForm(initialFormState);
      setLocalPhotoUri(null);
      onClose();
    } catch (error) {
      console.error("Error adding pet:", error);
      Alert.alert("Error", "Failed to add pet.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setAddPetForm(initialFormState);
    setLocalPhotoUri(null);
    onClose();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleCancel} animationType="slide">
        <View 
          className={`
            flex flex-row justify-between items-center w-full 
            ${Platform.OS === "ios" ? "pt-16" : "pt-2"}`}
        >
          <Button mode="text"
            onPress={() => {
              setAddPetForm(initialFormState);
              onClose();
            }}
          >
            <Text style={{ color: theme.colors.onBackground, fontSize: 16 }}>Cancel</Text>
          </Button>

          <Text style={{ color: theme.colors.onBackground, fontSize: 16 }} className="font-bold">
            Add a Pet
          </Text>

          <Button mode="text" onPress={handleAddPet} disabled={isUploading}>
            <Text style={{ color: theme.colors.primary, fontSize: 16 }}>Add</Text>
          </Button>
        </View>
        <ScrollView>
          <TouchableOpacity onPress={handlePetPhotoChange} className="flex items-center justify-center py-4">
            <Avatar.Image
              size={100}
              source={localPhotoUri ? { uri: localPhotoUri } : require("@assets/default-pet-avatar.png")}
            />
          </TouchableOpacity>

          <View className="flex flex-col w-full px-4">
            <TextInput
              label="Name"
              value={addPetForm.name}
              onChangeText={(name) => setAddPetForm({ ...addPetForm, name })}
              theme={{ roundness: 10 }}
              autoCapitalize="none"
              left={<TextInput.Icon icon="paw" />}
              mode="outlined"
              className="mb-4"
              style={{ width: "100%" }}
            />

            <TextInput
              label="Breed"
              value={addPetForm.breed}
              onChangeText={(breed) => setAddPetForm({ ...addPetForm, breed })}
              theme={{ roundness: 10 }}
              autoCapitalize="none"
              left={<TextInput.Icon icon="dna" />}
              mode="outlined"
              className="mb-4"
              style={{ width: "100%" }}
            />

            <View className="mb-2">
              <TextInput
                label="Owners"
                autoCapitalize="none"
                placeholder="Search username..."
                value={ownerInput}
                onChangeText={(text) => {
                  setOwnerInput(text);
                  setDropdownVisible(text.length > 0); // Show dropdown if input is not emptyz
                }}
                mode="outlined"
                theme={{ roundness: 10 }}
                left={<TextInput.Icon icon="account" />}
                style={{ width: "100%", zIndex: 10 }}
              />

              {/* Scrollable Dropdown List (max-height: 200px) */}
              {dropdownVisible && filteredUsernames.length > 0 && (
                <View style={{ backgroundColor: theme.colors.surface, elevation: 3, paddingTop: 6, borderBottomRightRadius: 8, borderBottomLeftRadius: 8, maxHeight: 120, top: -6, zIndex: 1 }}>
                  <ScrollView>
                    {filteredUsernames.slice(0, 5).map((user, index) => (
                      <TouchableOpacity key={index} onPress={() => handleAddOwner(user)} style={{ padding: 10 }}>
                        <Text>{user}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Display Selected Owners as Chips */}
              <View className="mt-4" style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {addPetForm.owners.map((owner, index) => (
                  <Chip key={index} onClose={() => removeOwner(owner)} disabled={owner === userData.username} style={{ marginRight: 5, marginBottom: 5 }}>
                    {owner}
                  </Chip>
                ))}
              </View>
            </View>

            {/* Birthdate Picker */}
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
              style={{ width: "100%" }}
            >
              <View pointerEvents="none">
                <TextInput
                  label="Birthdate"
                  value={addPetForm.birthdate}
                  mode="outlined"
                  theme={{ roundness: 10 }}
                  left={<TextInput.Icon icon="calendar" />}
                  editable={false}
                  className="mb-4"
                  style={{ width: "100%" }}
                />
              </View>
            </TouchableOpacity>

            {/* iOS: Uses Modal + Confirm Button */}
            {showDatePicker && Platform.OS === "ios" && (
              <Modal transparent animationType="fade">
                <Pressable
                  style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" }}
                  onPress={() => setShowDatePicker(false)}
                >
                  <View style={{ backgroundColor: theme.colors.surface, padding: 10 }}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                    />
                  </View>
                </Pressable>
              </Modal>
            )}

            {/* Android: Default Behavior */}
            {showDatePicker && Platform.OS === "android" && (
              <DateTimePicker value={selectedDate} mode="date" display="spinner"  onChange={handleDateChange} />
            )}

            <TextInput
              label="Birthplace"
              value={addPetForm.birthplace}
              onChangeText={(birthplace) => setAddPetForm({ ...addPetForm, birthplace })}
              theme={{ roundness: 10 }}
              autoCapitalize="none"
              left={<TextInput.Icon icon="map-marker" />}
              mode="outlined"
              className="mb-4"
              style={{ width: "100%" }}
            />

            <View className="mb-1">
              <TextInput
                label="Hobbies"
                placeholder="Type a hobby and press add"
                value={hobbyInput}
                onChangeText={setHobbyInput}
                mode="outlined"
                theme={{ roundness: 10 }}
                left={<TextInput.Icon icon="heart" />}
                right={<TextInput.Icon icon="plus" onPress={handleAddHobby} />}
                className="mb-2"
                style={{ width: "100%" }}
              />
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
                {addPetForm.hobbies.map((hobby, index) => (
                  <Chip key={index} onClose={() => removeItem(hobby, "hobbies")} style={{ marginRight: 5, marginBottom: 5 }}>
                    {hobby}
                  </Chip>
                ))}
              </View>
            </View>

            <View className="mb-2">
              <TextInput
                label="Favorite Food"
                placeholder="Type a food and press add"
                value={foodInput}
                onChangeText={setFoodInput}
                mode="outlined"
                theme={{ roundness: 10 }}
                left={<TextInput.Icon icon="food-drumstick" />}
                right={<TextInput.Icon icon="plus" onPress={handleAddFood} />}
                className="mb-2"
                style={{ width: "100%" }}
              />
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
                {addPetForm.favoriteFood.map((food, index) => (
                  <Chip key={index} onClose={() => removeItem(food, "favoriteFood")} style={{ marginRight: 5, marginBottom: 5 }}>
                    {food}
                  </Chip>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default AddPetModal;