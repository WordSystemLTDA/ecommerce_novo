import type { Banner } from "~/features/produto/types";
import apiClient from "./api";

const bannerCache = new Map<string, { expiresAt: number; value: Banner[] }>();
const bannerInFlight = new Map<string, Promise<Banner[]>>();

export const getBanners = async (tipo: string = 'Principal'): Promise<Banner[]> => {
    const key = `banners:${tipo}`;
    const now = Date.now();
    const cached = bannerCache.get(key);

    if (cached && cached.expiresAt > now) {
        return cached.value;
    }

    const pending = bannerInFlight.get(key);
    if (pending) {
        return pending;
    }

    const request = apiClient.get(`/banners?tipo=${tipo}`)
        .then((response) => {
            const banners = response.data.data || [];
            bannerCache.set(key, { expiresAt: Date.now() + 180_000, value: banners });
            return banners;
        })
        .finally(() => {
            bannerInFlight.delete(key);
        });

    bannerInFlight.set(key, request);
    return request;
};
