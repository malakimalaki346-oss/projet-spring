import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Chargement...</div>;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    let hasAccess = false;
    if (allowedRoles && allowedRoles.length > 0) {
        hasAccess = allowedRoles.some(role => hasRole(role));
    } else {
        hasAccess = true;
    }

    if (!hasAccess) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default RoleRoute;