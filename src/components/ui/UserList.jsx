import React, { useState } from 'react';
import TieLogo from '../images/TieLogo.png'; // Adjust the path as per your project structure

const UserList = () => {
  const initialUsers = [
    { id: 1, name: 'John Doe', role: 'Admin' },
    { id: 2, name: 'Jane Smith', role: 'User' },
    { id: 3, name: 'Mark Wilson', role: 'Pending' },
  ];

  const [users, setUsers] = useState(initialUsers);

  const handlePromote = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id && user.role !== 'Admin'
          ? { ...user, role: 'Admin' }
          : user
      )
    );
  };

  const handleDemote = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id && user.role !== 'User'
          ? { ...user, role: 'User' }
          : user
      )
    );
  };

  const handleApprove = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id && user.role === 'Pending'
          ? { ...user, role: 'User' }
          : user
      )
    );
  };

  const handleDelete = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <div>
          <img src={TieLogo} alt="Tie Logo" className="w-12 h-12" />
        </div>
        <div className="space-x-4">
          <button
            onClick={() => console.log('Back')}
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Back
          </button>
          <button
            onClick={() => console.log('Logout')}
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Logout
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="mt-6 bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">User List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border border-gray-300 p-2">S.No</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {user.role === 'User' && (
                    <button
                      onClick={() => handlePromote(user.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                    >
                      Promote
                    </button>
                  )}
                  {user.role === 'Admin' && (
                    <button
                      onClick={() => handleDemote(user.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Demote
                    </button>
                  )}
                  {user.role === 'Pending' && (
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
