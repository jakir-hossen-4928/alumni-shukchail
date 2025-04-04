
import { ReactNode, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
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
      <Header />
      <div className="flex flex-1">
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
        
        <main className="flex-1 p-4 md:p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
