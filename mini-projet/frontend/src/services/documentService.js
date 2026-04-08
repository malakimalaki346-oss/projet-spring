import api from './api';

const documentService = {
    getByProjet: async (projetId) => {
        const response = await api.get(`/projets/${projetId}/documents`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    },

    create: async (projetId, formData) => {
        const response = await api.post(`/projets/${projetId}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/documents/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    },

    download: async (id) => {
        const response = await api.get(`/documents/${id}/download`, {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default documentService;