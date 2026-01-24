import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Partners from './pages/Partners';

import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

function App() {
  const [toastPosition, setToastPosition] = useState('bottom-right');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setToastPosition('bottom-center');
      } else {
        setToastPosition('bottom-right');
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AuthProvider>
      <Toaster position={toastPosition} />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="partners" element={<Partners />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
