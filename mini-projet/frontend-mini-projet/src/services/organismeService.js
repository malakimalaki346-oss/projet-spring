import api from './api';

const ORGANISME_URL = '/organismes';

const organismeService = {
    getAll: async () => {
        const response = await api.get(ORGANISME_URL);
        return response.data;
    },

    getAllPaged: async (page = 0, size = 10, sort = 'id,asc') => {
        const response = await api.get(`${ORGANISME_URL}/paged`, {
            params: { page, size, sort }
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${ORGANISME_URL}/${id}`);
        return response.data;
    },

    create: async (organismeData) => {
        const response = await api.post(ORGANISME_URL, organismeData);
        return response.data;
    },

    update: async (id, organismeData) => {
        const response = await api.put(`${ORGANISME_URL}/${id}`, organismeData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`${ORGANISME_URL}/${id}`);
        return response.data;
    },

    searchByNom: async (nom) => {
        const response = await api.get(`${ORGANISME_URL}/search`, {
            params: { nom }
        });
        return response.data;
    }
};

export default organismeService;