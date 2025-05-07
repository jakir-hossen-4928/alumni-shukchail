// src/pages/admin/Users.tsx

import { useEffect, useState } from 'react';
import { getAllUsers, updateMembershipStatus } from '@/lib/api';
import { User } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DashboardLayout from '@/components/DashboardLayout';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

    if (filter !== 'all') {
      result = result.filter(user =>
        filter === 'approved' ? user.approved :
        filter === 'rejected' ? !user.approved && user.approvedAt !== undefined :
        !user.approved && user.approvedAt === undefined
      );
    }

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
        setUsers(prevUsers => prevUsers.map(user =>
          user.uid === userId ? { ...user, approved: true, approvedAt: new Date() } : user
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
        setUsers(prevUsers => prevUsers.map(user =>
          user.uid === userId ? { ...user, approved: false, approvedAt: undefined } : user
        ));
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.approved) {
      return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> অনুমোদিত</Badge>;
    } else if (!user.approved && user.approvedAt === undefined) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Clock className="h-3 w-3 mr-1" /> অপেক্ষমান</Badge>;
    } else {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> বাতিল</Badge>;
    }
  };

  const openProfileDialog = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">সদস্য ব্যবস্থাপনা</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            সদস্যদের তালিকা এবং তাদের সদস্যপদ অনুমোদন
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">সদস্য তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন"
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-start">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className={`text-xs sm:text-sm ${filter === 'all' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}`}
                >
                  সকল
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilter('pending')}
                  className={`text-xs sm:text-sm ${filter === 'pending' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}`}
                >
                  অপেক্ষমান
                </Button>
                <Button
                  variant={filter === 'approved' ? 'default' : 'outline'}
                  onClick={() => setFilter('approved')}
                  className={`text-xs sm:text-sm ${filter === 'approved' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}`}
                >
                  অনুমোদিত
                </Button>
                <Button
                  variant={filter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setFilter('rejected')}
                  className={`text-xs sm:text-sm ${filter === 'rejected' ? 'bg-alumni-primary hover:bg-alumni-secondary' : ''}`}
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px] sm:w-[250px] text-xs sm:text-sm">নাম</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">যোগাযোগ</TableHead>
                      <TableHead className="text-xs sm:text-sm">স্ট্যাটাস</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">রেজিস্ট্রেশন তারিখ</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">সর্বশেষ আপডেট</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell className="font-medium text-xs sm:text-sm">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="p-0 h-auto text-xs sm:text-sm" onClick={() => openProfileDialog(user)}>
                                {user.name || "নাম নেই"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[90vw] sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-lg sm:text-xl">{user.name || "নাম নেই"} এর প্রোফাইল</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 text-sm sm:text-base">
                                <div><strong>ইমেইল:</strong> {user.email}</div>
                                {user.phoneNumber && <div><strong>ফোন:</strong> {user.phoneNumber}</div>}
                                {user.gender && <div><strong>লিঙ্গ:</strong> {user.gender === 'male' ? 'পুরুষ' : user.gender === 'female' ? 'মহিলা' : 'অন্যান্য'}</div>}
                                {user.birthDate && (
                                  <div>
                                    <strong>জন্ম তারিখ:</strong>
                                    {user.birthDate instanceof Date ? user.birthDate.toLocaleDateString('bn-BD') : new Date(user.birthDate).toLocaleDateString('bn-BD')}
                                  </div>
                                )}
                                {user.nationalIdOrBirthCert && <div><strong>NID/জন্ম সনদ:</strong> {user.nationalIdOrBirthCert}</div>}
                                {user.currentAddress && <div><strong>বর্তমান ঠিকানা:</strong> {user.currentAddress}</div>}
                                {user.permanentAddress && <div><strong>স্থায়ী ঠিকানা:</strong> {user.permanentAddress}</div>}
                                {user.occupation && <div><strong>পেশা:</strong> {user.occupation}</div>}
                                {user.currentLocation && <div><strong>বর্তমান অবস্থান:</strong> {user.currentLocation}</div>}
                                {user.studyYears && <div><strong>শুকচাইল স্কুলে পড়াশোনার বছর:</strong> {user.studyYears}</div>}
                                {user.passYear && <div><strong>পঞ্চম শ্রেণী পাসের বছর:</strong> {user.passYear}</div>}
                                {user.secondaryEducation && <div><strong>মাধ্যমিক ও উচ্চ মাধ্যমিক:</strong> {user.secondaryEducation}</div>}
                                {user.higherEducation && <div><strong>উচ্চশিক্ষা:</strong> {user.higherEducation}</div>}
                                {user.currentWorkplace && <div><strong>বর্তমান কর্মস্থল:</strong> {user.currentWorkplace}</div>}
                                {user.workExperience && <div><strong>কর্ম অভিজ্ঞতা:</strong> {user.workExperience}</div>}
                                {user.specialContribution && <div><strong>বিশেষ অবদান:</strong> {user.specialContribution}</div>}
                                {user.suggestions && <div><strong>পরামর্শ:</strong> {user.suggestions}</div>}
                                {user.profileImageUrl && (
                                  <div>
                                    <strong>প্রোফাইল ছবি:</strong>
                                    <img src={user.profileImageUrl} alt="Profile" className="w-24 h-24 sm:w-32 sm:h-32 mt-2 rounded-full mx-auto" />
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                          <div>{user.email}</div>
                          {user.phoneNumber && <div className="text-muted-foreground">{user.phoneNumber}</div>}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{getStatusBadge(user)}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          {user.createdAt instanceof Date
                            ? user.createdAt.toLocaleDateString('bn-BD')
                            : new Date(user.createdAt).toLocaleDateString('bn-BD')}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          {user.updatedAt instanceof Date
                            ? user.updatedAt.toLocaleDateString('bn-BD')
                            : new Date(user.updatedAt).toLocaleDateString('bn-BD')}
                        </TableCell>
                        <TableCell align="right">
                          <div className="flex justify-end gap-1 sm:gap-2 flex-wrap">
                            {!user.approved && user.approvedAt === undefined && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 text-xs sm:text-sm px-2 sm:px-3"
                                  onClick={() => handleApprove(user.uid)}
                                >
                                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> অনুমোদন
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs sm:text-sm px-2 sm:px-3"
                                  onClick={() => handleReject(user.uid)}
                                >
                                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> বাতিল
                                </Button>
                              </>
                            )}
                            {(!user.approved && user.approvedAt !== undefined) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 text-xs sm:text-sm px-2 sm:px-3"
                                onClick={() => handleApprove(user.uid)}
                              >
                                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> অনুমোদন
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