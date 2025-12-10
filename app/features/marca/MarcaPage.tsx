import sign from 'jwt-encode';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import FilterToolbar from '~/components/filter_toolbar';
import Footer from '~/components/footer';
import Header from '~/components/header';
import { ProductCard } from '~/components/ProductCard';
import { FilterContent } from '~/features/home/components/FilterContent';
import { MobileFilterDrawer } from '~/features/home/components/MobileFilterDrawer';
import { produtoService } from '~/features/produto/services/produtoService';
import type { Paginacao, Produto } from '~/features/produto/types';
import { gerarSlug } from '~/utils/formatters';
import { marcaService } from './services/marcaService';
import type { Marca } from './types';

interface FilterOptions {
    marcas: { id: number; nome: string }[];
    categorias: { id: number; nome: string }[];
    cores: { id: number; nome: string }[];
    tamanhos: string[];
}

interface ActiveFilters {
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

const defaultFilters: ActiveFilters = {
    marcas: [],
    categorias: [],
    cores: [],
    tamanhos: [],
    freteGratis: false,
    promocao: false,
    ordenacao: 'mais_procurados'
};

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

const Sidebar = ({ filterOptions, activeFilters, onFilterChange }: { filterOptions: FilterOptions, activeFilters: ActiveFilters, onFilterChange: (newFilters: ActiveFilters) => void }) => {
    return (
        <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
                <FilterContent
                    activeFilters={activeFilters}
                    filterOptions={filterOptions}
                    onFilterChange={onFilterChange}
                />
            </div>
        </aside>
    );
};

const ProductGrid = ({ products, isLoading }: { products: Produto[], isLoading: boolean }) => {
    if (isLoading) {
        return <div className="p-8 text-center">Carregando produtos...</div>;
    }

    if (products.length === 0) {
        return <div className="p-8 text-center">Nenhum produto encontrado nesta marca.</div>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0.5 lg:gap-4 px-4">
            {products.map((product) => (
                <ProductCard key={product.id} produto={product} />
            ))}
        </div>
    );
};

const Pagination = ({ pagination, onPageChange }: { pagination: Paginacao, onPageChange: (page: number) => void }) => {
    const { pagina, total_paginas } = pagination;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagina - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(total_paginas, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (total_paginas <= 1) return null;

    return (
        <nav className="flex justify-center items-center gap-1 mt-8 text-sm">
            <button
                onClick={() => onPageChange(pagina - 1)}
                disabled={pagina === 1}
                className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
                {'<'}
            </button>

            {startPage > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className="px-3 py-1 rounded hover:bg-gray-200">1</button>
                    {startPage > 2 && <span className="px-3 py-1">...</span>}
                </>
            )}

            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 rounded ${p === pagina ? 'bg-terciary text-white' : 'hover:bg-gray-200'}`}
                >
                    {p}
                </button>
            ))}

            {endPage < total_paginas && (
                <>
                    {endPage < total_paginas - 1 && <span className="px-3 py-1">...</span>}
                    <button onClick={() => onPageChange(total_paginas)} className="px-3 py-1 rounded hover:bg-gray-200">{total_paginas}</button>
                </>
            )}

            <button
                onClick={() => onPageChange(pagina + 1)}
                disabled={pagina === total_paginas}
                className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
                {'>'}
            </button>
        </nav>
    );
};

export default function MarcaPage() {
    const { id, slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState<Produto[]>([]);
    const [pagination, setPagination] = useState<Paginacao>({ pagina: 1, por_pagina: 20, total: 0, total_paginas: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [brandName, setBrandName] = useState('MARCA');
    const [porPagina, setPorPagina] = useState(20);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        marcas: [],
        categorias: [],
        cores: [],
        tamanhos: []
    });
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultFilters);

    const page = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await produtoService.listarFiltros();
                if (response.sucesso) {
                    setFilterOptions(response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar opções de filtro", error);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchBrandName = async () => {
            if (!id) return;
            try {
                const { data } = await marcaService.listarMarcas();
                if (data) {
                    const found = data.find((m: Marca) => String(m.id) === id);
                    if (found) setBrandName(found.nome.toUpperCase());
                }
            } catch (error) {
                console.error("Erro ao buscar nome da marca", error);
            }
        };
        fetchBrandName();
    }, [id]);

    useEffect(() => {
        if (brandName && brandName !== 'MARCA' && id) {
            const expectedSlug = gerarSlug(brandName);
            if (!slug || slug !== expectedSlug) {
                const newPath = `/marca/${id}/${expectedSlug}`;
                const currentSearch = window.location.search;
                window.history.replaceState(null, '', newPath + currentSearch);
            }
        }
    }, [brandName, id, slug]);

    useEffect(() => {
        const token = searchParams.get('filtros');
        if (token) {
            const decodedPartial = decodeJwt(token);
            if (decodedPartial) {
                const mergedFilters = { ...defaultFilters, ...decodedPartial };

                // Force current brand ID
                if (!mergedFilters.marcas.includes(Number(id))) {
                    mergedFilters.marcas = [Number(id)];
                }

                setActiveFilters(mergedFilters);
            }
        } else {
            setActiveFilters({ ...defaultFilters, marcas: [Number(id)] });
        }
    }, [searchParams, id]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const filtersToApply = {
                    ...activeFilters,
                    marcas: [Number(id)],
                    pagina: page,
                    por_pagina: porPagina,
                };

                const token = sign(filtersToApply, 'secret');
                const params = new URLSearchParams();
                params.append('filtros', token);

                const response = await produtoService.listarProdutos(params.toString());

                if (response.data) {
                    setProducts(response.data.produtos);
                    setPagination(response.data.paginacao);
                }
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [activeFilters, page, porPagina, id]);


    const handleFilterChange = (newFilters: ActiveFilters) => {
        const payload: any = {};

        if (newFilters.marcas.length > 0) payload.marcas = newFilters.marcas;
        if (newFilters.categorias.length > 0) payload.categorias = newFilters.categorias;
        if (newFilters.cores.length > 0) payload.cores = newFilters.cores;
        if (newFilters.tamanhos.length > 0) payload.tamanhos = newFilters.tamanhos;

        if (newFilters.minPreco !== undefined) payload.minPreco = newFilters.minPreco;
        if (newFilters.maxPreco !== undefined) payload.maxPreco = newFilters.maxPreco;

        if (newFilters.freteGratis) payload.freteGratis = true;
        if (newFilters.promocao) payload.promocao = true;

        if (newFilters.ordenacao !== 'mais_procurados') payload.ordenacao = newFilters.ordenacao;

        // Ensure current brand is always applied
        if (!payload.marcas || payload.marcas.length === 0) {
            payload.marcas = [Number(id)];
        }

        const token = sign(payload, 'secret');
        setSearchParams({ filtros: token, page: '1' });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            prev.set('page', String(newPage));
            return prev;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-gray-100">
            <Header />

            <div className="max-w-387 mx-auto px-0 mb-4 lg:mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-1">
                        <Sidebar
                            filterOptions={filterOptions}
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    <div className="lg:col-span-4 lg:mb-5">
                        <FilterToolbar
                            totalProdutos={pagination.total}
                            onPerPageChange={setPorPagina}
                            onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
                        />

                        <div className="mb-4 px-4">
                            <p className="text-lg max-lg:text-base font-semibold">{brandName}</p>
                        </div>

                        <ProductGrid products={products} isLoading={isLoading} />
                        <Pagination pagination={pagination} onPageChange={handlePageChange} />
                    </div>

                </div>

            </div>

            <Footer />

            <MobileFilterDrawer
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                activeFilters={activeFilters}
                filterOptions={filterOptions}
                onApply={handleFilterChange}
            />
        </div>
    );
}
