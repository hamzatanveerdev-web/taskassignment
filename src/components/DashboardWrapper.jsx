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
  const [hoverTimer, setHoverTimer] = useState(null);

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

  // ================= HOVER TOGGLE (DESKTOP ONLY) =================
  const handleSidebarMouseEnter = () => {
    if (!isMobile) {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        setHoverTimer(null);
      }
      setSidebarOpen(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (!isMobile) {
      // Delay closing to prevent flickering when moving between sidebar and content
      const timer = setTimeout(() => {
        setSidebarOpen(false);
      }, 300);
      setHoverTimer(timer);
    }
  };

  // ================= SIDEBAR =================
  const handleCloseSidebar = useCallback(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  // ================= FETCH UNREAD COUNT =================
  // MOVED THIS FUNCTION ABOVE WHERE IT'S USED
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [setUnreadCount]);

  // ================= INITIAL FETCH =================
  useEffect(() => {
    if (!authReady || !user) return;

    fetchUnreadCount();
  }, [authReady, user, fetchUnreadCount]);

  // ================= CLEANUP HOVER TIMER =================
  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Hover Zone for Desktop - Invisible area on left edge */}
      {!isMobile && !sidebarOpen && (
        <div
          className="fixed left-0 top-0 h-screen w-8 z-50 cursor-pointer"
          onMouseEnter={handleSidebarMouseEnter}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={handleCloseSidebar}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      />

      <div
        className={`flex-1 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
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
  );
}