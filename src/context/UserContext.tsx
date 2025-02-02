import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface UserContextProps {
  currentUser: FirebaseAuthTypes.User | null;
  setCurrentUser: (user: FirebaseAuthTypes.User | null) => void;
  userData: any | null;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  currentUser: null,
  setCurrentUser: () => {
    throw new Error('setCurrentUser must be used within a UserProvider');
  },
  userData: null,
  refreshUserData: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);

  // Fetch user Firestore data when currentUser changes
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserData(currentUser.uid);
    } else {
      setUserData(null);
    }
  }, [currentUser]);

  // Function to manually refresh user data
  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserData(currentUser.uid);
    }
  };

  const contextValue = useMemo(
    () => ({ currentUser, setCurrentUser, userData, refreshUserData }),
    [currentUser, userData]
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Hook to access user data
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserContext };