import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { updateUser } from '../redux/slices/userSlice';
import { setUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toggleTheme, isDark } = useContext(ThemeContext);

  const [form, setForm] = useState({
    name: user?.name || '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!form.name || !form.password) {
      toast.error('Name and Password are required');
      return;
    }

    const updatedUser = { ...user, name: form.name, password: form.password };

    dispatch(updateUser(updatedUser));
    dispatch(setUser(updatedUser)); // ✅ This ensures auth.user is also updated
    toast.success('Profile updated successfully ✅');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen text-gray-800 dark:text-white dark:bg-gray-900">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 space-y-8">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">⚙️ Settings</h1>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg font-medium transition-all"
          >
            Save Changes
          </button>
        </form>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">🌙 Theme Preference</h2>
          <button
            onClick={toggleTheme}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-medium transition"
          >
            Toggle to {isDark ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
