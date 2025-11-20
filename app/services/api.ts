import axios from 'axios';
import config from '~/config/config';

const apiClient = axios.create({
    baseURL: config.API,
    headers: {
        'Content-Type': 'application/json',
        'X-Empresas-IDs': config.EMPRESAS.join(','),
    },
});

// Interceptor de resposta
apiClient.interceptors.response.use(
    (response) => {
        // keep the AxiosResponse shape but normalize the payload
        response.data = response.data['data'];
        return response;
    },
    (error) => {
        // normalize error payload and reject so callers receive a rejected promise
        const payload = error.response?.data || error.message;

        return Promise.reject({
            sucesso: false,
            error: payload,
            originalError: error,
        });
    }
);

export default apiClient;
