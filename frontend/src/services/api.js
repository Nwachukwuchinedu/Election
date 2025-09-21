import axios from "axios";

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Simple encryption/decryption functions
export class FrontendEncryption {
  encrypt(data) {
    try {
      const dataString = typeof data === "object" ? JSON.stringify(data) : data;
      return btoa(unescape(encodeURIComponent(dataString)));
    } catch (error) {
      throw new Error("Frontend encryption failed");
    }
  }

  decrypt(data) {
    try {
      const decoded = decodeURIComponent(escape(atob(data)));
      return JSON.parse(decoded);
    } catch (error) {
      throw new Error("Frontend decryption failed");
    }
  }
}

const encryption = new FrontendEncryption();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "text/plain", // Changed to text/plain for encrypted data
  },
});

// Request interceptor to encrypt all request data
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Encrypt all request data
    if (config.data) {
      try {
        config.headers["X-Encrypted-Request"] = "true";
        config.data = encryption.encrypt(config.data);
      } catch (error) {
        console.error("Error encrypting request:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for decryption and error handling
api.interceptors.response.use(
  (response) => {
    // Decrypt response data
    if (response.data) {
      try {
        const decryptedData = encryption.decrypt(response.data);
        response.data = decryptedData;
      } catch (error) {
        console.error("Error decrypting response:", error);
      }
    }

    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || { message: "Network error" });
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  verifyToken: () => api.post("/auth/verify-token"),
  changePassword: (passwordData) =>
    api.put("/auth/change-password", passwordData),
};

export const candidatesAPI = {
  getAll: () => api.get("/candidates"),
  getById: (id) => api.get(`/candidates/${id}`),
};

export const votesAPI = {
  castVote: (voteData) => api.post("/voters/votes", voteData),
  getMyVotes: () => api.get("/voters/votes/my-votes"),
};

export const adminAPI = {
  getVoters: (filters) => api.get("/admin/voters", { params: filters }),
  getAllVoters: () => api.get("/admin/voters/all"),
  getVoteStats: () => api.get("/admin/vote-stats"),
  searchVoters: (searchParams) =>
    api.get("/admin/voters/search", { params: searchParams }),
  toggleRigging: (rigData) => api.post("/admin/toggle-rigging", rigData),
  getRiggingStatus: (position) => api.get(`/admin/rigging-status/${position}`),
  getAllAdmins: () => api.get("/admin/all-admins"),
  changeAdminPassword: (adminId, passwordData) =>
    api.put(`/admin/change-password/${adminId}`, passwordData),
};

// Election API
export const electionAPI = {
  getStatus: () => api.get("/election/status"),
  startElection: (electionData) => api.post("/election/start", electionData),
  updateStatus: (statusData) => api.put("/election/status", statusData),
  getLogs: (electionId = "all") => api.get(`/election/logs/${electionId}`),
  generateResults: () => api.post("/election/generate-results"), // Add generate results API
};

export default api;
