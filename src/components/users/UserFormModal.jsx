import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '../../redux/slices/userSlice';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const UserFormModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const isEdit = !!user;
  const { projects } = useSelector((state) => state.projects);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: '',
      projectIds: [],
    },
  });

  useEffect(() => {
    if (isEdit && user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        role: user.role || '',
        projectIds: Array.isArray(user.projectIds)
          ? user.projectIds.map(String)
          : [],
      });
    }
  }, [isEdit, user, reset]);

  const onSubmit = (data) => {
    const formatted = {
      ...data,
      id: isEdit ? user.id : uuidv4(),
      email: data.email.toLowerCase().trim(),
      projectIds: Array.isArray(data.projectIds)
        ? data.projectIds.map(String)
        : [String(data.projectIds)],
    };

    if (isEdit) {
      dispatch(updateUser(formatted));
      toast.success('User updated successfully ✅');
    } else {
      dispatch(
        addUser({
          ...formatted,
          role: data.role || 'manager',
        })
      );
      toast.success('User created successfully 🎉');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {isEdit ? 'Edit User' : 'Add User'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="Name"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            {...register('email', { required: 'Email is required' })}
            placeholder="Email"
            type="email"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 4, message: 'Minimum 4 characters' },
            })}
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <select
            {...register('role', { required: 'Role is required' })}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="">-- Select Role --</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Assign Projects
          </label>
          <select
            {...register('projectIds')}
            multiple
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            {projects.length > 0 ? (
              projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name || 'Untitled Project'}
                </option>
              ))
            ) : (
              <option disabled>No projects available</option>
            )}
          </select>

          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
