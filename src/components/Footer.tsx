
import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-alumni-primary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <img 
            src="https://i.ibb.co/NgkLwVm3/shukchail-logo.jpg" 
            alt="শুকচাইল স্কুল লোগো" 
            className="h-16 w-auto"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">শুকচাইল সরকারি প্রাথমিক বিদ্যালয় অ্যালামনাই</h3>
            <p className="text-alumni-light">
              আমাদের স্কুলের পুরানো ছাত্র-ছাত্রীদের মিলন মেলা, যা একটি সাংস্কৃতিক ও সামাজিক উন্নয়নে অবদান রাখে।
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">দ্রুত লিঙ্ক</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-alumni-light hover:underline">আমাদের সম্পর্কে</Link>
              </li>
              <li>
                <Link to="/events" className="text-alumni-light hover:underline">ইভেন্টস</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-alumni-light hover:underline">সদস্য ড্যাশবোর্ড</Link>
              </li>
              <li>
                <Link to="/register" className="text-alumni-light hover:underline">সদস্য হোন</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">যোগাযোগ</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-alumni-accent" />
                <span>shukchail.alumni@example.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-alumni-accent" />
                <span>+880 1712-345678</span>
              </div>
              <div className="flex items-center">
                <Facebook className="mr-2 h-5 w-5 text-alumni-accent" />
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  ফেসবুক পেজ
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {currentYear} শুকচাইল সরকারি প্রাথমিক বিদ্যালয় অ্যালামনাই। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
