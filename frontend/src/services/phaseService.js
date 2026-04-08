import api from './api';

const PHASE_URL = '/phases';

const phaseService = {
    getByProjet: async (projetId) => {
        const response = await api.get(`/projets/${projetId}/phases`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${PHASE_URL}/${id}`);
        return response.data;
    },

    create: async (projetId, phaseData) => {
        const response = await api.post(`/projets/${projetId}/phases`, phaseData);
        return response.data;
    },

    update: async (id, phaseData) => {
        const response = await api.put(`${PHASE_URL}/${id}`, phaseData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`${PHASE_URL}/${id}`);
        return response.data;
    },

    updateRealisation: async (id, terminee) => {
        const response = await api.patch(`${PHASE_URL}/${id}/realisation?terminee=${terminee}`);
        return response.data;
    },

    updateFacturation: async (id, facturee) => {
        const response = await api.patch(`${PHASE_URL}/${id}/facturation?facturee=${facturee}`);
        return response.data;
    },

    updatePaiement: async (id, payee) => {
        const response = await api.patch(`${PHASE_URL}/${id}/paiement?payee=${payee}`);
        return response.data;
    },

    getTermineesNonFacturees: async () => {
        const response = await api.get(`${PHASE_URL}/terminees-non-facturees`);
        return response.data;
    },

    getFactureesNonPayees: async () => {
        const response = await api.get(`${PHASE_URL}/facturees-non-payees`);
        return response.data;
    }
};

export default phaseService;