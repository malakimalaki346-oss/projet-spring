import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && user?.role !== `ROLE_${requiredRole}` && user?.role !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;