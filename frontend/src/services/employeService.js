import api from './api';

const EMPLOYE_URL = '/employes';

const employeService = {
    getAll: async () => {
        const response = await api.get(EMPLOYE_URL);
        return response.data;
    },

    getByProfil: async (profilCode) => {
        const response = await api.get(`${EMPLOYE_URL}/profil/${profilCode}`);
        return response.data;
    }
};

export default employeService;