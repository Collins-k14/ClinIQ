const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls with Clerk auth
const apiCall = async (endpoint, options = {}) => {
  // Get Clerk session token
  const token = await window.Clerk?.session?.getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
};

// Fetch facilities with filters
export const fetchFacilities = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.type && filters.type !== 'All') {
    queryParams.append('type', filters.type);
  }
  if (filters.verifiedOnly) {
    queryParams.append('verified', 'true');
  }
  if (filters.twentyFourHour) {
    queryParams.append('twentyFourHour', 'true');
  }
  if (filters.nearbyOnly) {
    queryParams.append('maxDistance', '5');
  }
  
  // Get user's current location
  if (navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000
        });
      });
      queryParams.append('lat', position.coords.latitude);
      queryParams.append('lng', position.coords.longitude);
    } catch (err) {
      console.warn('Location access denied or unavailable');
    }
  }

  const query = queryParams.toString();
  const endpoint = `/facilities${query ? `?${query}` : ''}`;
  
  return apiCall(endpoint);
};

// Fetch facility profile (for logged-in facility owner)
export const fetchFacilityProfile = async () => {
  return apiCall('/facility/profile');
};

// Update facility profile
export const updateFacilityProfile = async (profileData) => {
  return apiCall('/facility/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

// Upgrade facility plan
export const upgradeFacilityPlan = async (planId) => {
  return apiCall('/facility/upgrade', {
    method: 'POST',
    body: JSON.stringify({ planId }),
  });
};

// Book appointment
export const bookAppointment = async (facilityId, appointmentData) => {
  return apiCall(`/facilities/${facilityId}/appointments`, {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
};

export default {
  fetchFacilities,
  fetchFacilityProfile,
  updateFacilityProfile,
  upgradeFacilityPlan,
  bookAppointment,
};