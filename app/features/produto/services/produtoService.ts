import apiClient from "~/services/api";
import type { CalculcarFreteResponse, Produto, ProdutoResponse, ProdutosResponse } from "../types";

export const produtoService = {
    listarProduto: async (id: string) => {
        const { data } = await apiClient.get<ProdutoResponse>(`/produtos/${id}`);

        return data;
    },

    listarProdutos: async (filtros: string) => {
        const { data } = await apiClient.get<ProdutosResponse>(filtros.length <= 0 ? '/produtos' : `/produtos?${filtros}`);
        return data;
    },

    calcularFrete: async (cepDestino: string, produtos: Produto[]) => {
        const response = await apiClient.post<CalculcarFreteResponse>('/produtos/calcular_frete', {
            'cepDestino': cepDestino,
            'produtos': produtos,
        });

        return response.data;
    },
};