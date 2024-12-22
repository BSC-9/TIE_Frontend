import React from 'react';
import './index.css';
import Login from './components/ui/login';  
import Dashboard from './components/ui/Dashboard';
import SignUp from './components/ui/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserList from './components/ui/UserList';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/UserList" element={<UserList />} />
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;