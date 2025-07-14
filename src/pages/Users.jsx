import React, { useState } from 'react';
import UserTable from '../components/users/UserTable';
import UserFormModal from '../components/users/UserFormModal';
import { useSelector } from 'react-redux';

const Users = () => {
  const role = useSelector(state => state.auth.user?.role);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleAddUser = () => {
    setEditUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">👥 Manage Users</h1>
          {role === 'admin' && (
            <button
              onClick={handleAddUser}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow transition"
            >
              + Add User
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
          <UserTable onEdit={handleEditUser} />
        </div>
      </div>

      {showModal && (
        <UserFormModal
          onClose={() => setShowModal(false)}
          user={editUser}
        />
      )}
    </div>
  );
};

export default Users;
