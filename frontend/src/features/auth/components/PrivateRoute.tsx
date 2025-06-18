import { useAuthStore } from '@/features/auth/stores/authStore';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
