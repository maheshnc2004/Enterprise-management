import React from 'react';
import TaskStatusBarChart from '../components/charts/TaskStatusBarChart';
import TasksPerProjectBarChart from '../components/charts/TasksPerProjectBarChart';
import ProgressPieChart from '../components/charts/ProgressPieChart';
import ManagerTaskCompletionChart from '../components/charts/ManagerTaskCompletionChart';

const Reports = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-sky-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400">
            📊 Reports & Analytics
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Visual insights into your team's performance and project progress.
          </p>
        </header>

        {/* Charts */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <ReportCard title="✅ Task Completion Overview">
            <ProgressPieChart />
          </ReportCard>

          {/* Bar Chart: Tasks per Project */}
          <ReportCard title="📂 Tasks by Project">
            <TasksPerProjectBarChart />
          </ReportCard>

          {/* Bar Chart: Completed by Manager */}
          <ReportCard title="👔 Tasks Completed by Manager">
            <ManagerTaskCompletionChart />
          </ReportCard>

          {/* Optional: Uncomment below */}
          {/* <ReportCard title="📈 Task Status Distribution">
            <TaskStatusBarChart />
          </ReportCard> */}
        </div>
      </div>
    </div>
  );
};

// ⬛ Reusable card with modern style
const ReportCard = ({ title, children }) => (
  <section className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition hover:shadow-lg">
    <div className="mb-4 flex justify-between items-center">
      <h2 className="text-lg font-bold text-gray-700 dark:text-white">{title}</h2>
      {/* Optional Export Button */}
      {/* <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Export</button> */}
    </div>
    {children}
  </section>
);

export default Reports;
