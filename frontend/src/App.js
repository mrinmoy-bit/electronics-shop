import React, { useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleLogin = (username, password, role) => {
    // Simple login validation (we'll improve this later with backend)
    if ((username === 'admin' && password === 'admin123') || 
        (username === 'employee' && password === 'emp123')) {
      
      setCurrentUser({ username, role });
      setCurrentScreen(role === 'admin' ? 'admin-dashboard' : 'employee-dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  // Show different screens based on currentScreen state
  if (currentScreen === 'login') {
    return <Login onLogin={handleLogin} />;
  } else if (currentScreen === 'admin-dashboard') {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  } else if (currentScreen === 'employee-dashboard') {
    return <EmployeeDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return <div>Loading...</div>;
}

export default App;