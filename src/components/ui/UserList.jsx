import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TieLogo from '../images/TieLogo.png'; // Adjust the path as per your project structure

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

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

  const handlePromote = async (userid) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No token found, redirecting to login...');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/auth/promote', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid, newRole: 'admin' }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userid === userid ? { ...user, role: 'admin' } : user
          )
        );
        console.log('User promoted successfully');
      } else {
        console.error('Failed to promote user', await response.json());
      }
    } catch (error) {
      console.error('Error promoting user:', error);
    }
  };

  const handleDemote = async (userid) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No token found, redirecting to login...');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/auth/promote', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid, newRole: 'user' }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userid === userid ? { ...user, role: 'user' } : user
          )
        );
        console.log('User demoted successfully');
      } else {
        console.error('Failed to demote user', await response.json());
      }
    } catch (error) {
      console.error('Error demoting user:', error);
    }
  };

  const handleApprove = async (userid) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No token found, redirecting to login...');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/auth/promote', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userid, newRole: 'user' }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userid === userid && user.role === 'pending'
              ? { ...user, role: 'user' }
              : user
          )
        );
        console.log('User approved successfully');
      } else {
        console.error('Failed to approve user', await response.json());
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleDelete = (userid) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.userid !== userid));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center bg-white p-4 shadow-md">
        <div>
          <img src={TieLogo} alt="Tie Logo" className="w-12 h-12" />
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/AdminDashboard')}
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Back
          </button>
          <button
            onClick={handleLogout}
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Logout
          </button>
        </div>
      </div>

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
