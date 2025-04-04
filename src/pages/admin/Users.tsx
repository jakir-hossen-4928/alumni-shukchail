
import { useEffect, useState } from 'react';
import { getAllUsers, updateMembershipStatus } from '@/lib/api';
import { UserData } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/DashboardLayout';

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('সদস্য তালিকা লোড করতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  useEffect(() => {
    let result = users;
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(user => user.membershipStatus === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        (user.name?.toLowerCase().includes(term) || false) || 
        user.email.toLowerCase().includes(term) || 
        (user.phoneNumber?.toLowerCase().includes(term) || false)
      );
    }
    
    setFilteredUsers(result);
  }, [filter, searchTerm, users]);
  
  const handleApprove = async (userId: string) => {
    try {
      const success = await updateMembershipStatus(userId, 'approved');
      if (success) {
        // Update local state
        setUsers(prevUsers => prevUsers.map(user => 
          user.uid === userId ? { ...user, membershipStatus: 'approved' } : user
        ));
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };
  
  const handleReject = async (userId: string) => {
    try {
      const success = await updateMembershipStatus(userId, 'rejected');
      if (success) {
        // Update local state
        setUsers(prevUsers => prevUsers.map(user => 
          user.uid === userId ? { ...user, membershipStatus: 'rejected' } : user
        ));
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> অনুমোদিত</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> বাতিল</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Clock className="h-3 w-3 mr-1" /> অপেক্ষমান</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">সদস্য ব্যবস্থাপনা</h1>
          <p className="text-muted-foreground">
            সদস্যদের তালিকা এবং তাদের সদস্যপদ অনুমোদন
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>সদস্য তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন"
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
                  variant={filter === 'approved' ? 'default' : 'outline'}
                  onClick={() => setFilter('approved')}
                  className={filter === 'approved' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}
                >
                  অনুমোদিত
                </Button>
                <Button 
                  variant={filter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setFilter('rejected')}
                  className={filter === 'rejected' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}
                >
                  বাতিল
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">লোড হচ্ছে...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">কোনো সদস্য পাওয়া যায়নি।</div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">নাম</TableHead>
                      <TableHead>যোগাযোগ</TableHead>
                      <TableHead>স্ট্যাটাস</TableHead>
                      <TableHead>রেজিস্ট্রেশন তারিখ</TableHead>
                      <TableHead className="text-right">অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell className="font-medium">{user.name || "নাম নেই"}</TableCell>
                        <TableCell>
                          <div>{user.email}</div>
                          {user.phoneNumber && <div className="text-muted-foreground">{user.phoneNumber}</div>}
                        </TableCell>
                        <TableCell>{getStatusBadge(user.membershipStatus)}</TableCell>
                        <TableCell>
                          {user.createdAt instanceof Date ? user.createdAt.toLocaleDateString('bn-BD') : 
                           new Date(user.createdAt).toLocaleDateString('bn-BD')}
                        </TableCell>
                        <TableCell align="right">
                          <div className="flex justify-end gap-2">
                            {user.membershipStatus === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" 
                                  onClick={() => handleApprove(user.uid)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" /> অনুমোদন
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700" 
                                  onClick={() => handleReject(user.uid)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> বাতিল
                                </Button>
                              </>
                            )}
                            {user.membershipStatus === 'rejected' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" 
                                onClick={() => handleApprove(user.uid)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" /> অনুমোদন
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

export default Users;
