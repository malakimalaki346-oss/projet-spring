import api from './api';

const EMPLOYE_URL = '/employes';

const employeService = {
    getAll: async () => {
        const response = await api.get(EMPLOYE_URL);
        return response.data;
    },

    getAllPaged: async (page = 0, size = 10, sort = 'id,asc') => {
        const response = await api.get(`${EMPLOYE_URL}/paged`, {
            params: { page, size, sort }
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${EMPLOYE_URL}/${id}`);
        return response.data;
    },

    create: async (employeData) => {
        const response = await api.post(EMPLOYE_URL, employeData);
        return response.data;
    },

    update: async (id, employeData) => {
        const response = await api.put(`${EMPLOYE_URL}/${id}`, employeData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`${EMPLOYE_URL}/${id}`);
        return response.data;
    },

    getByProfil: async (profilCode) => {
        const response = await api.get(`${EMPLOYE_URL}/profil/${profilCode}`);
        return response.data;
    },

    getDisponibles: async (dateDebut, dateFin) => {
        const response = await api.get(`${EMPLOYE_URL}/disponibles`, {
            params: { dateDebut, dateFin }
        });
        return response.data;
    }
};

export default employeService;