import { createContext, useState, useCallback } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <UIContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        sidebarOpen,
        toggleSidebar,
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
