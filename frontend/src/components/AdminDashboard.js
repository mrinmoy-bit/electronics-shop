import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductForm from './ProductForm';
import SalesReport from './SalesReport';
import StockManagement from './StockManagement';

function AdminDashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = () => {
    fetchProducts();
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        const response = await productAPI.deleteProduct(productId);
        
        if (response.data.success) {
          alert('Product deleted successfully!');
          fetchProducts();
        }
      } catch (err) {
        alert('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: '#2c3e50',
        color: 'white',
        padding: '20px 0'
      }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>
          Admin Panel
        </h3>
        <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '14px', opacity: '0.8' }}>
          Welcome, {user?.username}!
        </p>
        
        <div style={{ padding: '0 20px' }}>
          <div 
            onClick={() => setActiveSection('dashboard')}
            style={{ 
              padding: '15px', 
              marginBottom: '10px', 
              background: activeSection === 'dashboard' ? '#34495e' : 'transparent', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📊 Dashboard
          </div>
          <div 
            onClick={() => setActiveSection('products')}
            style={{ 
              padding: '15px', 
              marginBottom: '10px',
              background: activeSection === 'products' ? '#34495e' : 'transparent',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📱 Manage Products
          </div>
          <div 
            onClick={() => setActiveSection('sales')}
            style={{ 
              padding: '15px', 
              marginBottom: '10px',
              background: activeSection === 'sales' ? '#34495e' : 'transparent',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            💰 Sales Reports
          </div>
          <div 
            onClick={() => setActiveSection('stock')}
            style={{ 
              padding: '15px', 
              marginBottom: '10px',
              background: activeSection === 'stock' ? '#34495e' : 'transparent',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📦 Stock Management
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
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <p>Connected to Laravel Backend!</p>
            
            {/* Products Section */}
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              marginTop: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3>Current Products (Live from Database)</h3>
              
              {loading && <p>Loading products...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              
              {!loading && !error && (
                <div style={{ marginTop: '15px' }}>
                  <strong>Total Products: {products.length}</strong>
                  
                  <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Category</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Price</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Stock</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.name}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.category}</td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>${product.price}</td>
                          <td style={{ 
                            padding: '10px', 
                            border: '1px solid #ddd',
                            color: product.stock <= 10 ? 'red' : 'green',
                            fontWeight: 'bold'
                          }}>
                            {product.stock}
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              style={{
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Add Product Form */}
            <ProductForm onProductAdded={handleProductAdded} />
          </div>
        )}

        {/* Products Management Section */}
        {activeSection === 'products' && (
          <div style={{ padding: '20px' }}>
            <h2>📱 Product Management</h2>
            <ProductForm onProductAdded={handleProductAdded} />
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              marginTop: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3>All Products</h3>
              <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Price</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Stock</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.name}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.category}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>${product.price}</td>
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #ddd',
                        color: product.stock <= 10 ? 'red' : 'green',
                        fontWeight: 'bold'
                      }}>
                        {product.stock}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          style={{
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            padding: '8px 15px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sales Reports Section */}
        {activeSection === 'sales' && <SalesReport />}

        {/* Stock Management Section */}
        {activeSection === 'stock' && <StockManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;