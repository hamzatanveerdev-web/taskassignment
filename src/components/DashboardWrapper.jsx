import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth, useUI } from '../context/hooks';
import { notificationAPI, getUserId } from '../services/api';
import notificationManager from '../services/notificationManager';

export default function DashboardWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const { user, userId, authReady } = useAuth();
  const { setUnreadCount } = useUI();

  // ================= MOBILE CHECK =================
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ================= SIDEBAR =================
  const handleCloseSidebar = useCallback(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  // ================= UNREAD COUNT =================
  useEffect(() => {
    if (!authReady || !user) return;

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
  }, [authReady, user, setUnreadCount]);

  // ================= SOCKET INIT =================
  useEffect(() => {
    if (!authReady || !user) return;

    const socketId = userId || user?._id || getUserId();

    notificationManager.initSocket(socketId);

    const unsubscribe = notificationManager.onNotification(() => {
      setUnreadCount((prev) => prev + 1);
    });

    console.log('Notification manager initialized');

    return () => {
      unsubscribe();
      notificationManager.disconnect();
    };
  }, [authReady, user, userId, setUnreadCount]);

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
            !isMobile && sidebarOpen
              ? 'ml-64'
              : !isMobile && !sidebarOpen
              ? 'ml-20'
              : ''
          } w-full`}
        >
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