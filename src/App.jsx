import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { useAuth } from './context/hooks';

// Pages
import LoginPage from './pages/LoginPage';
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
import EmployeeAttendence from './pages/EmployeeAttendence';


// ================= PROTECTED ROUTE =================
function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isAuthenticated, loading, authReady } = useAuth();

  // Show loading while validating token
  if (loading || !authReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3BC0E1] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Navigate
        to={user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'}
        replace
      />
    );
  }

  return children;
}


// ================= APP CONTENT =================
function AppContent() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setup-password/:token" element={<SetupPasswordPage />} />

      {/* WRAPPER (ONLY ONCE) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        }
      >

        {/* ADMIN ROUTES */}
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


        {/* EMPLOYEE ROUTES */}
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

        {/* COMMON */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* DEFAULT REDIRECT */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}


// ================= MAIN APP =================
export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <Router>
          <AppContent />
        </Router>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#000',
            },
          }}
        />
      </UIProvider>
    </AuthProvider>
  );
}