
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import React,{ useState, useEffect } from 'react';
import { useAuth, useUI } from '../context/hooks';
import { notificationAPI, getUserId } from '../services/api';
import notificationManager from '../services/notificationManager';

export default function DashboardWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
 
  const { user, userId } = useAuth();
  const { setUnreadCount } = useUI();

  // Check if mobile on mount and resize
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
  }, [setUnreadCount]);

  const handleCloseSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Fetch initial unread count
useEffect(() => {
  if (user) {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationAPI.getUnreadCount();
        if (response.data.success) {
          setUnreadCount(response.data.unreadCount);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
  }
}, [user, setUnreadCount]);
  // Initialize notification manager when component mounts
  useEffect(() => {
    if (user) {
      notificationManager.initSocket(userId || user?._id || getUserId());
      
      // Register handler to update unread count when new notifications arrive
      const unsubscribe = notificationManager.onNotification((data, type) => {
        setUnreadCount((prev) => prev + 1);
      });

      console.log('Notification manager initialized');

      return () => {
        unsubscribe();
        // Cleanup on unmount
        notificationManager.disconnect();
      };
    }
  }, [user, userId, setUnreadCount]);

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
        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} onClose={handleCloseSidebar} />
        <div className={`flex-1 transition-all duration-300 ${
            !isMobile && sidebarOpen ? 'ml-64' : !isMobile && !sidebarOpen ? 'ml-20' : ''
          } w-full`}>
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-4 md:p-8 w-full">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
