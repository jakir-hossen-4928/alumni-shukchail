export interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  className?: string;
}

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
  lastPaymentDate?: Date;
  paymentCountInYear?: number;
  membershipExpiry?: Date;
}

export interface Payment {
  id: string; // Same as tran_id for SSLCommerz
  userId: string;
  userName?: string;
  amount: number;
  tran_id: string; // SSLCommerz transaction ID
  // status: 'pending' | 'completed' | 'failed' | 'cancelled';
  status: 'pending' | 'verified' | 'completed' | 'failed' | 'cancelled';
  val_id?: string; // Validation ID from SSLCommerz
  bank_tran_id?: string; // Bank transaction ID
  card_type?: string; // e.g., VISA, MASTER
  currency: string; // e.g., BDT
  store_amount?: number; // Amount after bank charges
  card_issuer?: string; // Issuer bank name
  card_brand?: string; // VISA, MASTER, etc.
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: string; // Matches tran_date from SSLCommerz
  verifiedAt?: Date; // Optional, for manual verification
  error?: string; // Error message if failed
}