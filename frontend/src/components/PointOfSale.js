import React, { useState, useEffect } from 'react';
import { productAPI, salesAPI } from '../services/api';
import Invoice from './Invoice';

function PointOfSale() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

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

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity if already in cart
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert('Cannot add more. Stock limit reached!');
      }
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Update quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity <= product.stock) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      alert('Cannot exceed stock limit!');
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Clear cart
  const clearCart = () => {
    if (window.confirm('Clear the entire cart?')) {
      setCart([]);
    }
  };

  // Process order
  const processOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    if (!window.confirm('Process this order?')) {
      return;
    }

    setProcessing(true);

    try {
      const saleData = {
        served_by: 'employee', // We'll get this from logged-in user later
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      const response = await salesAPI.createSale(saleData);

      if (response.data.success) {
        alert('Order processed successfully!');
        setCurrentSale(response.data.data);
        setShowInvoice(true);
        setCart([]);
        fetchProducts(); // Refresh products to show updated stock
      }
    } catch (err) {
      alert('Failed to process order: ' + (err.response?.data?.message || err.message));
      console.error('Error processing order:', err);
    } finally {
      setProcessing(false);
    }
  };

  // Print invoice
  const handlePrint = () => {
    window.print();
  };

  // Close invoice
  const closeInvoice = () => {
    setShowInvoice(false);
    setCurrentSale(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>🛒 Point of Sale</h2>

      {/* Search and Filter */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>Search Products</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
          <input
            type="text"
            placeholder="Search by product name..."
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

        {/* Available Products */}
        <div style={{ marginTop: '20px' }}>
          <h4>Available Products:</h4>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    background: '#f8f9fa'
                  }}
                >
                  <h4 style={{ margin: '0 0 10px 0' }}>{product.name}</h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>{product.category}</p>
                  <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '18px', color: '#667eea' }}>
                    ${product.price}
                  </p>
                  <p style={{ margin: '5px 0', color: product.stock <= 10 ? 'red' : 'green' }}>
                    Stock: {product.stock}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      padding: '10px',
                      background: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
          {!loading && filteredProducts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
              No products found
            </p>
          )}
        </div>
      </div>

      {/* Shopping Cart */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3>Shopping Cart ({cart.length} items)</h3>
        
        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            Cart is empty. Add products to get started!
          </p>
        ) : (
          <>
            <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Product</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Price</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Quantity</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Total</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {item.name}
                      <br />
                      <small style={{ color: '#666' }}>{item.category}</small>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                      ${item.price}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        min="1"
                        max={item.stock}
                        style={{
                          width: '60px',
                          padding: '5px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          textAlign: 'center'
                        }}
                      />
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <h2 style={{ color: '#667eea' }}>Total: ${calculateTotal()}</h2>
              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={clearCart}
                  style={{
                    padding: '12px 25px',
                    background: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Clear Cart
                </button>
                <button
                  onClick={processOrder}
                  disabled={processing}
                  style={{
                    padding: '12px 25px',
                    background: processing ? '#95a5a6' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {processing ? 'Processing...' : 'Process Order'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <Invoice
          sale={currentSale}
          onClose={closeInvoice}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}

export default PointOfSale;