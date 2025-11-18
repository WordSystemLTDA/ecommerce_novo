// app/components/features/auth/services/authService.ts

import apiClient from "~/services/api";
import type { Products } from "../types";

export const homeService = {
    listProducts: async () => {
        const { data } = await apiClient.get<Products>('/produtos/listar.php');
        return data;
    },
};