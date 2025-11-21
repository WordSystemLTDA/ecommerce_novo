// app/components/features/auth/services/authService.ts

import apiClient from "~/services/api";
import type { Produtos } from "../types";
import type { Categoria } from "~/features/categoria/types";

export const homeService = {
    listarProdutos: async () => {
        const { data } = await apiClient.get<Produtos>('/produtos');
        return data;
    },

    listarCategorias: async () => {
        const { data } = await apiClient.get<Categoria[]>('/categorias');
        return data;
    },

    listarCategoriasComSubCategorias: async () => {
        const { data } = await apiClient.get<Categoria[]>('/categorias?with_subcategories');
        return data;
    },
};