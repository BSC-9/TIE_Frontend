import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen bg-gray-100">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate('/UserList')}
          className="px-4 py-2 bg-[#003B95] text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200"
        >
          Users List
        </button>
      </div>
      <div className="flex justify-center items-center h-full">
        <h1 className="text-2xl font-bold">Welcome Admin</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
