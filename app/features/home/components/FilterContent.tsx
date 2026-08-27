import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { PriceRangeSlider } from "~/components/price_range_slider";
import type { ActiveFilters, FilterOptions } from '../context/HomeContext';

interface FilterContentProps {
    activeFilters: ActiveFilters;
    filterOptions: FilterOptions;
    onFilterChange: (newFilters: ActiveFilters) => void;
}

type ArrayFilterKey = 'categorias' | 'marcas' | 'cores' | 'tamanhos';

export function FilterContent({ activeFilters, filterOptions, onFilterChange }: FilterContentProps) {
    const handleCheckboxChange = (type: ArrayFilterKey, value: number | string) => {
        const currentValues = activeFilters[type] as Array<number | string>;
        const nextValues = currentValues.includes(value)
            ? currentValues.filter((currentValue) => currentValue !== value)
            : [...currentValues, value];

        onFilterChange({ ...activeFilters, [type]: nextValues } as ActiveFilters);
    };

    const handleToggleChange = (type: 'freteGratis' | 'promocao') => {
        onFilterChange({ ...activeFilters, [type]: !activeFilters[type] });
    };

    return (
        <div className="flex flex-col">
            {filterOptions.categorias.length > 0 && (
                <FilterSection title="Departamentos" defaultOpen>
                    <CheckboxFilter
                        items={filterOptions.categorias.map((category) => ({ id: Number(category.id), label: category.nome }))}
                        selectedValues={activeFilters.categorias}
                        onChange={(id) => handleCheckboxChange('categorias', id)}
                        showSearch
                    />
                </FilterSection>
            )}

            {filterOptions.marcas.length > 0 && (
                <FilterSection title="Marcas" defaultOpen>
                    <CheckboxFilter
                        items={filterOptions.marcas.map((brand) => ({ id: Number(brand.id), label: brand.nome }))}
                        selectedValues={activeFilters.marcas}
                        onChange={(id) => handleCheckboxChange('marcas', id)}
                        showSearch
                    />
                </FilterSection>
            )}

            {filterOptions.cores.length > 0 && (
                <FilterSection title="Cores" defaultOpen>
                    <CheckboxFilter
                        items={filterOptions.cores.map((color) => ({ id: Number(color.id), label: color.nome }))}
                        selectedValues={activeFilters.cores}
                        onChange={(id) => handleCheckboxChange('cores', id)}
                        showSearch={filterOptions.cores.length > 7}
                    />
                </FilterSection>
            )}

            {filterOptions.tamanhos.length > 0 && (
                <FilterSection title="Tamanhos" defaultOpen>
                    <CheckboxFilter
                        items={filterOptions.tamanhos.map((size) => ({ id: size, label: size }))}
                        selectedValues={activeFilters.tamanhos}
                        onChange={(id) => handleCheckboxChange('tamanhos', id)}
                        layout="grid"
                    />
                </FilterSection>
            )}

            <FilterSection title="Preço" defaultOpen>
                {filterOptions.maxPrice !== undefined ? (
                    <PriceRangeSlider
                        min={0}
                        max={filterOptions.maxPrice || 5000}
                        minVal={activeFilters.minPreco}
                        maxVal={activeFilters.maxPreco}
                        onChange={(min, max) => onFilterChange({ ...activeFilters, minPreco: min, maxPreco: max })}
                    />
                ) : (
                    <p className="text-xs text-primary/50">Carregando faixa de preço...</p>
                )}
            </FilterSection>

            <FilterSection title="Opções" defaultOpen>
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-primary/70">Frete grátis</span>
                        <ToggleSwitch checked={activeFilters.freteGratis} onChange={() => handleToggleChange('freteGratis')} label="Filtrar produtos com frete grátis" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-primary/70">Somente promoções</span>
                        <ToggleSwitch checked={activeFilters.promocao} onChange={() => handleToggleChange('promocao')} label="Filtrar produtos em promoção" />
                    </div>
                </div>
            </FilterSection>
        </div>
    );
}

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <section className="border-b border-primary/10 py-4 last:border-0">
            <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen}>
                <h3 className="text-sm font-semibold text-primary">{title}</h3>
                {isOpen ? <FaChevronUp size={11} className="text-primary/50" /> : <FaChevronDown size={11} className="text-primary/50" />}
            </button>
            {isOpen && <div className="mt-3">{children}</div>}
        </section>
    );
}

interface CheckboxFilterProps {
    items: Array<{ id: number | string; label: string }>;
    selectedValues: Array<number | string>;
    onChange: (id: number | string) => void;
    showSearch?: boolean;
    layout?: 'list' | 'grid';
}

export function CheckboxFilter({ items, selectedValues, onChange, showSearch = false, layout = 'list' }: CheckboxFilterProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredItems = items.filter((item) => item.label.toLocaleLowerCase('pt-BR').includes(searchTerm.toLocaleLowerCase('pt-BR')));

    return (
        <div>
            {showSearch && (
                <input
                    type="search"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="mb-3 w-full border border-primary/15 bg-main-bg px-3 py-2 text-xs text-primary outline-none placeholder:text-primary/40 focus:border-terciary"
                />
            )}

            <div className={layout === 'grid' ? 'grid max-h-44 grid-cols-3 gap-2 overflow-y-auto pr-1' : 'flex max-h-48 flex-col gap-2 overflow-y-auto pr-1'}>
                {filteredItems.map((item) => {
                    const selected = selectedValues.includes(item.id);
                    if (layout === 'grid') {
                        return (
                            <button key={item.id} type="button" onClick={() => onChange(item.id)} aria-pressed={selected} className={`min-h-9 border px-2 text-xs transition-colors ${selected ? 'border-primary bg-primary text-secondary' : 'border-primary/15 bg-product-bg text-primary hover:border-terciary'}`}>
                                {item.label}
                            </button>
                        );
                    }

                    return (
                        <label key={item.id} className="group flex cursor-pointer items-center gap-2.5 py-0.5">
                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${selected ? 'border-terciary bg-terciary' : 'border-primary/25 group-hover:border-terciary'}`}>
                                {selected && <span className="h-1.5 w-1.5 bg-secondary" />}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-xs text-primary/70 transition-colors group-hover:text-primary">{item.label}</span>
                            <input type="checkbox" className="sr-only" checked={selected} onChange={() => onChange(item.id)} />
                        </label>
                    );
                })}

                {filteredItems.length === 0 && <p className="py-2 text-xs text-primary/50">Nenhuma opção encontrada.</p>}
            </div>
        </div>
    );
}

function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-5 w-10 rounded-full transition-colors ${checked ? 'bg-terciary' : 'bg-primary/15'}`}>
            <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-secondary shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );
}
