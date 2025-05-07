import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="flex justify-center mb-8"
        >
          <img
            src="https://i.ibb.co/NgkLwVm3/shukchail-logo.jpg"
            alt="শুকচাইল স্কুল লোগো"
            className="h-24 w-24 rounded-full border-4 border-yellow-500 p-1 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* About Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">শুকচাইল সরকারি প্রাথমিক বিদ্যালয় অ্যালামনাই</h3>
            <p className="text-blue-200">
              আমাদের স্কুলের পুরানো ছাত্র-ছাত্রীদের মিলন মেলা, যা একটি সাংস্কৃতিক ও সামাজিক উন্নয়নে অবদান রাখে।
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">দ্রুত লিঙ্ক</h3>
            <ul className="space-y-3">
              {[
                { path: '/about', text: 'আমাদের সম্পর্কে' },
                { path: '/events', text: 'ইভেন্টস' },
                { path: '/dashboard', text: 'সদস্য ড্যাশবোর্ড' },
                { path: '/register', text: 'সদস্য হোন' }
              ].map((link, index) => (
                <motion.li
                  key={link.path}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link
                    to={link.path}
                    className="text-blue-200 hover:text-yellow-400 transition-colors flex items-center"
                  >
                    <span className="mr-2">•</span>
                    {link.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">যোগাযোগ</h3>
            <div className="space-y-4">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="mr-3 h-6 w-6 text-yellow-400" />
                <span className="text-blue-200">shukchail.alumni@example.com</span>
              </motion.div>

              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="mr-3 h-6 w-6 text-yellow-400" />
                <span className="text-blue-200">+880 1712-345678</span>
              </motion.div>

              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Facebook className="mr-3 h-6 w-6 text-yellow-400" />
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-yellow-400 transition-colors"
                >
                  ফেসবুক পেজ
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-blue-800 mt-8 pt-6 text-center"
        >
          <p className="text-blue-300">
            &copy; {currentYear} শুকচাইল সরকারি প্রাথমিক বিদ্যালয় অ্যালামনাই। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;