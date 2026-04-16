import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/products/${id}`
      );
      
      // Handle different response formats
      const productData = response.data?.data || response.data;
      setProduct(productData);
      setError('');
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <p className="error-message">{error || 'Product not found'}</p>
        <button onClick={() => navigate('/')} className="back-btn">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Products
      </button>
      <div className="product-detail-content">
        <div className="product-detail-image">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400';
            }}
          />
        </div>
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="product-description">{product.description}</p>
          <div className="product-price-section">
            <p className="product-price">${Number(product.price).toFixed(2)}</p>
            <span className="price-label">Per Item</span>
          </div>
          <div className="quantity-section">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              max="100"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <div className="total-price">
            <p>Total: ${(Number(product.price) * quantity).toFixed(2)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
          >
            {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
          {addedToCart && (
            <button onClick={() => navigate('/cart')} className="go-to-cart-btn">
              Go to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
