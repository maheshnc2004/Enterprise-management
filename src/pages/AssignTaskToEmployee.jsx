import React, { useState } from "react";
import { useSelector } from "react-redux";
import EmployeeTaskBoard from "../components/EmployeeTaskBoard";

const CreateEmployee = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);

  // Filter projects managed by the logged-in manager
  const assignedProjects = projects.filter(
    (p) => p.manager === user.email || p.manager?.email === user.email
  );

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleProjectChange = (e) => {
    const selected = e.target.value;
    setSelectedProjectId(selected || null);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            🧑‍💼 Team Task Overview
          </h1>
          <p className="text-gray-600 text-sm">
            View and manage tasks assigned to your project team members.
          </p>
        </header>

        {/* Project Selector */}
        <section>
          <label className="block font-medium text-gray-700 mb-2">
            Select a Project
          </label>
          <select
            value={selectedProjectId || ""}
            onChange={handleProjectChange}
            className="w-full sm:w-96 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a Project --</option>
            {assignedProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          {assignedProjects.length === 0 && (
            <p className="text-sm text-red-500 italic mt-2">
              You have no projects assigned yet.
            </p>
          )}
        </section>

        {/* Task Board */}
        <section className="mt-6">
          {selectedProjectId ? (
            <EmployeeTaskBoard
              projectId={selectedProjectId}
              showCommentsEditable={true}
              showPerTaskUpdateButton={true}
            />
          ) : (
            <p className="text-gray-500 italic">
              Select a project above to display employee task details.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default CreateEmployee;
