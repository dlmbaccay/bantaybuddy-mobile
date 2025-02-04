import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Pet } from '@models/Pet';

export const addPetToFirestore = async (pet: Pet): Promise<FirebaseFirestoreTypes.DocumentReference> => {
  try {
    const newPetRef = await firestore().collection("pets").add(pet);
    await newPetRef.update({ uid: newPetRef.id }); // Update the pet document with its own ID

    for (const ownerUid of pet.owners) {
      await firestore().collection("users").doc(ownerUid).update({
        pets: firestore.FieldValue.arrayUnion(newPetRef.id), // Add the pet ID to the user's pets array
      });
    }

    return newPetRef; // Return the Firestore document reference
  } catch (error) {
    console.error("Error adding pet:", error);
    throw error;
  }
};

export const updatePetProfile = async (uid: string, data: Partial<Pet>): Promise<void> => {
  try {
    await firestore().collection('pets').doc(uid).update(data);
  } catch (error) {
    console.error('Error updating pet profile:', error);
    throw error;
  }
};

export const deletePetProfile = async (uid: string): Promise<void> => {
  try {
    await firestore().collection('pets').doc(uid).delete();
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw error;
  }
};

export const getPetDocument = async (uid: string): Promise<Pet | undefined> => {
  try {
    const snapshot = await firestore().collection('pets').doc(uid).get();
    return snapshot.data() as Pet;
  } catch (error) {
    console.error('Error getting pet:', error);
    throw error;
  }
};

export const getOwnerPets = async (ownerUid: string): Promise<Pet[]> => {
  try {
    const snapshot = await firestore().collection('pets').where('owners', 'array-contains', ownerUid).get();
    return snapshot.docs.map(doc => doc.data() as Pet);
  } catch (error) {
    console.error('Error getting pets:', error);
    throw error;
  }
}

export const fetchOwnersPetsInfo = async (petIds: string[]): Promise<Pet[]> => {
  try {
    const petDocs = await Promise.all(petIds.map(async petId => {
      const petDoc = await firestore().collection('pets').doc(petId).get();
      return petDoc.data() as Pet;
    }));
    return petDocs;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};