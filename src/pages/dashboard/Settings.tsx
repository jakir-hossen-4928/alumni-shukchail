
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/loading';

const Settings = () => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    paymentReminders: true,
    newsletterSubscription: true,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "সেটিংস আপডেট হয়েছে",
        description: "আপনার সেটিংস সফলভাবে আপডেট করা হয়েছে।",
      });
    }, 1000);
  };

  if (!userData) {
    return (
      <DashboardLayout>
        <div className="h-[50vh] flex items-center justify-center">
          <Loading text="লোড হচ্ছে..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">সেটিংস</h1>
          <p className="text-muted-foreground">আপনার অ্যাকাউন্ট পছন্দসমূহ পরিচালনা করুন।</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>নোটিফিকেশন সেটিংস</CardTitle>
            <CardDescription>আপনার নোটিফিকেশন পছন্দসমূহ কনফিগার করুন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="emailNotifications" className="font-medium">ইমেইল নোটিফিকেশন</Label>
                    <p className="text-sm text-muted-foreground">গুরুত্বপূর্ণ আপডেট সম্পর্কে ইমেইল পাঠান</p>
                  </div>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle('emailNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="smsNotifications" className="font-medium">এসএমএস নোটিফিকেশন</Label>
                    <p className="text-sm text-muted-foreground">অনুষ্ঠান এবং আপডেট সম্পর্কে এসএমএস পান</p>
                  </div>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={() => handleToggle('smsNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="eventReminders" className="font-medium">ইভেন্ট রিমাইন্ডার</Label>
                    <p className="text-sm text-muted-foreground">আসন্ন ইভেন্ট সম্পর্কে রিমাইন্ডার পান</p>
                  </div>
                </div>
                <Switch
                  id="eventReminders"
                  checked={settings.eventReminders}
                  onCheckedChange={() => handleToggle('eventReminders')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="paymentReminders" className="font-medium">পেমেন্ট রিমাইন্ডার</Label>
                    <p className="text-sm text-muted-foreground">বার্ষিক সদস্যপদ ফি সম্পর্কে রিমাইন্ডার</p>
                  </div>
                </div>
                <Switch
                  id="paymentReminders"
                  checked={settings.paymentReminders}
                  onCheckedChange={() => handleToggle('paymentReminders')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="newsletterSubscription" className="font-medium">নিউজলেটার সাবস্ক্রিপশন</Label>
                    <p className="text-sm text-muted-foreground">মাসিক নিউজলেটার পাঠাবেন</p>
                  </div>
                </div>
                <Switch
                  id="newsletterSubscription"
                  checked={settings.newsletterSubscription}
                  onCheckedChange={() => handleToggle('newsletterSubscription')}
                />
              </div>
            </div>
            
            <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loading size="sm" /> : 'সেটিংস আপডেট করুন'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
