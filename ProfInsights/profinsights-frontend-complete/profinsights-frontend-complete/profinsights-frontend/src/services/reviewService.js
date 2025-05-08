import api from './api';

const reviewService = {
  // Get all reviews
  getAllReviews: async () => {
    try {
      const response = await api.get('/api/reviews');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get reviews for a specific professor
  getProfessorReviews: async (professorId) => {
    try {
      const response = await api.get(`/api/reviews/professor/${professorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get reviews for the logged-in faculty
  getMyReviews: async () => {
    try {
      const response = await api.get('/api/reviews/my-reviews');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add a review
  addReview: async (professorId, reviewData) => {
    try {
      const response = await api.post(`/api/professors/${professorId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/api/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reviewService;