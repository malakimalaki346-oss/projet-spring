import api from './api';

const AFFECTATION_URL = '/api';

const affectationService = {
    getByPhase: async (phaseId) => {
        const response = await api.get(`${AFFECTATION_URL}/phases/${phaseId}/employes`);
        return response.data;
    },

    getByEmploye: async (employeId) => {
        const response = await api.get(`${AFFECTATION_URL}/employes/${employeId}/phases`);
        return response.data;
    },

    getOne: async (phaseId, employeId) => {
        const response = await api.get(`${AFFECTATION_URL}/phases/${phaseId}/employes/${employeId}`);
        return response.data;
    },

    create: async (phaseId, employeId, data) => {
        const response = await api.post(`${AFFECTATION_URL}/phases/${phaseId}/employes/${employeId}`, data);
        return response.data;
    },

    update: async (phaseId, employeId, data) => {
        const response = await api.put(`${AFFECTATION_URL}/phases/${phaseId}/employes/${employeId}`, data);
        return response.data;
    },

    delete: async (phaseId, employeId) => {
        const response = await api.delete(`${AFFECTATION_URL}/phases/${phaseId}/employes/${employeId}`);
        return response.data;
    }
};

export default affectationService;