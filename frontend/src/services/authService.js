import api from './api';

const authService = {
    login: async (login, password) => {
        console.log('Login attempt with:', login);
        console.log('Type of login:', typeof login);


        const payload = {
            login: String(login).trim(),
            password: String(password)
        };
        console.log('Payload being sent:', payload);

        try {
            const response = await api.post('/auth/login', payload);
            console.log('Login response:', response.data);

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
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return localStorage.getItem('accessToken') !== null;
    }
};

export default authService;