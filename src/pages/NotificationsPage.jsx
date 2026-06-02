import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { notificationAPI } from '../services/api';
import { useUI } from '../context/hooks';
import LoadingSpinner, { ButtonSpinner } from '../components/LoadingSpinner';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const { setUnreadCount } = useUI();

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
    setActionLoading(id);
    try {
      const response = await notificationAPI.markAsRead(id);
      if (response.data.success) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Failed to mark notification as read');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkAllLoading(true);
    try {
      const response = await notificationAPI.markAllAsRead();
      if (response.data.success) {
        toast.success('All notifications marked as read');
        setUnreadCount(0);
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkAllLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    try {
      const notification = notifications.find(n => n._id === id);
      const response = await notificationAPI.delete(id);
      if (response.data.success) {
        toast.success('Notification deleted');
        if (notification && !notification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        fetchNotifications();
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <motion.button 
                  onClick={handleMarkAllAsRead} 
                  disabled={markAllLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary text-sm flex items-center justify-center gap-2"
                >
                  {markAllLoading ? (
                    <>
                      <ButtonSpinner size="sm" />
                      Processing...
                    </>
                  ) : (
                    'Mark All as Read'
                  )}
                </motion.button>
              </div>

              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`card ${
                        !notification.isRead ? 'border-l-4 border-[#3BC0E1]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
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
                            <motion.button
                              onClick={() => handleMarkAsRead(notification._id)}
                              disabled={actionLoading === notification._id}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 hover:bg-[#3BC0E1]/10 text-[#3BC0E1] rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading === notification._id ? (
                                <ButtonSpinner size="sm" />
                              ) : (
                                <FiCheck size={18} />
                              )}
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => handleDelete(notification._id)}
                            disabled={actionLoading === notification._id}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {actionLoading === notification._id ? (
                              <ButtonSpinner size="sm" />
                            ) : (
                              <FiTrash2 size={18} />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No notifications</p>
                  </div>
                )}
              </div>
      </div>
    </>
  );
}
