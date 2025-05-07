// src/pages/PaymentFail.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';

const PaymentFail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
  }, []);

  return (
    <DashboardLayout>
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">পেমেন্ট ব্যর্থ</h1>
        <p className="mt-4">পেমেন্ট প্রক্রিয়া সম্পন্ন করা যায়নি।</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard/payment')}>
          আবার চেষ্টা করুন
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default PaymentFail;