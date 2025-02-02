import storage from '@react-native-firebase/storage';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { updateUserProfile } from './userService';

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
    const path = `profilePictures/${uid}.jpg`;
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