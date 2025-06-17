import axios from 'axios';
import type { AuthResponse, CreateIssueDto, Issue, LoginDto, RegisterDto, UpdateIssueDto, User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://api.symfony.local';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

const api = axios.create({
  baseURL: `${API_URL}/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    const response = await api.get<Issue[]>('/issues');
    return response.data;
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
  getTechnicians: async () => {
    const response = await api.get('/technicians');
    return response.data;
  },
};

export default api; 