// src/utils/axiosConfig.js
import axios from 'axios';

const API_URL = '/api';

// Create an axios instance with base URL
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
    if (error.response && error.response.status === 401) {
      // Clear token on auth error
      localStorage.removeItem('token');
      // Could redirect to login page here
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;