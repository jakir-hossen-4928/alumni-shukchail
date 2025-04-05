
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) {
      toast.error('অনুগ্রহ করে সব তথ্য পূরণ করুন।');
      return;
    }
    
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      toast.success('আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।');
      setForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="https://i.ibb.co/NgkLwVm3/shukchail-logo.jpg" 
              alt="Shukchail Logo" 
              className="h-20"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">যোগাযোগ করুন</h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            আমাদের সাথে যোগাযোগ করতে নিচের ফর্মটি পূরণ করুন অথবা আমাদের যোগাযোগের তথ্য ব্যবহার করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>আমাদের মেসেজ পাঠান</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">নাম</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="আপনার নাম"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">ইমেইল</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="আপনার ইমেইল"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">ফোন নম্বর</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="আপনার ফোন নম্বর"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">মেসেজ</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="আপনার মেসেজ লিখুন"
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'পাঠানো হচ্ছে...' : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> মেসেজ পাঠান
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">ইমেইল</h3>
                    <p className="text-gray-600">info@shukchail.org</p>
                    <p className="text-gray-600">support@shukchail.org</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">ফোন</h3>
                    <p className="text-gray-600">+880 1712-345678</p>
                    <p className="text-gray-600">+880 1812-345678</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">ঠিকানা</h3>
                    <p className="text-gray-600">শুকচাইল কমিউনিটি সেন্টার</p>
                    <p className="text-gray-600">শুকচাইল, সেন্টমার্টিন, কক্সবাজার</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">অফিস আওয়ার্স</h3>
              <div className="space-y-1 text-gray-600">
                <p>সোম - শুক্র: সকাল ৯টা - বিকাল ৫টা</p>
                <p>শনি: সকাল ১০টা - দুপুর ২টা</p>
                <p>রবি: বন্ধ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
