import React from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiBell, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth, useUI } from '../context/hooks';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick }) {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode, unreadCount } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b sticky top-0 z-40 transition-colors`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className={`p-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-xl font-bold text-blue-600">TaskPro</h1>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 transition-colors"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
