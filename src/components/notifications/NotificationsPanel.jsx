import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BellIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { markAllAsReadForRole } from '../../redux/slices/notificationSlice';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const notifications = useSelector((state) =>
    state.notifications.notifications.filter(
      (n) => !n.role || n.role === user.role
    )
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      dispatch(markAllAsReadForRole(user.role));
    }
  };

  const typeBadge = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <BellIcon className="h-6 w-6 text-gray-700 dark:text-white" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
          </>
        )}
      </button>

      {/* Dropdown */}
      <Transition
        show={isOpen}
        enter="transition duration-150 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-100 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-100">Notifications</h3>
            <span className="text-xs text-gray-400">{unreadCount} unread</span>
          </div>

          <div className="p-3 max-h-64 overflow-y-auto space-y-2">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded px-3 py-2 text-sm shadow-sm border border-transparent ${
                    typeBadge[n.type] || typeBadge.info
                  }`}
                >
                  <div className="font-medium">{n.message}</div>
                  {n.time && (
                    <div className="text-xs text-gray-400 mt-1 italic">{n.time}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm italic text-center">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default NotificationPanel;
