import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [tasksRes, analyticsRes] = await Promise.all([
        taskAPI.getAll(1, 5),
        taskAPI.getAnalytics(),
      ]);
      setTasks(tasksRes.data.tasks);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    toast.success('Edit feature coming soon');
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await taskAPI.delete(taskId);
        if (response.data.success) {
          toast.success('Task deleted successfully');
          fetchDashboardData();
        }
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const chartData = analytics ? [
    { name: 'Pending', value: analytics.pendingTasks },
    { name: 'Started', value: analytics.startedTasks },
    { name: 'Completed', value: analytics.completedTasks },
  ] : [];

  const priorityData = analytics ? [
    { name: 'High', value: analytics.priorityBreakdown.high },
    { name: 'Medium', value: analytics.priorityBreakdown.medium },
    { name: 'Low', value: analytics.priorityBreakdown.low },
  ] : [];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">Dashboard</h1>

      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Total Tasks</p>
            <p className="text-xl md:text-3xl font-bold text-[#3BC0E1] mt-2">{analytics.totalTasks}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Pending</p>
            <p className="text-xl md:text-3xl font-bold text-yellow-600 mt-2">{analytics.pendingTasks}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">In Progress</p>
            <p className="text-xl md:text-3xl font-bold text-[#3BC0E1] mt-2">{analytics.startedTasks}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Completed</p>
            <p className="text-xl md:text-3xl font-bold text-green-600 mt-2">{analytics.completedTasks}</p>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card">
          <h2 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3BC0E1" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="card">
          <h2 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white mb-4">Priority Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h2 className="text-base md:text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Tasks</h2>
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}
