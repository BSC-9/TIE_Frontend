import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hotelpic from '../images/Hotelpic.png';
import TieLogo from '../images/TieLogo.png';

const Login = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid login credentials');
      }

      const data = await response.json();
      const token = data.token;

      // Save token to localStorage
      localStorage.setItem('authToken', token);

      // Fetch welcome message
      const welcomeResponse = await fetch('http://localhost:3001/api/auth/welcome', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!welcomeResponse.ok) {
        throw new Error('Failed to fetch welcome message');
      }

      const welcomeData = await welcomeResponse.json();
      const roleMessage = welcomeData.message;

      if (roleMessage === 'Welcome Admin') {
        navigate('/AdminDashboard');
      } else if (roleMessage === 'Welcome User') {
        navigate('/UserDashboard');
      } else {
        throw new Error('Unknown role');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="lg:w-1/2 w-full p-6 flex flex-col justify-center bg-white shadow-lg relative">
        <div className="absolute top-8 left-8">
          <img src={TieLogo} alt="Logo" className="w-16 h-16" />
        </div>

        <div
          className="border-2 border-gray-300 p-6 rounded-[1.375rem] shadow-md relative mx-auto"
          style={{
            width: '30rem',
            height: '30rem',
            backgroundColor: '#FFF',
            boxShadow: '13px 16px 45.5px 6px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div className="mb-6 mt-6">
            <h2 className="text-3xl font-bold text-gray-900 p-2">Welcome</h2>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="pb-1">
              <input
                type="text"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                required
                placeholder="User ID"
                className="mt-1 p-2 w-full max-w-[26.625rem] h-16 border border-gray-300 rounded-[0.625rem]"
                style={{ backgroundColor: '#F3F1F1' }}
              />
            </div>
            <div className="pb-7">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="mt-1 p-2 w-full max-w-[26.625rem] h-16 border border-gray-300 rounded-[0.625rem]"
                style={{ backgroundColor: '#F3F1F1' }}
              />
            </div>
            <button
              type="submit"
              className="w-full max-w-[26.625rem] h-16 py-2 bg-[#003B95] text-white rounded-[0.625rem] hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="mt-1 text-center">
            <a
              onClick={() => navigate('/signup')}
              className="text-md text-blue-600 hover:underline cursor-pointer"
            >
              No account yet? Sign up now!
            </a>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 w-full hidden lg:block">
        <img src={Hotelpic} alt="Hotel" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Login;
