import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API calls
// Product API calls
export const productAPI = {
  // Get all products
  getAllProducts: () => api.get('/products'),
  
  // Get single product
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Create new product
  createProduct: (productData) => api.post('/products', productData),

  // Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Add these functions to your existing api.js file

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Add these functions to your existing api.js file

// Search products
export const searchProducts = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/search?search=${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Process sale
export const processSale = async (saleData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/sales`, saleData);
    return response.data;
  } catch (error) {
    console.error('Error processing sale:', error);
    throw error;
  }
};

// Get all products (for employee to browse)
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Sales API calls
export const salesAPI = {
  // Create new sale
  createSale: (saleData) => api.post('/sales', saleData),
  
  // Get all sales
  getAllSales: () => api.get('/sales'),
  
  // Get single sale
  getSale: (id) => api.get(`/sales/${id}`),
};

export default api;