import api from "~/services/api";
import type { Produto } from "../../produto/types";
import config from "~/config/config";

const localFavoritesKey = `favoritos:${config.EMPRESAS.join(',') || 'default'}`;
export const localFavoritesEvent = 'ecommerce:favoritos-locais-atualizados';

const getLocalFavoriteIds = (): number[] => {
    if (typeof window === 'undefined') return [];
    try {
        const parsed = JSON.parse(window.localStorage.getItem(localFavoritesKey) ?? '[]');
        if (!Array.isArray(parsed)) return [];
        return Array.from(new Set(parsed.map(Number).filter((id) => Number.isInteger(id) && id > 0)));
    } catch {
        return [];
    }
};

const setLocalFavoriteIds = (ids: number[]) => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(localFavoritesKey, JSON.stringify(ids));
        window.dispatchEvent(new CustomEvent(localFavoritesEvent));
    } catch {
        // Favoriting must not interrupt shopping when storage is unavailable.
    }
};

export interface FavoritosResponse {
    produtos: Produto[];
    total: number;
}

export const favoritoService = {
    listarLocais: getLocalFavoriteIds,

    adicionarLocal: (idProduto: number) => {
        setLocalFavoriteIds([...getLocalFavoriteIds(), Number(idProduto)].filter((id, index, ids) => ids.indexOf(id) === index));
    },

    removerLocal: (idProduto: number) => {
        setLocalFavoriteIds(getLocalFavoriteIds().filter((id) => id !== Number(idProduto)));
    },

    verificarLocal: (idProduto: number) => getLocalFavoriteIds().includes(Number(idProduto)),

    contarLocais: () => getLocalFavoriteIds().length,

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
