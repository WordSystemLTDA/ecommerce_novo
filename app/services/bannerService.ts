import apiClient from "./api";
import type { Banner } from "~/features/produto/types";

export const getBanners = async (tipo: string = 'Principal'): Promise<Banner[]> => {
    const response = await apiClient.get(`/banners?tipo=${tipo}`);
    return response.data.data || [];
};
