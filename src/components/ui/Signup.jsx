import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hotelpic from '../images/Hotelpic.png';
import TieLogo from '../images/TieLogo.png';

const SignUp = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userId, password }), // Match 'userid' key from Postman setup
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      if (data.message === 'User already exists') {
        setMessage('User already exists.');
      } else if (data.token) {
        setMessage('Sign-up successful. Redirecting...');
        // Save token to localStorage (if needed) and navigate to another page
        localStorage.setItem('token', data.token);
        setTimeout(() => navigate('/dashboard'), 2000); // Replace '/dashboard' with your desired path
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Section */}
      <div className="lg:w-1/2 w-full p-6 flex flex-col justify-center bg-white shadow-lg relative">
        <div className="absolute top-8 left-8">
          <img src={TieLogo} alt="Company Logo" className="w-16 h-16" />
        </div>

        <div
          className="border-2 border-gray-300 p-6 rounded-xl shadow-md relative mx-auto"
          style={{
            width: '30rem',
            height: '25rem',
            backgroundColor: '#FFF',
            boxShadow: '13px 16px 45.5px 6px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6 mt-4">Sign Up</h2>

          {/* Error and Success Messages */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                placeholder="User ID"
                className="w-full p-4 h-12 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="User ID"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full p-4 h-12 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Password"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a onClick={() => navigate('/login')} className="text-sm text-blue-600 hover:underline cursor-pointer">
            Already have an account? Log in here!
            </a>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full hidden lg:block">
        <img
          src={Hotelpic}
          alt="Decorative Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignUp;
