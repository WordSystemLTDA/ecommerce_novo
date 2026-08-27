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

const firstString = (...candidates: unknown[]) =>
    candidates.find(
        (candidate): candidate is string =>
            typeof candidate === 'string' && candidate.trim() !== '',
    );

const asObject = (value: unknown): Record<string, unknown> | null =>
    typeof value === 'object' && value !== null
        ? value as Record<string, unknown>
        : null;

const extractApiErrorMessage = (payload: unknown) => {
    if (typeof payload === 'string') {
        return payload.trim() || undefined;
    }

    const root = asObject(payload);
    if (!root) {
        return undefined;
    }

    const data = asObject(root.data);
    const contexto = asObject(data?.contexto);
    const venda = asObject(contexto?.venda);
    const nestedError = asObject(root.error);
    const nestedErrorData = asObject(nestedError?.data);
    const nestedErrorContexto = asObject(nestedErrorData?.contexto);
    const nestedErrorVenda = asObject(nestedErrorContexto?.venda);

    return firstString(
        data?.detalhes,
        venda?.mensagem,
        nestedErrorData?.detalhes,
        nestedErrorVenda?.mensagem,
        root.detalhes,
        root.mensagem,
        root.message,
        typeof root.error === 'string' ? root.error : undefined,
        nestedError?.detalhes,
        nestedError?.mensagem,
        nestedError?.message,
    );
};

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
        const originalError = extractApiErrorMessage(payload);
        // toast.error(error, { position: 'top-center' });

        return Promise.reject({
            sucesso: false,
            error: payload,
            originalError,
        });
    }
);

export default apiClient;
