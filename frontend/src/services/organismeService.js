import api from './api';

const ORGANISME_URL = '/organismes';

const organismeService = {
    getAll: async () => {
        const response = await api.get(ORGANISME_URL);
        return response.data;
    }
};

export default organismeService;