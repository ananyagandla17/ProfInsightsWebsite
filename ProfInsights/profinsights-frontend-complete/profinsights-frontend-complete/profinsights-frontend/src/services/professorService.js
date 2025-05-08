import api from './api';

const professorService = {
  // Get all professors
  getAllProfessors: async () => {
    try {
      const response = await api.get('/api/professors');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific professor by ID
  getProfessorById: async (id) => {
    try {
      const response = await api.get(`/api/professors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // For faculty dashboard - get professor's own profile and reviews
  getDashboardData: async () => {
    try {
      const response = await api.get('/api/professors/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update professor profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/professors/me', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default professorService;