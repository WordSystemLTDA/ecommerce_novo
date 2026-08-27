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
        <div className="fixed inset-0 z-50 flex h-dvh items-center justify-center lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary/45 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer Content */}
            <div className="relative flex h-full w-full flex-col overflow-hidden bg-sidebar-bg text-primary shadow-xl animate-slide-up md:h-[90%] md:w-[80%] md:max-w-2xl md:animate-fade-in">
                <div className="flex items-center justify-between border-b border-primary/10 p-4">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/45">Refine sua busca</span>
                        <h2 className="font-serif text-2xl font-medium text-primary">Filtros</h2>
                    </div>
                    <button onClick={onClose} className="flex h-11 w-11 items-center justify-center border border-primary/15 text-primary/60 hover:border-terciary hover:text-terciary" aria-label="Fechar filtros">
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

                <div className="safe-bottom border-t border-primary/10 bg-sidebar-bg p-4">
                    <button
                        onClick={handleApply}
                        className="w-full bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-secondary transition-colors hover:bg-terciary"
                    >
                        Ver resultados
                    </button>
                </div>
            </div>
        </div>
    );
}
