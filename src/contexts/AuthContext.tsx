import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';

// Define our types
export type UserRole = 'admin' | 'user';
export type MembershipStatus = 'pending' | 'approved' | 'rejected';

export interface UserData {
  uid: string;
  email: string;
  phoneNumber?: string;
  name?: string;
  role: UserRole;
  membershipStatus: MembershipStatus;
  membershipExpiresAt: Date | null;
  createdAt: Date;
  profileImageUrl?: string; // Added this property
  // Other fields as needed
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, phoneNumber?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // For development, we'll use mock data for testing
  const mockUserData: UserData = {
    uid: 'mock-uid-12345',
    email: 'user@example.com',
    phoneNumber: '01712345678',
    name: 'Test User',
    role: 'user',
    membershipStatus: 'pending',
    membershipExpiresAt: null,
    createdAt: new Date(),
    profileImageUrl: undefined
  };

  const signup = async (email: string, password: string, phoneNumber: string = '') => {
    try {
      // In a real app, we would actually create the account
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
      
      // For development, we'll just simulate creating a user
      const mockUser = { uid: 'mock-uid-12345', email } as User;
      
      // Here we would store the user in Firestore
      // await setDoc(doc(db, "users", user.uid), {
      //   uid: user.uid,
      //   email,
      //   phoneNumber,
      //   role: "user",
      //   membershipStatus: "pending",
      //   membershipExpiresAt: null,
      //   createdAt: new Date()
      // });

      // For development, we'll use our mock data
      setCurrentUser(mockUser);
      setUserData(mockUserData);
      
      toast.success('Account created successfully!');
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error('Failed to create account. Please try again.');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // In a real app, we would actually log in
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
      
      // For development, we'll just simulate login with mock data
      const mockUser = { uid: 'mock-uid-12345', email } as User;
      
      // Here we would fetch the user data from Firestore
      // const userDocRef = doc(db, "users", user.uid);
      // const userDoc = await getDoc(userDocRef);
      // if (userDoc.exists()) {
      //   setUserData(userDoc.data() as UserData);
      // }

      // For development, we'll use our mock data
      setCurrentUser(mockUser);
      setUserData(mockUserData);
      
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error('Failed to log in. Please check your credentials.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // In a real app, we would actually log out
      // await signOut(auth);
      
      // For development, we'll just clear our state
      setCurrentUser(null);
      setUserData(null);
      
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error('Failed to log out. Please try again.');
      throw error;
    }
  };

  useEffect(() => {
    // In a real app, we would listen for auth state changes
    // const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //   setCurrentUser(user);
    //   
    //   if (user) {
    //     const userDocRef = doc(db, "users", user.uid);
    //     const userDoc = await getDoc(userDocRef);
    //     if (userDoc.exists()) {
    //       setUserData(userDoc.data() as UserData);
    //     }
    //   } else {
    //     setUserData(null);
    //   }
    //   
    //   setLoading(false);
    // });
    //
    // return unsubscribe;

    // For development, we'll simulate the auth state loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
