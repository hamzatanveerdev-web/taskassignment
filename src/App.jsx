import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { useAuth } from './context/hooks';
import { authAPI } from './services/api';
import pushService from './services/pushService';

// Pages
import LoginPage from './pages/LoginPage';
import EmployeeAttendence from './pages/EmployeeAttendence';
import SetupPasswordPage from './pages/SetupPasswordPage';
import DashboardWrapper from './components/DashboardWrapper';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import AssignTaskPage from './pages/AssignTaskPage';
import MyTasksPage from './pages/MyTasksPage';
import NotificationsPage from './pages/NotificationsPage';
import TaskHistoryPage from './pages/TaskHistoryPage';
import CompletedTasksPage from './pages/CompletedTasksPage';
import ProfilePage from './pages/ProfilePage';



// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} />;
  }

  return children;
}

// Main App Content
function AppContent() {
  const { user, login, setLoading } = useAuth();

  useEffect(() => {
    // Try to get current user if token exists
    const token = localStorage.getItem('token');
    console.log('App useEffect - Token exists:', !!token, 'User exists:', !!user);
    if (token && !user) {
      setLoading(true);
      authAPI
        .getMe()
        .then((res) => {
          console.log('getMe success:', res.data);
          if (res.data.success) {
            login(res.data.user, token);
          }
        })
        .catch((error) => {
          console.error('getMe error:', error.response?.data, error.response?.status);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, login, setLoading]);

  // Initialize push notifications when user logs in
  useEffect(() => {
    if (user) {
      pushService.init().catch((error) => {
        console.error('Failed to initialize push notifications:', error);
      });
    }
  }, [user]);

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup-password/:token" element={<SetupPasswordPage />} />

        {/* Dashboard Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          }
        >
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute requiredRole="admin">
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assign-task"
            element={
              <ProtectedRoute requiredRole="admin">
                <AssignTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/task-history"
            element={
              <ProtectedRoute requiredRole="admin">
                <TaskHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute requiredRole="admin">
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
             <Route
            path="/admin/employees/attendance"
            element={
              <ProtectedRoute requiredRole="admin">
                <EmployeeAttendence />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/my-tasks"
            element={
              <ProtectedRoute requiredRole="employee">
                <MyTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/completed-tasks"
            element={
              <ProtectedRoute requiredRole="employee">
                <CompletedTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/notifications"
            element={
              <ProtectedRoute requiredRole="employee">
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute requiredRole="employee">
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Protected Notifications (both roles) */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
        </Route>


        {/* Redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#000000',
          },
        }}
      />
    </div>
  );
}

// Main App Component
export default function App() {


  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <AppContent />
        </Router>
      </UIProvider>
    </AuthProvider>
  );
}
