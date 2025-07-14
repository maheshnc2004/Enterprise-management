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

const ManagerTaskCompletionChart = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);

  // Calculate task completion by manager
  const managerDoneTaskCount = {};
  projects.forEach((project) => {
    const completed = tasks.filter(
      (task) => task.projectId === project.id && task.status === 'Done'
    ).length;

    if (!managerDoneTaskCount[project.manager]) {
      managerDoneTaskCount[project.manager] = 0;
    }

    managerDoneTaskCount[project.manager] += completed;
  });

  const data = Object.entries(managerDoneTaskCount).map(([email, count]) => {
    const manager = users.find((u) => u.email === email);
    return {
      name: manager?.name || email,
      completed: count,
    };
  });

  return (
    <div className="w-full h-72">
      {data.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 italic mt-6">
          No completed tasks data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="name"
              stroke="#888"
              tick={{ fontSize: 12 }}
              angle={-15}
              height={50}
            />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tw-bg-opacity,1) #fff',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#fbbf24" name="Completed Tasks" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ManagerTaskCompletionChart;
