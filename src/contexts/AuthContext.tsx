// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail, // Added for password reset
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';

// Define our types
export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  profileImageUrl?: string;
  phoneNumber?: string;
  approved: boolean;
  approvedAt?: Date;
  approvedBy?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: Date;
  nationalIdOrBirthCert?: string;
  currentAddress?: string;
  permanentAddress?: string;
  occupation?: string;
  currentLocation?: string;
  studyYears?: string;
  passYear?: string;
  secondaryEducation?: string;
  higherEducation?: string;
  currentWorkplace?: string;
  workExperience?: string;
  specialContribution?: string;
  suggestions?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userData: User | null;
  loading: boolean;
  signup: (email: string, password: string, phoneNumber?: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>; // Added resetPassword
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {}, // Default empty function
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signup = async (email: string, password: string, phoneNumber: string = '', name: string = '') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocData: User = {
        uid: user.uid,
        email,
        name: name || '',
        role: 'user',
        profileImageUrl: '',
        phoneNumber,
        approved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userDocData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setCurrentUser(user);
      setUserData({ ...userDocData, createdAt: new Date(), updatedAt: new Date() });

      toast.success('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('অ্যাকাউন্ট তৈরি করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as User;
        setUserData({
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          approvedAt: data.approvedAt ? data.approvedAt.toDate() : undefined,
          birthDate: data.birthDate ? data.birthDate.toDate() : undefined,
        });
      } else {
        throw new Error('User data not found in Firestore');
      }

      setCurrentUser(user);
      toast.success('সফলভাবে লগইন করা হয়েছে!');
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('লগইন ব্যর্থ হয়েছে। আপনার তথ্য চেক করুন।');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
      toast.success('সফলভাবে লগআউট করা হয়েছে!');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('লগআউট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent to:', email);
      toast.success('পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।');
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('অবৈধ ইমেইল ঠিকানা।');
      } else {
        toast.error('পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as User;
          setUserData({
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            approvedAt: data.approvedAt ? data.approvedAt.toDate() : undefined,
            birthDate: data.birthDate ? data.birthDate.toDate() : undefined,
          });
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout,
    resetPassword, // Added to context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};