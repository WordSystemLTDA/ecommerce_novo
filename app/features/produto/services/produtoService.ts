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

    listarFiltros: async () => {
        const { data } = await apiClient.get<any>('/produtos/filtros');
        return data;
    },

    toggleAvisoEstoque: async (id_produto: number, id_cliente: number) => {
        const { data } = await apiClient.post<any>('/produtos/aviso_estoque/toggle', {
            id_produto,
            id_cliente
        });
        return data['data']; // expected { status: boolean, message: string }
    },

    verificarAvisoEstoque: async (id_produto: number, id_cliente: number) => {
        const { data } = await apiClient.get<any>(`/produtos/aviso_estoque/verificar/${id_produto}/${id_cliente}`);
        return data['data']; // expected { status: boolean }
    },
};