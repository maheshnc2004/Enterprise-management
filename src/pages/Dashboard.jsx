// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { projects } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  const [notifications, setNotifications] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);

  useEffect(() => {
    const recent = [
      `📌 ${user.name || user.email} logged in.`,
      '✅ Task "Design Homepage" marked as done.',
      '🆕 New project "E-commerce Platform" created.',
    ];
    const notifs = [
      '🔔 Task deadline approaching: “Client Meeting Notes”',
      '🛠️ New bug reported in "API Gateway"',
      '🚨 Task assigned: "Refactor Login Flow"',
    ];
    setActivityFeed(recent);
    setNotifications(notifs);
  }, [user]);

  const completedTasks = tasks.filter(t => t.status === 'Done');
  const pendingTasks = tasks.filter(t => t.status !== 'Done');

  useEffect(() => {
    console.log('Dashboard loaded');
    toast.success('Welcome to WorkNext 👋');
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📊 Welcome to WorkNext Dashboard</h1>

      {/* METRICS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Projects" value={projects.length} color="from-blue-500 to-blue-600" />
        <MetricCard title="Completed Tasks" value={completedTasks.length} color="from-green-500 to-green-600" />
        <MetricCard title="Pending Tasks" value={pendingTasks.length} color="from-yellow-500 to-yellow-600" />
        <MetricCard title="Team Members" value={users.length} color="from-purple-500 to-purple-600" />
      </section>

      {/* RECENT ACTIVITY */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">📜 Recent Activity</h2>
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-2 border border-blue-100">
          {activityFeed.map((item, idx) => (
            <div key={idx} className="text-gray-600">• {item}</div>
          ))}
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">🔔 Notifications</h2>
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-2 border border-blue-100">
          {notifications.map((notif, idx) => (
            <div key={idx} className="text-sm text-blue-800 font-medium">{notif}</div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Metric card component with gradient and shadow
const MetricCard = ({ title, value, color }) => (
  <div className={`bg-gradient-to-r ${color} text-white rounded-xl p-6 shadow-lg`}>
    <p className="text-sm font-medium">{title}</p>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);

export default Dashboard;
