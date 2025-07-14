import React from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const TasksPerProjectBarChart = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);

  // Count tasks grouped by projectId
  const projectTaskCounts = projects.map((project) => {
    const taskCount = tasks.filter((task) => task.projectId === project.id).length;
    return {
      name: project.name,
      tasks: taskCount,
    };
  });

  return (
    <div className="w-full h-72 bg-white dark:bg-gray-800 rounded shadow p-4">
      {projectTaskCounts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic text-center">
          No projects or tasks available to visualize.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={projectTaskCounts}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value} Tasks`, 'Total']}
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
            <Legend />
            <Bar dataKey="tasks" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TasksPerProjectBarChart;
