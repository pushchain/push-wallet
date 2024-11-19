// src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000',
})

// Add a request interceptor to include the JWT in headers
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('jwt'); // or localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api
