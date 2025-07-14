import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import notificationsData from "../../data/notifications.json"; // You can replace this with Redux state

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const unread = notificationsData.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
        aria-label="Notifications"
      >
        <FaBell size={20} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full text-[10px] animate-pulse">
            {unread}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">🔔 Notifications</h3>
          </div>

          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 text-sm">
            {notificationsData.length === 0 ? (
              <li className="px-4 py-2 text-gray-500 italic dark:text-gray-400">No new notifications</li>
            ) : (
              notificationsData.slice(0, 5).map((note, i) => (
                <li key={i} className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  {note.message}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
