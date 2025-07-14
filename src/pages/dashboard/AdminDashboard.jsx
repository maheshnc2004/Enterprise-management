import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, FileBarChart2, Settings, FolderKanban } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      title: 'Manage Users',
      icon: <Users className="w-8 h-8 text-blue-600" />,
      description: 'Add, remove, or edit users in the system.',
      to: '/users',
      bg: 'bg-blue-100',
    },
    {
      title: 'View Reports',
      icon: <FileBarChart2 className="w-8 h-8 text-green-600" />,
      description: 'Track usage, performance, and audit logs.',
      to: '/reports',
      bg: 'bg-green-100',
    },
    {
      title: 'Manage Projects',
      icon: <FolderKanban className="w-8 h-8 text-yellow-600" />,
      description: 'Create, assign, and track project progress.',
      to: '/projects',
      bg: 'bg-yellow-100',
    },
    {
      title: 'Settings',
      icon: <Settings className="w-8 h-8 text-purple-600" />,
      description: 'Configure system preferences and permissions.',
      to: '/settings',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
          Welcome back, {user?.name || 'Admin'} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here’s a quick overview of your administration panel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            to={feature.to}
            key={feature.title}
            className={`rounded-lg p-6 shadow-md hover:shadow-xl transition ${feature.bg} dark:bg-gray-800`}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-full bg-white shadow">{feature.icon}</div>
              <h2 className="text-lg font-semibold">{feature.title}</h2>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
