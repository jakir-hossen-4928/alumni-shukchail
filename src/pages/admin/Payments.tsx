import { useEffect, useState } from 'react';
import { getAllPayments, updatePaymentStatus } from '@/lib/api';
import { Payment, DashboardCardProps } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, CreditCard, DollarSign, Clock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserById } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, description, className }) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);


const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUserToken(token);
        const userData = await getUserById(user.uid);
        setIsAdmin(userData?.role === 'admin');
      } else {
        setIsAdmin(false);
        setUserToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
        setFilteredPayments(data);
      } catch (error: any) {
        console.error('Error fetching payments:', error);
        setError(error.message || 'পেমেন্ট তালিকা লোড করতে সমস্যা হয়েছে।');
        toast.error(error.message || 'পেমেন্ট তালিকা লোড করতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    const result = payments.filter(payment => {
      const term = searchTerm.toLowerCase();
      return (
        (payment.userName?.toLowerCase().includes(term) ?? false) ||
        (payment.tran_id?.toLowerCase().includes(term) ?? false) ||
        (payment.val_id?.toLowerCase().includes(term) ?? false) ||
        (payment.bank_tran_id?.toLowerCase().includes(term) ?? false) ||
        (payment.card_issuer?.toLowerCase().includes(term) ?? false)
      );
    });
    setFilteredPayments(result);
  }, [searchTerm, payments]);

  const handleStatusChange = async (paymentId: string, newStatus: 'pending' | 'verified' | 'completed' | 'failed' | 'cancelled') => {
    if (!userToken) {
      toast.error('অনুগ্রহ করে লগইন করুন।');
      return;
    }

    const success = await updatePaymentStatus(paymentId, newStatus, userToken);
    if (success) {
      setPayments(prev =>
        prev.map(payment =>
          payment.id === paymentId ? { ...payment, status: newStatus } : payment
        )
      );
      setFilteredPayments(prev =>
        prev.map(payment =>
          payment.id === paymentId ? { ...payment, status: newStatus } : payment
        )
      );
    }
  };

  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">লোড হচ্ছে...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">পেমেন্ট তালিকা</h1>
          <p className="text-muted-foreground">সদস্যদের পেমেন্ট বিবরণ দেখুন</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            title="মোট পেমেন্ট"
            value={totalPayments}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            description="সকল পেমেন্টের সংখ্যা"
          />
          <DashboardCard
            title="সফল পেমেন্ট"
            value={completedPayments}
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
            description="সম্পন্ন পেমেন্ট"
          />
          <DashboardCard
            title="পেন্ডিং পেমেন্ট"
            value={pendingPayments}
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            description="অপেক্ষমাণ পেমেন্ট"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>সকল পেমেন্ট</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="নাম, ট্রানজেকশন আইডি, ভ্যালিডেশন আইডি, ব্যাংক বা কার্ড ইস্যুয়ার দিয়ে খুঁজুন"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">কোনো পেমেন্ট পাওয়া যায়নি।</div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>সদস্য নাম</TableHead>
                      <TableHead>ট্রানজেকশন আইডি</TableHead>
                      <TableHead>ভ্যালিডেশন আইডি</TableHead>
                      <TableHead>কার্ড টাইপ</TableHead>
                      <TableHead>কার্ড ইস্যুয়ার</TableHead>
                      <TableHead>পরিমাণ</TableHead>
                      <TableHead>স্ট্যাটাস</TableHead>
                      <TableHead>তারিখ</TableHead>
                      {isAdmin && <TableHead>অ্যাকশন</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.userName || 'N/A'}</TableCell>
                        <TableCell>{payment.tran_id || 'N/A'}</TableCell>
                        <TableCell>{payment.val_id || 'N/A'}</TableCell>
                        <TableCell>{payment.card_type || 'N/A'}</TableCell>
                        <TableCell>{payment.card_issuer || 'N/A'}</TableCell>
                        <TableCell>{payment.amount} ৳</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : payment.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : payment.status === 'verified'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {payment.status === 'completed'
                              ? 'সম্পন্ন'
                              : payment.status === 'pending'
                              ? 'পেন্ডিং'
                              : payment.status === 'failed'
                              ? 'ব্যর্থ'
                              : payment.status === 'verified'
                              ? 'যাচাইকৃত'
                              : 'বাতিল'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {payment.createdAt instanceof Date
                            ? payment.createdAt.toLocaleDateString('bn-BD')
                            : 'N/A'}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Select
                              onValueChange={(value) =>
                                handleStatusChange(
                                  payment.id,
                                  value as 'pending' | 'verified' | 'completed' | 'failed' | 'cancelled'
                                )
                              }
                              defaultValue={payment.status}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="স্ট্যাটাস" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">পেন্ডিং</SelectItem>
                                <SelectItem value="verified">যাচাইকৃত</SelectItem>
                                <SelectItem value="completed">সম্পন্ন</SelectItem>
                                <SelectItem value="failed">ব্যর্থ</SelectItem>
                                <SelectItem value="cancelled">বাতিল</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;