import firestore, { onSnapshot, doc, collection } from '@react-native-firebase/firestore';
import { User } from '@models/User';

export async function createUserOnGoogleAuth(user: User): Promise<User> {
  const newUser = {
    uid: user.uid,
    signInMethod: user.signInMethod,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,

    birthdate: '',
    sex: '',
    location: '',
    phoneNumber: '',
    bio: '',

    following: [],
    followers: [],
    posts: [],
    pets: []
  };

  try {
    await firestore().collection('users').doc(user.uid).set(newUser, { merge: true });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }

  return newUser;
}

export async function createUserOnEmailSignUp(user: User): Promise<User> {
  const newUser = {
    uid: user.uid,
    signInMethod: user.signInMethod,
    email: user.email,

    username: '',
    displayName: '',
    photoURL: '',

    birthdate: '',
    sex: '',
    location: '',
    phoneNumber: '',
    bio: '',

    following: [],
    followers: [],
    posts: [],
    pets: []
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

export async function getUserDocument(uid: string): Promise<User> {
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

export async function getIDfromUsername(username: string): Promise<string> {
  try {
    const querySnapshot = await firestore().collection('users').where('username', '==', username).get();
    return querySnapshot.docs[0].id;
  } catch (error) {
    console.error('Error deriving ID from username:', error);
    throw error;
  }
}

export async function getAllUsernames(): Promise<string[]> {
  try {
    const querySnapshot = await firestore().collection('users').get();
    return querySnapshot.docs
      .map(doc => doc.data().username)
      .filter(username => username && username.trim() !== '');
  } catch (error) {
    console.error('Error getting all usernames:', error);
    throw error;
  }
}

export async function fetchUserPetsId(uid: string): Promise<string[]> {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      console.warn(`User document with UID ${uid} does not exist.`);
      return []; // ✅ Return an empty array if user doc is missing
    }

    const userData = userDoc.data();
    const pets = userData?.pets ?? []; // Ensure it's always an array

    return pets;
  } catch (error) {
    console.error("Error fetching user pets:", error);
    throw error;
  }
} 

export async function checkIfFollowing(uid: string, followerID: string): Promise<boolean> {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    return userDoc.data()?.following.includes(followerID);
  } catch (error) {
    console.error('Error checking if following:', error);
    throw error;
  }
}

export async function followUser(followerID: string, profileID: string): Promise<void> {
  try {
    await firestore().collection('users').doc(followerID).update({
      following: firestore.FieldValue.arrayUnion(profileID)
    });

    await firestore().collection('users').doc(profileID).update({
      followers: firestore.FieldValue.arrayUnion(followerID)
    });
    
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
}

export async function unfollowUser(followerID: string, profileID: string): Promise<void> {
  try {
    await firestore().collection('users').doc(followerID).update({
      following: firestore.FieldValue.arrayRemove(profileID)
    });

    await firestore().collection('users').doc(profileID).update({
      followers: firestore.FieldValue.arrayRemove(followerID)
    });
    
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}