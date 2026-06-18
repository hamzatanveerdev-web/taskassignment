import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
import AttendanceCard from '../components/AttendanceCard';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
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
      {/* Attendance Timer */}
      {user?.role === "employee" && <AttendanceCard />}

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">
        My Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Tasks</p>
          <p className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">Started Tasks</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.started}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">Completed Tasks</p>
          <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.completed}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
  {/* Header */}
  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Today's Tasks
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} assigned
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Progress Bar */}
  {tasks.length > 0 && (
    <div className="px-6 py-3 bg-gray-50/50 dark:bg-gray-700/30">
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5">
        <span>Progress</span>
        <span className="font-medium text-blue-600 dark:text-blue-400">
          {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0}%` 
          }}
        ></div>
      </div>
    </div>
  )}

  {/* Tasks List */}
  <div className="divide-y divide-gray-100 dark:divide-gray-700">
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
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-3">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          No tasks assigned yet
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Check back later for new assignments
        </p>
      </div>
    )}
  </div>
</div>
      </motion.div>
    </>
  );
}