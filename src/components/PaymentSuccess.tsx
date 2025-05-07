// src/pages/PaymentSuccess.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentID = searchParams.get('paymentID');
    if (paymentID) {
      toast.success('পেমেন্ট সফলভাবে সম্পন্ন হয়েছে! আপনার সদস্যপদ নবায়ন করা হয়েছে।');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  }, [searchParams, navigate]);

  return (
    <DashboardLayout>
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-green-600">পেমেন্ট সফল</h1>
        <p className="mt-4">আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। ড্যাশবোর্ডে ফিরে যাচ্ছেন...</p>
      </div>
    </DashboardLayout>
  );
};

export default PaymentSuccess;