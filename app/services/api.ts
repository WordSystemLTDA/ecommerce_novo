import axios from 'axios';
import { toast } from 'react-toastify';
import config from '~/config/config';

const apiClient = axios.create({
    baseURL: config.API,
    withCredentials: true,
    timeout: 45000,
    timeoutErrorMessage: 'A API demorou para responder. Tente novamente.',
    headers: {
        'Content-Type': 'application/json',
        'X-Empresas-IDs': config.EMPRESAS.join(','),
    },
});

// Interceptor para adicionar o Token Bearer
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const payload = error.response?.data || error.message || 'A API demorou para responder. Tente novamente.';
        const originalError = typeof payload === 'string'
            ? payload
            : payload?.error || payload?.message || payload?.mensagem;
        // toast.error(error, { position: 'top-center' });

        return Promise.reject({
            sucesso: false,
            error: payload,
            originalError,
        });
    }
);

export default apiClient;
