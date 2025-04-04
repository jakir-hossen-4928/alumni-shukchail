
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  return (
    <header className="bg-alumni-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="font-bold text-xl md:text-2xl">
            শুকচাইল স্কুল অ্যালামনাই
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-alumni-light transition-colors">
              হোম
            </Link>
            <Link to="/about" className="hover:text-alumni-light transition-colors">
              আমাদের সম্পর্কে
            </Link>
            <Link to="/events" className="hover:text-alumni-light transition-colors">
              ইভেন্টস
            </Link>
            <Link to="/contact" className="hover:text-alumni-light transition-colors">
              যোগাযোগ
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={userData?.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="hover:text-alumni-light transition-colors flex items-center"
                >
                  <User size={18} className="mr-1" />
                  {userData?.role === 'admin' ? 'অ্যাডমিন' : 'ড্যাশবোর্ড'}
                </Link>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="flex items-center bg-transparent border-white hover:bg-white hover:text-alumni-primary"
                >
                  <LogOut size={18} className="mr-1" />
                  লগআউট
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-alumni-primary">
                  <Link to="/login">লগইন</Link>
                </Button>
                <Button asChild className="bg-alumni-accent hover:bg-alumni-secondary text-white">
                  <Link to="/register">রেজিস্টার</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col space-y-4">
            <Link 
              to="/"
              onClick={() => setIsMenuOpen(false)} 
              className="hover:text-alumni-light transition-colors"
            >
              হোম
            </Link>
            <Link 
              to="/about"
              onClick={() => setIsMenuOpen(false)} 
              className="hover:text-alumni-light transition-colors"
            >
              আমাদের সম্পর্কে
            </Link>
            <Link 
              to="/events"
              onClick={() => setIsMenuOpen(false)} 
              className="hover:text-alumni-light transition-colors"
            >
              ইভেন্টস
            </Link>
            <Link 
              to="/contact"
              onClick={() => setIsMenuOpen(false)} 
              className="hover:text-alumni-light transition-colors"
            >
              যোগাযোগ
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  to={userData?.role === 'admin' ? '/admin' : '/dashboard'} 
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-alumni-light transition-colors flex items-center"
                >
                  <User size={18} className="mr-1" />
                  {userData?.role === 'admin' ? 'অ্যাডমিন' : 'ড্যাশবোর্ড'}
                </Link>
                <Button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  variant="outline" 
                  className="justify-start bg-transparent border-white hover:bg-white hover:text-alumni-primary"
                >
                  <LogOut size={18} className="mr-1" />
                  লগআউট
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-alumni-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/login">লগইন</Link>
                </Button>
                <Button 
                  asChild 
                  className="bg-alumni-accent hover:bg-alumni-secondary text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/register">রেজিস্টার</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
