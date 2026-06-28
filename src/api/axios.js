import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wms_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Optionally handle global errors like 401 redirect to login here
    if (error.response?.status === 401) {
      localStorage.removeItem('wms_admin_token');
      // window.location.href = '/login'; // Let AuthContext handle it
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
