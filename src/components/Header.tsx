import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Animation variants
  const menuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
          staggerChildren: 0.1,
          staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 }
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg border-b border-l-white ">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center ">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center">
              <img
                src="https://i.ibb.co/NgkLwVm3/shukchail-logo.jpg"
                alt="শুকচাইল স্কুল লোগো"
                className="h-10 w-auto mr-3 rounded-full border-1 border-yellow-500  object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <span className="font-bold text-xl md:text-2xl">
                শুকচাইল স্কুল অ্যালামনাই
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center space-x-6"
          >
            {['/', '/about', '/events', '/contact'].map((path, i) => (
              <motion.div
                key={path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={path}
                  className="px-3 py-2 hover:text-yellow-400 transition-colors"
                >
                  {['হোম', 'আমাদের সম্পর্কে', 'ইভেন্টস', 'যোগাযোগ'][i]}
                </Link>
              </motion.div>
            ))}

            {currentUser ? (
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to={userData?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="hover:text-yellow-400 transition-colors flex items-center"
                  >
                    <User size={18} className="mr-1" />
                    {userData?.role === 'admin' ? 'অ্যাডমিন' : 'ড্যাশবোর্ড'}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="bg-transparent border-white hover:bg-white hover:text-blue-900"
                  >
                    <LogOut size={18} className="mr-1" />
                    লগআউট
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" className="bg-yellow-500 text-blue-900">
                    <Link to="/login">লগইন</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-blue-900">
                    <Link to="/register">রেজিস্টার</Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden overflow-hidden"
            >
              <motion.div className="flex flex-col space-y-4 pt-4 pb-6">
                {['/', '/about', '/events', '/contact'].map((path, i) => (
                  <motion.div
                    key={path}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Link
                      to={path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 hover:text-yellow-400"
                    >
                      {['হোম', 'আমাদের সম্পর্কে', 'ইভেন্টস', 'যোগাযোগ'][i]}
                    </Link>
                  </motion.div>
                ))}

                {currentUser ? (
                  <>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
                      <Link
                        to={userData?.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:text-yellow-400"
                      >
                        <User size={18} className="mr-1" />
                        {userData?.role === 'admin' ? 'অ্যাডমিন' : 'ড্যাশবোর্ড'}
                      </Link>
                    </motion.div>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full bg-transparent border-white hover:bg-white hover:text-blue-900"
                      >
                        <LogOut size={18} className="mr-1" />
                        লগআউট
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    className="flex flex-col space-y-2"
                    variants={itemVariants}
                  >
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-white text-blue-900 "
                      >
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                          লগইন
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        asChild
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900"
                      >
                        <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                          রেজিস্টার
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;