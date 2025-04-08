import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authApi from '../../api/authApi';

export default function GuestGuard() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        let unsubscribe;
        const setupAuth = () => {
            unsubscribe = authApi.onAuthStateChange((user) => {
                setIsAuthenticated(!!user);
            });
        };

        setupAuth();

        return () => {
            unsubscribe?.();
        };
    }, []);

    if (isAuthenticated === null) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}