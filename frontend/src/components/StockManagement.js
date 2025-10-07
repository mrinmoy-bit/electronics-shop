import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

function StockManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [newStock, setNewStock] = useState('');

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
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const startUpdate = (product) => {
    setUpdateProduct(product);
    setNewStock(product.stock);
  };

  const cancelUpdate = () => {
    setUpdateProduct(null);
    setNewStock('');
  };

  const handleUpdateStock = async () => {
    // Note: We'll need to add an update endpoint to the backend
    // For now, we'll just show an alert
    alert('Stock update feature will be implemented with backend API');
    cancelUpdate();
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= 10);
  };

  const getOutOfStockProducts = () => {
    return products.filter(p => p.stock === 0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>📦 Stock Management</h2>

      {/* Alert Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(45deg, #f39c12, #e67e22)',
          color: 'white',
          padding: '25px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>Low Stock Items</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{getLowStockProducts().length}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
          color: 'white',
          padding: '25px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>Out of Stock</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{getOutOfStockProducts().length}</p>
        </div>

        <div style={{
          background: 'linear-gradient(45deg, #27ae60, #2ecc71)',
          color: 'white',
          padding: '25px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', opacity: 0.9 }}>Total Products</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{products.length}</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {getLowStockProducts().length > 0 && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#856404' }}>⚠️ Low Stock Alerts</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
            {getLowStockProducts().map(product => (
              <li key={product.id} style={{ marginBottom: '5px' }}>
                <strong>{product.name}</strong> - Only {product.stock} units left
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Inventory Table */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>Current Inventory</h3>

        {loading ? (
          <p>Loading inventory...</p>
        ) : (
          <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Product Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>Price</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Current Stock</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{
                  background: product.stock === 0 ? '#f8d7da' : (product.stock <= 10 ? '#fff3cd' : 'transparent')
                }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.category}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>
                    ${product.price}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {product.stock}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {product.stock === 0 ? (
                      <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>Out of Stock</span>
                    ) : product.stock <= 10 ? (
                      <span style={{ color: '#f39c12', fontWeight: 'bold' }}>Low Stock</span>
                    ) : (
                      <span style={{ color: '#27ae60', fontWeight: 'bold' }}>In Stock</span>
                    )}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                    <button
                      onClick={() => startUpdate(product)}
                      style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Update Stock Modal */}
      {updateProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            minWidth: '400px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h3>Update Stock for {updateProduct.name}</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Current Stock: <strong>{updateProduct.stock}</strong>
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label>New Stock Quantity:</label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                min="0"
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelUpdate}
                style={{
                  padding: '10px 20px',
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockManagement;