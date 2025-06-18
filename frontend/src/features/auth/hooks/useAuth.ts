import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { setToken, setUser } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            setToken(data.token);
            setUser(data.user);
            toast.success('Zalogowano pomyślnie');
            navigate('/', { replace: true });
        },
        onError: (error: any) => {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Nieprawidłowy email lub hasło';
            
            // Jeśli to błąd 401, wyczyść stan autoryzacji
            if (error.response?.status === 401) {
                setToken(null);
                setUser(null);
            }
            
            toast.error(errorMessage, {
                duration: 5000,
                style: {
                    background: '#ef4444',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                },
            });
        },
    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            toast.success('Konto zostało utworzone. Możesz się teraz zalogować.');
            navigate('/login');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Błąd rejestracji. Spróbuj ponownie.';
            toast.error(errorMessage, {
                duration: 5000,
                style: {
                    background: '#ef4444',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                },
            });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            setToken(null);
            setUser(null);
            queryClient.clear();
            toast.success('Wylogowano pomyślnie');
            navigate('/login');
        },
    });

    return {
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    };
};
