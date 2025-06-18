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
        onError: (error) => {
            console.error('Login error:', error);
            toast.error('Błąd logowania. Sprawdź dane i spróbuj ponownie.');
        },
    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            toast.success('Konto zostało utworzone. Możesz się teraz zalogować.');
            navigate('/login');
        },
        onError: () => {
            toast.error('Błąd rejestracji. Spróbuj ponownie.');
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
