import React from 'react';
import { useSelector } from 'react-redux';
import NotificationPanel from '../notifications/NotificationsPanel';

const LayoutTopbar = () => {
  const { user } = useSelector((state) => state.auth);

  const firstName = user?.name?.split(' ')[0] || 'User';
  const role = user?.role || '';

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
      {/* User Info Section */}
      <div className="flex items-center gap-4">
        {/* Avatar Initial */}
        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow">
          {firstName.charAt(0).toUpperCase()}
        </div>

        {/* Greeting */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Hello, {firstName}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize relative group">
            Role: {role}
            {/* Underline animation */}
            <span className="block w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left mt-0.5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Notification Panel with Tooltip */}
      <div className="relative group">
        <NotificationPanel />
        <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Notifications
        </div>
      </div>
    </div>
  );
};

export default LayoutTopbar;
