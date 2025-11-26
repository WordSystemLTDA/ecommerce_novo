import apiClient from "~/services/api";
import type { ProdutoResponse, ProdutosResponse } from "../types";


export const produtoService = {
    listarProduto: async (id: string) => {
        const { data } = await apiClient.get<ProdutoResponse>(`/produtos/${id}`);

        return data;
    },

    listarProdutos: async () => {
        const { data } = await apiClient.get<ProdutosResponse>('/produtos');
        return data;
    },
};