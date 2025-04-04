
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Users, Calendar, CreditCard, GraduationCap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-alumni-primary py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-alumni-primary to-alumni-secondary opacity-90"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                শুকচাইল সরকারি প্রাথমিক বিদ্যালয় অ্যালামনাই
              </h1>
              
              <p className="text-xl mb-8">
                আমাদের স্কুলের পুরানো ছাত্র-ছাত্রীদের একটি একীভূত প্ল্যাটফর্ম। যোগাযোগ, নেটওয়ার্কিং এবং সহযোগিতার মাধ্যমে এগিয়ে যাই।
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-alumni-primary hover:bg-alumni-light hover:text-alumni-secondary">
                  <Link to="/register">সদস্য হোন</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-alumni-primary">
                  <Link to="/about">আরও জানুন</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-alumni-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-alumni-primary mb-4">অ্যালামনাই সুবিধা</h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                আমাদের অ্যালামনাই অ্যাসোসিয়েশনে যোগদানের মাধ্যমে আপনি বিভিন্ন সুবিধা উপভোগ করতে পারবেন।
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Users className="h-12 w-12 text-alumni-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">নেটওয়ার্কিং</h3>
                  <p className="text-gray-600">
                    পুরানো বন্ধুদের সাথে যোগাযোগ করুন এবং নতুন সম্পর্ক স্থাপন করুন
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Calendar className="h-12 w-12 text-alumni-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">ইভেন্টস</h3>
                  <p className="text-gray-600">
                    মিটআপ, রিইউনিয়ন এবং অন্যান্য অনুষ্ঠানে অংশগ্রহণ করুন
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <GraduationCap className="h-12 w-12 text-alumni-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">মেন্টরশিপ</h3>
                  <p className="text-gray-600">
                    শিক্ষার্থীদের সাহায্য করুন এবং বিশেষজ্ঞদের থেকে পরামর্শ নিন
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <CreditCard className="h-12 w-12 text-alumni-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">অবদান</h3>
                  <p className="text-gray-600">
                    স্কুলের উন্নয়নে সহযোগিতা করুন এবং সামাজিক কর্মকাণ্ডে অংশগ্রহণ করুন
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-alumni-primary rounded-xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">আজই সদস্য হোন</h2>
              <p className="text-xl mb-6 max-w-2xl mx-auto">
                শুধুমাত্র বাৎসরিক ৫০০ টাকা দিয়ে আমাদের অ্যালামনাই পরিবারের সদস্য হোন এবং সুবিধা উপভোগ করুন।
              </p>
              
              <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-alumni-accent" />
                    <span>সহজ রেজিস্ট্রেশন প্রক্রিয়া</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-alumni-accent" />
                    <span>সুরক্ষিত অনলাইন পেমেন্ট</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-alumni-accent" />
                    <span>আজীবন সদস্যতা সুবিধা</span>
                  </div>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-white text-alumni-primary hover:bg-alumni-light hover:text-alumni-secondary">
                <Link to="/register">রেজিস্টার করুন</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
