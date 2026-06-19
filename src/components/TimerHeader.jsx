// components/TimerHeader.jsx (Advanced Version)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, 
  FiLogIn, 
  FiLogOut, 
  FiPieChart
} from 'react-icons/fi';

export default function TimerHeader({ 
  isCheckedIn, 
  timerDisplay, 
  onCheckIn, 
  onCheckOut,
  isTimerRunning,
  totalTimeToday = 0 // Optional: total time for today
}) {
  const [showStats, setShowStats] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          sticky top-0 z-51
          w-full px-4 py-3 md:py-4
          border-b-2
          backdrop-blur-sm
          transition-all duration-300
          ${isCheckedIn 
            ? 'bg-green-50/95 dark:bg-green-900/20 border-green-400 dark:border-green-500' 
            : 'bg-gray-50/95 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'
          }
        `}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Timer Section */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start z-50">
              <div className={`
                p-2 rounded-full
                transition-colors duration-300
                ${isCheckedIn 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}>
                <FiClock className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              
              <div className="flex flex-col items-start">
                <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  {isCheckedIn ? '⏱️ Currently Working' : '⏸️ Not Checked In'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`
                    text-xl md:text-3xl font-mono font-bold tracking-wider
                    transition-colors duration-300
                    ${isCheckedIn 
                      ? 'text-green-700 dark:text-green-400' 
                      : 'text-gray-400 dark:text-gray-500'
                    }
                  `}>
                    {timerDisplay}
                  </span>
                  
                  {/* Running indicator */}
                  {isCheckedIn && isTimerRunning && (
                    <motion.div 
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-xs text-green-500 dark:text-green-400 font-medium"
                    >
                      ● LIVE
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              
              {/* Daily Stats Toggle */}
              {isCheckedIn && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStats(!showStats)}
                  className="
                    p-2 md:p-2.5
                    bg-blue-50 dark:bg-blue-900/20
                    text-blue-600 dark:text-blue-400
                    rounded-lg
                    hover:bg-blue-100 dark:hover:bg-blue-900/30
                    transition-colors
                    relative
                  "
                  title="Today's Stats"
                >
                  <FiPieChart className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              )}

              {!isCheckedIn ? (
                // Check-In Button
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCheckIn}
                  className="
                    flex items-center gap-2
                    px-4 py-2 md:px-6 md:py-2.5
                    bg-gradient-to-r from-green-500 to-green-600
                    hover:from-green-600 hover:to-green-700
                    text-white font-medium
                    rounded-lg
                    transition-all duration-200
                    shadow-md hover:shadow-lg
                    text-sm md:text-base
                  "
                >
                  <FiLogIn className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden xs:inline">Check In</span>
                  <span className="inline xs:hidden">In</span>
                </motion.button>
              ) : (
                // Check-Out Button
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCheckOut}
                  className="
                    flex items-center gap-2
                    px-4 py-2 md:px-6 md:py-2.5
                    bg-gradient-to-r from-red-500 to-red-600
                    hover:from-red-600 hover:to-red-700
                    text-white font-medium
                    rounded-lg
                    transition-all duration-200
                    shadow-md hover:shadow-lg
                    text-sm md:text-base
                  "
                >
                  <FiLogOut className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden xs:inline">Check Out</span>
                  <span className="inline xs:hidden">Out</span>
                </motion.button>
              )}
            </div>

          </div>
        </div>
      </motion.div>

      {/* Stats Popup */}
      <AnimatePresence>
        {showStats && isCheckedIn && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              fixed top-20 right-4 z-40
              bg-white dark:bg-gray-800
              rounded-lg shadow-xl
              p-4 min-w-[200px]
              border border-gray-200 dark:border-gray-700
            "
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Today's Stats
            </h4>
            <div className="space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Current Session:</span> {timerDisplay}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">Status:</span> 
                <span className="text-green-500"> Active</span>
              </p>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowStats(false)}
                  className="text-xs text-blue-500 hover:text-blue-600 w-full text-center"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}