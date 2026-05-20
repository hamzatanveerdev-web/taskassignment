import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
import { FiFilter, FiSearch } from 'react-icons/fi';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');


  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskAPI.getMyTasks(1, 50, statusFilter, priorityFilter);
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      fetchTasks();
      return;
    }
    try {
      const response = await taskAPI.search(search);
      setTasks(response.data.tasks.filter((t) => t.assignedTo._id || t.createdBy._id));
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await taskAPI.updateStatus(taskId, newStatus);
      if (response.data.success) {
        toast.success('Task status updated!');
        fetchTasks();
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Tasks</h1>

              <div className="card mb-8">
                <div className="space-y-4">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="input-field pl-10"
                      />
                    </div>
                    <button type="submit" className="btn-primary">
                      Search
                    </button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <FiFilter size={16} /> Filter by Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field"
                      >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="started">Started</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <FiFilter size={16} /> Filter by Priority
                      </label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="input-field"
                      >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isEmployee={true}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No tasks found</p>
                  </div>
                )}
              </div>
      </div>
    </>
  );
}
