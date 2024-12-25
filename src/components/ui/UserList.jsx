import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TieLogo from '../images/TieLogo.png'; // Adjust the path as per your project structure

const UserList = () => {
  const [users, setUsers] = useState([]); // Ensure initial state is an array
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user data from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.log('No token found, redirecting to login...');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:3001/api/auth/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        });

        const data = await response.json();

        // Check if data is an array before setting it
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('API response is not an array', data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handlePromote = (userid) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userid === userid && user.role !== 'admin'
          ? { ...user, role: 'admin' }
          : user
      )
    );
  };

  const handleDemote = (userid) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userid === userid && user.role !== 'user'
          ? { ...user, role: 'user' }
          : user
      )
    );
  };

  const handleApprove = (userid) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userid === userid && user.role === 'pending'
          ? { ...user, role: 'user' }
          : user
      )
    );
  };

  const handleDelete = (userid) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.userid !== userid));
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('authToken');
    // Redirect to the login page
    navigate('/login');
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
            onClick={() => navigate('/AdminDashboard')} // Redirect to AdminDashboard
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Back
          </button>
          <button
            onClick={handleLogout} // Handle logout
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
              <th className="border border-gray-300 p-2">User ID</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Only map over users if it is an array */}
            {Array.isArray(users) &&
              users.map((user, index) => (
                <tr key={user.userid} className="text-center">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{user.userid}</td>
                  <td className="border border-gray-300 p-2">{user.role}</td>
                  <td className="border border-gray-300 p-2 space-x-2">
                    {user.role === 'user' && (
                      <button
                        onClick={() => handlePromote(user.userid)}
                        className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                      >
                        Promote
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleDemote(user.userid)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                      >
                        Demote
                      </button>
                    )}
                    {user.role === 'pending' && (
                      <button
                        onClick={() => handleApprove(user.userid)}
                        className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.userid)}
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
