// src/pages/Projects.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProjectFormModal from "../components/projects/ProjectFormModal";

const Projects = () => {
  const { projects } = useSelector((state) => state.projects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Projects</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects available.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-sm text-gray-500">Status: {project.status}</p>
              <p className="text-sm text-gray-500">Manager: {project.manager}</p>
              <button
                onClick={() => handleEdit(project)}
                className="mt-2 text-blue-600 hover:underline"
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <ProjectFormModal
          isEdit={!!selectedProject}
          defaultValues={selectedProject}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Projects;
