// app/components/features/auth/services/authService.ts

import apiClient from "~/services/api";
import type { LoginRequest, LoginResponse } from "../types";

export const authService = {
    login: async (credentials: LoginRequest) => {
        const { data } = await apiClient.post<LoginResponse>('/autenticacao/entrar.php', credentials);
        return data;
    },

    register: async (userData: any) => {
        const { data } = await apiClient.post('/autenticacao/registrar.php', userData);
        return data;
    },
};