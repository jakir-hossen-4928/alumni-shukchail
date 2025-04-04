
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User, CreditCard, Settings, Shield, Home, Users, Check } from 'lucide-react';

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: ('user' | 'admin')[];
}

const DashboardSidebar = () => {
  const { userData } = useAuth();
  const location = useLocation();
  
  const links: SidebarLink[] = [
    {
      title: 'ড্যাশবোর্ড',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      roles: ['user', 'admin']
    },
    {
      title: 'প্রোফাইল',
      href: '/dashboard/profile',
      icon: <User className="h-5 w-5" />,
      roles: ['user', 'admin']
    },
    {
      title: 'পেমেন্ট',
      href: '/dashboard/payment',
      icon: <CreditCard className="h-5 w-5" />,
      roles: ['user']
    },
    {
      title: 'সেটিংস',
      href: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['user', 'admin']
    },
    {
      title: 'সদস্য অনুমোদন',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin']
    },
    {
      title: 'পেমেন্ট যাচাই',
      href: '/admin/payments',
      icon: <Check className="h-5 w-5" />,
      roles: ['admin']
    },
    {
      title: 'অ্যাডমিন সেটিংস',
      href: '/admin/settings',
      icon: <Shield className="h-5 w-5" />,
      roles: ['admin']
    },
  ];
  
  const filteredLinks = links.filter(link => 
    userData?.role && link.roles.includes(userData.role)
  );
  
  return (
    <div className="min-w-52 bg-gray-100 min-h-screen p-4 border-r">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-alumni-primary">
          {userData?.role === 'admin' ? 'অ্যাডমিন প্যানেল' : 'সদস্য ড্যাশবোর্ড'}
        </h2>
      </div>
      
      <nav className="space-y-1">
        {filteredLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center py-2 px-3 rounded-md transition-colors",
              location.pathname === link.href
                ? "bg-alumni-primary text-white"
                : "text-gray-700 hover:bg-gray-200"
            )}
          >
            <span className="mr-3">{link.icon}</span>
            <span>{link.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
