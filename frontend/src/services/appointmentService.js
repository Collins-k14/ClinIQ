import api from './api';
import { getAuth } from '@clerk/clerk-react';

const getAuthHeader = async () => {
  const { getToken } = getAuth();
  const token = await getToken();
  return { Authorization: `Bearer ${token}` };
};

export const appointmentService = {
    // get appointments for logged-in user
  getUserAppointments: async () => {
    const headers = await getAuthHeader();
    const response = await api.get('/appointments', { headers });
    return response.data;
  },
   // Get facility appointments (for facility accounts)
  getFacilityAppointments: async (facilityId) => {
    const headers = await getAuthHeader();
    const response = await api.get(`/appointments/facility/${facilityId}`, { headers });
    return response.data;
  },
   //create appointment
  createAppointment: async (appointmentData) => {
    const headers = await getAuthHeader();
    const response = await api.post('/appointments', appointmentData, { headers });
    return response.data;
  },
   //update appointment
  updateAppointment: async (id, appointmentData) => {
    const headers = await getAuthHeader();
    const response = await api.put(`/appointments/${id}`, appointmentData, { headers });
    return response.data;
  },
   //cancel appointment
  cancelAppointment: async (id) => {
    const headers = await getAuthHeader();
    const response = await api.put(`/appointments/${id}/cancel`, null, { headers });
    return response.data;
  },
    //get available slots for a facility on a specific date
  getAvailableSlots: async (facilityId, date) => {
    const headers = await getAuthHeader();
    const response = await api.get(`/appointments/slots/${facilityId}`, {
      params: { date },
      headers
    });
    return response.data;
  }
};
