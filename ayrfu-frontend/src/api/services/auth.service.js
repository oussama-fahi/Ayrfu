import axios from '../axios';

class AuthService {
  login(credentials) {
    return axios.post('/auth/login', credentials)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      });
  }
  
  register(userData) {
    return axios.post('/auth/register', userData);
  }
  
  getCurrentUser() {
    return axios.get('/auth/profile');
  }
  
  logout() {
    localStorage.removeItem('token');
  }
  
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();