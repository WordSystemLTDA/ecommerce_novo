import React, { useState } from 'react';
import {
    FaStar,
    FaChevronUp,
    FaChevronDown,
    FaTh,
    FaList,
    FaClock,
    FaHeart,
    FaRegHeart
} from 'react-icons/fa';
import Footer from '~/components/footer';
import { Header } from '~/components/header';
import { PriceRangeSlider } from '~/components/price_range_slider';
import Breadcrumb from '~/components/breadcrumb';

// ===================================================================
// DADOS DE EXEMPLO (MOCK DATA)
// ===================================================================

// Dados para a grade de produtos

// Dados para os filtros da sidebar
const mockMarcas = [
    'ISIPlayer', '5+', 'Acer', 'Adata', 'AERO COOL', 'AFOX', 'AINIX', 'AMD', 'AOC', 'Apple'
];
const mockSocket = ['T1x', 'AM1', 'AM2', 'AM3', 'AM3+', 'AM4', 'AM5'];

// ===================================================================
// COMPONENTE: Breadcrumb
// ===================================================================


// ===================================================================
// COMPONENTE: Barra de Ferramentas de Filtro (Ordenação e Exibição)
// ===================================================================
const FilterToolbar = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
                <label htmlFor="ordenar" className="text-sm font-medium text-gray-700">Ordenar:</label>
                <select id="ordenar" className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
                    <option>Mais procurados</option>
                    <option>Mais recentes</option>
                    <option>Menor preço</option>
                    <option>Maior preço</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="exibir" className="text-sm font-medium text-gray-700">Exibir:</label>
                <select id="exibir" className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
                    <option>20 por página</option>
                    <option>40 por página</option>
                    <option>60 por página</option>
                </select>
            </div>
            <span className="text-sm text-gray-500">8259 produtos</span>
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
// COMPONENTE: Abas de Categoria (TODOS, COOLERS, etc.)
// ===================================================================
const CategoryTabs = () => {
    const categories = [
        'TODOS', 'COOLERS', 'DISCO RÍGIDO (HD)', 'DRIVES', 'FONTES', 'KIT HARDWARE',
        'MEMÓRIA RAM', 'PLACA DE VÍDEO (VGA)', 'PLACAS INTERFACE'
    ];
    const [activeTab, setActiveTab] = useState('TODOS');

    return (
        <div className="mb-4">
            <h3 className="text-lg font-bold mb-3">CATEGORIAS</h3>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={`
              px-4 py-2 text-xs font-bold rounded-md
              ${activeTab === category
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }
            `}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

// ===================================================================
// COMPONENTE: Seção de Filtro Reutilizável (Acordeão)
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
// COMPONENTE: Filtro de Preço
// ===================================================================
const PriceFilter = () => (
    <PriceRangeSlider />
);

// ===================================================================
// COMPONENTE: Filtro de Checkbox
// ===================================================================
const CheckboxFilter = ({ items, showSearch = false }: { items: string[], showSearch?: boolean }) => (
    <div className="space-y-3">
        {showSearch && (
            <input
                type="search"
                placeholder="Buscar"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
        )}
        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {items.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-orange-500" />
                    {item}
                </label>
            ))}
        </div>
        <button className="text-xs text-primary hover:text-orange-700">Ver mais</button>
    </div>
);

// ===================================================================
// COMPONENTE: Barra Lateral (Sidebar)
// ===================================================================
const Sidebar = () => (
    <aside className="lg:col-span-1">
        <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
            <FilterSection title="Preço">
                <PriceFilter />
            </FilterSection>

            <FilterSection title="Marcas" defaultOpen={true}>
                <CheckboxFilter items={mockMarcas} showSearch={true} />
            </FilterSection>

            <FilterSection title="Categorias" defaultOpen={false}>
                <CheckboxFilter items={['Hardware', 'SSD', 'Kit Hardware', 'Placas Interface']} />
            </FilterSection>

            {/* Adicione mais seções de filtro conforme as imagens */}
        </div>
    </aside>
);

// ===================================================================
// COMPONENTE: Grade de Produtos
// ===================================================================
const ProductGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))} */}
    </div>
);

// ===================================================================
// COMPONENTE: Paginação
// ===================================================================
const Pagination = () => (
    <nav className="flex justify-center items-center gap-1 mt-8 text-sm">
        <button className="px-3 py-1 rounded bg-orange-600 text-white">1</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">2</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">3</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">4</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">5</button>
        <span className="px-3 py-1">...</span>
        <button className="px-3 py-1 rounded hover:bg-gray-200">409</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">410</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">411</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">412</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">413</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">{'>'}</button>
        <button className="px-3 py-1 rounded hover:bg-gray-200">{'>>'}</button>
    </nav>
);

// ===================================================================
// COMPONENTE PRINCIPAL DA PÁGINA
// ===================================================================
export default function CategoryPage() {
    return (
        <div className="bg-gray-100">
            <Header />

            <div className="max-w-387 mx-auto px-0 mb-4">
                <Breadcrumb  />

                {/* Layout Principal: Sidebar + Conteúdo */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Coluna da Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar />
                    </div>

                    {/* Coluna de Conteúdo Principal */}
                    <div className="lg:col-span-4 lg:mb-5">
                        <FilterToolbar />
                        <CategoryTabs />
                        <ProductGrid />
                        <Pagination />
                    </div>

                </div>

            </div>

            <Footer />
        </div>
    );
}