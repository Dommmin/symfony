import { useAuthStore } from '@/features/auth/stores/authStore';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminRoute = () => {
    const isAdmin = useAuthStore((state) => state.isAdmin);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
