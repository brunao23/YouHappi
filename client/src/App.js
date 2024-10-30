// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  // Função simples para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    console.log('Authentication check:', token ? 'User is authenticated' : 'User is not authenticated');
    return token !== null;
  };

  console.log('App is rendering');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
