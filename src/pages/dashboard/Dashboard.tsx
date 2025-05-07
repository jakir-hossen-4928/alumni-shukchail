import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPayments } from '@/lib/api';
import { Payment, User } from '@/lib/types';
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
        // Sort by createdAt descending and take top 2
        const sortedPayments = data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 2);
        setPayments(sortedPayments);
      }
      setLoading(false);
    };

    fetchPayments();
  }, [userData]);

  
// Calculate profile completion percentage
const calculateProfileCompletion = (user: User | null) => {
  if (!user) return 0;

  // Fields defined in profileSchema (from Profile.tsx)
  const profileFields: (keyof User)[] = [
    'name',
    'phoneNumber',
    'gender',
    'birthDate',
    'nationalIdOrBirthCert',
    'currentAddress',
    'permanentAddress',
    'occupation',
    'currentLocation',
    'studyYears',
    'passYear',
    'secondaryEducation',
    'higherEducation',
    'currentWorkplace',
    'workExperience',
    'specialContribution',
    'suggestions',
    'profileImageUrl',
  ];

  const totalFields = profileFields.length;
  let filledFields = 0;

  profileFields.forEach(field => {
    const value = user[field];
    if (field === 'birthDate') {
      // Special handling for birthDate (Date object or string)
      if (value instanceof Date || (typeof value === 'string' && value.trim() !== '')) {
        filledFields++;
      }
    } else if (value !== undefined && value !== null && value !== '') {
      filledFields++;
    }
  });

  return Math.round((filledFields / totalFields) * 100);
};

  const profileCompletionPercentage = calculateProfileCompletion(userData);



  const getMembershipStatusCard = () => {
    if (!userData?.approved) {
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
    } else if (userData?.approved) {
      if (userData?.membershipExpiry) {
        const expiryDate = userData.membershipExpiry instanceof Date
          ? userData.membershipExpiry
          : new Date(userData.membershipExpiry);
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
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
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
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-blue-700">সদস্যপদ অনুমোদিত</h3>
              </div>
              <p className="text-blue-600 mb-4">
                আপনার সদস্যপদ অনুমোদিত হয়েছে। সদস্যপদ সক্রিয় করতে পেমেন্ট করুন।
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/dashboard/payment">পেমেন্ট করুন</Link>
              </Button>
            </CardContent>
          </Card>
        );
      }
    }

    return null;
  };

  const renderPaymentHistory = () => {
    if (loading) {
      return <p className="text-gray-600">লোড হচ্ছে...</p>;
    }

    if (payments.length === 0) {
      return <p className="text-gray-500">কোনো পেমেন্ট হিস্টরি পাওয়া যায়নি।</p>;
    }

    return (
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="font-medium text-gray-800">
                    {payment.amount} ৳ - বিকাশ (bKash)
                  </p>
                  <p className="text-gray-600 text-sm">
                    {payment.createdAt instanceof Date
                      ? payment.createdAt.toLocaleDateString('bn-BD')
                      : new Date(payment.createdAt).toLocaleDateString('bn-BD')}
                  </p>
                  <p className="text-gray-600 text-sm">
                    TrxID: {payment.transactionID || 'N/A'}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status === 'completed'
                      ? 'সফল'
                      : payment.status === 'pending'
                      ? 'অপেক্ষমান'
                      : payment.error
                      ? `ব্যর্থ (${payment.error})`
                      : 'ব্যর্থ'}
                  </span>
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
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              স্বাগতম, {userData?.name || 'সদস্য'}
            </h1>
            <p className="text-sm text-gray-600">আপনার অ্যালামনাই অ্যাকাউন্ট ড্যাশবোর্ডে স্বাগতম।</p>
          </div>
          {userData?.approved && !userData?.membershipExpiry && (
            <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/dashboard/payment" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                পেমেন্ট করুন
              </Link>
            </Button>
          )}
        </div>

        {getMembershipStatusCard()}

        {profileCompletionPercentage < 100 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">প্রোফাইল সম্পূর্ণতা</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                আপনার প্রোফাইল তথ্য সম্পূর্ণ করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletionPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{profileCompletionPercentage}% সম্পূর্ণ</span>
                  <Button asChild variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                    <Link to="/dashboard/profile">প্রোফাইল সম্পূর্ণ করুন</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">পেমেন্ট হিস্টরি</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              আপনার সাম্প্রতিক ২টি পেমেন্টের বিবরণ
            </CardDescription>
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