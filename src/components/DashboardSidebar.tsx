
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User, CreditCard, Settings, Shield, Home, Users, Check, X } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: ('user' | 'admin')[];
}

interface DashboardSidebarProps {
  onClose?: () => void;
}

const DashboardSidebar = ({ onClose }: DashboardSidebarProps) => {
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
    <div className="min-w-60 bg-white h-full p-4 border-r shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-800">
          {userData?.role === 'admin' ? 'অ্যাডমিন প্যানেল' : 'সদস্য ড্যাশবোর্ড'}
        </h2>
        
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <nav className="space-y-1">
        {filteredLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={onClose}
            className={cn(
              "flex items-center py-2 px-3 rounded-md transition-colors",
              location.pathname === link.href
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
