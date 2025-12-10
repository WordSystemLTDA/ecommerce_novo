
import apiClient from "~/services/api";
import type { MarcaResponse } from "../types";

export const marcaService = {
    listarMarcas: async () => {
        const { data } = await apiClient.get<MarcaResponse>('/marcas');
        return data;
    },
};
