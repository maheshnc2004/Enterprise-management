// src/components/layout/Layout.jsx
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserCog } from 'react-icons/fa';
import LayoutTopbar from './LayoutTopbar';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };

  useEffect(() => {
    if (!user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Gradient Topbar */}
        <header className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-4 shadow-md">
          <div className="text-lg font-bold">
            Hello, {user?.name || user?.role}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-1 hover:text-yellow-300"
            >
              <FaUserCog />
              <span className="hidden sm:inline">Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-200 hover:text-red-400"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <LayoutTopbar />

        {/* Main content */}
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
