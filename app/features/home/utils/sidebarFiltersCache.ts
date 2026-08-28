interface SidebarFiltersCacheEnvelope {
    expiresAt: number;
    filters: unknown;
}

const DEFAULT_CACHE_TTL_MS = 5 * 60_000;

function isCacheEnvelope(value: unknown): value is SidebarFiltersCacheEnvelope {
    return value !== null
        && typeof value === 'object'
        && 'filters' in value;
}

export function readSidebarFiltersCache<T>(
    cacheKey: string,
    isValid: (value: unknown) => value is T,
): T | null {
    if (typeof window === 'undefined') return null;

    try {
        const rawCache = window.sessionStorage.getItem(cacheKey);
        if (!rawCache) return null;

        const parsed: unknown = JSON.parse(rawCache);
        const cachedFilters = isCacheEnvelope(parsed) ? parsed.filters : parsed;

        if (isCacheEnvelope(parsed)
            && (!Number.isFinite(Number(parsed.expiresAt)) || Number(parsed.expiresAt) <= Date.now())) {
            window.sessionStorage.removeItem(cacheKey);
            return null;
        }

        if (!isValid(cachedFilters)) {
            window.sessionStorage.removeItem(cacheKey);
            return null;
        }

        return cachedFilters;
    } catch {
        window.sessionStorage.removeItem(cacheKey);
        return null;
    }
}

export function persistSidebarFiltersCache<T>(
    cacheKey: string,
    filters: T,
    ttlMs = DEFAULT_CACHE_TTL_MS,
) {
    if (typeof window === 'undefined') return;

    try {
        window.sessionStorage.setItem(cacheKey, JSON.stringify({
            expiresAt: Date.now() + ttlMs,
            filters,
        } satisfies SidebarFiltersCacheEnvelope));
    } catch {
        // O checkout e a navegacao continuam funcionando mesmo sem sessionStorage.
    }
}
