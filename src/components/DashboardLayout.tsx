
import { ReactNode, useState } from 'react';
import DashboardNavbar from './DashboardNavbar';
import DashboardFooter from './DashboardFooter';
import DashboardSidebar from './DashboardSidebar';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex flex-1 pt-16"> {/* Added pt-16 to account for fixed navbar */}
        {isMobile ? (
          <>
            <div className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => setSidebarOpen(false)} />
            
            <div className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <DashboardSidebar onClose={() => setSidebarOpen(false)} />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed left-4 top-16 z-30 bg-primary text-white rounded-full shadow-lg md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <DashboardSidebar />
        )}
        
        <main className="flex-1 p-4 md:p-6 bg-background md:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default DashboardLayout;
