import apiClient from "./api";

export interface ConfigData {
    id: number;
    nome_fantasia: string;
    razao_social: string;
    cnpj: string;
    logo_url?: string;

    [key: string]: any;
}

export const getConfig = async (): Promise<ConfigData> => {
    const response = await apiClient.get('/config');
    return response.data.dados;
};
