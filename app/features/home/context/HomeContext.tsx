import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { categoriaService } from '~/features/categoria/services/categoriaService';
import { produtoService } from '~/features/produto/services/produtoService';
import type { Produto, ProdutosBanners } from '~/features/produto/types';
import sign from 'jwt-encode';
import type { Marca } from '~/features/marca/types';
import type { Categoria } from '~/features/categoria/types';

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
    const [isLoading, setIsLoading] = useState(true);
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

    useEffect(() => {
        fetchFilterOptions();
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
    }, [searchParams]);

    const fetchFilterOptions = async () => {
        try {
            const response = await produtoService.listarFiltros();
            if (response.sucesso) {
                setFilterOptions(response.data);
            }
        } catch (error) {
            console.error("Error fetching filter options", error);
        }
    };

    const fetchFilteredProducts = async (token: string) => {
        setIsLoadingFilters(true);
        try {
            const params = new URLSearchParams();
            params.append('filtros', token);

            const queryString = params.toString();

            const response = await produtoService.listarProdutos(queryString);

            if (response.sucesso) {
                setFilteredProducts(response.data.produtos);
            }
        } catch (error) {
            console.error("Error fetching filtered products", error);
        } finally {
            setIsLoadingFilters(false);
        }
    }

    const applyFilters = (filters: ActiveFilters) => {
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
    };

    const listarProdutos = async (id: string, filtros: string) => {
        // Check if we already have data for this ID with the same filters
        const existingData = produtos.find(p => p.id === id);
        if (existingData && existingData.filtros === filtros) {
            return; // Data already exists and filters match, no need to fetch
        }

        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <HomeContext.Provider value={{
            produtos,
            listarProdutos,
            filterOptions,
            activeFilters,
            setFilterOptions,
            setActiveFilters,
            applyFilters,
            filteredProducts,
            isFiltering,
            isLoadingFilters
        }}>
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