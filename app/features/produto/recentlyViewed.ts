import config from "~/config/config";
import type { Produto } from "./types";
import { getPrimaryProductImage } from "~/utils/seo";

export interface RecentlyViewedProduct {
    id: number;
    name: string;
    image: string;
    price: number;
}

const storageKey = `produtos-vistos:${config.EMPRESAS.join(',') || 'default'}`;

export function getRecentlyViewed(excludeId?: number): RecentlyViewedProduct[] {
    if (typeof window === "undefined") return [];
    try {
        const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((item): item is RecentlyViewedProduct =>
                item && Number.isInteger(Number(item.id)) && typeof item.name === "string" && typeof item.image === "string"
            )
            .filter((item) => Number(item.id) !== Number(excludeId))
            .slice(0, 8);
    } catch {
        return [];
    }
}

export function rememberRecentlyViewed(produto: Produto) {
    if (typeof window === "undefined") return;
    const item: RecentlyViewedProduct = {
        id: Number(produto.id),
        name: produto.nome,
        image: getPrimaryProductImage(produto),
        price: Math.max(0, Number(produto.preco) - Number(produto.valorDescontoPix || 0)),
    };

    try {
        const updated = [item, ...getRecentlyViewed(produto.id)].slice(0, 8);
        window.localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
        // The store keeps working when local storage is unavailable.
    }
}
