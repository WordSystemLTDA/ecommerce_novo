import apiClient from "~/services/api";
import type { Produto } from "../types";

export const produtoService = {
    listarProduto: async (id: string) => {
        const { data } = await apiClient.get<Produto | undefined>(`/produtos/${id}`);
        return data;
    },
};