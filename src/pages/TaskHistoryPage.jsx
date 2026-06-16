import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { taskAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function TaskHistoryPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCompletedTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getAll(page, 10, "completed");

      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load task history");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Task History
      </h1>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-x-auto"
      >
        <div className="rounded-xl overflow-hidden border">
  <table className="w-full text-sm text-left">
          <thead className="bg-[#3BC0E1] text-white  uppercase tracking-wider">
            <tr>
              <th className="py-3 px-3 text-left font-semibold">Title</th>
              <th className="py-3 px-3 text-left font-semibold">Description</th>
              <th className="py-3 px-3 text-left font-semibold">Priority</th>
              <th className="py-3 px-3 text-left font-semibold">Assigned To</th>
              <th className="py-3 px-3 text-left font-semibold">Created By</th>
              <th className="py-3 px-3 text-left font-semibold">Completed</th>
              <th className="py-3 px-3 text-left font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr
                key={task._id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {/* TITLE */}
                <td className="py-3 px-2 font-medium text-gray-800 dark:text-white max-w-[150px] truncate">
                  {task.title}
                </td>

                {/* DESCRIPTION */}
                <td
                  className="py-3 px-2 text-gray-600 dark:text-gray-400 max-w-[250px]"
                  title={task.description}
                >
                  <span className="block truncate">
                    {task.description}
                  </span>
                </td>

                {/* PRIORITY */}
                <td className="py-3 px-2 capitalize text-gray-700">
                  {task.priority}
                </td>

                {/* ASSIGNED TO */}
                <td className="py-3 px-2 text-gray-700">
                  {task.assignedTo?.fullName ||
                    task.assignedTo?.email ||
                    "Unassigned"}
                </td>

                {/* CREATED BY */}
                <td className="py-3 px-2 text-gray-700">
                  {task.createdBy?.fullName ||
                    task.createdBy?.email ||
                    "N/A"}
                </td>

                {/* COMPLETED DATE */}
                <td className="py-3 px-2 text-green-600">
                  {task.completedDate
                    ? new Date(task.completedDate).toLocaleDateString()
                    : "-"}
                </td>

                {/* STATUS */}
                <td className="py-3 px-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    COMPLETED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      

        {/* EMPTY STATE */}
        {tasks.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No completed tasks found
          </div>
        )}
      </motion.div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
