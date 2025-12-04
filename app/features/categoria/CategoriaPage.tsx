import React, { useEffect, useState } from 'react';
import {
    FaChevronDown,
    FaChevronUp,
    FaList,
    FaTh
} from 'react-icons/fa';
import { useParams, useSearchParams } from 'react-router';
import sign from 'jwt-encode';
import Breadcrumb from '~/components/breadcrumb';
import Footer from '~/components/footer';
import Header from '~/components/header';
import { ProductCard } from '~/components/ProductCard';
import { PriceRangeSlider } from '~/components/price_range_slider';
import { produtoService } from '~/features/produto/services/produtoService';
import { categoriaService } from '~/features/categoria/services/categoriaService';
import type { Produto, Paginacao } from '~/features/produto/types';
import type { Categoria } from '~/features/categoria/types';
import { gerarSlug } from '~/utils/formatters';

// ===================================================================
// TYPES (Copied/Adapted from HomeContext for independence)
// ===================================================================
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

// Helper to decode JWT payload safely
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

// ===================================================================
// COMPONENTE: Barra de Ferramentas de Filtro
// ===================================================================
const FilterToolbar = ({ totalProdutos, onSortChange, onPerPageChange, ordenacao }: { totalProdutos: number, onSortChange: (val: string) => void, onPerPageChange: (val: number) => void, ordenacao: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
                <label htmlFor="ordenar" className="text-sm font-medium text-gray-700">Ordenar:</label>
                <select
                    id="ordenar"
                    className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    onChange={(e) => onSortChange(e.target.value)}
                    value={ordenacao}
                >
                    <option value="mais_procurados">Mais procurados</option>
                    <option value="mais_recentes">Mais recentes</option>
                    <option value="menor_preco">Menor preço</option>
                    <option value="maior_preco">Maior preço</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="exibir" className="text-sm font-medium text-gray-700">Exibir:</label>
                <select
                    id="exibir"
                    className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    onChange={(e) => onPerPageChange(Number(e.target.value.split(' ')[0]))}
                >
                    <option>20 por página</option>
                    <option>40 por página</option>
                    <option>60 por página</option>
                </select>
            </div>
            <span className="text-sm text-gray-500">{totalProdutos} produtos</span>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-orange-600 bg-gray-100 rounded cursor-pointer">
                <FaList size={16} />
            </button>
            <button className="p-2 text-orange-600 bg-gray-100 rounded cursor-pointer">
                <FaTh size={16} />
            </button>
        </div>
    </div>
);

// ===================================================================
// COMPONENTE: Seção de Filtro Reutilizável
// ===================================================================
const FilterSection = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                className="flex justify-between items-center w-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="text-sm font-bold text-gray-800 uppercase">{title}</h4>
                {isOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
            </button>
            {isOpen && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </div>
    );
};

// ===================================================================
// COMPONENTE: Filtro de Checkbox
// ===================================================================
const CheckboxFilter = ({ items, selectedValues, onChange, showSearch = false }: { items: { id: any, label: string }[], selectedValues: any[], onChange: (id: any) => void, showSearch?: boolean }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredItems = items.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-3">
            {showSearch && (
                <input
                    type="search"
                    placeholder="Buscar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
            )}
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {filteredItems.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(item.id)}
                            onChange={() => onChange(item.id)}
                            className="rounded border-gray-300 text-primary focus:ring-orange-500"
                        />
                        {item.label}
                    </label>
                ))}
            </div>
        </div>
    );
};

// ===================================================================
// COMPONENTE: Barra Lateral (Sidebar)
// ===================================================================
const Sidebar = ({ filterOptions, activeFilters, onFilterChange }: { filterOptions: FilterOptions, activeFilters: ActiveFilters, onFilterChange: (newFilters: ActiveFilters) => void }) => {

    const handleCheckboxChange = (type: keyof ActiveFilters, value: any) => {
        const currentValues = activeFilters[type] as any[];
        let newValues;
        if (currentValues.includes(value)) {
            newValues = currentValues.filter((v: any) => v !== value);
        } else {
            newValues = [...currentValues, value];
        }
        onFilterChange({ ...activeFilters, [type]: newValues });
    };

    return (
        <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
                <FilterSection title="Preço">
                    <PriceRangeSlider
                        min={0}
                        max={10000}
                        onChange={(min, max) => {
                            onFilterChange({ ...activeFilters, minPreco: min, maxPreco: max });
                        }}
                    />
                </FilterSection>

                <FilterSection title="Marcas" defaultOpen={true}>
                    <CheckboxFilter
                        items={filterOptions.marcas.map(m => ({ id: m.id, label: m.nome }))}
                        selectedValues={activeFilters.marcas}
                        onChange={(id) => handleCheckboxChange('marcas', id)}
                        showSearch={true}
                    />
                </FilterSection>

                <FilterSection title="Cores" defaultOpen={true}>
                    <CheckboxFilter
                        items={filterOptions.cores.map(c => ({ id: c.id, label: c.nome }))}
                        selectedValues={activeFilters.cores}
                        onChange={(id) => handleCheckboxChange('cores', id)}
                    />
                </FilterSection>
            </div>
        </aside>
    );
};

// ===================================================================
// COMPONENTE: Grade de Produtos
// ===================================================================
const ProductGrid = ({ products, isLoading }: { products: Produto[], isLoading: boolean }) => {
    if (isLoading) {
        return <div className="p-8 text-center">Carregando produtos...</div>;
    }

    if (products.length === 0) {
        return <div className="p-8 text-center">Nenhum produto encontrado nesta categoria.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} produto={product} />
            ))}
        </div>
    );
};

// ===================================================================
// COMPONENTE: Paginação
// ===================================================================
const Pagination = ({ pagination, onPageChange }: { pagination: Paginacao, onPageChange: (page: number) => void }) => {
    const { pagina, total_paginas } = pagination;

    // Logic to show a window of pages
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
                    className={`px-3 py-1 rounded ${p === pagina ? 'bg-orange-600 text-white' : 'hover:bg-gray-200'}`}
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

// ===================================================================
// COMPONENTE PRINCIPAL DA PÁGINA
// ===================================================================
export default function CategoryPage() {
    const { id, slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState<Produto[]>([]);
    const [pagination, setPagination] = useState<Paginacao>({ pagina: 1, por_pagina: 20, total: 0, total_paginas: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('CATEGORIA');
    const [porPagina, setPorPagina] = useState(20);

    // Filter State
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        marcas: [],
        categorias: [],
        cores: [],
        tamanhos: []
    });
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultFilters);

    const page = Number(searchParams.get('page')) || 1;

    // 1. Fetch Filter Options (Once)
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

    // 2. Fetch Category Name
    useEffect(() => {
        const fetchCategoryName = async () => {
            if (!id) return;
            try {
                // We need to find the category name. 
                // Since we don't have a direct endpoint for "get category by id" that returns just the name easily without listing all,
                // we'll list all and find it. 
                // Optimization: If the backend supported /categorias/:id it would be better.
                // For now, let's use listarCategoriasComSubCategorias or similar.
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

    // 2.1 Enforce Slug
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

    // 3. Sync URL params to State
    useEffect(() => {
        const token = searchParams.get('filtros');
        if (token) {
            const decodedPartial = decodeJwt(token);
            if (decodedPartial) {
                // Merge decoded partial filters with defaults
                // IMPORTANT: Ensure the URL category ID is always respected if not present in token (though it should be)
                const mergedFilters = { ...defaultFilters, ...decodedPartial };

                // Force current category ID if not in filters (edge case)
                if (!mergedFilters.categorias.includes(Number(id))) {
                    mergedFilters.categorias = [Number(id)];
                }

                setActiveFilters(mergedFilters);
            }
        } else {
            // If no filters in URL, reset to defaults BUT keep the current category
            setActiveFilters({ ...defaultFilters, categorias: [Number(id)] });
        }
    }, [searchParams, id]);

    // 4. Fetch Products when ActiveFilters or Pagination changes
    useEffect(() => {
        const fetchProducts = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                // Ensure the current category is always included in the fetch
                const filtersToApply = {
                    ...activeFilters,
                    categorias: [Number(id)],
                    pagina: page,
                    por_pagina: porPagina,
                };

                // If the user selected other categories in sidebar, we might want to allow that, 
                // but usually a Category Page is scoped to that category. 
                // For now, let's assume the sidebar category filter might add MORE categories or refine.
                // But wait, if we are in "Hardware" page, and user selects "SSD" (sub), 
                // we should probably include both or just the sub?
                // The current backend logic likely uses `IN` clause.

                // Let's just use the activeFilters as is, assuming it's correctly populated from URL.

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

        // Only fetch if we have active filters synced (to avoid double fetch on initial load if URL has params)
        // But we need to fetch at least once.
        fetchProducts();
    }, [activeFilters, page, porPagina, id]);


    // 5. Update URL when Filters Change
    const handleFilterChange = (newFilters: ActiveFilters) => {
        // Minify payload
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

        // Ensure current category is in payload if it's the only one, or just rely on the fact that 
        // if we are in this page, we want this category.
        // However, if we remove 'categorias' from payload, the backend might return ALL products.
        // So we MUST ensure the current category ID is in the payload.
        if (!payload.categorias || payload.categorias.length === 0) {
            payload.categorias = [Number(id)];
        }

        const token = sign(payload, 'secret');
        setSearchParams({ filtros: token, page: '1' }); // Reset to page 1 on filter change
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

            <div className="max-w-387 mx-auto px-0 mb-4">
                <Breadcrumb />

                {/* Layout Principal: Sidebar + Conteúdo */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Coluna da Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar
                            filterOptions={filterOptions}
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* Coluna de Conteúdo Principal */}
                    <div className="lg:col-span-4 lg:mb-5">
                        <FilterToolbar
                            totalProdutos={pagination.total}
                            onSortChange={(val) => handleFilterChange({ ...activeFilters, ordenacao: val })}
                            onPerPageChange={setPorPagina}
                            ordenacao={activeFilters.ordenacao}
                        />

                        <div className="mb-4">
                            <h3 className="text-lg font-bold mb-3">{categoryName}</h3>
                        </div>

                        <ProductGrid products={products} isLoading={isLoading} />
                        <Pagination pagination={pagination} onPageChange={handlePageChange} />
                    </div>

                </div>

            </div>

            <Footer />
        </div>
    );
}