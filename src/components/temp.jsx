import React, { useState } from 'react';

function App() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [roleMessage, setRoleMessage] = useState('');
  const [showPressButton, setShowPressButton] = useState(false);
  const [showWelcomeSection, setShowWelcomeSection] = useState(false);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userid, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      setToken(token);

      // Show welcome section
      setShowWelcomeSection(true);

      // Send GET request to the protected welcome endpoint
      const welcomeResponse = await fetch('http://localhost:3001/api/auth/welcome', {
        method: 'GET',
        headers: {
          'Authorization': Bearer ${token},
        },
      });

      if (welcomeResponse.ok) {
        const welcomeData = await welcomeResponse.json();
        const message = welcomeData.message;

        setRoleMessage(message);

        // Show "Press Me" button for Admin role
        if (message === 'Welcome Admin') {
          setShowPressButton(true);
        }
      } else {
        console.error('Failed to fetch welcome message');
      }
    } else {
      console.error('Login failed');
    }
  };

  return (
    <div>
      <h1>Hello World</h1>

      {/* Login Form */}
      {!showWelcomeSection && (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input
                type="text"
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                required
              />
            </label>
            <br /><br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <br /><br />
            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {/* Welcome Message Section */}
      {showWelcomeSection && (
        <div>
          <h2>{roleMessage}</h2>
          {showPressButton && (
            <button onClick={() => alert('You pressed the button!')}>Press Me</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;