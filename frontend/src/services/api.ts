import { useAuthStore } from '@/features/auth/stores/authStore';
import type {
    AuthResponse,
    CreateIssueDto,
    CreateTechnicianDto,
    Issue,
    LoginDto,
    RegisterDto,
    Technician,
    UpdateIssueDto,
    UpdateTechnicianDto,
    User
} from '@/types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://api.symfony.local';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

const api = axios.create({
    baseURL: `${API_URL}/${API_VERSION}`,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
});

// Add token to requests if it exists in authStore
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().setToken(null);
            useAuthStore.getState().setUser(null);
            // Nie przekierowujemy tutaj - pozwalamy komponentom obsłużyć błąd
        }
        return Promise.reject(error);
    },
);

export const authApi = {
    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/login', data);
        return response.data;
    },

    register: async (data: RegisterDto): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/register', data);
        return response.data;
    },

    me: async (): Promise<User> => {
        const response = await api.get<User>('/me');
        return response.data;
    },
};

export const issuesApi = {
    getIssues: async (): Promise<Issue[]> => {
        const response = await api.get<{ items: Issue[] }>('/issues');
        return response.data.items;
    },

    getIssue: async (id: number): Promise<Issue> => {
        const response = await api.get<Issue>(`/issues/${id}`);
        return response.data;
    },

    createIssue: async (data: CreateIssueDto): Promise<Issue> => {
        const response = await api.post<Issue>('/issues', data);
        return response.data;
    },

    updateIssue: async (id: number, data: UpdateIssueDto): Promise<Issue> => {
        const response = await api.patch<Issue>(`/issues/${id}`, data);
        return response.data;
    },
};

export const techniciansApi = {
    getTechnicians: async (): Promise<Technician[]> => {
        const response = await api.get<{ items: Technician[] }>('/technicians');
        return response.data.items;
    },

    getTechnician: async (id: number): Promise<Technician> => {
        const response = await api.get<Technician>(`/technicians/${id}`);
        return response.data;
    },

    createTechnician: async (data: CreateTechnicianDto): Promise<Technician> => {
        const response = await api.post<Technician>('/technicians', data);
        return response.data;
    },

    updateTechnician: async (id: number, data: UpdateTechnicianDto): Promise<Technician> => {
        const response = await api.patch<Technician>(`/technicians/${id}`, data);
        return response.data;
    },

    deleteTechnician: async (id: number): Promise<void> => {
        await api.delete(`/technicians/${id}`);
    },
};

export default api;
