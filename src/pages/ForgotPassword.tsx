// src/pages/ForgotPassword.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth(); // Get resetPassword from AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('ইমেইল ঠিকানা দিন।');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email); // Use resetPassword from AuthContext
      setSent(true);
      // Success toast is handled in AuthContext
    } catch (error) {
      console.error('Password reset error:', error);
      // Error toasts are handled in AuthContext, no need to duplicate here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img
              src="https://i.ibb.co/NgkLwVm3/shukchail-logo.jpg"
              alt="Shukchail Logo"
              className="h-16"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          <CardTitle className="text-2xl text-center mb-2">পাসওয়ার্ড ভুলে গেছেন?</CardTitle>
          <CardDescription className="text-center">
            {!sent
              ? 'আপনার ইমেইল ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠানো হবে'
              : 'আপনার ইমেইল চেক করুন। পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="আপনার ইমেইল ঠিকানা"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">লোড হচ্ছে...</span>
                ) : (
                  <span className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" /> পাসওয়ার্ড রিসেট লিংক পাঠান
                  </span>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 text-gray-600">
              <p>আপনার ইমেইলে পাঠানো লিংকটি ক্লিক করুন। যদি ইমেইল না পান, আপনার স্প্যাম ফোল্ডার চেক করুন।</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> লগইন পেইজে ফিরুন
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;