import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiChevronDown,
} from 'react-icons/fi';

export default function Sidebar({ isOpen, isMobile, onClose, onMouseEnter, onMouseLeave }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    {
      icon: FiUsers, 
      label: 'Manage Employees', 
      children: [
        { path: '/admin/employees', label: 'Employees' },
        { path: '/admin/employees/attendance', label: 'Attendance Records' }
      ]
    },
      {
      icon: FiUsers, 
      label: 'Work & Tasks', 
      children: [
        { path: '/admin/assign-task', label: 'Assign Task' },
        { path: '/admin/task-history', label: 'Task History' }
      ]
    },
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
    if (path) {
      navigate(path);
      if (isMobile) onClose();
    }
  };

  const isChildActive = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  const getSidebarWidth = () => {
    if (isMobile) return isOpen ? 256 : 0;
    return isOpen ? 256 : 70;
  };

  const toggleMobileMenu = (label) => {
    if (isMobile) {
      setHoveredMenu(hoveredMenu === label ? null : label);
    }
  };

  return (
    <motion.aside
      className="bg-gray-900 text-white fixed left-0 top-0 h-screen z-50 flex flex-col  overflow-hidden"
      initial={false}
      animate={{
        width: getSidebarWidth(),
        x: isMobile && !isOpen ? -256 : 0,
        opacity: isMobile && !isOpen ? 0 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        width: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        x: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.2, ease: "easeInOut" }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header - Fixed */}
      <div className="px-2 py-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <motion.h2 
            className="text-lg font-bold text-[#3BC0E1] whitespace-nowrap"
            animate={{
              opacity: (isMobile ? isOpen : isOpen) ? 1 : 0,
              scale: (isMobile ? isOpen : isOpen) ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
          >
            CODESTACK
          </motion.h2>
        </div>
      </div>

      {/* Scrollable Menu Area - Hide scrollbar */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-hide">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isActive = location.pathname === item.path;
            const isChildActiveNow = isChildActive(item.children);
            const isHovered = hoveredMenu === item.label;
            const showChildren = (isHovered && !isMobile) || (isMobile && isHovered);

            return (
              <div 
                key={item.label} 
                className="mb-1"
                onMouseEnter={() => {
                  if (hasChildren && !isMobile) {
                    setHoveredMenu(item.label);
                  }
                }}
                onMouseLeave={() => {
                  if (hasChildren && !isMobile) {
                    setHoveredMenu(null);
                  }
                }}
              >
                {/* Parent Menu Button */}
                <motion.button
                  onClick={() => {
                    if (hasChildren) {
                      toggleMobileMenu(item.label);
                    } else if (item.path) {
                      handleNavigation(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                    isActive || isChildActiveNow
                      ? 'bg-[#3BC0E1]/20 text-[#3BC0E1]'
                      : 'hover:bg-gray-800 text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {Icon && <Icon size={20} className="flex-shrink-0" />}

                  <motion.div
                    className="flex justify-between w-full items-center overflow-hidden"
                    animate={{
                      opacity: (isMobile ? isOpen : isOpen) ? 1 : 0,
                      width: (isMobile ? isOpen : isOpen) ? 'auto' : 0,
                      marginLeft: (isMobile ? isOpen : isOpen) ? '0.75rem' : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    {hasChildren && (
                      <motion.span 
                        className="text-xs ml-2 flex-shrink-0"
                        animate={{ rotate: isHovered ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiChevronDown size={16} />
                      </motion.span>
                    )}
                  </motion.div>
                </motion.button>

                {/* Children Menu */}
                {hasChildren && (
                  <AnimatePresence>
                    {showChildren && (isOpen || isMobile) && (
                      <motion.div
                        initial={{ 
                          maxHeight: 0, 
                          opacity: 0,
                          y: -10
                        }}
                        animate={{ 
                          maxHeight: 500, 
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{ 
                          maxHeight: 0, 
                          opacity: 0,
                          y: -10,
                        }}
                        transition={{
                          maxHeight: { duration: 0.3, ease: "easeInOut" },
                          opacity: { duration: 0.2 },
                          y: { duration: 0.2 }
                        }}
                        className="ml-8 overflow-hidden"
                      >
                        {item.children.map((child) => {
                          const active = location.pathname === child.path;
                          return (
                            <button
                              key={child.path}
                              onClick={() => handleNavigation(child.path)}
                              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                active
                                  ? 'bg-[#3BC0E1]/20 text-[#3BC0E1]'
                                  : 'text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              {child.label}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="border-t border-gray-800 p-4 space-y-2 flex-shrink-0">
        {(isMobile || isOpen) && user && (
          <motion.div 
            className="px-4 py-2 mb-2 bg-gray-800 rounded-lg overflow-hidden"
            animate={{
              opacity: (isMobile ? isOpen : isOpen) ? 1 : 0,
              height: (isMobile ? isOpen : isOpen) ? 'auto' : 0,
              marginBottom: (isMobile ? isOpen : isOpen) ? '0.5rem' : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm font-semibold text-gray-100 truncate">{user?.fullName || 'User'}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role || 'Role'}</p>
          </motion.div>
        )}
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiLogOut size={20} className="flex-shrink-0" />
          <motion.span
            animate={{
              opacity: (isMobile ? isOpen : isOpen) ? 1 : 0,
              width: (isMobile ? isOpen : isOpen) ? 'auto' : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            Logout
          </motion.span>
        </motion.button>
      </div>
    </motion.aside>
  );
}