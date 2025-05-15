// src/utils/axiosConfig.js
import axios from 'axios';

// Create axios instance with default configuration
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
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
    if (error.response && error.response.status === 401) {
      // Clear token on auth error
      //localStorage.removeItem('token');
      
      // Redirect to login page if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;