import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { PriceRangeSlider } from "~/components/price_range_slider";
import type { FilterOptions } from '../context/HomeContext'; // Assuming this type exists or I need to define/mock it for now

interface FilterContentProps {
    activeFilters: any;
    filterOptions: any; // Using any for now to match HomePage usage, will refine
    onFilterChange: (newFilters: any) => void;
}

export function FilterContent({ activeFilters, filterOptions, onFilterChange }: FilterContentProps) {

    const handleCheckboxChange = (type: string, value: any) => {
        const currentValues = activeFilters[type] as any[];
        let newValues;
        if (currentValues.includes(value)) {
            newValues = currentValues.filter((v: any) => v !== value);
        } else {
            newValues = [...currentValues, value];
        }
        const newFilters = { ...activeFilters, [type]: newValues };
        onFilterChange(newFilters);
    };

    const handleToggleChange = (type: 'freteGratis' | 'promocao') => {
        const newFilters = { ...activeFilters, [type]: !activeFilters[type] };
        onFilterChange(newFilters);
    };

    return (
        <div className="flex flex-col gap-2">
            {filterOptions.categorias && filterOptions.categorias.length > 0 && (
                <FilterSection title="Departamentos">
                    <CheckboxFilter
                        items={filterOptions.categorias.map((c: any) => ({ id: c.id, label: c.nome }))}
                        selectedValues={activeFilters.categorias}
                        onChange={(id) => handleCheckboxChange('categorias', id)}
                        showSearch={true}
                    />
                </FilterSection>
            )}

            {filterOptions.marcas && filterOptions.marcas.length > 0 && (
                <FilterSection title="Marcas" defaultOpen={true}>
                    <CheckboxFilter
                        items={filterOptions.marcas.map((m: any) => ({ id: m.id, label: m.nome }))}
                        selectedValues={activeFilters.marcas}
                        onChange={(id) => handleCheckboxChange('marcas', id)}
                        showSearch={true}
                    />
                </FilterSection>
            )}

            {filterOptions.cores && filterOptions.cores.length > 0 && (
                <FilterSection title="Cores" defaultOpen={true}>
                    <CheckboxFilter
                        items={filterOptions.cores.map((c: any) => ({ id: c.id, label: c.nome }))}
                        selectedValues={activeFilters.cores}
                        onChange={(id) => handleCheckboxChange('cores', id)}
                        showSearch={true}
                    />
                </FilterSection>
            )}

            {filterOptions.tamanhos && filterOptions.tamanhos.length > 0 && (
                <FilterSection title="Tamanhos" defaultOpen={true}>
                    <CheckboxFilter
                        items={filterOptions.tamanhos.map((t: any) => ({ id: t, label: t }))}
                        selectedValues={activeFilters.tamanhos}
                        onChange={(id) => handleCheckboxChange('tamanhos', id)}
                        showSearch={true}
                    />
                </FilterSection>
            )}

            <FilterSection title="Opções" defaultOpen={true}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Frete Grátis</span>
                    <ToggleSwitch
                        checked={activeFilters.freteGratis}
                        onChange={() => handleToggleChange('freteGratis')}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Promoção</span>
                    <ToggleSwitch
                        checked={activeFilters.promocao}
                        onChange={() => handleToggleChange('promocao')}
                    />
                </div>
            </FilterSection>

            <FilterSection title="Preço" defaultOpen={true}>
                {filterOptions.maxPrice != undefined &&
                    <PriceRangeSlider
                        min={0}
                        max={filterOptions.maxPrice || 5000}
                        minVal={activeFilters.minPreco}
                        maxVal={activeFilters.maxPreco}
                        onChange={(min, max) => onFilterChange({ ...activeFilters, minPreco: min, maxPreco: max })}
                    />
                }
            </FilterSection>
        </div>
    );
}

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const FilterSection = ({ title, children, defaultOpen = false }: FilterSectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 py-4 last:border-0">
            <div
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="font-medium text-gray-900">{title}</h3>
                {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </div>
            {isOpen && <div className="mt-2">{children}</div>}
        </div>
    );
};

interface CheckboxFilterProps {
    items: { id: number | string; label: string }[];
    selectedValues: (number | string)[];
    onChange: (id: number | string) => void;
    showSearch?: boolean;
}

export const CheckboxFilter = ({ items, selectedValues, onChange, showSearch }: CheckboxFilterProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {showSearch && (
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            )}
            {filteredItems.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedValues.includes(item.id) ? 'bg-terciary border-terciary' : 'border-gray-300 group-hover:border-primary'}`}>
                        {selectedValues.includes(item.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{item.label}</span>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedValues.includes(item.id)}
                        onChange={() => onChange(item.id)}
                    />
                </label>
            ))}
        </div>
    );
};

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
}

export const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
    return (
        <div
            className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${checked ? 'bg-terciary' : 'bg-gray-300'}`}
            onClick={onChange}
        >
            <div
                className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${checked ? 'left-5.5' : 'left-0.5'}`}
            />
        </div>
    );
};
