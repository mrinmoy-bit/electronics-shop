import React, { useState } from 'react';
import { productAPI } from '../services/api';

function ProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Phones',
    price: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await productAPI.createProduct(formData);
      
      if (response.data.success) {
        // Clear form
        setFormData({ name: '', category: 'Phones', price: '', stock: '' });
        // Notify parent component
        onProductAdded();
        alert('Product added successfully!');
      }
    } catch (err) {
      setError('Failed to add product');
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginTop: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3>Add New Product</h3>
      
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label>Product Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
              placeholder="e.g., iPhone 16 Pro"
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            >
              <option value="Phones">Phones</option>
              <option value="PCs">PCs</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label>Price ($):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
              placeholder="999.99"
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label>Stock Quantity:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '5px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
              placeholder="50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;