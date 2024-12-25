import React from 'react';
import './index.css';
import Login from './components/ui/login';  
import SignUp from './components/ui/Signup';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserList from './components/ui/UserList';
import AdminDashboard from './components/ui/AdminDashboard';
import UserDashboard from './components/ui/UserDashboard';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Example
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserDashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserList"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
