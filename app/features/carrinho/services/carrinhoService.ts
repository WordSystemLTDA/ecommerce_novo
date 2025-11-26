import type { Produto } from "~/features/produto/types";
import apiClient from "~/services/api";

export const carrinhoService = {
    listar: async (id_cliente: string) => {
        const { data } = await apiClient.get<Produto | undefined>(`/carrinho/${id_cliente}`);
        return data;
    },
};