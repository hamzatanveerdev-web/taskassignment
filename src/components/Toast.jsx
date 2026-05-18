import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

export default function Toast({ message, type = 'info', onClose }) {
  const icons = {
    success: <FiCheckCircle className="text-green-500" size={24} />,
    error: <FiAlertCircle className="text-red-500" size={24} />,
    info: <FiInfo className="text-blue-500" size={24} />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700',
    error: 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colors[type]}`}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <FiX size={18} />
      </button>
    </motion.div>
  );
}
