import { useAuthStore } from '@/features/auth/stores/authStore';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
