
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { submitPayment } from '@/lib/api';
import { PaymentFormData } from '@/lib/types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/DashboardLayout';

const paymentSchema = z.object({
  amount: z.number().min(1, { message: 'টাকার পরিমাণ আবশ্যক' }),
  paymentMethod: z.enum(['bKash', 'Nagad'], { 
    required_error: 'পেমেন্ট মেথড নির্বাচন করুন' 
  }),
  paymentNumber: z.string().min(11, { message: 'সঠিক মোবাইল নম্বর দিন' }),
  transactionId: z.string().min(1, { message: 'ট্রানজেকশন আইডি আবশ্যক' }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const Payment = () => {
  const { userData, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 500, // Default membership fee
      paymentMethod: 'bKash',
      paymentNumber: '',
      transactionId: '',
    }
  });
  
  const onSubmit = async (data: PaymentFormValues) => {
    if (!currentUser?.uid) return;
    
    if (userData?.membershipStatus !== 'approved') {
      toast.error('আপনার সদস্যপদ এখনও অনুমোদিত হয়নি।');
      return;
    }
    
    try {
      setLoading(true);
      // Ensure data is fully conforming to PaymentFormData type
      const paymentData: PaymentFormData = {
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentNumber: data.paymentNumber,
        transactionId: data.transactionId
      };
      const result = await submitPayment(currentUser.uid, paymentData);
      if (result) {
        toast.success('পেমেন্ট সাবমিট হয়েছে! অ্যাডমিন দ্বারা যাচাইয়ের জন্য অনুরোধ করা হচ্ছে।');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('পেমেন্ট সাবমিট করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };
  
  if (userData?.membershipStatus !== 'approved') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold mb-1">সদস্য ফি পরিশোধ করুন</h1>
          
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-700 mb-1">পেমেন্ট করতে অপেক্ষা করুন</h3>
                  <p className="text-yellow-600">
                    আপনার সদস্যপদ এখনও অ্যাডমিন দ্বারা অনুমোদিত হয়নি। অনুমোদনের পর আপনি পেমেন্ট করতে পারবেন।
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">সদস্য ফি পরিশোধ করুন</h1>
          <p className="text-muted-foreground">
            আপনার বার্ষিক সদস্য ফি পরিশোধ করুন এবং অ্যালামনাই অ্যাসোসিয়েশনের সদস্যপদ সক্রিয় করুন।
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>পেমেন্ট ফর্ম</CardTitle>
                <CardDescription>
                  নিচের তথ্য সঠিকভাবে পূরণ করুন
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>বার্ষিক সদস্য ফি (৳) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              // Convert string to number for the form
                              value={field.value}
                              onChange={e => field.onChange(Number(e.target.value))}
                              disabled
                            />
                          </FormControl>
                          <FormDescription>
                            বার্ষিক সদস্য ফি ৫০০ টাকা (নির্ধারিত)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>পেমেন্ট মেথড *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="bKash" />
                                </FormControl>
                                <FormLabel className="font-normal">বিকাশ (bKash)</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="Nagad" />
                                </FormControl>
                                <FormLabel className="font-normal">নগদ (Nagad)</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>পেমেন্ট করা নম্বর *</FormLabel>
                          <FormControl>
                            <Input placeholder="যে নম্বর থেকে পেমেন্ট করেছেন" {...field} />
                          </FormControl>
                          <FormDescription>
                            যে মোবাইল নম্বর থেকে আপনি পেমেন্ট করেছেন।
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="transactionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ট্রানজেকশন আইডি *</FormLabel>
                          <FormControl>
                            <Input placeholder="পেমেন্টের ট্রানজেকশন আইডি" {...field} />
                          </FormControl>
                          <FormDescription>
                            পেমেন্ট করার পর আপনি যে ট্রানজেকশন আইডি পেয়েছেন।
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-alumni-primary hover:bg-alumni-secondary" 
                      disabled={loading}
                    >
                      {loading ? 'অপেক্ষা করুন...' : 'পেমেন্ট সাবমিট করুন'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>পেমেন্ট নির্দেশনা</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-alumni-primary mb-2">বিকাশ (bKash) পেমেন্ট</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>বিকাশ অ্যাপ বা *247# ডায়াল করুন</li>
                    <li>"সেন্ড মানি" অপশনে যান</li>
                    <li>এই নম্বরে টাকা পাঠান: <strong>01712345678</strong></li>
                    <li>৫০০ টাকা লিখুন</li>
                    <li>"রেফারেন্স" হিসেবে আপনার নাম লিখুন</li>
                    <li>পেমেন্ট নিশ্চিত করুন</li>
                    <li>ট্রানজেকশন আইডি সংরক্ষণ করুন</li>
                    <li>এই ফর্মে ট্রানজেকশন আইডি সাবমিট করুন</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-semibold text-alumni-primary mb-2">নগদ (Nagad) পেমেন্ট</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>নগদ অ্যাপ বা *167# ডায়াল করুন</li>
                    <li>"সেন্ড মানি" অপশনে যান</li>
                    <li>এই নম্বরে টাকা পাঠান: <strong>01798765432</strong></li>
                    <li>৫০০ টাকা লিখুন</li>
                    <li>পেমেন্ট নিশ্চিত করুন</li>
                    <li>ট্রানজেকশন আইডি সংরক্ষণ করুন</li>
                    <li>এই ফর্মে ট্রানজেকশন আইডি সাবমিট করুন</li>
                  </ol>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                  <p><strong>দ্রষ্টব্য:</strong> পেমেন্ট সাবমিট করার পর, অ্যাডমিন আপনার পেমেন্ট যাচাই করবেন এবং সদস্যপদ সক্রিয় করবেন। এতে কিছু সময় লাগতে পারে।</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payment;
