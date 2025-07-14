// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { addNotification } from './redux/slices/notificationSlice';

// Pages
import Projects from './pages/Projects'; 
import Login from './pages/auth/Login';
import Home from './pages/Home';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import CreateEmployee from './pages/AssignTaskToEmployee';
import ProjectDetails from './pages/ProjectDetails';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const tasks = useSelector((state) => state.tasks.tasks);

  // 🔔 Notify overdue tasks
  useEffect(() => {
    const now = new Date();

    tasks.forEach((task) => {
      if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'Done') {
        dispatch(addNotification(`⏰ Task '${task.title}' is overdue!`));
      }
    });
  }, [tasks, dispatch]);

  // 🔒 Protect routes by role
  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/unauthorized" replace />;
    return children;
  };

  // 🎯 Redirect logged-in users based on role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'employee':
        return <Navigate to="/employee" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 👑 Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <ProjectDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 📋 Manager Routes */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="manager">
              <ManagerLayout>
                <ManagerDashboard />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/projects"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <Projects />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
        <Route
          path="/my-employees"
          element={
            <ProtectedRoute role="manager">
              <ManagerLayout>
                <CreateEmployee />
              </ManagerLayout>
            </ProtectedRoute>
          }
        />

        {/* 🧑‍💻 Employee Routes */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeeLayout>
                <EmployeeDashboard />
              </EmployeeLayout>
            </ProtectedRoute>
          }
        />

        {/* ⚙️ Settings – shared by all roles */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' && (
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              )}
              {user?.role === 'manager' && (
                <ManagerLayout>
                  <Settings />
                </ManagerLayout>
              )}
              {user?.role === 'employee' && (
                <EmployeeLayout>
                  <Settings />
                </EmployeeLayout>
              )}
            </ProtectedRoute>
          }
        />

        {/* 📦 Fallback route: redirect logged-in users to their dashboard */}
        <Route path="*" element={renderDashboard()} />
      </Routes>
    </>
  );
}

export default App;
