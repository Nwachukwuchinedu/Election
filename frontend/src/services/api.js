import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || { message: 'Network error' });
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.post('/auth/verify-token')
};

export const candidatesAPI = {
  getAll: () => api.get('/candidates'),
  getById: (id) => api.get(`/candidates/${id}`)
};

export const votesAPI = {
  castVote: (voteData) => api.post('/voters/votes', voteData),
  getMyVotes: () => api.get('/voters/votes/my-votes')
};

export const adminAPI = {
  getVoters: (filters) => api.get('/admin/voters', { params: filters }),
  getAllVoters: () => api.get('/admin/voters/all'),
  getVoteStats: () => api.get('/admin/vote-stats'),
  searchVoters: (searchParams) => api.get('/admin/voters/search', { params: searchParams })
};

export default api;