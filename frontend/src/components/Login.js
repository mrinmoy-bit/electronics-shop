import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const loginSuccess = onLogin(username, password, role);
    
    if (!loginSuccess) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <form onSubmit={handleLogin} style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        minWidth: '300px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          🔌 ElectroStock Login
        </h2>
        
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label>Username:</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Role:</label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          Login
        </button>

        <div style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center', color: '#666' }}>
          <strong>Demo Accounts:</strong><br />
          Admin: admin / admin123<br />
          Employee: employee / emp123
        </div>
      </form>
    </div>
  );
}

export default Login;