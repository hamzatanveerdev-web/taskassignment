import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ButtonSpinner } from './LoadingSpinner';


export default function TaskCard({ task, onStatusChange, onEdit = () => {}, onDelete = () => {}, isEmployee = false }) {
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleStatusClick = async () => {
    setLoadingStatus(true);
    try {
      await onStatusChange(task._id, task.status === 'pending' ? 'started' : 'completed');
    } finally {
      setLoadingStatus(false);
    }
  };
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low',
    };
    return colors[priority] || 'priority-medium';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      started: 'status-started',
      completed: 'status-completed',
    };
    return colors[status] || 'status-pending';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white break-words">{task.title}</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
          <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Due Date</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          {task.completedDate && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Completed</p>
              <p className="font-medium text-green-600">{new Date(task.completedDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {isEmployee && (
          <div className="flex gap-2 flex-col md:flex-row">
            {task.status !== 'completed' && (
              <motion.button
                onClick={handleStatusClick}
                disabled={loadingStatus}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary text-xs md:text-sm flex items-center justify-center gap-2 py-2 md:py-2"
              >
                {loadingStatus ? (
                  <>
                    <ButtonSpinner size="sm" />
                    Updating...
                  </>
                ) : (
                  task.status === 'pending' ? 'Start Task' : 'Complete Task'
                )}
              </motion.button>
            )}
          </div>
        )}

        {!isEmployee && (
          <div className="flex gap-2 flex-col md:flex-row">
            <button onClick={() => onEdit(task)} className="w-full md:flex-1 btn-secondary text-xs md:text-sm py-2 md:py-2">
              Edit
            </button>
            <button onClick={() => onDelete(task._id)} className="w-full md:flex-1 btn-danger text-xs md:text-sm py-2 md:py-2">
              Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
