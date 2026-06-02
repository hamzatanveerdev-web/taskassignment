
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import React,{ useState, useEffect } from 'react';
import { useAuth, useUI } from '../context/hooks';
import { notificationAPI } from '../services/api';
import notificationManager from '../services/notificationManager';

export default function DashboardWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
 
  const { user } = useAuth();
  const { setUnreadCount } = useUI();

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
      notificationManager.initSocket(user._id);
      
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
  }, [user, setUnreadCount]);

  return (
    <div>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all`}>
          <main className="p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
