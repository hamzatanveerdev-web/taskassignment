import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { notificationAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUI } from '../context/hooks';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useUI();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationAPI.getAll(1, 50);
      setNotifications(response.data.notifications);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await notificationAPI.markAsRead(id);
      if (response.data.success) {
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationAPI.markAllAsRead();
      if (response.data.success) {
        toast.success('All notifications marked as read');
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await notificationAPI.delete(id);
      if (response.data.success) {
        toast.success('Notification deleted');
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                <button onClick={handleMarkAllAsRead} className="btn-secondary text-sm">
                  Mark All as Read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`card ${
                        !notification.isRead ? 'border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 rounded-lg transition-colors"
                            >
                              <FiCheck size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No notifications</p>
                  </div>
                )}
              </div>
      </div>
    </>
  );
}
