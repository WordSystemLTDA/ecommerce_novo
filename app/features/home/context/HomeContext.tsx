import sign from 'jwt-encode';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { categoriaService } from '~/features/categoria/services/categoriaService';
import type { Categoria } from '~/features/categoria/types';
import type { Marca } from '~/features/marca/types';
import { produtoService } from '~/features/produto/services/produtoService';
import type { Banner, Produto, ProdutosBanners } from '~/features/produto/types';
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
    isFiltering: boolean;
    isLoadingFilters: boolean;
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
    freteGratis: boolean;
    promocao: boolean;
    ordenacao: string;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

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

const defaultFilters: ActiveFilters = {
    marcas: [],
    categorias: [],
    cores: [],
    tamanhos: [],
    freteGratis: false,
    promocao: false,
    ordenacao: 'mais_procurados'
};

export function HomeProvider({ children }: { children: ReactNode }) {
    const [produtos, setProdutos] = useState<ProdutosBanners[]>([]);
    const [isLoadingFilters, setIsLoadingFilters] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        marcas: [],
        categorias: [],
        cores: [],
        tamanhos: []
    });
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultFilters);
    const [filteredProducts, setFilteredProducts] = useState<Produto[]>([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const latestFilterRequestRef = useRef<string>('');

    // Persisted state for HomePage sections
    const [sectionCategories, setSectionCategories] = useState<Record<string, number | null>>({});
    const [sectionMarcas, setSectionMarcas] = useState<Record<string, number | null>>({});

    // Persisted Banners
    const [banners, setBanners] = useState<Banner[]>([]);
    const [secondaryBanners, setSecondaryBanners] = useState<Banner[]>([]);
    const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [filtersResult, principalResult, secondaryResult] = await Promise.allSettled([
                    produtoService.listarFiltros(),
                    getBanners('Principal'),
                    getBanners('Secundario'),
                ]);

                if (filtersResult.status === 'fulfilled' && filtersResult.value?.sucesso) {
                    setFilterOptions(filtersResult.value.data);
                }

                if (principalResult.status === 'fulfilled') {
                    setBanners(principalResult.value);
                }

                if (secondaryResult.status === 'fulfilled') {
                    setSecondaryBanners(secondaryResult.value);
                }
            } catch (error) {
                console.error('Error loading home initial data', error);
            } finally {
                setIsInitialDataLoaded(true);
            }
        };

        loadInitialData();
    }, []);

    const fetchFilteredProducts = useCallback(async (token: string) => {
        latestFilterRequestRef.current = token;
        setIsLoadingFilters(true);
        try {
            const params = new URLSearchParams();
            params.append('filtros', token);

            // Add id_cliente if user is logged in
            const authToken = localStorage.getItem('@ecommerce/token');
            if (authToken) {
                const decodedAuth = decodeJwt(authToken);
                if (decodedAuth && decodedAuth.id) {
                    params.append('id_cliente', decodedAuth.id);
                }
            }

            const queryString = params.toString();

            const response = await produtoService.listarProdutos(queryString);

            if (response.sucesso && latestFilterRequestRef.current === token) {
                setFilteredProducts(response.data.produtos);
            }
        } catch (error) {
            console.error("Error fetching filtered products", error);
        } finally {
            if (latestFilterRequestRef.current === token) {
                setIsLoadingFilters(false);
            }
        }
    }, []);

    useEffect(() => {
        const token = searchParams.get('filtros');
        if (token) {
            const decodedPartial = decodeJwt(token);
            if (decodedPartial) {
                const mergedFilters = { ...defaultFilters, ...decodedPartial };
                setActiveFilters(mergedFilters);
                setIsFiltering(true);
                fetchFilteredProducts(token);
            }
        } else {
            setIsFiltering(false);
            setFilteredProducts([]);
            setActiveFilters(defaultFilters);
        }
    }, [fetchFilteredProducts, searchParams]);

    const applyFilters = useCallback((filters: ActiveFilters) => {
        const payload: any = {};

        if (filters.marcas.length > 0) payload.marcas = filters.marcas;
        if (filters.categorias.length > 0) payload.categorias = filters.categorias;
        if (filters.cores.length > 0) payload.cores = filters.cores;
        if (filters.tamanhos.length > 0) payload.tamanhos = filters.tamanhos;

        if (filters.minPreco !== undefined) payload.minPreco = filters.minPreco;
        if (filters.maxPreco !== undefined) payload.maxPreco = filters.maxPreco;

        if (filters.freteGratis) payload.freteGratis = true;
        if (filters.promocao) payload.promocao = true;

        if (filters.ordenacao !== 'mais_procurados') payload.ordenacao = filters.ordenacao;

        if (Object.keys(payload).length === 0) {
            setSearchParams({});
        } else {
            const token = sign(payload, 'secret');
            setSearchParams({ filtros: token });
        }
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
            const responseProdutos = await produtoService.listarProdutos(filtros);
            const responseCategorias = await categoriaService.listarCategorias();

            if (responseProdutos.sucesso) {
                setProdutos((oldState) => {
                    const exists = oldState.find(p => p.id === id);
                    if (exists) {
                        return oldState.map(p => p.id === id ? {
                            id: id,
                            categorias: responseCategorias.data,
                            produtos: responseProdutos.data.produtos as Produto[],
                            filtros: filtros
                        } : p);
                    }
                    return [...oldState, {
                        id: id,
                        categorias: responseCategorias.data,
                        produtos: responseProdutos.data.produtos as Produto[],
                        filtros: filtros
                    }];
                });
            }
        } catch (error) {
            throw error;
        }
    }, [produtos]);

    const contextValue = useMemo(() => ({
        produtos,
        listarProdutos,
        filterOptions,
        activeFilters,
        setFilterOptions,
        setActiveFilters,
        applyFilters,
        filteredProducts,
        isFiltering,
        isLoadingFilters,
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
        isFiltering,
        isLoadingFilters,
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