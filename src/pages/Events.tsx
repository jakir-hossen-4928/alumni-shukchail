
import { useState } from 'react';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  type: 'upcoming' | 'past';
}

const Events = () => {
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'বার্ষিক সম্মেলন ২০২৫',
      description: 'আমাদের বার্ষিক সম্মেলন যেখানে সকল সদস্যরা মিলিত হবেন এবং বছরের পরিকল্পনা নিয়ে আলোচনা করবেন।',
      date: '১০ ফেব্রুয়ারি, ২০২৫',
      time: 'সকাল ১০:০০',
      location: 'শুকচাইল উচ্চ বিদ্যালয়',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
      type: 'upcoming'
    },
    {
      id: '2',
      title: 'শিক্ষা সহায়তা কর্মসূচি',
      description: 'গরিব ও মেধাবী ছাত্রদের জন্য বৃত্তি বিতরণ এবং শিক্ষা সহায়তা প্রদান করা হবে।',
      date: '১৫ মার্চ, ২০২৫',
      time: 'দুপুর ২:০০',
      location: 'শুকচাইল কমিউনিটি সেন্টার',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop',
      type: 'upcoming'
    },
    {
      id: '3',
      title: 'স্বাস্থ্য সেবা ক্যাম্প',
      description: 'গ্রামের সকলের জন্য বিনামূল্যে স্বাস্থ্য পরীক্ষা এবং ওষুধ বিতরণ ক্যাম্প।',
      date: '২০ এপ্রিল, ২০২৫',
      time: 'সকাল ৯:০০',
      location: 'শুকচাইল প্রাথমিক বিদ্যালয়',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
      type: 'upcoming'
    },
    {
      id: '4',
      title: 'বার্ষিক সম্মেলন ২০২৪',
      description: 'গত বছরের বার্ষিক সম্মেলন যেখানে আমরা ২০২৪ সালের পরিকল্পনা নিয়ে আলোচনা করেছি।',
      date: '১২ ফেব্রুয়ারি, ২০২৪',
      time: 'সকাল ১০:০০',
      location: 'শুকচাইল উচ্চ বিদ্যালয়',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop',
      type: 'past'
    },
    {
      id: '5',
      title: 'বৃক্ষরোপণ কর্মসূচি',
      description: 'পরিবেশ সংরক্ষণের উদ্দেশ্যে গ্রামের বিভিন্ন স্থানে বৃক্ষরোপণ কর্মসূচি।',
      date: '৫ জুন, ২০২৪',
      time: 'সকাল ৮:০০',
      location: 'শুকচাইল গ্রাম',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
      type: 'past'
    },
  ]);

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">আমাদের ইভেন্টস</h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            শুকচাইল সমিতি দ্বারা আয়োজিত আসন্ন এবং অতীত ইভেন্টগুলি দেখুন। আমাদের কার্যক্রমে অংশগ্রহণ করে সমাজের উন্নয়নে সহায়তা করুন।
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">আসন্ন ইভেন্টস</TabsTrigger>
            <TabsTrigger value="past">অতীত ইভেন্টস</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.filter(event => event.type === 'upcoming').map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      বিস্তারিত দেখুন <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.filter(event => event.type === 'past').map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 grayscale"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      বিস্তারিত দেখুন <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
