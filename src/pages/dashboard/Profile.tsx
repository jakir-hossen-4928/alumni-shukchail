import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/DashboardLayout';

const profileSchema = z.object({
  name: z.string().min(1, { message: 'নাম আবশ্যক' }),
  phoneNumber: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birthDate: z.string().optional(),
  nationalIdOrBirthCert: z.string().optional(),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  occupation: z.string().optional(),
  currentLocation: z.string().optional(),
  studyYears: z.string().regex(/^\d{4}-\d{4}$/, { message: 'শুকচাইল স্কুলে পড়াশোনার বছর ফরম্যাট হবে "YYYY-YYYY" (যেমন: ১৯৯৫-২০০০)' }).optional(),
  passYear: z.string().regex(/^\d{4}$/, { message: 'পঞ্চম শ্রেণী পাসের বছর হবে ৪ সংখ্যার বছর (যেমন: ২০০০)' }).optional(),
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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(userData?.profileImageUrl || '');
  const imageHostKey = '7288703f0ff5be6da7fe2a1c0f030544'; // Replace with your ImgBB API key in .env

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name || '',
      phoneNumber: userData?.phoneNumber || '',
      gender: userData?.gender || 'male',
      birthDate: userData?.birthDate
        ? userData.birthDate instanceof Date
          ? userData.birthDate.toISOString().split('T')[0]
          : userData.birthDate
        : '',
      nationalIdOrBirthCert: userData?.nationalIdOrBirthCert || '',
      currentAddress: userData?.currentAddress || '',
      permanentAddress: userData?.permanentAddress || '',
      occupation: userData?.occupation || '',
      currentLocation: userData?.currentLocation || '',
      studyYears: userData?.studyYears || '',
      passYear: userData?.passYear || '',
      secondaryEducation: userData?.secondaryEducation || '',
      higherEducation: userData?.higherEducation || '',
      currentWorkplace: userData?.currentWorkplace || '',
      workExperience: userData?.workExperience || '',
      specialContribution: userData?.specialContribution || '',
      suggestions: userData?.suggestions || '',
    },
  });

  useEffect(() => {
    if (userData) {
      Object.keys(profileSchema.shape).forEach((key) => {
        const value = userData[key as keyof typeof userData];
        if (value !== undefined && value !== null) {
          if (key === 'birthDate' && value instanceof Date) {
            form.setValue(key as keyof ProfileFormValues, value.toISOString().split('T')[0]);
          } else {
            form.setValue(key as keyof ProfileFormValues, String(value));
          }
        }
      });
      setProfileImageUrl(userData.profileImageUrl || '');
    }
  }, [userData, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    setLoading(true); // Disable interactions during upload

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully, URL:', data.data.url);
        setProfileImageUrl(data.data.url);
        toast.success('ইমেজ সফলভাবে আপলোড হয়েছে!');
      } else {
        toast.error('ইমেজ আপলোডে সমস্যা হয়েছে।');
        console.error('Error uploading image to ImgBB');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('ইমেজ আপলোডে ত্রুটি।');
    } finally {
      setLoading(false); // Re-enable interactions
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser?.uid) return;

    setLoading(true); // Disable interactions during submission

    try {
      // Clean up the data to avoid undefined values
      const updatedData: Partial<typeof userData> = {};
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof ProfileFormValues];
        if (value !== undefined && value !== '') {
          if (key === 'birthDate') {
            updatedData[key] = new Date(value).toISOString();
          } else {
            updatedData[key] = value;
          }
        }
      });

      // Add profileImageUrl if it exists
      if (profileImageUrl) {
        updatedData.profileImageUrl = profileImageUrl;
      }

      const hasChanges =
        Object.keys(updatedData).some((key) => {
          const formValue = updatedData[key as keyof typeof updatedData];
          const userValue = userData?.[key as keyof typeof userData];
          if (key === 'birthDate') {
            const formDate = formValue ? new Date(formValue).toISOString() : '';
            const userDate = userValue instanceof Date ? userValue.toISOString() : userValue;
            return formDate !== userDate;
          }
          return String(formValue) !== String(userValue);
        }) || profileImageUrl !== userData?.profileImageUrl;

      if (!hasChanges) {
        toast.info('কোনো পরিবর্তন নেই।');
        setLoading(false);
        return;
      }

      await updateUserProfile(currentUser.uid, updatedData);
      toast.success('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('প্রোফাইল আপডেটে সমস্যা হয়েছে।');
    } finally {
      setLoading(false); // Re-enable interactions
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">প্রোফাইল সম্পাদনা</h1>
          <p className="text-gray-600 mt-2">আপনার তথ্য আপডেট করুন এবং সঠিকভাবে পূরণ করুন।</p>
          {userData?.updatedAt && (
            <p className="text-sm text-gray-500 mt-1">
              সর্বশেষ আপডেট: {userData.updatedAt instanceof Date
                ? userData.updatedAt.toLocaleString('bn-BD')
                : new Date(userData.updatedAt).toLocaleString('bn-BD')}
            </p>
          )}
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="shadow-lg border-none bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">ব্যক্তিগত তথ্য</CardTitle>
                <CardDescription className="text-gray-600">আপনার ব্যক্তিগত বিবরণ এখানে দিন।</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">ছবি নেই</span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs mx-auto"
                    disabled={loading}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">নাম *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="আপনার পূর্ণ নাম"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">মোবাইল নম্বর</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="আপনার মোবাইল নম্বর"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">লিঙ্গ</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex space-x-6"
                          disabled={loading}
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="male" className="text-blue-500" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">পুরুষ</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="female" className="text-blue-500" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">মহিলা</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="other" className="text-blue-500" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">অন্যান্য</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">জন্ম তারিখ</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationalIdOrBirthCert"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">জাতীয় পরিচয়পত্র/জন্ম সনদ নম্বর</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NID বা জন্ম সনদ নম্বর"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="currentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">বর্তমান ঠিকানা</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="আপনার বর্তমান ঠিকানা"
                            {...field}
                            className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">স্থায়ী ঠিকানা</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="আপনার স্থায়ী ঠিকানা"
                            {...field}
                            className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">পেশাগত ও শিক্ষাগত তথ্য</CardTitle>
                <CardDescription className="text-gray-600">আপনার পেশা এবং শিক্ষার বিবরণ দিন।</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">পেশা</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="আপনার বর্তমান পেশা"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">বর্তমান অবস্থান</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="আপনি বর্তমানে কোথায় থাকেন"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="studyYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">শুকচাইল স্কুলে পড়াশোনার বছর</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="যেমন: ১৯৯৫-২০০০"
                            {...field}
                            className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">পঞ্চম শ্রেণী পাসের বছর</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="যেমন: ২০০০"
                            {...field}
                            className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="secondaryEducation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="বিদ্যালয়/কলেজের নাম এবং পাসের বছর"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="higherEducation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">উচ্চশিক্ষার তথ্য</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="বিশ্ববিদ্যালয়/অন্যান্য শিক্ষা প্রতিষ্ঠান, ডিগ্রি ও বছর"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentWorkplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">বর্তমান কর্মস্থল/শিক্ষাপ্রতিষ্ঠান</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="আপনি বর্তমানে কোথায় কাজ করেন বা পড়াশোনা করেন"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">চাকরি/পেশাগত অভিজ্ঞতা</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="আপনার কর্ম অভিজ্ঞতা সংক্ষেপে"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">অতিরিক্ত তথ্য</CardTitle>
                <CardDescription className="text-gray-600">অ্যালামনাই সম্পর্কিত অতিরিক্ত তথ্য শেয়ার করুন।</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="specialContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">কোনো বিশেষ অবদান বা স্মৃতি</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="স্কুলে আপনার কোনো বিশেষ অবদান বা স্মৃতি"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="suggestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">আপনার মতামত/পরামর্শ</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="অ্যালামনাই অ্যাসোসিয়েশনের জন্য আপনার পরামর্শ"
                          {...field}
                          className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end mt-8 space-x-4">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-md shadow-md transition duration-200"
                onClick={() => form.reset()}
                disabled={loading}
              >
                রিসেট করুন
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md shadow-md transition duration-200"
                disabled={loading}
              >
                {loading ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল সংরক্ষণ করুন'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;