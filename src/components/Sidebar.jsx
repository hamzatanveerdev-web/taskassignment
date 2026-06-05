import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/hooks';
import {
  FiHome,
  FiUsers,
  FiCheckSquare,
  FiBell,
  FiSettings,
  FiUser,
  FiBarChart2,
  FiLogOut,
} from 'react-icons/fi';

export default function Sidebar({ isOpen, isMobile, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/employees', icon: FiUsers, label: 'Employees' },
    { path: '/admin/assign-task', icon: FiCheckSquare, label: 'Assign Task' },
    { path: '/admin/task-history', icon: FiBarChart2, label: 'Task History' },
    { path: '/admin/notifications', icon: FiBell, label: 'Notifications' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  const employeeMenuItems = [
    { path: '/employee/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/employee/my-tasks', icon: FiCheckSquare, label: 'My Tasks' },
    { path: '/employee/completed-tasks', icon: FiBarChart2, label: 'Completed' },
    { path: '/employee/notifications', icon: FiBell, label: 'Notifications' },
    { path: '/employee/profile', icon: FiUser, label: 'Profile' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <motion.aside
      className={`bg-gray-900 text-white fixed left-0 top-0 h-screen overflow-y-auto transition-all duration-300 z-40 flex flex-col ${
        isMobile
          ? 'w-64'
          : `${
              isOpen ? 'w-64' : 'w-20'
            } md:flex`
      }`}
      initial={false}
      animate={{
        width: isMobile ? 256 : isOpen ? 256 : 80,
        x: isMobile && !isOpen ? -256 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {isMobile ? (
            <h2 className="text-lg font-bold text-[#3BC0E1] flex-1">Brainscraft</h2>
          ) : (
            <>
              <h2 className={`text-lg font-bold text-[#3BC0E1] ${!isOpen ? 'hidden' : ''}`}>
                Brainscraft
              </h2>
            </>
          )}
        </div>
      </div>
      <div className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-[#3BC0E1]/20 text-[#3BC0E1]' : 'hover:bg-gray-800 text-white'
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isMobile || isOpen ? <span>{item.label}</span> : null}
            </motion.button>
          );
        })}
      </div>

      {/* User Info & Logout Section */}
      <div className="border-t border-gray-800 p-4 space-y-2">
        {(isMobile || isOpen) && user && (
          <div className="px-4 py-2 mb-2 bg-gray-800 rounded-lg">
            <p className="text-sm font-semibold text-gray-100">{user.fullName}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        )}
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiLogOut size={20} className="flex-shrink-0" />
          {isMobile || isOpen ? <span>Logout</span> : null}
        </motion.button>
      </div>
    </motion.aside>
  );
}
