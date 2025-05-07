
import { useEffect, useState } from 'react';
import { 
  Users, Check, Clock, AlertCircle, ArrowUpRight,
  ArrowDownRight, UserPlus, CreditCard
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Loading } from '@/components/ui/loading';
import PaymentStatusChip from '@/components/PaymentStatusChip';
import { Payment } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

// Mock data for admin dashboard
const mockMonthlyData = [
  { name: 'জানুয়ারী', value: 12 },
  { name: 'ফেব্রুয়ারী', value: 15 },
  { name: 'মার্চ', value: 18 },
  { name: 'এপ্রিল', value: 24 },
  { name: 'মে', value: 28 },
  { name: 'জুন', value: 30 },
  { name: 'জুলাই', value: 35 },
];

const mockPaymentData = [
  { name: 'যাচাই হয়েছে', value: 68, color: '#10b981' },
  { name: 'অপেক্ষমান', value: 25, color: '#f59e0b' },
  { name: 'ব্যর্থ হয়েছে', value: 7, color: '#ef4444' },
];

const mockRecentPayments: Payment[] = [
  {
    id: '1',
    userId: 'user123',
    amount: 500,
    paymentMethod: 'bKash',
    paymentNumber: '01712345678',
    transactionId: 'TRX12345',
    status: 'pending',
    paymentDate: new Date(2025, 3, 3),
    verifiedAt: null
  },
  {
    id: '2',
    userId: 'user456',
    amount: 500,
    paymentMethod: 'Nagad',
    paymentNumber: '01898765432',
    transactionId: 'TRX67890',
    status: 'verified',
    paymentDate: new Date(2025, 3, 2),
    verifiedAt: new Date(2025, 3, 3)
  },
  {
    id: '3',
    userId: 'user789',
    amount: 500,
    paymentMethod: 'bKash',
    paymentNumber: '01712345679',
    transactionId: 'TRX12346',
    status: 'failed',
    paymentDate: new Date(2025, 3, 1),
    verifiedAt: null
  }
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-[50vh] flex items-center justify-center">
          <Loading text="ড্যাশবোর্ড লোড হচ্ছে..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">অ্যাডমিন ড্যাশবোর্ড</h1>
          <p className="text-muted-foreground">অ্যালামনাই অ্যাসোসিয়েশনের সামগ্রিক অবস্থা</p>
        </div>

        {/* Summary Cards */}
        <div className="dashboard-grid">
          <DashboardCard 
            title="মোট সদস্য"
            value="125"
            icon={<Users className="w-6 h-6 text-primary" />}
            trend={8}
            className="card-hover"
          />
          
          <DashboardCard 
            title="নতুন সদস্য"
            value="24"
            icon={<UserPlus className="w-6 h-6 text-green-600" />}
            description="এই মাসে"
            trend={15}
            className="card-hover"
          />
          
          <DashboardCard 
            title="অনুমোদিত পেমেন্ট"
            value="৳32,500"
            icon={<Check className="w-6 h-6 text-green-600" />}
            description="গত 30 দিনে"
            trend={5}
            className="card-hover"
          />
          
          <DashboardCard 
            title="অপেক্ষমান পেমেন্ট"
            value="৳5,500"
            icon={<Clock className="w-6 h-6 text-yellow-600" />}
            description="11 টি লেনদেন"
            trend={-3}
            className="card-hover"
          />
        </div>

        {/* Charts and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Member Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>সদস্য বৃদ্ধি</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockMonthlyData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>পেমেন্ট স্ট্যাটাস</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockPaymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockPaymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {mockPaymentData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>সাম্প্রতিক পেমেন্টসমূহ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">তারিখ</th>
                    <th className="text-left py-3 px-4">পরিমাণ</th>
                    <th className="text-left py-3 px-4">পেমেন্ট পদ্ধতি</th>
                    <th className="text-left py-3 px-4">ট্রানজেকশন আইডি</th>
                    <th className="text-left py-3 px-4">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-3 px-4">{payment.paymentDate.toLocaleDateString('bn-BD')}</td>
                      <td className="py-3 px-4">৳{payment.amount}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-normal">
                          <CreditCard className="w-3 h-3 mr-1" />
                          {payment.paymentMethod}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{payment.transactionId}</td>
                      <td className="py-3 px-4">
                        <PaymentStatusChip status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
