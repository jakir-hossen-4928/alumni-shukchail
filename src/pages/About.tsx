import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

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

const About = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <motion.img
              src="https://i.ibb.co/NgkLwVm3/shukchail-logo.jpg"
              alt="Shukchail Logo"
              className="h-24 w-24 rounded-full border-4 border-yellow-500 object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
              whileHover={{ scale: 1.05 }}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">আমাদের সম্পর্কে</h1>
          <motion.div
            className="w-20 h-1 bg-yellow-500 mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
          <p className="text-blue-700 max-w-2xl mx-auto text-lg">
            আমরা শুকচাইল গ্রামের প্রাক্তন ছাত্রদের সমিতি। আমাদের উদ্দেশ্য হল গ্রামের উন্নয়নে সহযোগিতা করা এবং সদস্যদের মধ্যে একটি শক্তিশালী নেটওয়ার্ক গড়ে তোলা।
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Vision Card */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 15 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">আমাদের লক্ষ্য</h3>
                  <p className="text-blue-600">
                    গ্রামের উন্নয়নে অবদান রাখা এবং সদস্যদের মধ্যে সাহায্য ও সহযোগিতার মাধ্যমে একটি শক্তিশালী সম্প্রদায় গড়ে তোলা।
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values Card */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 15 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">আমাদের মূল্যবোধ</h3>
                  <p className="text-blue-600">
                    সততা, সেবা, সহযোগিতা এবং একতার মাধ্যমে আমরা সবাই মিলে কাজ করি। আমরা বিশ্বাস করি যে একসাথে আমরা আরও বেশি অর্জন করতে পারি।
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Community Card */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 15 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">আমাদের সম্প্রদায়</h3>
                  <p className="text-blue-600">
                    আমাদের সদস্যরা বিভিন্ন পেশা থেকে আসেন এবং তাদের জ্ঞান ও অভিজ্ঞতা ভাগ করে নিয়ে সবাই একসাথে কাজ করেন।
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-sm p-6 mb-12"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-4">আমাদের ইতিহাস</h2>
          <p className="text-blue-600 mb-4">
            ২০১০ সালে প্রতিষ্ঠিত, আমাদের সমিতি শুকচাইল গ্রামের প্রাক্তন ছাত্রদের একটি ছোট গ্রুপ হিসেবে শুরু হয়েছিল। বছরের পর বছর ধরে, আমরা বিভিন্ন সামাজিক কার্যক্রম, শিক্ষা সহায়তা এবং স্বাস্থ্য সেবা প্রদান করে গ্রামের উন্নয়নে অবদান রেখে আসছি।
          </p>
          <p className="text-blue-600">
            আমাদের সদস্য সংখ্যা বর্তমানে ২০০ এর বেশি, যারা দেশের বিভিন্ন প্রান্ত থেকে আমাদের কার্যক্রমে অংশগ্রহণ করেন এবং সমিতির উন্নয়নে সহায়তা করেন।
          </p>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-6">আমাদের সাথে যোগাযোগ করুন</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-blue-900">
                <Link to="/contact">যোগাযোগ করুন</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                <Link to="/events">আমাদের ইভেন্টস দেখুন</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;