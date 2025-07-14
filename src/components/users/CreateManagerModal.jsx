import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '../../redux/slices/userSlice';
import { addProject } from '../../redux/slices/projectSlice';
import toast from 'react-hot-toast';

const CreateManagerModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    projectName: '',
    projectDescription: '',
    techTools: '',
    status: 'Pending',
    employeeList: [{ name: '', email: '', password: '' }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (index, e) => {
    const updatedList = [...formData.employeeList];
    updatedList[index][e.target.name] = e.target.value;
    setFormData({ ...formData, employeeList: updatedList });
  };

  const addEmployeeField = () => {
    setFormData({
      ...formData,
      employeeList: [...formData.employeeList, { name: '', email: '', password: '' }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      projectName,
      projectDescription,
      techTools,
      status,
      employeeList,
    } = formData;

    if (!name || !email || !password || !projectName || !projectDescription) {
      toast.error('Please fill all required manager and project fields');
      return;
    }

    const managerId = Date.now();
    const projectId = (managerId + 1).toString(); // Make sure it's a string

    // Add manager if not exists
    const managerExists = users.find((u) => u.email === email && u.role === 'manager');
    if (!managerExists) {
      dispatch(
        addUser({
          id: managerId,
          name,
          email,
          password,
          role: 'manager',
        })
      );
    }

    // Create project
    const newProject = {
      id: projectId,
      name: projectName,
      description: projectDescription,
      techTools: techTools.split(',').map((tool) => tool.trim()),
      manager: email, // Store as email string
      status,
      employees: employeeList.map((emp) => emp.email),
      tasks: [],
    };

    dispatch(addProject(newProject));

    let employeeCreatedOrUpdated = 0;

    employeeList.forEach((emp) => {
      if (!emp.name || !emp.email || !emp.password) return;

      const existingEmployee = users.find(
        (u) => u.email === emp.email && u.role === 'employee'
      );

      if (!existingEmployee) {
        dispatch(
          addUser({
            id: Date.now() + Math.random(),
            name: emp.name,
            email: emp.email,
            password: emp.password,
            role: 'employee',
            manager: email,
            projectIds: [projectId],
          })
        );
        employeeCreatedOrUpdated++;
      } else {
        const previousProjects = Array.isArray(existingEmployee.projectIds)
          ? existingEmployee.projectIds.map(String)
          : [];

        const mergedProjects = Array.from(new Set([...previousProjects, projectId]));

        dispatch(
          updateUser({
            ...existingEmployee,
            projectIds: mergedProjects,
          })
        );
        employeeCreatedOrUpdated++;
      }
    });

    toast.success(`Project created. ${employeeCreatedOrUpdated} employee(s) assigned.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">
          Create Manager, Assign Project & Employees
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Manager Name"
            className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Manager Email"
            className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Manager Password"
            className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <input
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Project Name"
            className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <textarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            placeholder="Project Description"
            className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <input
            name="techTools"
            value={formData.techTools}
            onChange={handleChange}
            placeholder="Tech Tools (comma separated)"
            className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />

          <h3 className="text-lg font-medium mt-6">Assign Employees</h3>
          {formData.employeeList.map((emp, index) => (
            <div key={index} className="space-y-2 border p-3 rounded">
              <input
                name="name"
                value={emp.name}
                onChange={(e) => handleEmployeeChange(index, e)}
                placeholder="Employee Name"
                className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
              <input
                name="email"
                value={emp.email}
                onChange={(e) => handleEmployeeChange(index, e)}
                placeholder="Employee Email"
                className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
              <input
                name="password"
                type="password"
                value={emp.password}
                onChange={(e) => handleEmployeeChange(index, e)}
                placeholder="Employee Password"
                className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addEmployeeField}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Another Employee
          </button>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManagerModal;
