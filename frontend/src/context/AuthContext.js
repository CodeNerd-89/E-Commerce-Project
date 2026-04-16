import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const decodeJwtPayload = (token) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch (error) {
    console.error('Unable to decode JWT payload:', error);
    return null;
  }
};

const parseAuthResponse = (data) => {
  if (typeof data === 'string') {
    const payload = decodeJwtPayload(data);

    return {
      token: data,
      user: payload
        ? {
            id: payload.sub,
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            is_shop_owner: payload.is_shop_owner,
          }
        : null,
    };
  }

  const authData = data?.data || data || {};
  if (typeof authData === 'string') {
    return parseAuthResponse(authData);
  }

  return {
    token: authData.token || null,
    user: authData.user || null,
  };
};

const getApiErrorMessage = (error, fallbackMessage) => {
  if (!error.response) {
    if (error.request) {
      return `Could not reach the backend at ${apiUrl}. Make sure it is running and accessible from the browser.`;
    }

    return error.message || fallbackMessage;
  }

  const { data } = error.response;
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }

  return fallbackMessage;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${apiUrl}/users/login`,
        { email, password }
      );
      const { token, user } = parseAuthResponse(response.data);
      
      if (!token) {
        throw new Error('No token received from server');
      }
      if (!user) {
        throw new Error('No user data received from server');
      }

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true, user };
    } catch (error) {
      console.error('Login API error:', error);

      return {
        success: false,
        message: getApiErrorMessage(error, 'Login failed'),
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/users`,
        userData
      );
      const { token, user } = response.data.data || response.data;
      
      // If token not returned, let user login
      if (!token) {
        return { success: true, message: 'Signup successful! Please login.' };
      }

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true, user };
    } catch (error) {
      console.error('Signup API error:', error);

      return {
        success: false,
        message: getApiErrorMessage(error, 'Signup failed'),
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
