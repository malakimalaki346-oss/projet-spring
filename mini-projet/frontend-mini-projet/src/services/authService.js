import api from './api';

const AUTH_URL = '/auth';

const authService = {
    login: async (login, password) => {
        try {
            const response = await api.post(`${AUTH_URL}/login`, { login, password });
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('user', JSON.stringify({
                    id: response.data.id,
                    login: response.data.login,
                    nom: response.data.nom,
                    prenom: response.data.prenom,
                    email: response.data.email,
                    role: response.data.role
                }));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    getToken: () => {
        return localStorage.getItem('accessToken');
    },

    isAuthenticated: () => {
        return localStorage.getItem('accessToken') !== null;
    },

    hasRole: (role) => {
        const user = authService.getCurrentUser();
        if (!user) return false;
        return user.role === `ROLE_${role}` || user.role === role;
    },

    changePassword: async (oldPassword, newPassword, confirmPassword) => {
        const response = await api.post(`${AUTH_URL}/change-password`, {
            oldPassword,
            newPassword,
            confirmPassword
        });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get(`${AUTH_URL}/me`);
        return response.data;
    }
};

export default authService;