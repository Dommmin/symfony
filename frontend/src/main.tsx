import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminRoute } from './features/auth/components/AdminRoute';
import { AuthProvider } from './features/auth/components/AuthProvider';
import { PrivateRoute } from './features/auth/components/PrivateRoute';
import { PublicRoute } from './features/auth/components/PublicRoute';
import './index.css';
import { AdminLayout } from './layouts/AdminLayout';
import { UserLayout } from './layouts/UserLayout';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
});

const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: 'login',
                async lazy() {
                    const { default: Component } = await import('./pages/auth/login');
                    return { Component };
                },
            },
            {
                path: 'register',
                async lazy() {
                    const { default: Component } = await import('./pages/auth/register');
                    return { Component };
                },
            },
        ],
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                element: <UserLayout />,
                children: [
                    {
                        path: '/',
                        element: <div>User Dashboard</div>,
                    },
                    {
                        path: 'dashboard',
                        element: <div>User Dashboard</div>,
                    },
                    {
                        path: 'issues',
                        element: <div>User Issues</div>,
                    },
                    {
                        path: 'issues/new',
                        element: <div>New Issue</div>,
                    },
                ],
            },
        ],
    },
    {
        element: <AdminRoute />,
        children: [
            {
                path: 'admin',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        async lazy() {
                            const { default: Component } = await import('./pages/admin/dashboard');
                            return { Component };
                        },
                    },
                    {
                        path: 'issues',
                        async lazy() {
                            const { default: Component } = await import('./pages/admin/issues');
                            return { Component };
                        },
                    },
                    {
                        path: 'issues/new',
                        async lazy() {
                            const { default: Component } = await import('./pages/admin/issues/new');
                            return { Component };
                        },
                    },
                    {
                        path: 'technicians',
                        element: <div>Technicians</div>,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
                <Toaster position="top-right" />
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>,
);
