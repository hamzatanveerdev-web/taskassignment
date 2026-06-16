import React, { useState } from "react";
import { motion } from "framer-motion";
import { ButtonSpinner } from "./LoadingSpinner";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function TaskCard({
  task,
  onStatusChange,
  onEdit = () => {},
  onDelete = () => {},
  isEmployee = false,
}) {
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleStatusClick = async () => {
    setLoadingStatus(true);
    try {
      await onStatusChange(
        task._id,
        task.status === "pending" ? "started" : "completed"
      );
    } finally {
      setLoadingStatus(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-600",
      medium: "bg-yellow-100 text-yellow-600",
      low: "bg-green-100 text-green-600",
    };
    return colors[priority] || "bg-yellow-100 text-yellow-600";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-gray-100 text-gray-600",
      started: "bg-blue-100 text-blue-600",
      completed: "bg-green-100 text-green-600",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card relative"
    >
      {/* TOP RIGHT ACTIONS (ADMIN ONLY) */}
      {!isEmployee && (
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <FaEdit size={14} />
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )}

      {/* TASK CONTENT */}
      <div className="space-y-4 pr-16">
        {/* TITLE + DESCRIPTION */}
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
            {task.title}
          </h3>

          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {task.description}
          </p>
        </div>

        {/* BADGES */}
        <div className="flex gap-2 flex-wrap">
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority.toUpperCase()}
          </span>

          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status.toUpperCase()}
          </span>
        </div>

        {/* DATES */}
        <div className="text-xs md:text-sm space-y-1">
          <p className="text-gray-500">
            Due:{" "}
            <span className="text-gray-800 dark:text-white font-medium">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </p>

          {task.completedDate && (
            <p className="text-green-600">
              Completed:{" "}
              {new Date(task.completedDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* EMPLOYEE ACTION */}
        {isEmployee && task.status !== "completed" && (
          <motion.button
            onClick={handleStatusClick}
            disabled={loadingStatus}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary flex items-center justify-center gap-2 py-2 text-sm"
          >
            {loadingStatus ? (
              <>
                <ButtonSpinner size="sm" />
                Updating...
              </>
            ) : task.status === "pending" ? (
              "Start Task"
            ) : (
              "Complete Task"
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}