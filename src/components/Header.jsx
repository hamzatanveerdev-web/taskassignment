import React from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth, useUI } from '../context/hooks';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick }) {
  const { logout } = useAuth();
  const { unreadCount } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      className="bg-white border-gray-200 border-b sticky top-0 z-40 transition-colors shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3BC0E1]"
            title="Toggle Menu"
          >
            <FiMenu size={24} className="text-gray-700" />
          </motion.button>
          <h1 className="text-lg md:text-xl font-bold text-[#3BC0E1]">TaskPro</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3BC0E1]"
            title="Notifications"
          >
            <FiBell size={20} className="text-gray-700" />
            {unreadCount > 0 && (
              <motion.span
                key={unreadCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center shadow-lg"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            )}
          </motion.button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
