import storage from '@react-native-firebase/storage';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { updateUserProfile } from './userService';
import { updatePetProfile } from './petService';

export const uploadUserProfilePhoto = async (uid: string, imageUri?: string): Promise<string | null> => {
  try {
    let finalUri = imageUri;

    if (!imageUri) {
      // If no image provided, use default avatar
      const asset = Asset.fromModule(require('@assets/default-user-avatar.png'));
      await asset.downloadAsync(); // Ensure asset is available locally
      finalUri = asset.localUri ?? asset.uri;
    }

    if (!finalUri) {
      throw new Error('No valid image URI found for upload.');
    }

    // Ensure the file exists before uploading
    const fileInfo = await FileSystem.getInfoAsync(finalUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist at the given path.');
    }

    // Firebase Storage path
    const path = `userProfilePictures/${uid}.jpg`;
    const reference = storage().ref(path);

    // Upload image file to Firebase Storage
    await reference.putFile(fileInfo.uri);
    const downloadURL = await reference.getDownloadURL();

    // Update Firestore with new profile image URL
    await updateUserProfile(uid, { photoURL: downloadURL });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

export const uploadPetProfilePhoto = async (petUid: string, imageUri?: string): Promise<string | null> => {
  // Similar to uploadUserProfilePhoto, but for pets
  try {
    let finalUri = imageUri;

    if (!imageUri) {
      // If no image provided, use default pet avatar
      const asset = Asset.fromModule(require('@assets/default-pet-avatar.png'));
      await asset.downloadAsync(); // Ensure asset is available locally
      finalUri = asset.localUri ?? asset.uri;
    }

    if (!finalUri) {
      throw new Error('No valid image URI found for upload.');
    }

    // Ensure the file exists before uploading
    const fileInfo = await FileSystem.getInfoAsync(finalUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist at the given path.');
    }

    // Firebase Storage path
    const path = `petProfilePictures/${petUid}.jpg`;
    const reference = storage().ref(path);

    // Upload image file to Firebase Storage
    await reference.putFile(fileInfo.uri);
    const downloadURL = await reference.getDownloadURL();

    // Update Firestore with new pet image URL
    await updatePetProfile(petUid, { photoURL: downloadURL });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading pet photo:', error);
    throw error;
  }
}