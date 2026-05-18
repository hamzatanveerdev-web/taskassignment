import React, { useState } from 'react';
import { useAuth } from '../context/hooks';
import { motion } from 'framer-motion';
import { useUI } from '../context/hooks';
import { FiUser, FiMail, FiBriefcase, FiCalendar } from 'react-icons/fi';

export default function ProfilePage() {
  const { user } = useAuth();
  const { darkMode } = useUI();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <FiUser size={48} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullName}</h2>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiMail size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiBriefcase size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FiCalendar size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {user.lastLogin && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <FiCalendar size={20} className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Last Login</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(user.lastLogin).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
      </div>
    </>
  );}
