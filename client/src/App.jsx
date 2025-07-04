import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import Navbar from './components/Navbar';
import { isAuthenticated } from './utils/auth';
import Home from './pages/Home';

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated() && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login onAuth={() => navigate('/dashboard')} />} />
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Register onAuth={() => navigate('/login')} />} />
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/upload" element={isAuthenticated() ? <UploadPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/"} />} />
      </Routes>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
} 