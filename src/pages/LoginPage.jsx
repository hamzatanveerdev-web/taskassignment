import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/hooks';
import { ButtonSpinner } from '../components/LoadingSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Clear any existing tokens before login to prevent conflicts
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    try {
      const response = await authAPI.login(email, password);
      if (response.data.success) {
        login(response.data.user, response.data.token);
        toast.success('Login successful!');
        navigate(response.data.user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3BC0E1] to-[#2FA8C5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="card bg-white shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#3BC0E1] mb-2">TaskPro</h1>
            <p className="text-gray-600">Task Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field focus:ring-[#3BC0E1]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field focus:ring-[#3BC0E1]"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <ButtonSpinner size="sm" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Demo Credentials:<br />
              Email: admin@test.com<br />
              Password: password123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
