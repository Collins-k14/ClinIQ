import api from './api';

export const symptomService = {
  // Check symptoms
  checkSymptoms: async (symptomsData) => {
    const response = await api.post('/symptoms/check', symptomsData);
    return response.data;
  },
  
  // Get symptom history
  getSymptomHistory: async () => {
    const response = await api.get('/symptoms/history');
    return response.data;
  },
  
  // Get symptom check by ID
  getSymptomCheckById: async (id) => {
    const response = await api.get(`/symptoms/${id}`);
    return response.data;
  },
  
  // Get common symptoms
  getCommonSymptoms: async () => {
    const response = await api.get('/symptoms/common');
    return response.data;
  }
};