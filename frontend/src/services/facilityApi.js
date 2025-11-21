import api from './api'; // your Axios instance

// Fetch facilities with filters
export const fetchFacilities = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.type && filters.type !== 'All') queryParams.append('type', filters.type);
  if (filters.verifiedOnly) queryParams.append('verified', 'true');
  if (filters.twentyFourHour) queryParams.append('twentyFourHour', 'true');
  if (filters.nearbyOnly) queryParams.append('maxDistance', '5');

  // Get user's location
  if (navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      queryParams.append('lat', position.coords.latitude);
      queryParams.append('lng', position.coords.longitude);
    } catch (err) {
      console.warn('Location access denied or unavailable');
    }
  }

  const query = queryParams.toString();
  const endpoint = `/facilities${query ? `?${query}` : ''}`;

  const response = await api.get(endpoint);
  return response.data;
};

// Fetch facility profile
export const fetchFacilityProfile = async () => {
  const response = await api.get('/facility/profile');
  return response.data;
};

// Update facility profile
export const updateFacilityProfile = async (profileData) => {
  const response = await api.put('/facility/profile', profileData);
  return response.data;
};

// Upgrade facility plan
export const upgradeFacilityPlan = async (planId) => {
  const response = await api.post('/facility/upgrade', { planId });
  return response.data;
};

// Book appointment
export const bookAppointment = async (facilityId, appointmentData) => {
  const response = await api.post(`/facilities/${facilityId}/appointments`, appointmentData);
  return response.data;
};

export default {
  fetchFacilities,
  fetchFacilityProfile,
  updateFacilityProfile,
  upgradeFacilityPlan,
  bookAppointment,
};
