
import { useEffect, useState } from 'react';
import { getAllPayments, verifyPayment } from '@/lib/api';
import { Payment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, Clock, Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
        setFilteredPayments(data.filter(payment => payment.status === 'pending'));
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('পেমেন্ট তালিকা লোড করতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);
  
  useEffect(() => {
    let result = payments;
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(payment => payment.status === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(payment => 
        payment.userId.toLowerCase().includes(term) || 
        payment.transactionId.toLowerCase().includes(term) || 
        payment.paymentNumber.toLowerCase().includes(term)
      );
    }
    
    setFilteredPayments(result);
  }, [filter, searchTerm, payments]);
  
  const handleVerify = async (paymentId: string, userId: string) => {
    try {
      const success = await verifyPayment(paymentId, userId);
      if (success) {
        // Update local state
        setPayments(prevPayments => prevPayments.map(payment => 
          payment.id === paymentId ? { ...payment, status: 'verified', verifiedAt: new Date() } : payment
        ));
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            যাচাই হয়েছে
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            অপেক্ষমান
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            ব্যর্থ হয়েছে
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">পেমেন্ট যাচাই</h1>
          <p className="text-muted-foreground">
            সদস্যদের পেমেন্ট যাচাই করুন এবং অনুমোদন দিন
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>পেমেন্ট তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="সদস্য আইডি বা ট্রানজেকশন আইডি দিয়ে খুঁজুন"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}
                >
                  সকল
                </Button>
                <Button 
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilter('pending')}
                  className={filter === 'pending' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}
                >
                  অপেক্ষমান
                </Button>
                <Button 
                  variant={filter === 'verified' ? 'default' : 'outline'}
                  onClick={() => setFilter('verified')}
                  className={filter === 'verified' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}
                >
                  যাচাইকৃত
                </Button>
                <Button 
                  variant={filter === 'failed' ? 'default' : 'outline'}
                  onClick={() => setFilter('failed')}
                  className={filter === 'failed' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}
                >
                  বাতিল
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">লোড হচ্ছে...</div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">কোনো পেমেন্ট পাওয়া যায়নি।</div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ইউজার আইডি</TableHead>
                      <TableHead>ট্রানজেকশন আইডি</TableHead>
                      <TableHead>মোবাইল</TableHead>
                      <TableHead>পরিমাণ</TableHead>
                      <TableHead>তারিখ</TableHead>
                      <TableHead>স্ট্যাটাস</TableHead>
                      <TableHead className="text-right">অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.userId.slice(0, 8)}...</TableCell>
                        <TableCell>{payment.transactionId}</TableCell>
                        <TableCell>{payment.paymentNumber}</TableCell>
                        <TableCell>{payment.amount} ৳</TableCell>
                        <TableCell>
                          {payment.paymentDate instanceof Date ? payment.paymentDate.toLocaleDateString('bn-BD') : 
                           new Date(payment.paymentDate).toLocaleDateString('bn-BD')}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell align="right">
                          <div className="flex justify-end">
                            {payment.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" 
                                onClick={() => handleVerify(payment.id, payment.userId)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" /> যাচাই করুন
                              </Button>
                            )}
                          </div>
                        </TableCell>
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
