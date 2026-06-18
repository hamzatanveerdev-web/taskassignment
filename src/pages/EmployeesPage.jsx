import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { employeeAPI } from '../services/api';
import LoadingSpinner, { ButtonSpinner } from '../components/LoadingSpinner';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'employee' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.employees);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      fetchEmployees();
      return;
    }
    try {
      const response = await employeeAPI.search(search);
      setEmployees(response.data.employees);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const response = await employeeAPI.add(formData.fullName, formData.email, formData.role);
      if (response.data.success) {
        toast.success('Employee added successfully! Invitation sent.');
        setFormData({ fullName: '', email: '', role: 'employee' });
        setShowAddForm(false);
        fetchEmployees();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add employee');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);
    setFormData({ fullName: employee.fullName, email: employee.email, role: employee.role });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const response = await employeeAPI.update(editingId, formData);
      if (response.data.success) {
        toast.success('Employee updated successfully!');
        setEditingId(null);
        setFormData({ fullName: '', email: '', role: 'employee' });
        fetchEmployees();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update employee');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ fullName: '', email: '', role: 'employee' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const response = await employeeAPI.delete(id);
        if (response.data.success) {
          toast.success('Employee deleted');
          fetchEmployees();
        }
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
        {!editingId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={actionLoading}
            className="btn-primary flex items-center gap-2 w-auto max-w-full sm:w-auto ml-auto md:w-auto justify-center "
          >
            <FiPlus /> Add Employee
          </motion.button>
        )}
      </div>

      {(showAddForm || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6 md:mb-8"
        >
          <h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
          <form onSubmit={editingId ? handleUpdate : handleAddEmployee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 dark:text-gray-200">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 dark:text-gray-200">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 dark:text-gray-200">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 flex-col md:flex-row">
              <button type="submit" disabled={actionLoading} className="btn-primary flex items-center justify-center gap-2 flex-1 md:flex-none">
                {actionLoading ? (
                  <>
                    <ButtonSpinner size="sm" />
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingId ? 'Update Employee' : 'Add Employee'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingId) {
                    handleCancelEdit();
                  } else {
                    setShowAddForm(false);
                  }
                }}
                className="btn-secondary flex-1 md:flex-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-col md:flex-row">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="input-field pl-10 w-full text-sm"
            />
          </div>
          <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary w-full md:w-auto">
            Search
          </motion.button>
        </form>
      </div>

     <div className="overflow-x-auto">
  <table className="w-full min-w-[600px] border-separate border-spacing-0 rounded-lg overflow-hidden">
    <thead className='bg-[#3BC0E1] f '>
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Name
        </th>
        <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Email
        </th>
        <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Role
        </th>
          <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Joining Date
        </th>
        <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      {employees.map((employee) => (
        <motion.tr
          key={employee._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3BC0E1]/20 flex items-center justify-center text-[#3BC0E1] font-semibold text-sm">
                {employee.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {employee.fullName}
              </span>
            </div>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {employee.email}
            </span>
          </td>
          <td className="py-3 px-4">
            <span className="inline-block px-2 py-1 bg-[#3BC0E1]/20 text-[#3BC0E1] text-xs rounded font-medium">
              {employee.role?.toUpperCase() || 'USER'}
            </span>
          </td>

          <td className="py-3 px-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(employee.createdAt).toLocaleDateString()}
            </span>
          </td>

          <td className="py-3 px-4">
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleEdit(employee)}
                className="p-2 hover:bg-[#3BC0E1]/10 text-[#3BC0E1] rounded-lg transition-colors"
                title="Edit"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(employee._id)}
                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </td>
        </motion.tr>
      ))}
    </tbody>
  </table>
</div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">No employees found</p>
        </div>
      )}
    </>
  );
}
