import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import { addProject, updateProject } from "../../redux/slices/projectSlice";
import { addNotification } from "../../redux/slices/notificationSlice";

const schema = yup.object({
  name: yup.string().required("Project name is required"),
  manager: yup.string().email("Invalid email").required("Manager email is required"),
  status: yup.string().required("Status is required"),
});

const ProjectFormModal = ({ isEdit, defaultValues, onClose }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", manager: "", status: "" },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name || "",
        manager: typeof defaultValues.manager === "object"
          ? defaultValues.manager.email
          : defaultValues.manager || "",
        status: defaultValues.status || "",
      });
    }
  }, [defaultValues, reset]);

  const onSubmit = (data) => {
    const cleanData = {
      ...data,
      manager: typeof data.manager === "object" ? data.manager.email : data.manager,
    };

    if (isEdit) {
      dispatch(updateProject({ ...cleanData, id: defaultValues.id }));
      toast.success("Project updated successfully ✅");

      if (data.status === "Completed") {
        dispatch(
          addNotification({
            message: `📌 Project '${data.name}' marked completed.`,
            role: "admin",
            type: "success",
          })
        );
        dispatch(
          addNotification({
            message: `✅ Project '${data.name}' successfully completed.`,
            role: "manager",
            type: "success",
          })
        );
      }
    } else {
      const id = Date.now();
      dispatch(addProject({ ...cleanData, id }));
      toast.success("Project created successfully 🎉");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {isEdit ? "Edit Project" : "Create New Project"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Project Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Manager Dropdown */}
          <div>
            <label htmlFor="manager" className="block mb-1 font-medium">
              Manager Email
            </label>
            <select
              id="manager"
              {...register("manager")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Manager</option>
              {users
                .filter((u) => u.role === "manager")
                .map((manager) => (
                  <option key={manager.id} value={manager.email}>
                    {manager.email}
                  </option>
                ))}
            </select>
            {errors.manager && (
              <p className="text-red-500 text-sm">{errors.manager.message}</p>
            )}
          </div>

          {/* Status Dropdown */}
          <div>
            <label htmlFor="status" className="block mb-1 font-medium">
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEdit ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
