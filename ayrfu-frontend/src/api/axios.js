// src/api/axios.js
import axios from 'axios';

// Base API URL - ideally from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to all requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration or other auth errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if error is due to authentication issues
    if (error.response && error.response.status === 401) {
      // Clear token on auth error
      localStorage.removeItem('token');
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        // Store the page the user was trying to access
        sessionStorage.setItem('redirectPath', window.location.pathname);
        
        // Redirect to login
        window.location.href = '/login';
      }
    }
    
    // Return error for handling by the calling code
    return Promise.reject(error);
  }
);

export default instance;