import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { employeeAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useUI } from '../context/hooks';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'employee' });
  const { darkMode } = useUI();

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
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);
    setFormData({ fullName: employee.fullName, email: employee.email, role: employee.role });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
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
      <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
                {!editingId && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiPlus /> Add Employee
                  </motion.button>
                )}
              </div>

              {(showAddForm || editingId) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card mb-8"
                >
                  <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
                  <form onSubmit={editingId ? handleUpdate : handleAddEmployee} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="input-field"
                        >
                          <option value="employee">Employee</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="btn-primary">
                        {editingId ? 'Update Employee' : 'Add Employee'}
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
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search employees..."
                      className="input-field pl-10"
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    Search
                  </button>
                </form>
              </div>

              <div className="grid gap-4">
                {employees.map((employee) => (
                  <motion.div
                    key={employee._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{employee.fullName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{employee.email}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded">
                        {employee.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 rounded-lg transition-colors"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {employees.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No employees found</p>
                </div>
              )}
      </div>
    </>
  );
}
