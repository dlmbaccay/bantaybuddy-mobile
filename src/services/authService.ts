import auth from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { alreadyRegistered, createUserOnGoogleAuth, createUserOnEmailSignUp, getSignInMethod, hasUsername, updateSignInMethod, updateUserProfile } from './userService';
import { GOOGLE_CLIENT_ID } from '@env';

GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID, offlineAccess: true });

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
    const newUser = { 
      uid: userCredential.user.uid, 
      email: email, 
      signInMethod: ['email'] };
    await createUserOnEmailSignUp(newUser);

    return userCredential.user;
  } catch (error: any) {
    throw error;
  }
};

export const handleGoogleAuth = async (setCurrentUser: (user: FirebaseAuthTypes.User | null) => void) => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken ?? null;
    
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user;
    setCurrentUser(user);
    
    const existingSignInMethod = (await getSignInMethod(user.uid)) ?? [];
    
    if (existingSignInMethod.includes('email')) {
      // Merge accounts: append displayName, photoURL, and add 'google' to signInMethod
      await updateSignInMethod(user.uid, {
        signInMethod: [...new Set([...existingSignInMethod, 'google'])],
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
      });
    } else if (existingSignInMethod.includes('google')) { // Google already linked, no need to merge
    } else {
      // New Google user, create entry
      const newUser = {
        uid: user.uid,
        signInMethod: ['google'],
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
      };
      await createUserOnGoogleAuth(newUser);
    }

    const hasUsernameFlag: boolean = await hasUsername(user.uid);
    
    return { isNewUser: !hasUsernameFlag };
  } catch (error: any) {
    throw error;
  }
};

export const handleForgotPassword = async (email: string) => {
  try {
    const emailInUse = await alreadyRegistered(email);
    if (!emailInUse) throw new Error('user-not-found');

    await auth().sendPasswordResetEmail(email);
  } catch (error: any) {
    throw error;
  }
}

export const handleAccountSetup = async (uid: string, username: string, displayName: string) => {
  try {
    const user = {
      username: username,
      displayName: displayName,
    };

    await updateUserProfile(uid, user);
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