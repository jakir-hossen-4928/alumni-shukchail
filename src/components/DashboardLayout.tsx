import { ReactNode, useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import DashboardFooter from './DashboardFooter';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOverlayClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Mobile Sidebar */}
        {isMobile && (
          <>
            <div
              className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={handleOverlayClick}
              aria-hidden="true"
            />
            <div
              className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <DashboardSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="fixed h-full w-64">
              <DashboardSidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto`}>
          <div className="p-6 min-h-[calc(100vh-4rem)]">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
