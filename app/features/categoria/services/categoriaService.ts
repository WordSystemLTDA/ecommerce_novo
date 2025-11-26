// app/components/features/auth/services/authService.ts

import apiClient from "~/services/api";
import type { CategoriaResponse } from "../types";

export const categoriaService = {
    listarCategorias: async () => {
        const { data } = await apiClient.get<CategoriaResponse>('/categorias');
        return data;
    },

    listarCategoriasComSubCategorias: async () => {
        const { data } = await apiClient.get<CategoriaResponse>('/categorias?with_subcategories');
        return data;
    },
};