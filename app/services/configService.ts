import apiClient from "./api";

export interface ConfigData {
    id: number;
    nome: string;
    razao_social: string;
    doc: string; // cnpj
    celular: string; // cnpj
    cep: string; // cnpj
    logo_url?: string;

    [key: string]: any;
}

export const getConfig = async (): Promise<ConfigData> => {
    const response = await apiClient.get('/configuracoes');
    return response.data.dados;
};
