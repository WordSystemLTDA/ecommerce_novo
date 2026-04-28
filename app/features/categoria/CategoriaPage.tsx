import sign from 'jwt-encode';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import FilterToolbar from '~/components/filter_toolbar';
import FilterSidebar from '~/components/FilterSidebar';
import Footer from '~/components/footer';
import Header from '~/components/header';
import { ProductCard } from '~/components/ProductCard';
import { SkeletonProductCard } from '~/components/skeleton_product_card';
import { categoriaService } from '~/features/categoria/services/categoriaService';
import type { Categoria } from '~/features/categoria/types';
import { MobileFilterDrawer } from '~/features/home/components/MobileFilterDrawer';
import { produtoService } from '~/features/produto/services/produtoService';
import type { Paginacao, Produto } from '~/features/produto/types';
import { gerarSlug } from '~/utils/formatters';

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

const ProductGrid = ({ products, isLoading }: { products: Produto[], isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 lg:gap-4 px-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <SkeletonProductCard key={index} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="mx-4 rounded-2xl border border-dashed border-slate-300 bg-product-bg p-10 text-center text-slate-600">
                Nenhum produto encontrado nesta categoria.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 lg:gap-4 px-4">
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
        <nav className="flex justify-center items-center gap-1 mt-8 text-sm pb-2">
            <button
                onClick={() => onPageChange(pagina - 1)}
                disabled={pagina === 1}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            >
                {'<'}
            </button>

            {startPage > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50">1</button>
                    {startPage > 2 && <span className="px-3 py-1">...</span>}
                </>
            )}

            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1.5 rounded-lg border ${p === pagina ? 'bg-terciary text-white border-terciary' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                >
                    {p}
                </button>
            ))}

            {endPage < total_paginas && (
                <>
                    {endPage < total_paginas - 1 && <span className="px-3 py-1">...</span>}
                    <button onClick={() => onPageChange(total_paginas)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50">{total_paginas}</button>
                </>
            )}

            <button
                onClick={() => onPageChange(pagina + 1)}
                disabled={pagina === total_paginas}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            >
                {'>'}
            </button>
        </nav>
    );
};

export default function CategoryPage() {
    const { id, slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState<Produto[]>([]);
    const [pagination, setPagination] = useState<Paginacao>({ pagina: 1, por_pagina: 20, total: 0, total_paginas: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('CATEGORIA');
    const [porPagina, setPorPagina] = useState(20);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isLoadingSidebar, setIsLoadingSidebar] = useState(() => {
        try {
            return !window.sessionStorage.getItem('home:sidebar-filters');
        } catch { return true; }
    });

    const [filterOptions, setFilterOptions] = useState<FilterOptions>(() => {
        try {
            const cached = window.sessionStorage.getItem('home:sidebar-filters');
            if (cached) return JSON.parse(cached);
        } catch { }
        return { marcas: [], categorias: [], cores: [], tamanhos: [] };
    });
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultFilters);

    const page = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const cached = window.sessionStorage.getItem('home:sidebar-filters');
                if (cached) {
                    setFilterOptions(JSON.parse(cached));
                    setIsLoadingSidebar(false);
                    return;
                }
                const response = await produtoService.listarFiltros();
                if (response.sucesso) {
                    setFilterOptions(response.data);
                    window.sessionStorage.setItem('home:sidebar-filters', JSON.stringify(response.data));
                }
            } catch (error) {
                console.error("Erro ao buscar opções de filtro", error);
            } finally {
                setIsLoadingSidebar(false);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchCategoryName = async () => {
            if (!id) return;
            try {
                const { data } = await categoriaService.listarCategoriasComSubCategorias();

                const findCategory = (cats: Categoria[]): Categoria | undefined => {
                    for (const cat of cats) {
                        if (String(cat.id) === id) return cat;
                        if (cat.subCategorias) {
                            const found = findCategory(cat.subCategorias);
                            if (found) return found;
                        }
                    }
                    return undefined;
                };

                if (data) {
                    const found = findCategory(data);
                    if (found) setCategoryName(found.nome.toUpperCase());
                }
            } catch (error) {
                console.error("Erro ao buscar nome da categoria", error);
            }
        };
        fetchCategoryName();
    }, [id]);

    useEffect(() => {
        if (categoryName && categoryName !== 'CATEGORIA' && id) {
            const expectedSlug = gerarSlug(categoryName);
            if (!slug) {
                const newPath = `/categoria/${id}/${expectedSlug}`;
                const currentSearch = window.location.search;
                window.history.replaceState(null, '', newPath + currentSearch);
            }
        }
    }, [categoryName, id, slug]);

    useEffect(() => {
        const token = searchParams.get('filtros');
        if (token) {
            const decodedPartial = decodeJwt(token);
            if (decodedPartial) {
                const mergedFilters = { ...defaultFilters, ...decodedPartial };

                if (!mergedFilters.categorias.includes(Number(id))) {
                    mergedFilters.categorias = [Number(id)];
                }

                setActiveFilters(mergedFilters);
            }
        } else {
            setActiveFilters({ ...defaultFilters, categorias: [Number(id)] });
        }
    }, [searchParams, id]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const filtersToApply = {
                    ...activeFilters,
                    categorias: [Number(id)],
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

        if (!payload.categorias || payload.categorias.length === 0) {
            payload.categorias = [Number(id)];
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
        <div className="bg-linear-to-b from-slate-50 to-slate-100/70 min-h-screen">
            <Header />

            <div className="max-w-387 mx-auto px-0 mb-4 lg:mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-1">
                        <FilterSidebar
                            filterOptions={filterOptions}
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                            isLoading={isLoadingSidebar}
                            className="hidden lg:block lg:col-span-1"
                        />
                    </div>

                    <div className="lg:col-span-4 lg:mb-5">
                        <div className="mb-4 mx-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Resultados da categoria</p>
                            <p className="text-xl md:text-2xl font-semibold text-slate-800 mt-1">{categoryName}</p>
                            <p className="text-sm text-slate-500 mt-1">{pagination.total} itens encontrados</p>
                        </div>

                        <FilterToolbar
                            totalProdutos={pagination.total}
                            onPerPageChange={setPorPagina}
                            onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
                        />

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