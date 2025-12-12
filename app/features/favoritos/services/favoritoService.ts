import api from "~/services/api";
import type { Produto } from "../../produto/types";

export interface FavoritosResponse {
    produtos: Produto[];
    total: number;
}

export const favoritoService = {
    listar: async (idCliente: number, page: number = 1): Promise<FavoritosResponse> => {
        const response = await api.get(`/favoritos/${idCliente}?page=${page}`);
        return response.data['data'];
    },

    adicionar: async (idCliente: number, idProduto: number): Promise<void> => {
        await api.post(`/favoritos/${idProduto}`, { id_cliente: idCliente });
    },

    remover: async (idCliente: number, idProduto: number): Promise<void> => {
        await api.delete(`/favoritos/${idProduto}`, { data: { id_cliente: idCliente } });
    },

    verificar: async (idCliente: number, idProduto: number): Promise<boolean> => {
        const response = await api.get(`/favoritos/verificar/${idProduto}/${idCliente}`);
        return response.data.data.favorito;
    },

    contar: async (idCliente: number): Promise<number> => {
        const response = await api.get(`/favoritos/contar/${idCliente}`);
        console.log("Resposta contar favoritos:", response.data);
        return response.data.data.total;
    }
};
