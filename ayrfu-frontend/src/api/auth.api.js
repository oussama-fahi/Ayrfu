import axios from './axios';

const AuthAPI = {
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await axios.get('/auth/profile');
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default AuthAPI;