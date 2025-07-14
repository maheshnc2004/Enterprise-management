import React from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const TaskStatusBarChart = () => {
  const { tasks } = useSelector((state) => state.tasks);

  const statusCounts = {
    'To Do': 0,
    'In Progress': 0,
    'Done': 0,
  };

  tasks.forEach((task) => {
    if (statusCounts[task.status] !== undefined) {
      statusCounts[task.status]++;
    }
  });

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="w-full h-72 bg-white dark:bg-gray-800 rounded shadow p-4">
      {data.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 italic">No tasks found to display status chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value} Tasks`, 'Status']}
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="#10b981" name="Task Count" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TaskStatusBarChart;
