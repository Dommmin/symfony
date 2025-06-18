import { authApi } from '@/services/api';
import { useAuthStore } from '../stores/authStore';
import type { LoginDto, RegisterDto, User } from '@/types';

export const authService = {
  async login(credentials: LoginDto) {
    const data = await authApi.login(credentials);
    
    if (!data.token) {
      throw new Error('No token received from server');
    }
    
    useAuthStore.getState().setToken(data.token);
    useAuthStore.getState().setUser(data.user);
    return data;
  },

  async register(credentials: RegisterDto) {
    const data = await authApi.register({
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      password: credentials.password,
    });
    
    useAuthStore.getState().setToken(data.token);
    useAuthStore.getState().setUser(data.user);
    return data;
  },

  async logout(): Promise<void> {
    useAuthStore.getState().setToken(null);
    useAuthStore.getState().setUser(null);
  },

  async getCurrentUser(): Promise<User> {
    const data = await authApi.me();
    useAuthStore.getState().setUser(data);
    return data;
  },
}; 
