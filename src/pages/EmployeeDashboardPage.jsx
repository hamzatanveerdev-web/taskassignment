import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
import TimerHeader from '../components/TimerHeader'; // New component

export default function EmployeeDashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pending: 0, started: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  
  // Timer States
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timerStarted, setTimerStarted] = useState(null); // timestamp
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    checkTimerStatus(); // Check if timer was running
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTotalSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning,timerStarted]);

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

  // Check if timer was running (localStorage)
  const checkTimerStatus = () => {
    const savedTimer = localStorage.getItem('employeeTimer');
    if (savedTimer) {
      const timerData = JSON.parse(savedTimer);
      const elapsed = Math.floor((Date.now() - timerData.startTime) / 1000);
      setIsCheckedIn(true);
      setIsTimerRunning(true);
      setTimerStarted(timerData.startTime);
      setTotalSeconds(elapsed);
    }
  };

  // Handle Check-In
  const handleCheckIn = () => {
    const now = Date.now();
    setIsCheckedIn(true);
    setIsTimerRunning(true);
    setTimerStarted(now);
    setTotalSeconds(0);
    
    // Save to localStorage
    localStorage.setItem('employeeTimer', JSON.stringify({
      startTime: now,
      isCheckedIn: true
    }));
    
    toast.success('✅ Checked in successfully!');
  };

  // Handle Check-Out
  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setIsTimerRunning(false);
    setTotalSeconds(0);
    setTimerStarted(null);
    
    // Clear localStorage
    localStorage.removeItem('employeeTimer');
    
    toast.success(`👋 Checked out! Total time: ${formatTime(totalSeconds)}`);
  };

  // Format time (HH:MM:SS)
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {/* Timer Header */}
      <TimerHeader
        isCheckedIn={isCheckedIn}
        timerDisplay={formatTime(totalSeconds)}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        isTimerRunning={isTimerRunning}
      />

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
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Today's Tasks
        </h2>
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
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No tasks assigned yet
            </p>
          )}
        </div>
      </motion.div>
    </>
  );
}