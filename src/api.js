const API_BASE = 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  auth: {
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    register: (data) => request('/auth/register', { method: 'POST', body: data }),
  },
  patients: {
    getAll: () => request('/patients'),
    getById: (id) => request(`/patients/${id}`),
  },
  reports: {
    getByPatient: (patientId) => request(`/reports/${patientId}`),
    addAllergy: (patientId, data) => request(`/reports/${patientId}/allergy`, { method: 'POST', body: data }),
    addPrescription: (patientId, data) => request(`/reports/${patientId}/prescription`, { method: 'POST', body: data }),
    addPriorRecord: (patientId, data) => request(`/reports/${patientId}/prior-record`, { method: 'POST', body: data }),
    addVitals: (patientId, data) => request(`/reports/${patientId}/vitals`, { method: 'POST', body: data }),
  },
  consents: {
    getByPatient: (patientId) => request(`/consents/${patientId}`),
    add: (patientId, data) => request(`/consents/${patientId}`, { method: 'POST', body: data }),
    revoke: (consentId) => request(`/consents/${consentId}/revoke`, { method: 'PUT' }),
  },
  audit: {
    getAll: () => request('/audit'),
    add: (data) => request('/audit', { method: 'POST', body: data }),
  },
};
