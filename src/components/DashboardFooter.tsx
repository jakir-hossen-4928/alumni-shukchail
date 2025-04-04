
import { Link } from 'react-router-dom';

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 p-4 md:ml-64 mt-auto text-center text-sm">
      <div className="container mx-auto">
        <p className="text-alumni-primary">
          &copy; {currentYear} শুকচাইল সরকারি প্রাথমিক বিদ্যালয় অ্যালামনাই। সর্বস্বত্ব সংরক্ষিত।
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link to="/dashboard" className="text-alumni-primary hover:underline">
            ড্যাশবোর্ড
          </Link>
          <Link to="/dashboard/profile" className="text-alumni-primary hover:underline">
            প্রোফাইল
          </Link>
          <Link to="/dashboard/settings" className="text-alumni-primary hover:underline">
            সেটিংস
          </Link>
          <Link to="/" className="text-alumni-primary hover:underline">
            মূল পাতায় ফিরে যান
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
