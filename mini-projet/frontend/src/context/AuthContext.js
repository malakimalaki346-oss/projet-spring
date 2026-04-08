import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (login, password) => {
        try {
            const data = await authService.login(login, password);
            setUser({
                id: data.id,
                login: data.login,
                nom: data.nom,
                prenom: data.prenom,
                email: data.email,
                role: data.role
            });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Erreur de connexion' };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAuthenticated = () => {
        return authService.isAuthenticated();
    };

    const hasRole = (role) => {
        if (!user) return false;
        return user.role === `ROLE_${role}` || user.role === role;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
};