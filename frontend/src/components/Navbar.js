import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/admin-status`);
        const adminStatus = response.data?.data || response.data;
        setAdminExists(Boolean(adminStatus?.admin_exists));
      } catch (error) {
        console.error('Failed to fetch admin status:', error);
      }
    };

    fetchAdminStatus();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛍️ ShopHub
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/cart" className="nav-link">
            Cart <span className="cart-badge">{getTotalItems()}</span>
          </Link>
          {user ? (
            <div className="nav-user">
              <span className="user-name">
                {user.first_name} {user.last_name}
              </span>
              {user.is_shop_owner && (
                <Link to="/admin/dashboard" className="nav-link admin-link">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Signup</Link>
              {!adminExists && (
                <Link to="/admin-register" className="nav-link admin-register">
                  Admin Register
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
