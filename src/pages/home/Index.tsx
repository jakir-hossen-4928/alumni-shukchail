import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Users, Calendar, CreditCard, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const slideRight = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const staggerItems = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const featureCards = [
  {
    icon: Users,
    title: 'নেটওয়ার্কিং',
    desc: 'পুরানো বন্ধুদের সাথে যোগাযোগ করুন এবং নতুন সম্পর্ক স্থাপন করুন'
  },
  {
    icon: Calendar,
    title: 'ইভেন্টস',
    desc: 'মিটআপ, রিইউনিয়ন এবং অন্যান্য অনুষ্ঠানে অংশগ্রহণ করুন'
  },
  {
    icon: GraduationCap,
    title: 'মেন্টরশিপ',
    desc: 'শিক্ষার্থীদের সাহায্য করুন এবং বিশেষজ্ঞদের থেকে পরামর্শ নিন'
  },
  {
    icon: CreditCard,
    title: 'অবদান',
    desc: 'স্কুলের উন্নয়নে সহযোগিতা করুন এবং সামাজিক কর্মকাণ্ডে অংশগ্রহণ করুন'
  }
];

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerItems}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              শুকচাইল সরকারি প্রাথমিক বিদ্যালয় অ্যালামনাই
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl mb-8 opacity-90"
            >
              আমাদের স্কুলের পুরানো ছাত্র-ছাত্রীদের একটি একীভূত প্ল্যাটফর্ম। যোগাযোগ, নেটওয়ার্কিং এবং সহযোগিতার মাধ্যমে এগিয়ে যাই।
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 transition-transform hover:scale-105"
              >
                <Link to="/register">সদস্য হোন</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
              >
                <Link to="/about">আরও জানুন</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideRight}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              অ্যালামনাই সুবিধা
            </h2>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto">
              আমাদের অ্যালামনাই অ্যাসোসিয়েশনে যোগদানের মাধ্যমে আপনি বিভিন্ন সুবিধা উপভোগ করতে পারবেন।
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerItems}
          >
            {featureCards.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-blue-900">
                      {feature.title}
                    </h3>
                    <p className="text-blue-600">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-blue-900 rounded-xl p-8 md:p-12 text-center text-white"
          >
            <motion.h2
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold mb-4"
            >
              আজই সদস্য হোন
            </motion.h2>

            <p className="text-xl mb-6 max-w-2xl mx-auto opacity-90">
              শুধুমাত্র বছরে ৬ মাস অন্তর অন্তর ১০০ টাকা দিয়ে বছরে মোট ২০০ টাকা দিয়ে আমাদের অ্যালামনাই পরিবারের অংশ হোন এবং সকল সুবিধা উপভোগ করুন।
            </p>

            <motion.div
              className="mb-8"
              initial="hidden"
              animate="visible"
              variants={staggerItems}
            >
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                {['সহজ রেজিস্ট্রেশন প্রক্রিয়া', 'সুরক্ষিত অনলাইন পেমেন্ট', 'আজীবন সদস্যতা সুবিধা'].map((text, i) => (
                  <motion.div
                    key={i}
                    variants={slideRight}
                    className="flex items-center"
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2 text-yellow-500" />
                    <span>{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900"
              >
                <Link to="/register">রেজিস্টার করুন</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;