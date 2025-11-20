// app/components/features/auth/services/authService.ts

import apiClient from "~/services/api";
import type { Produtos } from "../types";

export const homeService = {
    listarProdutos: async () => {
        const { data } = await apiClient.get<Produtos>('/produtos?');
        return data;
    },

    listarCategorias: async () => {
        const { data } = await apiClient.get<Produtos>('/produtos/listar.php');
        return data;
    },
};