import React, { useState } from 'react';
import PointOfSale from './PointOfSale';
import StockView from './StockView';

function EmployeeDashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('pos');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: '#27ae60',
        color: 'white',
        padding: '20px 0'
      }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>
          Employee Panel
        </h3>
        <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '14px', opacity: '0.8' }}>
          Welcome, {user?.username}!
        </p>
        
        <div style={{ padding: '0 20px' }}>
          <div 
            onClick={() => setActiveSection('pos')}
            style={{ 
              padding: '15px', 
              marginBottom: '10px', 
              background: activeSection === 'pos' ? '#2ecc71' : 'transparent', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🛒 Point of Sale
          </div>
          <div 
            onClick={() => setActiveSection('stock')}
            style={{ 
              padding: '15px', 
              marginBottom: '10px',
              background: activeSection === 'stock' ? '#2ecc71' : 'transparent',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📦 View Stock
          </div>
          
          {/* Logout Button */}
          <div 
            onClick={onLogout}
            style={{ 
              padding: '15px', 
              marginTop: '50px',
              background: '#e74c3c', 
              borderRadius: '5px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            🚪 Logout
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        background: '#f8f9fa',
        overflow: 'auto'
      }}>
        {activeSection === 'pos' && <PointOfSale />}
        
        {activeSection === 'stock' && <StockView />}
      </div>
    </div>
  );
}

export default EmployeeDashboard;