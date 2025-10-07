import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

function StockView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>📦 Stock View</h2>

      {/* Search and Filter */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              minWidth: '150px'
            }}
          >
            <option value="">All Categories</option>
            <option value="Phones">Phones</option>
            <option value="PCs">PCs</option>
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>Available Stock</h3>

        {loading ? (
          <p>Loading stock...</p>
        ) : (
          <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Product Name</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>Price</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Stock Available</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} style={{
                  background: product.stock === 0 ? '#f8d7da' : (product.stock <= 10 ? '#fff3cd' : 'transparent')
                }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <strong>{product.name}</strong>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {product.category}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>
                    ${parseFloat(product.price).toFixed(2)}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: product.stock === 0 ? '#e74c3c' : (product.stock <= 10 ? '#f39c12' : '#27ae60')
                  }}>
                    {product.stock} units
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {product.stock === 0 ? (
                      <span style={{ 
                        padding: '5px 10px', 
                        background: '#e74c3c', 
                        color: 'white', 
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        OUT OF STOCK
                      </span>
                    ) : product.stock <= 10 ? (
                      <span style={{ 
                        padding: '5px 10px', 
                        background: '#f39c12', 
                        color: 'white', 
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        LOW STOCK
                      </span>
                    ) : (
                      <span style={{ 
                        padding: '5px 10px', 
                        background: '#27ae60', 
                        color: 'white', 
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        IN STOCK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No products found
          </p>
        )}
      </div>

      {/* Stock Summary */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>Stock Summary</h3>
        <div style={{ marginTop: '15px' }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Total Products:</strong> {products.length}
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>In Stock:</strong> {products.filter(p => p.stock > 10).length}
          </p>
          <p style={{ marginBottom: '10px', color: '#f39c12' }}>
            <strong>Low Stock (≤10):</strong> {products.filter(p => p.stock > 0 && p.stock <= 10).length}
          </p>
          <p style={{ color: '#e74c3c' }}>
            <strong>Out of Stock:</strong> {products.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StockView;