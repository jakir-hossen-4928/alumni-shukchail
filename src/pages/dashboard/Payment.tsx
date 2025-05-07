import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { initiateSslcommerzPayment, getUserPayments } from '@/lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, CheckCircle, Clock, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/DashboardLayout';
import { Payment } from '@/lib/types';

const paymentSchema = z.object({
  amount: z.number().min(1, { message: 'টাকার পরিমাণ আবশ্যক' }),
  paymentMethod: z.enum(['sslcommerz'], { required_error: 'পেমেন্ট মেথড নির্বাচন করুন' }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const paymentMethods = [
  {
    id: 'sslcommerz',
    name: 'SSLCommerz',
    description: 'দ্রুত এবং নিরাপদ পেমেন্ট',
    icon: '/icons/sslcommerz.png',
    instructions: [
      'ফর্মে "পেমেন্ট করুন" বাটনে ক্লিক করুন',
      'SSLCommerz পেমেন্ট পেজে আপনার পছন্দের পেমেন্ট মেথড নির্বাচন করুন',
      '১০০ টাকা পেমেন্ট নিশ্চিত করুন',
      'সফল হলে আপনাকে সফলতার পেজে পুনঃনির্দেশিত করা হবে',
    ],
    color: 'bg-blue-600',
  },
];

const Payment = () => {
  const { userData, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const navigate = useNavigate();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 100,
      paymentMethod: 'sslcommerz',
    },
  });

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (currentUser?.uid) {
        try {
          const payments = await getUserPayments(currentUser.uid);
          setPaymentHistory(payments);
        } catch (error) {
          console.error('Error fetching payment history:', error);
          toast.error('পেমেন্ট ইতিহাস লোড করতে সমস্যা হয়েছে।');
        } finally {
          setHistoryLoading(false);
        }
      }
    };

    fetchPaymentHistory();
  }, [currentUser]);

  const onSubmit = async (data: PaymentFormValues) => {
    if (!currentUser?.uid) {
      toast.error('আপনি লগইন করেননি।');
      return;
    }

    try {
      setLoading(true);
      const { GatewayPageURL } = await initiateSslcommerzPayment(currentUser.uid, data.amount);
      if (GatewayPageURL) {
        window.location.href = GatewayPageURL;
      } else {
        throw new Error('Invalid SSLCommerz response');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('পেমেন্ট শুরু করতে সমস্যা হয়েছে।');
      setLoading(false);
    }
  };

  const isMembershipApproved = userData?.approved;

  if (!isMembershipApproved) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">সদস্য ফি পরিশোধ করুন</h1>
          <Card className="bg-yellow-50 border-yellow-200 shadow-md">
            <CardContent className="pt-6 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-700">পেমেন্ট করতে অপেক্ষা করুন</h3>
                <p className="text-yellow-600 text-sm">
                  আপনার সদস্যপদ এখনও অ্যাডমিন দ্বারা অনুমোদিত হয়নি। অনুমোদনের পর আপনি পেমেন্ট করতে পারবেন।
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">সদস্য ফি পরিশোধ করুন</h1>
          <p className="text-sm sm:text-base text-gray-600">
            প্রতি ৬ মাসে ১০০ টাকা সদস্য ফি পরিশোধ করুন এবং অ্যালামনাই অ্যাসোসিয়েশনের সদস্যপদ বজায় রাখুন।
          </p>
          {userData?.lastPaymentDate && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              সর্বশেষ পেমেন্ট: {new Date(userData.lastPaymentDate).toLocaleDateString('bn-BD')} | পরবর্তী পেমেন্টের সময়:{' '}
              {userData.membershipExpiry ? new Date(userData.membershipExpiry).toLocaleDateString('bn-BD') : 'N/A'}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-lg border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">পেমেন্ট করুন</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                আপনার সদস্য ফি পরিশোধ করতে নিচের বাটনে ক্লিক করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-800">সদস্য ফি</h3>
                        <p className="text-sm text-gray-500">প্রতি ৬ মাস</p>
                      </div>
                      <span className="font-bold text-lg">৳100</span>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পরিমাণ</FormLabel>
                        <FormControl>
                          <Input type="number" disabled value={field.value} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পেমেন্ট মেথড</FormLabel>
                        <FormControl>
                          <Input disabled value={paymentMethods[0].name} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        প্রস্তুত হচ্ছে...
                      </span>
                    ) : (
                      'পেমেন্ট করুন'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-100 w-full max-w-3xl mx-auto">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">আপনার পেমেন্ট ইতিহাস</CardTitle>
              <CardDescription className="text-xs md:text-sm text-gray-600">
                আপনার পূর্ববর্তী পেমেন্টের বিবরণ
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {historyLoading ? (
                <div className="text-center py-6 md:py-8 flex flex-col items-center justify-center text-gray-600">
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin mb-2" />
                  <p className="text-sm md:text-base">পেমেন্ট ইতিহাস লোড হচ্ছে...</p>
                </div>
              ) : paymentHistory.length === 0 ? (
                <div className="text-center py-6 md:py-8 flex flex-col items-center justify-center text-gray-500">
                  <Info className="h-6 w-6 md:h-8 md:w-8 mb-2 text-gray-400" />
                  <p className="text-sm md:text-base">কোনো পেমেন্ট ইতিহাস পাওয়া যায়নি</p>
                  <p className="text-xs md:text-sm mt-1">আপনার প্রথম পেমেন্ট সম্পন্ন করার পর এখানে দেখানো হবে</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                          <h3 className="font-medium text-sm md:text-base text-gray-800">
                            {payment.tran_id || 'পেমেন্ট #' + payment.id.slice(0, 6)}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {payment.createdAt instanceof Date
                              ? payment.createdAt.toLocaleDateString('bn-BD', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : new Date(payment.createdAt).toLocaleDateString('bn-BD', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                          </p>
                          {payment.bank_tran_id && (
                            <p className="text-xs text-gray-500 mt-1">ট্রানজেকশন: {payment.bank_tran_id}</p>
                          )}
                          {payment.card_type && (
                            <p className="text-xs text-gray-500 mt-1">পেমেন্ট মেথড: {payment.card_type}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-start md:items-end">
                          <span className="font-semibold text-sm md:text-base text-gray-800">{payment.amount} ৳</span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              payment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : payment.status === 'cancelled'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {payment.status === 'completed' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : payment.status === 'pending' ? (
                              <Clock className="h-3 w-3 mr-1" />
                            ) : payment.status === 'cancelled' ? (
                              <XCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {payment.status === 'completed'
                              ? 'সফল'
                              : payment.status === 'pending'
                              ? 'অপেক্ষমান'
                              : payment.status === 'cancelled'
                              ? 'বাতিল'
                              : payment.error
                              ? `ব্যর্থ (${payment.error.slice(0, 10)}...)`
                              : 'ব্যর্থ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payment;