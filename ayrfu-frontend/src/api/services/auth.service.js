import axios from 'axios';

// Configure axios interceptors for authentication
const setupAxiosInterceptors = () => {
  // Request interceptor to add auth token to all requests
  axios.interceptors.request.use(
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

  // Response interceptor to handle auth errors (token expired, etc.)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Clear token on authentication error
        //localStorage.removeItem('token');
        // Redirect to login page or dispatch logout action
       // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

const authService = {
  // Initialize interceptors
  init: () => {
    setupAxiosInterceptors();
  },

  // Login with email and password
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user (clear token)
  logout: () => {
    localStorage.removeItem('token');
    // Clear any other stored user data
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated (token exists)
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Get JWT token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;