import { Navigate, Outlet } from 'react-router-dom';

export default function GuestGuard() {
    const isAuthenticated = localStorage.getItem('auth'); // Adjust based on your auth logic

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}