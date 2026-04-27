

import apiClient from "~/services/api";
import type { CategoriaResponse } from "../types";

type CacheEntry<T> = {
    expiresAt: number;
    value: T;
};

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

async function cachedGet<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const entry = cache.get(key) as CacheEntry<T> | undefined;

    if (entry && entry.expiresAt > now) {
        return entry.value;
    }

    const pending = inFlight.get(key) as Promise<T> | undefined;
    if (pending) {
        return pending;
    }

    const request = fetcher()
        .then((value) => {
            cache.set(key, {
                expiresAt: Date.now() + ttlMs,
                value,
            });
            return value;
        })
        .finally(() => {
            inFlight.delete(key);
        });

    inFlight.set(key, request);
    return request;
}

export const categoriaService = {
    listarCategorias: async () => {
        return cachedGet<CategoriaResponse>('categorias:all', 300_000, async () => {
            const { data } = await apiClient.get<CategoriaResponse>('/categorias');
            return data;
        });
    },

    listarCategoriasMenu: async () => {
        return cachedGet<CategoriaResponse>('categorias:menu', 300_000, async () => {
            const { data } = await apiClient.get<CategoriaResponse>('/categorias?menu');
            return data;
        });
    },

    listarCategoriasComSubCategorias: async () => {
        return cachedGet<CategoriaResponse>('categorias:with_subcategories', 300_000, async () => {
            const { data } = await apiClient.get<CategoriaResponse>('/categorias?with_subcategories');
            return data;
        });
    },
};