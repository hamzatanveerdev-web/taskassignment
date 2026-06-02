import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TaskHistoryPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getAll(1, 100, 'completed');
      setTasks(response.data.tasks);
      console.log('Completed Tasks:', response.data.tasks);
      // Check the structure of assignedTo
      if (response.data.tasks.length > 0) {
        console.log('First task assignedTo:', response.data.tasks[0].assignedTo);
      }
    } catch (error) {
      toast.error('Failed to load task history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Task History</h1>

              <div className="space-y-4">
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                            <div>
                              <p className="text-gray-600">Priority</p>
                              <p className="font-medium text-gray-800 capitalize">{task.priority}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Assigned To</p>
                              <p className="font-medium text-gray-800">
                                {task.assignedTo?.fullName || task.assignedTo?.email || 'Unassigned'}
                              </p>
                              {task.assignedTo?.email && (
                                <p className="text-xs text-gray-500">{task.assignedTo.email}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-600">Created By</p>
                              <p className="font-medium text-gray-800">
                                {task.createdBy?.fullName || task.createdBy?.email || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Completed</p>
                              <p className="font-medium text-green-600">{new Date(task.completedDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            COMPLETED
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No completed tasks yet</p>
                  </div>
                )}
              </div>
      </div>
    </>
  );
}
