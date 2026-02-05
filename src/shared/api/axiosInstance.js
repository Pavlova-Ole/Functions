import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kanban_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kanban_token');
      localStorage.removeItem('kanban_user');
      
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;