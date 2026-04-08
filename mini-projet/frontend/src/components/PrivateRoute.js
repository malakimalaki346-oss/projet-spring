import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole } = useAuth();

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;