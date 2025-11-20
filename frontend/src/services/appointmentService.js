import api from './api';

export const appointmentService = {
  // Get appointments for logged-in user
  getUserAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  // Get facility appointments (for facility accounts)
  getFacilityAppointments: async (facilityId) => {
    const response = await api.get(`/appointments/facility/${facilityId}`);
    return response.data;
  },

  // Create appointment
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  },

  // Get available slots for a facility on a specific date
  getAvailableSlots: async (facilityId, date) => {
    const response = await api.get(`/appointments/slots/${facilityId}`, {
      params: { date }
    });
    return response.data;
  }
};

export default appointmentService;
