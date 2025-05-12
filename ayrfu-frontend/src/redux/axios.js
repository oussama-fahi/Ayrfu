// src/redux/axios.js
import axios from 'axios';
import { store } from './store';
import { logout } from './slices/authSlice';

// Create base API URL
const API_URL = '/api';

// Create axios instance for authenticated requests
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add auth token to all requests
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

// Handle response errors globally
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If there's no response, it's a network error
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle 401 Unauthorized errors by logging out the user
    if (error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      
      // Make sure we only dispatch logout once to avoid infinite loops
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        // Dispatch logout action to clear user state
        store.dispatch(logout());
        
        // Notify user with a custom error message
        return Promise.reject(new Error('Your session has expired. Please log in again.'));
      }
    }
    
    // For 403 Forbidden responses
    if (error.response.status === 403) {
      console.error('Permission denied:', error.response.data);
      return Promise.reject(new Error('You do not have permission to perform this action.'));
    }
    
    // For 404 Not Found responses
    if (error.response.status === 404) {
      console.error('Resource not found:', error.response.data);
      return Promise.reject(new Error('The requested resource was not found.'));
    }
    
    // For 422 Validation errors
    if (error.response.status === 422) {
      console.error('Validation error:', error.response.data);
      const validationErrors = error.response.data.errors || {};
      const firstError = Object.values(validationErrors)[0];
      
      return Promise.reject(new Error(firstError ? firstError[0] : 'Validation failed. Please check your input.'));
    }
    
    // For 500 Server errors
    if (error.response.status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject(new Error('A server error occurred. Please try again later.'));
    }
    
    // For any other error
    return Promise.reject(error);
  }
);

export default instance;