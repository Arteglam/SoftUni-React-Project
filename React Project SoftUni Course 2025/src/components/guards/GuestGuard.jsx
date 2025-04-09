import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function GuestGuard() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}