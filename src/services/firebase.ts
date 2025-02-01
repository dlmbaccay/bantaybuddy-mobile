// todo: consider renaming this file to auth.ts

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from '@env';

import { User, createUserOnSignUp, createUserOnGoogleAuth, updateUserOnAccountSetup, hasUsername, alreadyRegistered } from '@models/User';

GoogleSignin.configure({
  webClientId: GOOGLE_CLIENT_ID,
  offlineAccess: true,
});

export const handleEmailPasswordSignIn = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);

    if (!userCredential.user?.emailVerified) throw new Error('not-email-verified');

    const hasUsernameFlag = await hasUsername(userCredential.user.uid);
    return { user: userCredential.user, hasUsername: hasUsernameFlag };
  } catch (error: any) {
    console.error('Error during email sign-in:', error);
    throw error;
  }
};

export const handleEmailPasswordSignUp = async (email: string, password: string) => {
  try {
    // check if the email is already in use
    const emailInUse = await alreadyRegistered(email);
    if (emailInUse) throw new Error('email-in-use');
    
    // else, create a new user
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);

    // send email verification
    await userCredential.user?.sendEmailVerification();

    // create a user document in Firestore  
    const newUser = { uid: userCredential.user.uid, email: email};
    await createUserOnSignUp(newUser);

    return userCredential.user;
  } catch (error: any) {
    throw error;
  }
};

export const handleGoogleAuth = async (setCurrentUser: (user: FirebaseAuthTypes.User | null) => void) => {
  try {
    // access Google Sign-In
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    console.log(response);

    // get the idToken from the response
    const idToken = response.data?.idToken ?? null;

    // create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // check if the email is already in use
    const emailInUse = await alreadyRegistered(response.data?.user.email ?? '');
    if (emailInUse) throw new Error('email-in-use');

    // sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user;
    setCurrentUser(user);

    // check if the user has a username
    const hasUsernameFlag = await hasUsername(user.uid);

    // if the user does not have a username, create or update the user document
    if (!hasUsernameFlag) {
      const newUser = {
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
      }

      await createUserOnGoogleAuth(newUser);
    }

    return { isNewUser: !hasUsernameFlag };
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