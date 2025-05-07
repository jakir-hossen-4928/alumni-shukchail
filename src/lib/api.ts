import { collection, addDoc, getDocs, doc, getDoc, updateDoc, query, where, serverTimestamp, setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Payment, User } from './types';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

// Helper function to convert Firestore Timestamp to Date
const convertToDate = (value: any): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  return undefined; // Handle unexpected types gracefully
};

// User related functions
export const createUserProfile = async (userId: string, userData: Partial<User>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const defaultData: Partial<User> = {
      ...userData,
      role: userData.role || 'user',
      approved: userData.approved ?? false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastPaymentDate: null,
      paymentCountInYear: 0,
      membershipExpiry: null,
    };

    await setDoc(userRef, defaultData);
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    toast.error('প্রোফাইল তৈরি করতে ব্যর্থ হয়েছে।');
    return false;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    const updateData: Partial<User> = {
      ...profileData,
      updatedAt: serverTimestamp(),
    };

    if (profileData.birthDate) {
      updateData.birthDate = profileData.birthDate instanceof Date
        ? profileData.birthDate
        : new Date(profileData.birthDate);
    }

    await updateDoc(userRef, updateData);
    toast.success('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    return false;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: convertToDate(doc.data().createdAt),
      updatedAt: convertToDate(doc.data().updatedAt),
      approvedAt: convertToDate(doc.data().approvedAt),
      birthDate: convertToDate(doc.data().birthDate),
      lastPaymentDate: convertToDate(doc.data().lastPaymentDate),
      membershipExpiry: convertToDate(doc.data().membershipExpiry),
    } as User));
  } catch (error) {
    console.error('Error getting all users:', error);
    toast.error('ব্যবহারকারীদের তালিকা লোড করতে ব্যর্থ হয়েছে।');
    return [];
  }
};

export const updateMembershipStatus = async (userId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
  try {
    const unapprovedUserRef = doc(db, 'unapprovedUsers', userId);
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const unapprovedUserSnap = await getDoc(unapprovedUserRef);
    const userData = userSnap.data() as User;

    const updateData: Partial<User> = {
      approved: status === 'approved',
      updatedAt: serverTimestamp(),
    };

    if (status === 'approved') {
      const now = new Date();
      updateData.approvedAt = serverTimestamp();
      updateData.lastPaymentDate = serverTimestamp();
      updateData.paymentCountInYear = (userData?.paymentCountInYear || 0) < 2 ? (userData?.paymentCountInYear || 0) + 1 : 1;
      const expiryDate = new Date(now);
      expiryDate.setMonth(now.getMonth() + 6);
      updateData.membershipExpiry = expiryDate;
    }

    await updateDoc(userRef, updateData);
    if (unapprovedUserSnap.exists()) {
      await deleteDoc(unapprovedUserRef);
    }
    toast.success(`সদস্যপদ ${status === 'approved' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত'} হয়েছে!`);
    return true;
  } catch (error) {
    console.error('Error updating membership status:', error);
    toast.error('সদস্যপদ স্থিতি আপডেট করতে ব্যর্থ হয়েছে।');
    return false;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid: userSnap.id,
        ...data,
        createdAt: convertToDate(data.createdAt),
        updatedAt: convertToDate(data.updatedAt),
        approvedAt: convertToDate(data.approvedAt),
        birthDate: convertToDate(data.birthDate),
        lastPaymentDate: convertToDate(data.lastPaymentDate),
        membershipExpiry: convertToDate(data.membershipExpiry),
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Payment related functions
export const initiateSslcommerzPayment = async (userId: string, amount: number): Promise<{ GatewayPageURL: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/sslcommerz/create-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to initiate SSLCommerz payment (status: ${response.status})`);
    }

    const data = await response.json();
    if (!data.GatewayPageURL) {
      throw new Error('Invalid SSLCommerz response: Missing GatewayPageURL');
    }

    return { GatewayPageURL: data.GatewayPageURL };
  } catch (error) {
    console.error('Error initiating SSLCommerz payment:', error);
    toast.error(error.message || 'পেমেন্ট শুরু করতে সমস্যা হয়েছে।');
    throw error;
  }
};

export const getUserPayments = async (userId: string): Promise<Payment[]> => {
  try {
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertToDate(doc.data().createdAt),
      updatedAt: convertToDate(doc.data().updatedAt),
      completedAt: convertToDate(doc.data().completedAt),
      verifiedAt: convertToDate(doc.data().verifiedAt),
    } as Payment));
  } catch (error) {
    console.error('Error getting user payments:', error);
    toast.error('পেমেন্ট ইতিহাস লোড করতে ব্যর্থ হয়েছে।');
    return [];
  }
};


export const updatePaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'verified' | 'completed' | 'failed' | 'cancelled',
  token: string // Firebase ID token
): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/payments/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentId, status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update payment status (status: ${response.status})`);
    }

    const data = await response.json();
    toast.success(data.message || 'পেমেন্ট স্থিতি সফলভাবে আপডেট করা হয়েছে!');
    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    toast.error(error.message || 'পেমেন্ট স্থিতি আপডেট করতে সমস্যা হয়েছে।');
    return false;
  }
};

export const getAllPayments = async (): Promise<Payment[]> => {
  try {
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, orderBy('createdAt', 'desc')); // Sort by createdAt descending
    const querySnapshot = await getDocs(q);
    const payments = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const user = await getUserById(data.userId);
        return {
          id: doc.id,
          userId: data.userId,
          userName: user?.name || 'Unknown User',
          amount: data.amount,
          tran_id: data.tran_id,
          status: data.status,
          val_id: data.val_id,
          bank_tran_id: data.bank_tran_id,
          card_type: data.card_type,
          currency: data.currency,
          store_amount: data.store_amount,
          card_issuer: data.card_issuer,
          card_brand: data.card_brand,
          createdAt: convertToDate(data.createdAt),
          updatedAt: convertToDate(data.updatedAt),
          completedAt: convertToDate(data.completedAt),
          verifiedAt: convertToDate(data.verifiedAt),
          error: data.error,
        } as Payment;
      })
    );
    return payments;
  } catch (error) {
    console.error('Error getting all payments:', error);
    toast.error('সমস্ত পেমেন্ট লোড করতে ব্যর্থ হয়েছে।');
    throw error;
  }
};