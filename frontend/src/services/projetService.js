import api from './api';

const PROJET_URL = '/projets';

const projetService = {
    getAllList: async () => {
        try {
            const response = await api.get(PROJET_URL);
            console.log('API getAllList response:', response.data);
            return response.data || [];
        } catch (error) {
            console.error('Erreur getAllList:', error);
            return [];
        }
    },

    getById: async (id) => {
        const response = await api.get(`${PROJET_URL}/${id}`);
        return response.data;
    },

    getResume: async (id) => {
        const response = await api.get(`${PROJET_URL}/${id}/resume`);
        return response.data;
    },

    create: async (projetData) => {
        const response = await api.post(PROJET_URL, projetData);
        return response.data;
    },

    update: async (id, projetData) => {
        const response = await api.put(`${PROJET_URL}/${id}`, projetData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`${PROJET_URL}/${id}`);
        return response.data;
    }
};

export default projetService;