
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPayments } from '@/lib/api';
import { Payment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock, CreditCard } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const Dashboard = () => {
  const { userData } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (userData?.uid) {
        const data = await getUserPayments(userData.uid);
        setPayments(data);
      }
      setLoading(false);
    };

    fetchPayments();
  }, [userData]);

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

  const getMembershipStatusCard = () => {
    if (userData?.membershipStatus === 'pending') {
      return (
        <Card className="bg-yellow-50 border-yellow-200 mb-6">
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-yellow-700">সদস্যপদ অনুমোদন অপেক্ষমান</h3>
            </div>
            <p className="text-yellow-600">
              আপনার সদস্যপদ এখনও অ্যাডমিন দ্বারা অনুমোদনের অপেক্ষায় আছে। অনুমোদনের পর আপনি পেমেন্ট করতে পারবেন।
            </p>
          </CardContent>
        </Card>
      );
    } else if (userData?.membershipStatus === 'approved') {
      if (userData?.membershipExpiresAt) {
        const expiryDate = userData.membershipExpiresAt instanceof Date 
          ? userData.membershipExpiresAt 
          : new Date(userData.membershipExpiresAt);
        const now = new Date();
        
        if (expiryDate > now) {
          return (
            <Card className="bg-green-50 border-green-200 mb-6">
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-green-700">সক্রিয় সদস্যপদ</h3>
                </div>
                <p className="text-green-600">
                  আপনার সদস্যপদ {expiryDate.toLocaleDateString('bn-BD')} পর্যন্ত বৈধ আছে।
                </p>
              </CardContent>
            </Card>
          );
        } else {
          return (
            <Card className="bg-red-50 border-red-200 mb-6">
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-700">সদস্যপদ মেয়াদ শেষ</h3>
                </div>
                <p className="text-red-600 mb-4">
                  আপনার সদস্যপদের মেয়াদ শেষ হয়ে গেছে। অ্যাসোসিয়েশনের সুবিধা পেতে দয়া করে সদস্যপদ নবায়ন করুন।
                </p>
                <Button asChild className="bg-alumni-primary hover:bg-alumni-secondary">
                  <Link to="/dashboard/payment">নবায়ন করুন</Link>
                </Button>
              </CardContent>
            </Card>
          );
        }
      } else {
        return (
          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-alumni-primary" />
                <h3 className="font-semibold text-alumni-primary">সদস্যপদ অনুমোদিত</h3>
              </div>
              <p className="text-blue-600 mb-4">
                আপনার সদস্যপদ অনুমোদিত হয়েছে। সদস্যপদ সক্রিয় করতে পেমেন্ট করুন।
              </p>
              <Button asChild className="bg-alumni-primary hover:bg-alumni-secondary">
                <Link to="/dashboard/payment">পেমেন্ট করুন</Link>
              </Button>
            </CardContent>
          </Card>
        );
      }
    } else if (userData?.membershipStatus === 'rejected') {
      return (
        <Card className="bg-red-50 border-red-200 mb-6">
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-red-700">সদস্যপদ বাতিল হয়েছে</h3>
            </div>
            <p className="text-red-600">
              দুঃখিত, আপনার সদস্যপদের আবেদন বাতিল করা হয়েছে। বিস্তারিত জানতে যোগাযোগ করুন।
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return null;
  };

  const renderPaymentHistory = () => {
    if (loading) {
      return <p>লোড হচ্ছে...</p>;
    }

    if (payments.length === 0) {
      return <p className="text-muted-foreground">কোনো পেমেন্ট হিস্টরি পাওয়া যায়নি।</p>;
    }

    return (
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {payment.amount} ৳ - {payment.paymentMethod}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {payment.paymentDate.toLocaleDateString('bn-BD')}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    TrxID: {payment.transactionId}
                  </p>
                </div>
                <div>
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">স্বাগতম, {userData?.name || 'সদস্য'}</h1>
            <p className="text-muted-foreground">আপনার অ্যালামনাই অ্যাকাউন্ট ড্যাশবোর্ডে স্বাগতম।</p>
          </div>
          
          {userData?.membershipStatus === 'approved' && !userData?.membershipExpiresAt && (
            <Button className="bg-alumni-primary hover:bg-alumni-secondary mt-4 sm:mt-0">
              <Link to="/dashboard/payment" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                পেমেন্ট করুন
              </Link>
            </Button>
          )}
        </div>

        {getMembershipStatusCard()}

        <Card>
          <CardHeader>
            <CardTitle>প্রোফাইল সম্পূর্ণতা</CardTitle>
            <CardDescription>আপনার প্রোফাইল তথ্য সম্পূর্ণ করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {/* Mock profile completion progress */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-alumni-secondary h-4 rounded-full"
                  style={{ width: userData?.name ? '60%' : '20%' }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>{userData?.name ? '60%' : '20%'} সম্পূর্ণ</span>
                <Button asChild variant="link" className="p-0 h-auto text-alumni-primary">
                  <Link to="/dashboard/profile">প্রোফাইল সম্পূর্ণ করুন</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>পেমেন্ট হিস্টরি</CardTitle>
            <CardDescription>আপনার সাম্প্রতিক পেমেন্টসমূহ</CardDescription>
          </CardHeader>
          <CardContent>
            {renderPaymentHistory()}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
