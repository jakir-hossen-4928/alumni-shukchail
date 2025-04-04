
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/api';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserData } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

const profileSchema = z.object({
  name: z.string().min(1, { message: 'নাম আবশ্যক' }),
  parentName: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  birthDate: z.string().optional(),
  nationalIdOrBirthCert: z.string().optional(),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  phoneNumber: z.string().optional(),
  occupation: z.string().optional(),
  currentLocation: z.string().optional(),
  studyYears: z.string().optional(),
  passYear: z.string().optional(),
  secondaryEducation: z.string().optional(),
  higherEducation: z.string().optional(),
  currentWorkplace: z.string().optional(),
  workExperience: z.string().optional(),
  specialContribution: z.string().optional(),
  suggestions: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { userData, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name || '',
      parentName: '',
      gender: 'male',
      birthDate: '',
      nationalIdOrBirthCert: '',
      currentAddress: '',
      permanentAddress: '',
      phoneNumber: userData?.phoneNumber || '',
      occupation: '',
      currentLocation: '',
      studyYears: '',
      passYear: '',
      secondaryEducation: '',
      higherEducation: '',
      currentWorkplace: '',
      workExperience: '',
      specialContribution: '',
      suggestions: '',
    }
  });
  
  useEffect(() => {
    if (userData) {
      // Pre-populate the form with user data if available
      Object.keys(userData).forEach(key => {
        if (form.getValues()[key as keyof ProfileFormValues] !== undefined) {
          // Convert dates to strings if necessary
          const value = userData[key as keyof UserData];
          if (value instanceof Date && key === 'birthDate') {
            // Format Date objects to YYYY-MM-DD string for input[type="date"]
            const dateValue = value as Date;
            const formattedDate = dateValue.toISOString().split('T')[0];
            form.setValue(key as keyof ProfileFormValues, formattedDate);
          } else if (typeof value === 'string' || typeof value === 'number') {
            // Only set string or number values directly
            form.setValue(key as keyof ProfileFormValues, value as string);
          }
        }
      });
    }
  }, [userData, form]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser?.uid) return;
    
    try {
      setLoading(true);
      await updateUserProfile(currentUser.uid, data);
      toast.success('প্রোফাইল আপডেট করা হয়েছে!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('প্রোফাইল আপডেট করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">প্রোফাইল সম্পূর্ণ করুন</h1>
          <p className="text-muted-foreground">
            আপনার সম্পূর্ণ প্রোফাইল সেট আপ করুন। সবগুলি তথ্য সঠিকভাবে দিন।
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
                  <CardDescription>আপনার ব্যক্তিগত তথ্য দিন</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>নাম *</FormLabel>
                        <FormControl>
                          <Input placeholder="আপনার পূর্ণ নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পিতা/মাতার নাম</FormLabel>
                        <FormControl>
                          <Input placeholder="পিতা বা মাতার নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>লিঙ্গ *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="font-normal">পুরুষ</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="female" />
                              </FormControl>
                              <FormLabel className="font-normal">মহিলা</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal">অন্যান্য</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>জন্ম তারিখ</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nationalIdOrBirthCert"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>জাতীয় পরিচয়পত্র/জন্ম সনদ নম্বর</FormLabel>
                        <FormControl>
                          <Input placeholder="NID বা জন্ম সনদ নম্বর" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>বর্তমান ঠিকানা</FormLabel>
                          <FormControl>
                            <Textarea placeholder="আপনার বর্তমান ঠিকানা" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="permanentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>স্থায়ী ঠিকানা</FormLabel>
                          <FormControl>
                            <Textarea placeholder="আপনার স্থায়ী ঠিকানা" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>মোবাইল নম্বর</FormLabel>
                        <FormControl>
                          <Input placeholder="আপনার মোবাইল নম্বর" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>পেশাগত এবং শিক্ষাগত তথ্য</CardTitle>
                  <CardDescription>
                    আপনার পেশা এবং শিক্ষাগত যোগ্যতা সম্পর্কে তথ্য প্রদান করুন
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>পেশা</FormLabel>
                        <FormControl>
                          <Input placeholder="আপনার বর্তমান পেশা" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বর্তমান অবস্থান</FormLabel>
                        <FormControl>
                          <Input placeholder="আপনি বর্তমানে কোথায় থাকেন" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="studyYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>শুকচাইল স্কুলে পড়াশোনার বছর</FormLabel>
                          <FormControl>
                            <Input placeholder="যেমন: ১৯৯৫-২০০০" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="passYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>পঞ্চম শ্রেণী পাসের বছর</FormLabel>
                          <FormControl>
                            <Input placeholder="যেমন: ২০০০" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="secondaryEducation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা</FormLabel>
                        <FormControl>
                          <Textarea placeholder="বিদ্যালয়/কলেজের নাম এবং পাসের বছর" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="higherEducation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>উচ্চশিক্ষার তথ্য</FormLabel>
                        <FormControl>
                          <Textarea placeholder="বিশ্ববিদ্যালয়/অন্যান্য শিক্ষা প্রতিষ্ঠান, ডিগ্রি ও বছর" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currentWorkplace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বর্তমান কর্মস্থল/শিক্ষাপ্রতিষ্ঠান</FormLabel>
                        <FormControl>
                          <Input placeholder="আপনি বর্তমানে কোথায় কাজ করেন বা পড়াশোনা করেন" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="workExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>চাকরি/পেশাগত অভিজ্ঞতা</FormLabel>
                        <FormControl>
                          <Textarea placeholder="আপনার কর্ম অভিজ্ঞতা সংক্ষেপে" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>অতিরিক্ত তথ্য</CardTitle>
                  <CardDescription>
                    অ্যালামনাই সম্পর্কিত অতিরিক্ত তথ্য যা আপনি শেয়ার করতে চান
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="specialContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>কোনো বিশেষ অবদান বা স্মৃতি</FormLabel>
                        <FormControl>
                          <Textarea placeholder="স্কুলে আপনার কোনো বিশেষ অবদান বা স্মৃতি" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="suggestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>আপনার মতামত/পরামর্শ</FormLabel>
                        <FormControl>
                          <Textarea placeholder="অ্যালামনাই অ্যাসোসিয়েশনের জন্য আপনার পরামর্শ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-alumni-primary hover:bg-alumni-secondary" 
                  disabled={loading}
                >
                  {loading ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল সংরক্ষণ করুন'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
