import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kanban_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/registration', userData);
      
      const token = response.data.access_token || response.data.token;
      
      console.log('Ответ регистрации:', response.data);
      
      const user = {
        email: userData.email,
        name: response.data.name || userData.name, 
        id: response.data.userId || response.data.id
      };
      
      console.log('Сохраняем пользователя:', user);
      
      if (token) {
        localStorage.setItem('kanban_token', token);
        localStorage.setItem('kanban_user', JSON.stringify(user));
      }
      
      return {
        success: true,
        data: { user, token }
      };
      
    } catch (error) {
      console.error('Ошибка регистрации:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка при регистрации'
      };
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      const token = response.data.access_token || response.data.token;
     
      console.log('Ответ входа:', response.data);
      
      const user = {
        email: credentials.email,
        name: response.data.name || 
              response.data.user?.name || 
              credentials.email.split('@')[0], 
        id: response.data.userId || response.data.id || response.data.user?.id
      };
      
      console.log('Сохраняем пользователя:', user);
      
      if (token) {
        localStorage.setItem('kanban_token', token);
        localStorage.setItem('kanban_user', JSON.stringify(user));
      }
      
      return {
        success: true,
        data: { user, token }
      };
      
    } catch (error) {
      console.error('Ошибка входа:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Неверный email или пароль'
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка при входе'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('kanban_token');
    localStorage.removeItem('kanban_user');
  },

  getUser: () => {
    const userStr = localStorage.getItem('kanban_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('kanban_token');
  }
};