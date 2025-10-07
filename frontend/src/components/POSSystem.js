import React, { useState, useEffect } from 'react';
import { searchProducts, processSale, getAllProducts } from '../services/api';

const POSSystem = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Load all products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setSearchResults(data); // Show all products initially
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      try {
        const results = await searchProducts(term);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching:', error);
      }
    } else {
      setSearchResults(products); // Show all products if search is empty
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert(`Cannot add more. Only ${product.stock} in stock!`);
        return;
      }
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        stock: product.stock
      }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    const cartItem = cart.find(item => item.product_id === productId);
    if (newQuantity > cartItem.stock) {
      alert(`Cannot add more. Only ${cartItem.stock} in stock!`);
      return;
    }

    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processSaleTransaction = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        customer_name: customerName || 'Walk-in Customer',
        total_amount: getTotalAmount()
      };

      const result = await processSale(saleData);
      alert(`Sale processed successfully! Invoice: ${result.invoice_number}`);
      
      // Reset cart and reload products
      setCart([]);
      setCustomerName('');
      loadProducts();
      
    } catch (error) {
      alert('Failed to process sale: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
      {/* Left Side - Product Search & Selection */}
      <div style={{ flex: 2, background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h3>🔍 Product Search</h3>
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '20px',
            fontSize: '16px'
          }}
        />

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          {searchResults.map(product => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                backgroundColor: product.stock > 0 ? 'white' : '#f5f5f5',
                opacity: product.stock > 0 ? 1 : 0.6
              }}
              onClick={() => product.stock > 0 && addToCart(product)}
            >
              <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{product.name}</h4>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                {product.category}
              </p>
              <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#007bff' }}>
                ${parseFloat(product.price).toFixed(2)}
              </p>
              <p style={{ 
                margin: '5px 0', 
                fontSize: '12px',
                color: product.stock <= 10 ? 'red' : 'green'
              }}>
                Stock: {product.stock}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Shopping Cart */}
      <div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h3>🛒 Shopping Cart</h3>
        
        {/* Customer Name */}
        <input
          type="text"
          placeholder="Customer Name (Optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '20px'
          }}
        />

        {/* Cart Items */}
        <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.product_id} style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '10px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <br />
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      ${item.price.toFixed(2)} each
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                      style={{ padding: '5px 10px', border: '1px solid #ddd', borderRadius: '3px' }}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                      style={{ padding: '5px 10px', border: '1px solid #ddd', borderRadius: '3px' }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', marginTop: '5px', fontWeight: 'bold' }}>
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total & Checkout */}
        {cart.length > 0 && (
          <div>
            <div style={{
              borderTop: '2px solid #ddd',
              paddingTop: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              Total: ${getTotalAmount().toFixed(2)}
            </div>
            
            <button
              onClick={processSaleTransaction}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : '💳 Process Sale'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSSystem;