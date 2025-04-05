
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="text-[120px] md:text-[180px] font-extrabold text-gray-200">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle size={80} className="text-red-500" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800">পৃষ্ঠাটি খুঁজে পাওয়া যাচ্ছে না</h1>
        <p className="text-gray-600 max-w-sm mx-auto">
          আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে উপলব্ধ নেই।
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="default" className="flex gap-2">
            <Link to="/">
              <Home size={16} />
              হোমপেজে ফিরে যান
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex gap-2">
            <Link to="#" onClick={() => window.history.back()}>
              <ArrowLeft size={16} />
              আগের পৃষ্ঠায় ফিরুন
            </Link>
          </Button>
        </div>
        
        <div className="py-4">
          <img 
            src="https://i.ibb.co/NgkLwVm3/shukchail-logo.jpg" 
            alt="Shukchail Logo" 
            className="h-16 mx-auto"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
