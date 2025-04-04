
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">অননুমোদিত অ্যাক্সেস</h1>
        <p className="text-gray-600 mb-6">
          দুঃখিত, আপনার এই পৃষ্ঠা দেখার অনুমতি নেই। আপনি যদি মনে করেন এটি ভুল, অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।
        </p>
        
        <div className="space-y-3">
          <Button asChild className="bg-alumni-primary hover:bg-alumni-secondary w-full">
            <Link to="/">হোম পেইজে যান</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">লগইন পেইজে যান</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
