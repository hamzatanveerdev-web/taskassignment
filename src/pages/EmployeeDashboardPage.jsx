import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
export default function EmployeeDashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pending: 0, started: 0, completed: 0 });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getMyTasks(1, 10);
      const allTasks = response.data.tasks;
      setTasks(allTasks.slice(0, 5));

      const newStats = {
        pending: allTasks.filter((t) => t.status === 'pending').length,
        started: allTasks.filter((t) => t.status === 'started').length,
        completed: allTasks.filter((t) => t.status === 'completed').length,
      };
      setStats(newStats);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="max-w-7xl mx-auto">

          <main className="p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Dashboard</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Tasks</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Started Tasks</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.started}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Completed Tasks</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Today's Tasks</h2>
                <div className="grid gap-4">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        isEmployee={true}
                        onStatusChange={async (id, status) => {
                          try {
                            await taskAPI.updateStatus(id, status);
                            toast.success('Task status updated!');
                            fetchDashboardData();
                          } catch (error) {
                            toast.error('Failed to update task');
                          }
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No tasks assigned yet</p>
                  )}
                </div>
              </motion.div>
            </div>
          </main>
      </div>
    </>
  );
}
