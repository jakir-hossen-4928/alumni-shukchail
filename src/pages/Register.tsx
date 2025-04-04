
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('সবগুলি প্রয়োজনীয় ক্ষেত্র পূরণ করুন।');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('পাসওয়ার্ড মিলছে না।');
      return;
    }
    
    try {
      setLoading(true);
      await signup(email, password, phoneNumber);
      // Navigate to the dashboard after successful registration
      navigate('/dashboard', { state: { newRegistration: true } });
    } catch (error) {
      console.error('Registration error:', error);
      // Error is already handled in the auth context
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-alumni-light py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl mb-2">রেজিস্টার করুন</CardTitle>
          <CardDescription>
            অ্যালামনাই অ্যাসোসিয়েশনের সদস্য হিসেবে নিবন্ধন করুন
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল *</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="phone">মোবাইল নম্বর (ঐচ্ছিক)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="আপনার মোবাইল নম্বর"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড *</Label>
              <Input
                id="password"
                type="password"
                placeholder="পাসওয়ার্ড নির্বাচন করুন"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">পাসওয়ার্ড নিশ্চিত করুন *</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-alumni-primary hover:bg-alumni-secondary" 
              disabled={loading}
            >
              {loading ? (
                <span>প্রক্রিয়া চলছে...</span>
              ) : (
                <span className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" /> রেজিস্টার করুন
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link to="/login" className="text-alumni-highlight hover:underline">
              লগইন করুন
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
