import api from './api';

export const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Get health recommendations based on profile
  getRecommendations: async () => {
    try {
      const response = await api.get('/user/recommendations');
      return response.data;
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }
};