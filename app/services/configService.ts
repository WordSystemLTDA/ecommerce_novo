import apiClient from "./api";

export interface ConfigData {
    id: number;
    nome_fantasia: string;
    razao_social: string;
    cnpj: string;
    logo_url?: string;
    // Add other fields as needed based on the 'empresas' table structure
    [key: string]: any;
}

export const getConfig = async (): Promise<ConfigData> => {
    const response = await apiClient.get('/config');
    return response.data.dados;
};
