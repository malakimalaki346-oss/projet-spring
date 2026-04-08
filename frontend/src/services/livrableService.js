import api from './api';

const livrableService = {
    getByPhase: async (phaseId) => {
        const response = await api.get(`/phases/${phaseId}/livrables`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/livrables/${id}`);
        return response.data;
    },

    create: async (phaseId, data) => {
        const response = await api.post(`/phases/${phaseId}/livrables`, data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/livrables/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/livrables/${id}`);
        return response.data;
    }
};

export default livrableService;