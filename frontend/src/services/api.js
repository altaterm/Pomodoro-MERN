import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sessionAPI = {
  // Get all sessions
  getSessions: () => api.get('/sessions'),
  
  // Create new session
  createSession: (sessionData) => api.post('/sessions', sessionData),
  
  // Get statistics
  getStats: () => api.get('/sessions/stats'),
};

export default api;