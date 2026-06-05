import React, { useState, useEffect } from 'react';
import { useUI } from '../context/hooks';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Set default sidebar state based on screen size
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCloseSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
          isOpen={sidebarOpen}
          isMobile={isMobile}
          onClose={handleCloseSidebar}
        />
        <div
          className={`flex-1 transition-all duration-300 ${
            !isMobile && sidebarOpen ? 'ml-64' : !isMobile && !sidebarOpen ? 'ml-20' : ''
          } w-full`}
        >
          <Header
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="p-4 md:p-8 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
