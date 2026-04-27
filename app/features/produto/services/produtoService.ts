import apiClient from "~/services/api";
import type { CalculcarFreteResponse, Produto, ProdutoResponse, ProdutosResponse } from "../types";

type CacheEntry<T> = {
    expiresAt: number;
    value: T;
};

const responseCache = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();

async function getCached<T>(cacheKey: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const cached = responseCache.get(cacheKey) as CacheEntry<T> | undefined;

    if (cached && cached.expiresAt > now) {
        return cached.value;
    }

    const inFlight = inFlightRequests.get(cacheKey) as Promise<T> | undefined;
    if (inFlight) {
        return inFlight;
    }

    const promise = fetcher()
        .then((value) => {
            responseCache.set(cacheKey, {
                expiresAt: Date.now() + ttlMs,
                value,
            });
            return value;
        })
        .finally(() => {
            inFlightRequests.delete(cacheKey);
        });

    inFlightRequests.set(cacheKey, promise);
    return promise;
}

export const produtoService = {
    listarProduto: async (id: string) => {
        return getCached<ProdutoResponse>(`produto:${id}`, 60_000, async () => {
            const { data } = await apiClient.get<ProdutoResponse>(`/produtos/${id}`);
            return data;
        });
    },

    listarProdutos: async (filtros: string) => {
        const query = filtros.length <= 0 ? '/produtos' : `/produtos?${filtros}`;

        return getCached<ProdutosResponse>(`produtos:${query}`, 20_000, async () => {
            const { data } = await apiClient.get<ProdutosResponse>(query);
            return data;
        });
    },

    calcularFrete: async (cepDestino: string, produtos: Produto[]) => {
        const response = await apiClient.post<CalculcarFreteResponse>('/produtos/calcular_frete', {
            'cepDestino': cepDestino,
            'produtos': produtos,
        });

        return response.data;
    },

    listarFiltros: async () => {
        return getCached<any>('produtos:filtros', 300_000, async () => {
            const { data } = await apiClient.get<any>('/produtos/filtros');
            return data;
        });
    },

    toggleAvisoEstoque: async (id_produto: number, id_cliente: number) => {
        const { data } = await apiClient.post<any>('/produtos/aviso_estoque/toggle', {
            id_produto,
            id_cliente
        });
        return data['data']; // expected { status: boolean, message: string }
    },

    verificarAvisoEstoque: async (id_produto: number, id_cliente: number) => {
        const { data } = await apiClient.get<any>(`/produtos/aviso_estoque/verificar/${id_produto}/${id_cliente}`);
        return data['data']; // expected { status: boolean }
    },
};