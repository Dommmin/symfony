import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

export const useInitAuth = () => {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['currentUser'],
        queryFn: authService.getCurrentUser,
        enabled: !!token,
        retry: false,
        staleTime: Infinity,
    });
};
