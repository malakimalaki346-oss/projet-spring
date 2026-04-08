import api from './api';

const FACTURE_URL = '/factures';

const factureService = {
    getAll: async () => {
        const response = await api.get(FACTURE_URL);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${FACTURE_URL}/${id}`);
        return response.data;
    },

    create: async (factureData) => {
        const response = await api.post(FACTURE_URL, factureData);
        return response.data;
    },

    update: async (id, factureData) => {
        const response = await api.put(`${FACTURE_URL}/${id}`, factureData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`${FACTURE_URL}/${id}`);
        return response.data;
    },

    enregistrerPaiement: async (id) => {
        const response = await api.post(`${FACTURE_URL}/${id}/paiement`);
        return response.data;
    }
};

export default factureService;