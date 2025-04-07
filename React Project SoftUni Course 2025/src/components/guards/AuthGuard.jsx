import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authApi from '../../api/authApi';

export default function AuthGuard() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = authApi.onAuthStateChange((user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    // Show nothing while checking authentication
    if (isAuthenticated === null) {
        return null;
    }

    if (!isAuthenticated) {
        // Redirect to login while saving the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render child routes if authenticated
    return <Outlet />;
}