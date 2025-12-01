import type { Produto } from "~/features/produto/types";
import apiClient from "~/services/api";
import type { Pagamento, PagamentoResponse } from "~/types/Pagamento";

export const carrinhoService = {
    listar: async (id_cliente: string) => {
        const { data } = await apiClient.get<Produto | undefined>(`/carrinho/${id_cliente}`);
        return data;
    },

    listarPagamentosDisponiveis: async () => {
        const { data } = await apiClient.get<PagamentoResponse>(`/pagamentos`);
        return data;
    },
};