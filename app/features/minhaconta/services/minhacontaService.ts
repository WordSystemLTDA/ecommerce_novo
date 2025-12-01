import apiClient from "~/services/api";
import type { EnderecoResponse } from "../types";

export const minhacontaService = {
    listarEnderecos: async (id_cliente: number) => {
        const response = await apiClient.get<EnderecoResponse>(`/enderecos/${id_cliente}`);

        return response.data;
    },
};