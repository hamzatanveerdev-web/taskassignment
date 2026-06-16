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
    {
      icon: FiUsers, label: 'Employees', children: [
        {
          path: '/admin/employees',
          label: 'Add Employees'
        },
        {
          path: '/admin/employees/attendance',
          label: 'Attendance'
        }
      ]
    },
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
      className={`bg-gray-900 text-white fixed left-0 top-0 h-screen overflow-y-auto transition-all duration-300 z-40 flex flex-col ${isMobile
        ? 'w-64'
        : `${isOpen ? 'w-64' : 'w-20'
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
            <h2 className="text-lg font-bold text-[#3BC0E1] flex-1">CODESTACK</h2>
          ) : (
            <>
              <h2 className={`text-lg font-bold text-[#3BC0E1] ${!isOpen ? 'hidden' : ''}`}>
                CODESTACK
              </h2>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <div
              className="relative group" key={item.label}>

              {/* Parent Menu */}
              <motion.button
                onClick={() => {
                  if (!item.children) {
                    handleNavigation(item.path)
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                  ? 'bg-[#3BC0E1]/20 text-[#3BC0E1]'
                  : 'hover:bg-gray-800 text-white'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} />

                {(isMobile || isOpen) && (
                  <div className="flex justify-between w-full">
                    <span>{item.label}</span>

                    {item.children && (
                      <span className="text-xs">▼</span>
                    )}
                  </div>
                )}
              </motion.button>

              {item.children && (
                <div
                  className="ml-8 max-h-0 overflow-hidden  opacity-0 group-hover:max-h-[140px] group-hover:opacity-100 transition-[max-height,opacity] duration-300 ease-in-out  ">

                  {item.children.map((child) => {
                    const active =
                      location.pathname === child.path

                    return (
                      <button
                        key={child.path}
                        onClick={() =>
                          handleNavigation(child.path)
                        }
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${active
                          ? 'bg-[#3BC0E1]/20 text-[#3BC0E1]'
                          : 'text-gray-300 hover:bg-gray-800'
                          }`}
                      >
                        {child.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
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
