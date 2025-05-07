import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  User, CreditCard, Settings, Shield, Home,
  Users, Check, X, ChevronRight, Menu
} from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { AvatarFallback, AvatarImage } from './ui/avatar';

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: ('user' | 'admin')[];
  badge?: string;
}

interface DashboardSidebarProps {
  onClose?: () => void;
  className?: string;
}

const DashboardSidebar = ({ onClose, className }: DashboardSidebarProps) => {
  const { userData } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Automatically expand on desktop, collapse on mobile
      setCollapsed(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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
      roles: ['user']
    },
    {
      title: 'পেমেন্ট',
      href: '/dashboard/payment',
      icon: <CreditCard className="h-5 w-5" />,
      roles: ['user'],
      badge: 'নতুন'
    },
    {
      title: 'সেটিংস',
      href: '/dashboard/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['user']
    },
    {
      title: 'সদস্য অনুমোদন',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin'],
      badge: '৩'
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

  const toggleCollapse = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div
      className={cn(
        "bg-white h-full border-r shadow-sm transition-all duration-300 flex flex-col",
        collapsed && !isMobile ? "w-20" : "w-64",
        className
      )}
    >
      {/* Header with logo and collapse button */}
      <div className={cn(
        "flex items-center border-b p-4",
        collapsed && !isMobile ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent truncate">
            {userData?.role === 'admin' ? 'অ্যাডমিন প্যানেল' : 'সদস্য ড্যাশবোর্ড'}
          </h2>
        )}

        <div className="flex items-center">
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="h-8 w-8"
            >
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                !collapsed && "rotate-180"
              )} />
            </Button>
          )}

          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden ml-2"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* User profile section */}
      {!collapsed && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-blue-500">
              <AvatarImage src={userData?.profileImageUrl || ''} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
          {userData?.name
            ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'UN'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
          {userData?.name || 'সদস্য'}
              </p>
              <p className="text-xs text-gray-500 truncate">
          {userData?.email || ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <ScrollArea className="flex-1">
        <nav className={cn(
          "space-y-1 p-2",
          collapsed && !isMobile ? "px-2" : "px-3"
        )}>
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center py-2 px-3 rounded-lg transition-all relative group",
                collapsed && !isMobile ? "justify-center" : "justify-start",
                location.pathname === link.href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              )}
              title={collapsed && !isMobile ? link.title : undefined}
            >
              <span className={cn(
                "inline-flex items-center justify-center",
                location.pathname === link.href
                  ? "text-blue-700"
                  : "text-gray-500 group-hover:text-blue-600"
              )}>
                {link.icon}
              </span>

              {(!collapsed || isMobile) && (
                <span className="ml-3 flex-1 truncate">{link.title}</span>
              )}

              {(!collapsed || isMobile) && link.badge && (
                <Badge className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {link.badge}
                </Badge>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && !isMobile && link.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}

              {/* Active indicator */}
              {location.pathname === link.href && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r"></span>
              )}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer with version info */}
      <div className={cn(
        "border-t p-3 text-xs text-gray-500",
        collapsed && !isMobile ? "text-center" : ""
      )}>
        {!collapsed && "v1.0.2"}
        {collapsed && !isMobile && "v1.0"}
      </div>
    </div>
  );
};

export default DashboardSidebar;