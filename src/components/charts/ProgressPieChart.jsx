import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useSelector } from 'react-redux';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981']; // Blue, Yellow, Green (To Do, In Progress, Done)

const ProgressPieChart = () => {
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

  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="flex justify-center items-center">
      {total === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic">
          No tasks available to display.
        </p>
      ) : (
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} tasks`, name]}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '6px',
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      )}
    </div>
  );
};

export default ProgressPieChart;
