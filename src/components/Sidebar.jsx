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
  FiMenu,
} from 'react-icons/fi';

export default function Sidebar({ isOpen, onMenuClick }) {
  const { user } = useAuth();
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

  return (
    <motion.aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white fixed left-0 top-0 h-screen overflow-y-auto transition-all duration-300 z-50`}
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
    >
      <div className="px-4 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiMenu size={24} />
          </button>
          {isOpen && <h2 className="text-lg font-bold text-blue-400">TaskPro</h2>}
        </div>
        {!isOpen && <div className="text-sm font-bold text-blue-400 text-center w-full">TP</div>}
      </div>
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </motion.button>
          );
        })}
      </div>
    </motion.aside>
  );
}
