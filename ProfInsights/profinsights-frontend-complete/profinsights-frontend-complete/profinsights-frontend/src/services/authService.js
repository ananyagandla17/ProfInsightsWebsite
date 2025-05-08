import api from './api';

const authService = {
  // Login function - returns the user data and token
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Faculty Login function
  facultyLogin: async (credentials) => {
    try {
      console.log('Attempting faculty login with:', credentials);
      const response = await api.post('/api/auth/faculty-login', credentials);
      console.log('Faculty login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Faculty login error:', error);
      throw error;
    }
  },

  // Logout function - clears local storage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Register function
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current logged in user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

export default authService;