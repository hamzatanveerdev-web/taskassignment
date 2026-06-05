import React from 'react';
import { useAuth } from '../context/hooks';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiBriefcase, FiCalendar } from 'react-icons/fi';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8">My Profile</h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-2xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <FiUser size={40} className="text-white md:w-12 md:h-12" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{user.fullName}</h2>
            <p className="text-gray-600 dark:text-gray-400 capitalize text-sm md:text-base">{user.role}</p>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FiMail size={18} className="text-blue-600 flex-shrink-0 md:w-5 md:h-5" />
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white break-all text-sm md:text-base">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FiBriefcase size={18} className="text-blue-600 flex-shrink-0 md:w-5 md:h-5" />
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Role</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize text-sm md:text-base">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FiCalendar size={18} className="text-blue-600 flex-shrink-0 md:w-5 md:h-5" />
            <div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Member Since</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {user.lastLogin && (
            <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FiCalendar size={18} className="text-green-600 flex-shrink-0 md:w-5 md:h-5" />
              <div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Last Login</p>
                <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
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
    </>
  );
}
