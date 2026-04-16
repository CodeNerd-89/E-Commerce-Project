import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/products?limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Handle different response formats
      let productList = [];
      if (Array.isArray(response.data)) {
        productList = response.data;
      } else if (Array.isArray(response.data?.data)) {
        productList = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        productList = [];
      }
      
      setProducts(productList);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? value : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const normalizedTitle = formData.title.trim();
    const normalizedDescription = formData.description.trim();
    const normalizedImageUrl = formData.imageUrl.trim();
    const normalizedPrice = Number(formData.price);

    if (!normalizedTitle || !normalizedDescription || Number.isNaN(normalizedPrice) || normalizedPrice < 0) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        title: normalizedTitle,
        description: normalizedDescription,
        price: normalizedPrice,
        imageUrl: normalizedImageUrl,
      };

      if (editingId) {
        // Update product
        await axios.put(
          `${apiUrl}/products/${editingId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccess('Product updated successfully!');
      } else {
        // Create product
        await axios.post(
          `${apiUrl}/products`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccess('Product created successfully!');
      }

      resetForm();
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message =
        (typeof err.response?.data === 'string' && err.response.data.trim()) ||
        err.response?.data?.message ||
        'Operation failed';
      setError(message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl || '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(
          `${apiUrl}/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSuccess('Product deleted successfully!');
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.first_name} {user?.last_name}</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="admin-content">
        <div className="admin-section">
          <div className="section-header">
            <h2>Manage Products</h2>
            <button
              onClick={() =>
                showForm ? resetForm() : setShowForm(true)
              }
              className={`toggle-form-btn ${showForm ? 'active' : ''}`}
            >
              {showForm ? 'Cancel' : '+ Add New Product'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter product title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {formData.imageUrl && (
                <div className="image-preview">
                  <p>Image Preview:</p>
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200';
                    }}
                  />
                </div>
              )}

              <button type="submit" className="submit-btn">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          )}

          <div className="products-table-container">
            {products.length === 0 ? (
              <p className="no-products">No products yet. Add your first product!</p>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td className="description-cell">
                        {product.description}
                      </td>
                      <td className="price-cell">
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="table-image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50';
                            }}
                          />
                        ) : (
                          <span className="no-image">No image</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEdit(product)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
