import axios from '../../../utils/axios';
import { useAuthStore } from '../stores/authStore';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    roles: string[];
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>('/v1/login', credentials);
    
    if (!data.token) {
      throw new Error('No token received from server');
    }
    
    useAuthStore.getState().setUser(data.user);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    await axios.post('/v1/register', {
      email: credentials.email,
      password: credentials.password,
    });
  },

  async logout(): Promise<void> {
    await axios.post('/v1/logout');
  },

  async getCurrentUser(): Promise<LoginResponse['user']> {
    const { data } = await axios.get<LoginResponse['user']>('/v1/me');
    useAuthStore.getState().setUser(data);
    return data;
  },
}; 