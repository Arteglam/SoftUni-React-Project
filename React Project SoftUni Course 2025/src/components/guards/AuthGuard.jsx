import { Navigate, Outlet } from 'react-router-dom';

export default function AuthGuard() {
    const isAuthenticated = localStorage.getItem('auth'); // Adjust based on your auth logic

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}