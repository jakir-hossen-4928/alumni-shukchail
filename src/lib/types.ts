
import { UserData, UserRole, MembershipStatus } from '@/contexts/AuthContext';

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad';
  paymentNumber: string;
  transactionId: string;
  status: 'pending' | 'verified' | 'failed';
  paymentDate: Date;
  verifiedAt: Date | null;
}

export interface PaymentFormData {
  amount: number;
  paymentMethod: 'bKash' | 'Nagad';
  paymentNumber: string;
  transactionId: string;
}

export interface PaymentStatusChip {
  status: 'pending' | 'verified' | 'failed';
  className?: string;
}

export interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  className?: string;
}
