import firestore from '@react-native-firebase/firestore';

export interface User {
  uid: string;
  email: string;
  signInMethod: string;

  username?: string;
  displayName?: string;
  photoURL?: string;
  coverPhotoURL?: string;
  birthdate?: string;
  gender?: string;

  location?: string;
  phoneNumber?: string;
  bio?: string;

  following?: string[];
  followers?: string[];

  posts?: string[];
  pets?: string[];
}

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
    signInMethod: 'email',
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


export async function updateUserOnAccountSetup(user: User, data: Partial<User>): Promise<User> {
  const updatedUser = {
    ...user,
    ...data,
  };

  try {
    await firestore().collection('users').doc(user.uid).update(data);
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }

  return updatedUser;
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