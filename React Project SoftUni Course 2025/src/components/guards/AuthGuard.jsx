import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import authApi from '../../api/authApi';

export default function AuthGuard() {
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
        return (
            <Box display="flex" justifyContent="center" m={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}