import apiClient from "~/services/api";
import type { EnderecoPegarResponse, EnderecoResponse } from "../types";

export const minhacontaService = {
    listarEnderecos: async (id_cliente: number) => {
        const response = await apiClient.get<EnderecoResponse>(`/enderecos/${id_cliente}`);

        return response.data;
    },

    pegarEndereco: async (id: number, id_cliente: number) => {
        const response = await apiClient.get<EnderecoPegarResponse>(`/enderecos/pegar/${id}/${id_cliente}`);
        return response.data;
    },

    cadastrarEndereco: async (dados: any) => {
        const response = await apiClient.post(`/enderecos`, dados);
        return response.data;
    },

    editarEndereco: async (id: number, dados: any) => {
        const response = await apiClient.put(`/enderecos/${id}`, dados);
        return response.data;
    },

    excluirEndereco: async (id: number, id_cliente: number) => {
        const response = await apiClient.delete(`/enderecos/${id}`, {
            params: { id_cliente }
        });
        return response.data;
    },

    listarPedidos: async (id_cliente: number, page = 1, limit = 20) => {
        const response = await apiClient.get<any>(`/vendas/cliente/${id_cliente}`, {
            params: { page, limit }
        });
        return response.data;
    },
};