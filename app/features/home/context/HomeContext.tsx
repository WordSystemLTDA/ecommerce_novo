import sign from 'jwt-encode';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { categoriaService } from '~/features/categoria/services/categoriaService';
import type { Categoria } from '~/features/categoria/types';
import type { Marca } from '~/features/marca/types';
import { produtoService } from '~/features/produto/services/produtoService';
import type { Banner, Produto, ProdutosBanners } from '~/features/produto/types';
import config from '~/config/config';
import { getBanners } from '~/services/bannerService';

interface HomeContextType {
    produtos: ProdutosBanners[];
    listarProdutos: (id: string, filtros: string) => Promise<void>;
    filterOptions: FilterOptions;
    activeFilters: ActiveFilters;
    setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
    setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
    applyFilters: (newFilters: ActiveFilters) => void;
    filteredProducts: Produto[];
    filteredTotal: number;
    searchSuggestion: string;
    loadMoreProducts: () => Promise<void>;
    isFiltering: boolean;
    isLoadingFilters: boolean;
    isLoadingMore: boolean;
    isLoadingSidebarFilters: boolean;
    sectionCategories: Record<string, number | null>;
    setSectionCategories: React.Dispatch<React.SetStateAction<Record<string, number | null>>>;
    sectionMarcas: Record<string, number | null>;
    setSectionMarcas: React.Dispatch<React.SetStateAction<Record<string, number | null>>>;
    banners: Banner[];
    secondaryBanners: Banner[];
    isInitialDataLoaded: boolean;
}

export interface FilterOptions {
    marcas: Marca[];
    categorias: Categoria[];
    cores: { id: number; nome: string }[];
    tamanhos: string[];
    maxPrice?: number;
}

export interface ActiveFilters {
    marcas: number[];
    categorias: number[];
    cores: number[];
    tamanhos: string[];
    minPreco?: number;
    maxPreco?: number;
    pesquisa?: string;
    freteGratis: boolean;
    promocao: boolean;
    ordenacao: string;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);
const EMPRESAS_CACHE_SCOPE = config.EMPRESAS.join(',') || 'default';
const SIDEBAR_FILTERS_CACHE_KEY = `home:${EMPRESAS_CACHE_SCOPE}:sidebar-filters`;
const CATALOG_CACHE_KEY = `home:${EMPRESAS_CACHE_SCOPE}:catalog-default`;
const SIDEBAR_FILTERS_CACHE_TTL = 5 * 60_000;

interface CachedCatalog {
    expiresAt: number;
    produtos: Produto[];
    total: number;
}

interface CachedSidebarFilters {
    expiresAt: number;
    filters: FilterOptions;
}

function isFilterOptions(value: unknown): value is FilterOptions {
    if (!value || typeof value !== 'object') return false;

    const candidate = value as Partial<FilterOptions>;
    return Array.isArray(candidate.marcas)
        && Array.isArray(candidate.categorias)
        && Array.isArray(candidate.cores)
        && Array.isArray(candidate.tamanhos);
}

function getCachedCatalog(): CachedCatalog | null {
    if (typeof window === 'undefined') return null;

    try {
        const cached = window.sessionStorage.getItem(CATALOG_CACHE_KEY);
        if (!cached) return null;

        const parsed = JSON.parse(cached) as CachedCatalog;
        if (parsed.expiresAt <= Date.now() || !Array.isArray(parsed.produtos)) {
            window.sessionStorage.removeItem(CATALOG_CACHE_KEY);
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

function persistCatalog(produtos: Produto[], total: number) {
    if (typeof window === 'undefined') return;

    try {
        window.sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({
            expiresAt: Date.now() + 60_000,
            produtos,
            total,
        } satisfies CachedCatalog));
    } catch {
        // Storage may be unavailable in private browsing or already full.
    }
}

function getCachedSidebarFilters(): FilterOptions | null {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const cached = window.sessionStorage.getItem(SIDEBAR_FILTERS_CACHE_KEY);
        if (!cached) {
            return null;
        }

        const parsed = JSON.parse(cached) as CachedSidebarFilters | FilterOptions;
        if ('filters' in parsed) {
            if (parsed.expiresAt <= Date.now() || !isFilterOptions(parsed.filters)) {
                window.sessionStorage.removeItem(SIDEBAR_FILTERS_CACHE_KEY);
                return null;
            }

            return parsed.filters;
        }

        // Compatibilidade com o cache salvo pelas versoes anteriores. Ele e
        // revalidado em segundo plano assim que a Home abre.
        return isFilterOptions(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function persistSidebarFilters(filters: FilterOptions) {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.sessionStorage.setItem(SIDEBAR_FILTERS_CACHE_KEY, JSON.stringify({
            expiresAt: Date.now() + SIDEBAR_FILTERS_CACHE_TTL,
            filters,
        } satisfies CachedSidebarFilters));
    } catch {
        // Ignore cache persistence failures.
    }
}

function decodeJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export const defaultFilters: ActiveFilters = {
    marcas: [],
    categorias: [],
    cores: [],
    tamanhos: [],
    freteGratis: false,
    promocao: false,
    ordenacao: 'mais_procurados'
};

export function HomeProvider({ children }: { children: ReactNode }) {
    const [cachedSidebarFilters] = useState<FilterOptions | null>(() => getCachedSidebarFilters());
    const [cachedCatalog] = useState<CachedCatalog | null>(() => getCachedCatalog());
    const [produtos, setProdutos] = useState<ProdutosBanners[]>([]);
    const [isLoadingFilters, setIsLoadingFilters] = useState(!cachedCatalog);
    const [isLoadingSidebarFilters, setIsLoadingSidebarFilters] = useState(!cachedSidebarFilters);
    const [searchParams, setSearchParams] = useSearchParams();

    const [filterOptions, setFilterOptions] = useState<FilterOptions>(() => cachedSidebarFilters ?? {
        marcas: [],
        categorias: [],
        cores: [],
        tamanhos: []
    });
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultFilters);
    const [filteredProducts, setFilteredProducts] = useState<Produto[]>(cachedCatalog?.produtos ?? []);
    const [filteredTotal, setFilteredTotal] = useState(cachedCatalog?.total ?? 0);
    const [searchSuggestion, setSearchSuggestion] = useState("");
    const [filteredPage, setFilteredPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const latestFilterRequestRef = useRef<string>('');

    // Persisted state for HomePage sections
    const [sectionCategories, setSectionCategories] = useState<Record<string, number | null>>({});
    const [sectionMarcas, setSectionMarcas] = useState<Record<string, number | null>>({});

    // Persisted Banners
    const [banners, setBanners] = useState<Banner[]>([]);
    const [secondaryBanners, setSecondaryBanners] = useState<Banner[]>([]);
    const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
    const sectionCategoriesCacheRef = useRef<Categoria[] | null>(cachedSidebarFilters?.categorias ?? null);
    const sectionCategoriesPromiseRef = useRef<Promise<Categoria[]> | null>(null);

    const getSectionCategories = useCallback(async () => {
        if (sectionCategoriesCacheRef.current && sectionCategoriesCacheRef.current.length > 0) {
            return sectionCategoriesCacheRef.current;
        }

        if (filterOptions.categorias.length > 0) {
            sectionCategoriesCacheRef.current = filterOptions.categorias;
            return filterOptions.categorias;
        }

        if (!sectionCategoriesPromiseRef.current) {
            sectionCategoriesPromiseRef.current = categoriaService
                .listarCategorias()
                .then((response) => {
                    const categorias = response?.data ?? [];
                    sectionCategoriesCacheRef.current = categorias;
                    return categorias;
                })
                .finally(() => {
                    sectionCategoriesPromiseRef.current = null;
                });
        }

        return sectionCategoriesPromiseRef.current;
    }, [filterOptions.categorias]);

    useEffect(() => {
        let isActive = true;
        setIsLoadingSidebarFilters(!cachedSidebarFilters);

        const loadSidebarFilters = async () => {
            for (let attempt = 0; attempt < 2; attempt += 1) {
                try {
                    const filtersResult = await produtoService.listarFiltros();
                    const loadedFilters = filtersResult?.data;

                    if (!filtersResult?.sucesso || !isFilterOptions(loadedFilters)) {
                        throw new Error('Resposta de filtros invalida.');
                    }

                    if (isActive) {
                        setFilterOptions(loadedFilters);
                        sectionCategoriesCacheRef.current = loadedFilters.categorias;
                        persistSidebarFilters(loadedFilters);
                    }
                    return;
                } catch (error) {
                    if (attempt === 1) {
                        console.error('Error loading sidebar filters', error);
                    } else {
                        await new Promise((resolve) => window.setTimeout(resolve, 350));
                    }
                }
            }
        };

        const finishSidebarFilters = async () => {
            try {
                await loadSidebarFilters();
            } finally {
                if (isActive) {
                    setIsLoadingSidebarFilters(false);
                }
            }
        };

        const loadPrincipalBanner = async () => {
            try {
                const principalBanners = await getBanners('Principal');
                if (isActive) {
                    setBanners(principalBanners);
                }
            } catch (error) {
                console.error('Error loading main home banner', error);
            } finally {
                if (isActive) {
                    // O banner principal nao precisa aguardar banners secundarios.
                    setIsInitialDataLoaded(true);
                }
            }
        };

        const loadSecondaryBanners = async () => {
            try {
                const loadedBanners = await getBanners('Secundario');
                if (isActive) {
                    setSecondaryBanners(loadedBanners);
                }
            } catch (error) {
                console.error('Error loading secondary home banners', error);
            }
        };

        void loadPrincipalBanner();
        void finishSidebarFilters();

        const secondaryBannerTimer = window.setTimeout(() => void loadSecondaryBanners(), 500);

        return () => {
            isActive = false;
            window.clearTimeout(secondaryBannerTimer);
        };
    }, [cachedSidebarFilters]);

    const fetchFilteredProducts = useCallback(async (token?: string, page = 1, append = false, keepCurrent = false) => {
        const requestKey = `${token || 'catalogo-padrao'}:pagina-${page}`;
        latestFilterRequestRef.current = requestKey;
        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoadingMore(false);
            setIsLoadingFilters(!keepCurrent);
        }
        try {
            const params = new URLSearchParams();
            params.set('por_pagina', '16');
            params.set('pagina', String(page));
            if (token) {
                params.append('filtros', token);
            } else {
                params.set('order_by', 'mais_procurados');
            }

            // Add id_cliente if user is logged in
            const authToken = localStorage.getItem('token');
            if (authToken) {
                const decodedAuth = decodeJwt(authToken);
                if (decodedAuth && decodedAuth.id) {
                    params.append('id_cliente', decodedAuth.id);
                }
            }

            const queryString = params.toString();

            const response = await produtoService.listarProdutos(queryString);

            if (response.sucesso && latestFilterRequestRef.current === requestKey) {
                const responseProducts = response.data.produtos as Produto[];
                const responseTotal = Number(response.data.paginacao?.total ?? responseProducts.length);
                if (!append) setSearchSuggestion(String(response.data.sugestao ?? ""));
                setFilteredProducts((currentProducts) => {
                    if (!append) return responseProducts;

                    const knownIds = new Set(currentProducts.map((product) => product.id));
                    return [
                        ...currentProducts,
                        ...responseProducts.filter((product) => !knownIds.has(product.id)),
                    ];
                });
                setFilteredTotal(responseTotal);
                setFilteredPage(page);

                if (!token && !authToken && page === 1) {
                    persistCatalog(responseProducts, responseTotal);
                }
            }
        } catch (error) {
            console.error("Error fetching filtered products", error);
            if (!append) setSearchSuggestion("");
        } finally {
            if (latestFilterRequestRef.current === requestKey) {
                if (append) {
                    setIsLoadingMore(false);
                } else {
                    setIsLoadingFilters(false);
                }
            }
        }
    }, []);

    const loadMoreProducts = useCallback(async () => {
        if (isLoadingMore || filteredProducts.length >= filteredTotal) return;

        const query = searchParams.get('q')?.trim();
        const token = searchParams.get('filtros')
            ?? (query ? sign({ pesquisa: query, ordenacao: 'mais_procurados' }, 'secret') : undefined);
        await fetchFilteredProducts(token, filteredPage + 1, true);
    }, [fetchFilteredProducts, filteredPage, filteredProducts.length, filteredTotal, isLoadingMore, searchParams]);

    useEffect(() => {
        const token = searchParams.get('filtros');
        const query = searchParams.get('q')?.trim();
        if (token) {
            const decodedPartial = decodeJwt(token);
            if (decodedPartial) {
                const mergedFilters = { ...defaultFilters, ...decodedPartial };
                setActiveFilters(mergedFilters);
                setIsFiltering(true);
                fetchFilteredProducts(token);
            }
        } else if (query) {
            const searchFilters = { ...defaultFilters, pesquisa: query };
            const searchToken = sign({ pesquisa: query, ordenacao: searchFilters.ordenacao }, 'secret');
            setActiveFilters(searchFilters);
            setIsFiltering(true);
            fetchFilteredProducts(searchToken);
        } else {
            setIsFiltering(false);
            setActiveFilters(defaultFilters);
            setSearchSuggestion("");
            fetchFilteredProducts(undefined, 1, false, !!cachedCatalog);
        }
    }, [cachedCatalog, fetchFilteredProducts, searchParams]);

    const applyFilters = useCallback((filters: ActiveFilters) => {
        const payload: any = {};

        if (filters.marcas.length > 0) payload.marcas = filters.marcas;
        if (filters.categorias.length > 0) payload.categorias = filters.categorias;
        if (filters.cores.length > 0) payload.cores = filters.cores;
        if (filters.tamanhos.length > 0) payload.tamanhos = filters.tamanhos;

        if (filters.minPreco !== undefined) payload.minPreco = filters.minPreco;
        if (filters.maxPreco !== undefined) payload.maxPreco = filters.maxPreco;
        if (filters.pesquisa?.trim()) payload.pesquisa = filters.pesquisa.trim();

        if (filters.freteGratis) payload.freteGratis = true;
        if (filters.promocao) payload.promocao = true;

        if (Object.keys(payload).length === 0) {
            if (filters.ordenacao === 'mais_procurados') {
                setSearchParams({}, { preventScrollReset: true });
                return;
            }

            payload.ordenacao = filters.ordenacao;
        } else {
            payload.ordenacao = filters.ordenacao;
        }

        const token = sign(payload, 'secret');
        setSearchParams({ filtros: token }, { preventScrollReset: true });
    }, [setSearchParams]);

    const listarProdutos = useCallback(async (id: string, filtros: string) => {
        // Check if we already have data for this ID with the same filters
        const existingData = produtos.find(p => p.id === id);

        const areFiltersEqual = (params1: string, params2: string) => {
            if (params1 === params2) return true;

            const p1 = new URLSearchParams(params1);
            const p2 = new URLSearchParams(params2);

            // Compare id_cliente
            if (p1.get('id_cliente') !== p2.get('id_cliente')) return false;

            // Compare JWT content
            const t1 = p1.get('filtros');
            const t2 = p2.get('filtros');

            if (!t1 || !t2) return t1 === t2;

            const d1 = decodeJwt(t1);
            const d2 = decodeJwt(t2);

            if (!d1 || !d2) return false;

            // Simple deep compare for these specific filter objects
            // We assume arrays are consistent (e.g. sorted or same order as generated)
            return JSON.stringify(d1) === JSON.stringify(d2);
        };

        if (existingData && areFiltersEqual(existingData.filtros, filtros)) {
            return; // Data already exists and filters match, no need to fetch
        }

        try {
            const [responseProdutos, categorias] = await Promise.all([
                produtoService.listarProdutos(filtros),
                getSectionCategories(),
            ]);

            if (responseProdutos.sucesso) {
                setProdutos((oldState) => {
                    const exists = oldState.find(p => p.id === id);
                    if (exists) {
                        return oldState.map(p => p.id === id ? {
                            id: id,
                            categorias,
                            produtos: responseProdutos.data.produtos as Produto[],
                            filtros: filtros
                        } : p);
                    }
                    return [...oldState, {
                        id: id,
                        categorias,
                        produtos: responseProdutos.data.produtos as Produto[],
                        filtros: filtros
                    }];
                });
            }
        } catch (error) {
            throw error;
        }
    }, [getSectionCategories, produtos]);

    const contextValue = useMemo(() => ({
        produtos,
        listarProdutos,
        filterOptions,
        activeFilters,
        setFilterOptions,
        setActiveFilters,
        applyFilters,
        filteredProducts,
        filteredTotal,
        searchSuggestion,
        loadMoreProducts,
        isFiltering,
        isLoadingFilters,
        isLoadingMore,
        isLoadingSidebarFilters,
        sectionCategories,
        setSectionCategories,
        sectionMarcas,
        setSectionMarcas,
        banners,
        secondaryBanners,
        isInitialDataLoaded
    }), [
        produtos,
        listarProdutos,
        filterOptions,
        activeFilters,
        applyFilters,
        filteredProducts,
        filteredTotal,
        searchSuggestion,
        loadMoreProducts,
        isFiltering,
        isLoadingFilters,
        isLoadingMore,
        isLoadingSidebarFilters,
        sectionCategories,
        sectionMarcas,
        banners,
        secondaryBanners,
        isInitialDataLoaded
    ]);

    return (
        <HomeContext.Provider value={contextValue}>
            {children}
        </HomeContext.Provider>
    );
}

export function useHome() {
    const context = useContext(HomeContext);
    if (context === undefined) {
        throw new Error('useHome deve ser usado dentro de um HomeProvider');
    }
    return context;
}
