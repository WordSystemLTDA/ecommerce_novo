

import { toast } from "react-toastify";
import apiClient from "~/services/api";
import type { EntrarRequest, EntrarResponse, RegistrarRequest } from "../types";

export const authService = {
    eu: async () => {
        const { data } = await apiClient.get<EntrarResponse>('/auth/eu');

        return data;
    },

    sair: async () => {
        const { data } = await apiClient.post('/auth/sair');

        return data;
    },

    entrar: async (credentials: EntrarRequest) => {
        const { data } = await apiClient.post<EntrarResponse>('/auth/entrar', credentials);

        if (data.sucesso) {
            // toast.success(data.mensagem, { position: 'top-center' });
            window.location.href = "/";
        }

        return data;
    },

    registrar: async (userData: RegistrarRequest) => {
        const { data } = await apiClient.post('/auth/registrar', userData);

        if (data.sucesso) {
            toast.error(data.mensagem, { position: 'top-center' });
        }

        return data;
    },
};