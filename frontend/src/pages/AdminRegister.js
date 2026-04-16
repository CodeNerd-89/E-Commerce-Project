import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/admin-status`);
        const adminStatus = response.data?.data || response.data;
        setAdminExists(Boolean(adminStatus?.admin_exists));
      } catch (err) {
        console.error('Admin status error:', err);
      } finally {
        setCheckingStatus(false);
      }
    };

    fetchAdminStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (adminExists) {
      setError('Admin account already exists');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/users`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        is_shop_owner: true,
      });

      console.log('Admin registration response:', response.data);
      setSuccess('Admin account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let message = 'Registration failed';
      
      if (!err.response) {
        if (err.request) {
          message = `Could not reach the backend at ${apiUrl}. Make sure it is running and accessible from the browser.`;
        } else if (err.message) {
          message = err.message;
        }
      } else if (typeof err.response?.data === 'string') {
        message = err.response.data.trim();
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data) {
        message = JSON.stringify(err.response.data);
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Admin Registration</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {checkingStatus ? (
          <div className="loading">Checking admin status...</div>
        ) : adminExists ? (
          <div>
            <div className="error-message">Admin account already exists. New admin registration is disabled.</div>
            <p className="auth-link">
              Use the existing admin account to <Link to="/login">log in</Link>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Doe"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Your password"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
              />
            </div>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating account...' : 'Register as Admin'}
            </button>
          </form>
        )}
        <p className="auth-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
