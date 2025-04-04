
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Payment, PaymentFormData } from './types';
import { toast } from 'sonner';
import { UserData } from '@/contexts/AuthContext';

// Mock data for development
const mockUsers: UserData[] = [
  {
    uid: 'mock-uid-12345',
    email: 'user@example.com',
    phoneNumber: '01712345678',
    name: 'আব্দুল করিম',
    role: 'user',
    membershipStatus: 'pending',
    membershipExpiresAt: null,
    createdAt: new Date()
  },
  {
    uid: 'mock-uid-67890',
    email: 'admin@example.com',
    phoneNumber: '01798765432',
    name: 'মোহাম্মদ আলী',
    role: 'admin',
    membershipStatus: 'approved',
    membershipExpiresAt: new Date('2025-12-31'),
    createdAt: new Date('2023-01-01')
  },
  {
    uid: 'mock-uid-13579',
    email: 'fatima@example.com',
    phoneNumber: '01712345678',
    name: 'ফাতিমা আক্তার',
    role: 'user',
    membershipStatus: 'approved',
    membershipExpiresAt: new Date('2025-05-15'),
    createdAt: new Date('2024-01-15')
  }
];

const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    userId: 'mock-uid-13579',
    amount: 500,
    paymentMethod: 'bKash',
    paymentNumber: '01712345678',
    transactionId: 'TXN123456',
    status: 'verified',
    paymentDate: new Date('2024-01-15'),
    verifiedAt: new Date('2024-01-16')
  },
  {
    id: 'payment-2',
    userId: 'mock-uid-12345',
    amount: 500,
    paymentMethod: 'bKash',
    paymentNumber: '01798765432',
    transactionId: 'TXN654321',
    status: 'pending',
    paymentDate: new Date('2024-04-01'),
    verifiedAt: null
  }
];

// Payment related functions
export const submitPayment = async (userId: string, paymentData: PaymentFormData): Promise<boolean> => {
  try {
    // In a real app, we would store the payment data in Firestore
    // await addDoc(collection(db, 'payments'), {
    //   userId,
    //   ...paymentData,
    //   status: 'pending',
    //   paymentDate: new Date(),
    //   verifiedAt: null
    // });

    // For development, we'll just simulate adding a payment
    console.log('Payment submitted:', { userId, ...paymentData });
    toast.success('Payment submitted successfully!');
    return true;
  } catch (error) {
    console.error('Error submitting payment:', error);
    toast.error('Failed to submit payment. Please try again.');
    return false;
  }
};

export const getUserPayments = async (userId: string): Promise<Payment[]> => {
  try {
    // In a real app, we would query Firestore for payments
    // const paymentsRef = collection(db, 'payments');
    // const q = query(paymentsRef, where('userId', '==', userId));
    // const querySnapshot = await getDocs(q);
    // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));

    // For development, we'll return mock payments
    return mockPayments.filter(payment => payment.userId === userId);
  } catch (error) {
    console.error('Error getting user payments:', error);
    toast.error('Failed to load payment history.');
    return [];
  }
};

export const getAllPayments = async (): Promise<Payment[]> => {
  try {
    // In a real app, we would query Firestore for all payments
    // const paymentsRef = collection(db, 'payments');
    // const querySnapshot = await getDocs(paymentsRef);
    // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));

    // For development, we'll return all mock payments
    return mockPayments;
  } catch (error) {
    console.error('Error getting all payments:', error);
    toast.error('Failed to load payments.');
    return [];
  }
};

export const verifyPayment = async (paymentId: string, userId: string): Promise<boolean> => {
  try {
    // In a real app, we would update the payment status and user membership
    // const paymentRef = doc(db, 'payments', paymentId);
    // await updateDoc(paymentRef, {
    //   status: 'verified',
    //   verifiedAt: new Date()
    // });
    //
    // const userRef = doc(db, 'users', userId);
    // const expirationDate = new Date();
    // expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    // await updateDoc(userRef, {
    //   membershipExpiresAt: expirationDate
    // });

    // For development, we'll just simulate verifying a payment
    console.log('Payment verified:', { paymentId, userId });
    toast.success('Payment verified successfully!');
    return true;
  } catch (error) {
    console.error('Error verifying payment:', error);
    toast.error('Failed to verify payment. Please try again.');
    return false;
  }
};

// User related functions
export const updateUserProfile = async (userId: string, profileData: Partial<UserData>): Promise<boolean> => {
  try {
    // In a real app, we would update the user profile in Firestore
    // const userRef = doc(db, 'users', userId);
    // await updateDoc(userRef, profileData);

    // For development, we'll just simulate updating the profile
    console.log('Profile updated:', { userId, ...profileData });
    toast.success('Profile updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile. Please try again.');
    return false;
  }
};

export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    // In a real app, we would query Firestore for all users
    // const usersRef = collection(db, 'users');
    // const querySnapshot = await getDocs(usersRef);
    // return querySnapshot.docs.map(doc => ({ ...doc.data() } as UserData));

    // For development, we'll return mock users
    return mockUsers;
  } catch (error) {
    console.error('Error getting all users:', error);
    toast.error('Failed to load users.');
    return [];
  }
};

export const updateMembershipStatus = async (userId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
  try {
    // In a real app, we would update the user's membership status in Firestore
    // const userRef = doc(db, 'users', userId);
    // await updateDoc(userRef, { membershipStatus: status });

    // For development, we'll just simulate updating the status
    console.log('Membership status updated:', { userId, status });
    toast.success(`Membership ${status} successfully!`);
    return true;
  } catch (error) {
    console.error('Error updating membership status:', error);
    toast.error('Failed to update membership status. Please try again.');
    return false;
  }
};
