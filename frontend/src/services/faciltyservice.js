import api from './api';

export const facilityService = {
  // Get all facilities
  getAllFacilities: async (params = {}) => {
    const response = await api.get('/facilities', { params });
    return response.data;
  },
  
  // Get facility by ID
  getFacilityById: async (id) => {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
  },
  
  // Search facilities by location
  searchNearby: async (latitude, longitude, radius = 10, filters = {}) => {
    const response = await api.get('/facilities/nearby', {
      params: {
        latitude,
        longitude,
        radius,
        ...filters
      }
    });
    return response.data;
  },
  
  // Create facility (for facility accounts)
  createFacility: async (facilityData) => {
    const response = await api.post('/facilities', facilityData);
    return response.data;
  },
  
  // Update facility
  updateFacility: async (id, facilityData) => {
    const response = await api.put(`/facilities/${id}`, facilityData);
    return response.data;
  },
  
  // Get facility reviews
  getFacilityReviews: async (facilityId) => {
    const response = await api.get(`/facilities/${facilityId}/reviews`);
    return response.data;
  },
  
  // Add review
  addReview: async (facilityId, reviewData) => {
    const response = await api.post(`/facilities/${facilityId}/reviews`, reviewData);
    return response.data;
  }
};
