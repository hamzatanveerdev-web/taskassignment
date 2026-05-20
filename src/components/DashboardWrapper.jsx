import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/hooks';
import notificationManager from '../services/notificationManager';

export default function DashboardWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
 
  const { user } = useAuth();

  // Initialize notification manager when component mounts
  useEffect(() => {
    if (user) {
      notificationManager.initSocket(user._id);
      console.log('Notification manager initialized');
    }

    return () => {
      // Cleanup on unmount
      notificationManager.disconnect();
    };
  }, [user]);

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
