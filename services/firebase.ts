import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { GOOGLE_CLIENT_ID } from '@env';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: true,
});

export const handleGoogleSignIn = async (setCurrentUser: (user: FirebaseAuthTypes.User | null) => void) => {
  try {
    // access Google Sign-In
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    // get the idToken from the response
    const idToken = response.data?.idToken ?? null;
    
    // create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user;
    setCurrentUser(user);

    // check if the user exists in the database
    const userDoc = await firestore().collection('users').doc(user.uid).get();

    // if the user does not exist, create a new user document
    if (!userDoc.exists) {
      await firestore().collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }

    return { isNewUser: !userDoc.exists };
  } catch (error: any) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error: any) {
    throw error;
  }
};