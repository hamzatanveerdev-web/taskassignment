import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CompletedTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getMyTasks(1, 100, 'completed');
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to load completed tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">Completed Tasks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">{task.title}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 whitespace-nowrap flex-shrink-0">
                    ✓ Done
                  </span>
                </div>

                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{task.description}</p>

                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{task.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{new Date(task.completedDate).toLocaleDateString()}</span>
                  </div>
                  {task.completedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{task.completedTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">No completed tasks yet</p>
          </div>
        )}
      </div>
    </>
  );
}
