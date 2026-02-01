import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout for mobile connections
    withCredentials: false, // Avoid CORS issues with credentials
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle network errors gracefully
        if (!error.response) {
            error.message = 'Network error. Please check your connection.';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data: { name: string; email: string; password: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

export const projectAPI = {
    getAll: () => api.get('/projects'),
    getOne: (id: string) => api.get(`/projects/${id}`),
    create: (data: { name: string; description?: string; color?: string }) =>
        api.post('/projects', data),
    update: (id: string, data: any) => api.put(`/projects/${id}`, data),
    delete: (id: string) => api.delete(`/projects/${id}`),
};

export const taskAPI = {
    getAll: (projectId: string) => api.get(`/projects/${projectId}/tasks`),
    getOne: (id: string) => api.get(`/tasks/${id}`),
    create: (projectId: string, data: any) =>
        api.post(`/projects/${projectId}/tasks`, data),
    update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
    delete: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;