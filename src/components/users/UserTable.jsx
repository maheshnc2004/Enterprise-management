// src/components/users/UserTable.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from '../../redux/slices/userSlice';
import toast from 'react-hot-toast';

const UserTable = ({ onEdit = () => {} }) => {
  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const handleDelete = (user) => {
    const confirmed = window.confirm(`Are you sure you want to delete user "${user.name}"?`);
    if (confirmed) {
      dispatch(deleteUser(user.id));
      toast.success(`User "${user.name}" deleted`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">All Users</h2>

      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-white">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 italic text-gray-500 dark:text-gray-400">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-600 hover:underline dark:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
