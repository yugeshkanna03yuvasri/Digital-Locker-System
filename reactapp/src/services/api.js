import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config.data);
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url, response.data);
    return response;
  },
  async (error) => {
    console.error('❌ API Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  logout: (refreshToken, revokeAll = false) => 
    api.post('/auth/logout', { refreshToken, revokeAll }),
  
  getMe: () => 
    api.get('/auth/me'),
  
  signup: (name, email, password, role = 'USER', additionalData = {}) => 
    api.post('/users/signup', { 
      name, 
      email, 
      password, 
      role,
      phone: additionalData.phone,
      company: additionalData.company,
      jobTitle: additionalData.jobTitle,
      adminCode: additionalData.adminCode
    })
};

// User API
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// Document API
export const documentAPI = {
  getAllDocuments: () => api.get('/documents'),
  getDocumentById: (id) => api.get(`/documents/${id}`),
  uploadDocument: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadDocument: (id) => api.get(`/documents/${id}/download`, {
    responseType: 'blob'
  }),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
  updateDocument: (id, documentData) => api.put(`/documents/${id}`, documentData),
  renameDocument: (id, newName) => api.put(`/documents/${id}/rename`, { name: newName }),
  setPassword: (id, password) => api.put(`/documents/${id}/password`, { password }),
  removePassword: (id) => api.delete(`/documents/${id}/password`),
  verifyPassword: (id, password) => api.post(`/documents/${id}/verify-password`, { password })
};

// Folder API
export const folderAPI = {
  getAllFolders: () => api.get('/folders'),
  getFolderById: (id) => api.get(`/folders/${id}`),
  createFolder: (folderData) => api.post('/folders', folderData),
  updateFolder: (id, folderData) => api.put(`/folders/${id}`, folderData),
  deleteFolder: (id) => api.delete(`/folders/${id}`),
  setPassword: (id, password) => api.put(`/folders/${id}/password`, { password }),
  removePassword: (id) => api.delete(`/folders/${id}/password`),
  verifyPassword: (id, password) => api.post(`/folders/${id}/verify-password`, { password })
};

// Activity Log API
export const activityAPI = {
  getAllLogs: () => api.get('/activity'),
  getUserLogs: () => api.get('/activity/user'),
  recordActivity: (action, details) => api.post('/activity/record', { action, details }),
  getLogsByFile: (fileId) => api.get(`/activity/file/${fileId}`)
};

// OTP API
export const otpAPI = {
  sendOTP: () => api.post('/otp/send'),
  verifyOTP: (otp) => api.post('/otp/verify', { otp })
};

// User Settings API
export const userSettingsAPI = {
  getSecurityPreference: () => api.get('/user/settings/security-preference'),
  updateSecurityPreference: (securityPreference, twoFactorEnabled) => 
    api.put('/user/settings/security-preference', { securityPreference, twoFactorEnabled })
};

export default api;