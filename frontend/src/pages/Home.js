import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/products?limit=100`
      );
      
      // Handle different response formats from backend
      let productList = [];
      if (Array.isArray(response.data)) {
        productList = response.data;
      } else if (Array.isArray(response.data?.data)) {
        productList = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        // If response is object but not array, try to convert
        productList = Array.isArray(response.data) ? response.data : [];
      }
      
      console.log('Products fetched:', productList);
      setProducts(productList);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error('Products fetch error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to ShopHub</h1>
        <p>Discover amazing products at great prices</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>
            {searchTerm
              ? 'No products match your search'
              : 'No products available'}
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/200'}
          alt={product.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200';
          }}
        />
      </div>
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${Number(product.price).toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default Home;
