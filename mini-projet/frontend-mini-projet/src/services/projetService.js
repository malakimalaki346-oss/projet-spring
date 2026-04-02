import api from './api';

const PROJET_URL = '/projets';

const projetService = {
    getAll: async (page = 0, size = 10, sort = 'id,asc') => {
        const response = await api.get(`${PROJET_URL}/paged`, {
            params: { page, size, sort }
        });
        return response.data;
    },

    getAllList: async () => {
        const response = await api.get(PROJET_URL);
        return response.data;
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
    },

    getByChef: async (chefId) => {
        const response = await api.get(`${PROJET_URL}/chef/${chefId}`);
        return response.data;
    },

    getByOrganisme: async (organismeId) => {
        const response = await api.get(`${PROJET_URL}/organisme/${organismeId}`);
        return response.data;
    },

    verifierMontantPhases: async (id) => {
        const response = await api.get(`${PROJET_URL}/${id}/verifier-montant`);
        return response.data;
    }
};

export default projetService;