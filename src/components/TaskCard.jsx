import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function TaskCard({ task, onStatusChange, onEdit = () => {}, onDelete = () => {}, isEmployee = false }) {
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
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
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
          <div className="flex gap-2">
            {task.status !== 'completed' && (
              <button
                onClick={() => onStatusChange(task._id, task.status === 'pending' ? 'started' : 'completed')}
                className="flex-1 btn-primary text-sm"
              >
                {task.status === 'pending' ? 'Start Task' : 'Complete Task'}
              </button>
            )}
          </div>
        )}

        {!isEmployee && (
          <div className="flex gap-2">
            <button onClick={() => onEdit(task)} className="flex-1 btn-secondary text-sm">
              Edit
            </button>
            <button onClick={() => onDelete(task._id)} className="flex-1 btn-danger text-sm">
              Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
