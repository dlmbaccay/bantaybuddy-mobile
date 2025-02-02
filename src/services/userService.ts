import firestore from '@react-native-firebase/firestore';
import { User } from '@models/User';

export async function createUserOnGoogleAuth(user: User): Promise<User> {
  const newUser = {
    uid: user.uid,
    signInMethod: user.signInMethod,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };

  try {
    await firestore().collection('users').doc(user.uid).set(newUser, { merge: true });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }

  return newUser;
}

export async function createUserOnSignUp(user: User): Promise<User> {
  const newUser = {
    uid: user.uid,
    signInMethod: user.signInMethod,
    email: user.email
  };

  try {
    await firestore().collection('users').doc(user.uid).set(newUser);
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }

  return newUser;
}

export async function updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
  try {
    await firestore().collection('users').doc(uid).update(data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function alreadyRegistered(email: string): Promise<boolean> {
  try {
    const querySnapshot = await firestore().collection('users').where('email', '==', email).get();
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
}

export async function hasUsername(uid: string): Promise<boolean> {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    return userDoc.exists && !!userDoc.data()?.username;
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
}

export async function getSignInMethod(uid: string): Promise<string> {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    return userDoc.data()?.signInMethod;
  } catch (error) {
    console.error('Error getting sign-in method:', error);
    throw error;
  }
}

export async function updateSignInMethod(uid: string, data: Partial<User>): Promise<void> {
  try {
    await firestore().collection('users').doc(uid).update(data);
  } catch (error) {
    console.error('Error updating sign-in method:', error);
    throw error;
  }
}

export async function getUser(uid: string): Promise<User> {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    return userDoc.data() as User;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    const querySnapshot = await firestore().collection('users').where('username', '==', username).get();
    return querySnapshot.empty; // True if available
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
}