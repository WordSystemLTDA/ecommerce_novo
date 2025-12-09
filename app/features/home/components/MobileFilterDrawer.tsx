import { useEffect, useState } from 'react';
import { SlClose } from "react-icons/sl";
import { FilterContent } from './FilterContent';

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeFilters: any;
    filterOptions: any;
    onApply: (newFilters: any) => void;
}

export function MobileFilterDrawer({ isOpen, onClose, activeFilters, filterOptions, onApply }: MobileFilterDrawerProps) {
    const [localFilters, setLocalFilters] = useState(activeFilters);

    // Reset local state when drawer opens to match global state
    useEffect(() => {
        if (isOpen) {
            setLocalFilters(activeFilters);
        }
    }, [isOpen, activeFilters]);

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer Content */}
            <div className="relative w-full h-full md:w-[80%] md:h-[90%] md:rounded-lg bg-white shadow-xl flex flex-col overflow-hidden animate-slide-up md:animate-fade-in">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
                        <SlClose size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <FilterContent
                        activeFilters={localFilters}
                        filterOptions={filterOptions}
                        onFilterChange={setLocalFilters}
                    />
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                    <button
                        onClick={handleApply}
                        className="w-full py-3 bg-terciary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
