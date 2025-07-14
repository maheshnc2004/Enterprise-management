import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProjectDetails = () => {
  const { id } = useParams();

  const { projects } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.users);
  const { tasks } = useSelector((state) => state.tasks);

  const project = projects.find((p) => p.id.toString() === id);
  const manager = users.find((u) => u.email === project?.manager);

  const employees = users.filter(
    (u) =>
      u.role === 'employee' &&
      Array.isArray(u.projectIds) &&
      u.projectIds.map(String).includes(id)
  );

  const projectTasks = tasks.filter((t) => t.projectId.toString() === id);

  const progress = projectTasks.length
    ? Math.round(
        (projectTasks.filter((t) => t.status === 'Done').length / projectTasks.length) * 100
      )
    : 0;

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-6">
          📁 Project Overview
        </h1>

        {/* Project Info */}
        <InfoCard icon="📌" title="Project Info">
          <InfoRow label="ID" value={project?.id} />
          <InfoRow label="Name" value={project?.name} />
          <InfoRow label="Status" value={project?.status} />
        </InfoCard>

        {/* Manager */}
        <InfoCard icon="👤" title="Project Manager">
          {manager ? (
            <p>{manager.name} ({manager.email})</p>
          ) : (
            <p className="text-red-500">Manager not found.</p>
          )}
        </InfoCard>

        {/* Employees */}
        <InfoCard icon="👷" title="Assigned Employees">
          {employees.length > 0 ? (
            <ul className="list-disc ml-6 space-y-1">
              {employees.map((emp) => (
                <li key={emp.email}>{emp.name} ({emp.email})</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No employees assigned yet.</p>
          )}
        </InfoCard>

        {/* Tasks */}
        <InfoCard icon="📝" title="Project Tasks">
          {projectTasks.length > 0 ? (
            <ul className="space-y-3">
              {projectTasks.map((task) => (
                <li
                  key={task.id}
                  className="bg-white/70 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                >
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm italic text-blue-600 dark:text-blue-300">
                    {task.status}
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {task.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No tasks created for this project.</p>
          )}
        </InfoCard>

        {/* Progress */}
        <InfoCard icon="✅" title="Completion Progress">
          <div className="relative w-full bg-gray-200 dark:bg-gray-700 h-6 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 text-white text-sm font-medium flex items-center justify-center transition-all duration-500"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

// Row with label and value
const InfoRow = ({ label, value }) => (
  <p className="mb-1">
    <span className="font-medium text-gray-600 dark:text-gray-300">{label}:</span>{' '}
    <span>{value}</span>
  </p>
);

// Card with icon and children
const InfoCard = ({ title, icon, children }) => (
  <section className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
    </div>
    {children}
  </section>
);

export default ProjectDetails;
