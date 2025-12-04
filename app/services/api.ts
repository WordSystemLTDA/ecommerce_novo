import axios from 'axios';
import { toast } from 'react-toastify';
import config from '~/config/config';

const apiClient = axios.create({
    baseURL: config.API,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Empresas-IDs': config.EMPRESAS.join(','),
    },
});


apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const payload = error.response?.data || error.message;
        var error = payload['error'];
        toast.error(error, { position: 'top-center' });

        return Promise.reject({
            sucesso: false,
            error: payload,
            originalError: error,
        });
    }
);

export default apiClient;
