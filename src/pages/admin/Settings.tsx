
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, Lock, CreditCard, Globe, Shield, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    autoApproveMembers: false,
    requireFullProfile: true,
    receiveAdminNotifications: true,
    enablePublicRegistration: true,
    enablePayments: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    membershipFee: 500,
    currency: 'BDT',
    allowBkash: true,
    allowNagad: true,
    requirePendingVerification: true,
    autoRenewalNotice: 30, // days before expiry
  });

  const handleToggleGeneral = (setting: keyof typeof generalSettings) => {
    setGeneralSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handlePaymentChange = (field: keyof typeof paymentSettings, value: any) => {
    setPaymentSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveGeneral = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "সেটিংস আপডেট হয়েছে",
        description: "সাধারণ সেটিংস সফলভাবে আপডেট করা হয়েছে।",
      });
    }, 1000);
  };

  const handleSavePayment = () => {
    setSavingPayment(true);
    // Simulate API call
    setTimeout(() => {
      setSavingPayment(false);
      toast({
        title: "পেমেন্ট সেটিংস আপডেট হয়েছে",
        description: "পেমেন্ট সেটিংস সফলভাবে আপডেট করা হয়েছে।",
      });
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">অ্যাডমিন সেটিংস</h1>
          <p className="text-muted-foreground">অ্যালামনাই অ্যাসোসিয়েশন সেটিংস পরিচালনা করুন</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-2 max-w-md">
            <TabsTrigger value="general">সাধারণ সেটিংস</TabsTrigger>
            <TabsTrigger value="payment">পেমেন্ট সেটিংস</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>সাধারণ সেটিংস</CardTitle>
                <CardDescription>অ্যালামনাই অ্যাসোসিয়েশনের সাধারণ সেটিংস পরিবর্তন করুন</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="autoApproveMembers" className="font-medium">স্বয়ংক্রিয় সদস্য অনুমোদন</Label>
                        <p className="text-sm text-muted-foreground">সাইন আপ করা সদস্যদের স্বয়ংক্রিয়ভাবে অনুমোদন করুন</p>
                      </div>
                    </div>
                    <Switch
                      id="autoApproveMembers"
                      checked={generalSettings.autoApproveMembers}
                      onCheckedChange={() => handleToggleGeneral('autoApproveMembers')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="requireFullProfile" className="font-medium">সম্পূর্ণ প্রোফাইল প্রয়োজন</Label>
                        <p className="text-sm text-muted-foreground">অনুমোদনের আগে সম্পূর্ণ প্রোফাইল তথ্য প্রয়োজন</p>
                      </div>
                    </div>
                    <Switch
                      id="requireFullProfile"
                      checked={generalSettings.requireFullProfile}
                      onCheckedChange={() => handleToggleGeneral('requireFullProfile')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Bell className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="receiveAdminNotifications" className="font-medium">অ্যাডমিন নোটিফিকেশন</Label>
                        <p className="text-sm text-muted-foreground">নতুন সদস্য এবং পেমেন্টের জন্য অ্যাডমিন নোটিফিকেশন পান</p>
                      </div>
                    </div>
                    <Switch
                      id="receiveAdminNotifications"
                      checked={generalSettings.receiveAdminNotifications}
                      onCheckedChange={() => handleToggleGeneral('receiveAdminNotifications')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="enablePublicRegistration" className="font-medium">পাবলিক রেজিস্ট্রেশন</Label>
                        <p className="text-sm text-muted-foreground">যে কেউ রেজিস্টার করতে পারবে</p>
                      </div>
                    </div>
                    <Switch
                      id="enablePublicRegistration"
                      checked={generalSettings.enablePublicRegistration}
                      onCheckedChange={() => handleToggleGeneral('enablePublicRegistration')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="enablePayments" className="font-medium">পেমেন্ট সিস্টেম</Label>
                        <p className="text-sm text-muted-foreground">পেমেন্ট সিস্টেম সক্রিয় করুন</p>
                      </div>
                    </div>
                    <Switch
                      id="enablePayments"
                      checked={generalSettings.enablePayments}
                      onCheckedChange={() => handleToggleGeneral('enablePayments')}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveGeneral} disabled={loading} className="w-full sm:w-auto">
                  {loading ? <Loading size="sm" /> : 'সাধারণ সেটিংস আপডেট করুন'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>পেমেন্ট সেটিংস</CardTitle>
                <CardDescription>পেমেন্ট সংক্রান্ত সেটিংস পরিবর্তন করুন</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="membershipFee">বার্ষিক সদস্যপদ ফি</Label>
                    <Input
                      id="membershipFee"
                      type="number"
                      value={paymentSettings.membershipFee}
                      onChange={(e) => handlePaymentChange('membershipFee', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">কারেন্সি</Label>
                    <Input
                      id="currency"
                      value={paymentSettings.currency}
                      onChange={(e) => handlePaymentChange('currency', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="autoRenewalNotice">রিনিউয়াল নোটিশ দিন (আগে)</Label>
                    <Input
                      id="autoRenewalNotice"
                      type="number"
                      value={paymentSettings.autoRenewalNotice}
                      onChange={(e) => handlePaymentChange('autoRenewalNotice', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="allowBkash" className="font-medium">বিকাশ পেমেন্ট</Label>
                        <p className="text-sm text-muted-foreground">বিকাশ দিয়ে পেমেন্ট অনুমতি দিন</p>
                      </div>
                    </div>
                    <Switch
                      id="allowBkash"
                      checked={paymentSettings.allowBkash}
                      onCheckedChange={() => handlePaymentChange('allowBkash', !paymentSettings.allowBkash)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="allowNagad" className="font-medium">নগদ পেমেন্ট</Label>
                        <p className="text-sm text-muted-foreground">নগদ দিয়ে পেমেন্ট অনুমতি দিন</p>
                      </div>
                    </div>
                    <Switch
                      id="allowNagad"
                      checked={paymentSettings.allowNagad}
                      onCheckedChange={() => handlePaymentChange('allowNagad', !paymentSettings.allowNagad)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="requirePendingVerification" className="font-medium">পেমেন্ট যাচাই প্রয়োজন</Label>
                        <p className="text-sm text-muted-foreground">অ্যাডমিন দ্বারা পেমেন্ট যাচাইয়ের প্রয়োজন আছে</p>
                      </div>
                    </div>
                    <Switch
                      id="requirePendingVerification"
                      checked={paymentSettings.requirePendingVerification}
                      onCheckedChange={() => handlePaymentChange('requirePendingVerification', !paymentSettings.requirePendingVerification)}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSavePayment} disabled={savingPayment} className="w-full sm:w-auto">
                  {savingPayment ? <Loading size="sm" /> : 'পেমেন্ট সেটিংস আপডেট করুন'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
