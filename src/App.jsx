import React from 'react';
import './index.css';
import Login from './components/ui/login';  
import Dashboard from './components/ui/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;