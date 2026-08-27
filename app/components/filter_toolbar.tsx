import { FaList, FaTh } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { useHome } from "~/features/home/context/HomeContext";

interface FilterToolbarProps {
    onOpenMobileFilter: () => void;
    enableSortPerPage?: boolean;
    onPerPageChange?: (value: number) => void;
    totalProdutos: number;
    activeFilterCount?: number;
    viewMode?: 'grid' | 'compact';
    onViewModeChange?: (mode: 'grid' | 'compact') => void;
}

export default function FilterToolbar({
    onOpenMobileFilter,
    enableSortPerPage = false,
    onPerPageChange,
    totalProdutos,
    activeFilterCount = 0,
    viewMode = 'grid',
    onViewModeChange,
}: FilterToolbarProps) {
    const { activeFilters, applyFilters } = useHome();

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        applyFilters({ ...activeFilters, ordenacao: event.target.value });
    };

    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border border-primary/10 bg-product-bg p-3 shadow-[0_4px_18px_rgba(0,0,0,0.035)] sm:p-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
                <div className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/50">Catálogo</span>
                    <span className="text-sm font-semibold text-primary">{totalProdutos} {totalProdutos === 1 ? 'produto' : 'produtos'}</span>
                </div>

                <div className="ml-auto flex items-center gap-2 sm:ml-0">
                    <label htmlFor="ordenar" className="hidden text-xs font-medium text-primary/60 md:block">Ordenar por</label>
                    <select id="ordenar" value={activeFilters.ordenacao} onChange={handleSortChange} className="max-w-40 appearance-none border border-primary/15 bg-main-bg px-3 py-2.5 text-xs text-primary outline-none transition-colors focus:border-terciary sm:max-w-none">
                        <option value="mais_procurados">Mais procurados</option>
                        <option value="mais_recentes">Mais recentes</option>
                        <option value="menor_preco">Menor preço</option>
                        <option value="maior_preco">Maior preço</option>
                    </select>
                </div>

                {enableSortPerPage && (
                    <select aria-label="Produtos por página" className="hidden border border-primary/15 bg-main-bg px-3 py-2.5 text-xs text-primary outline-none focus:border-terciary sm:block" onChange={(event) => onPerPageChange?.(Number(event.target.value))}>
                        <option value="20">20 por página</option>
                        <option value="40">40 por página</option>
                        <option value="60">60 por página</option>
                    </select>
                )}
            </div>

            <div className="flex items-center gap-1.5">
                <button type="button" className="relative flex h-10 items-center gap-2 border border-primary/15 bg-main-bg px-3 text-xs font-semibold text-primary transition-colors hover:border-terciary hover:text-terciary lg:hidden" onClick={onOpenMobileFilter}>
                    <IoFilter size={17} />
                    Filtrar
                    {activeFilterCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terciary px-1 text-[10px] text-secondary">{activeFilterCount}</span>}
                </button>

                <button type="button" aria-label="Visualização espaçosa" aria-pressed={viewMode === 'grid'} onClick={() => onViewModeChange?.('grid')} className={`hidden h-10 w-10 items-center justify-center border transition-colors lg:flex ${viewMode === 'grid' ? 'border-primary bg-primary text-secondary' : 'border-primary/15 bg-main-bg text-primary/60 hover:text-terciary'}`}>
                    <FaList size={14} />
                </button>
                <button type="button" aria-label="Visualização compacta" aria-pressed={viewMode === 'compact'} onClick={() => onViewModeChange?.('compact')} className={`hidden h-10 w-10 items-center justify-center border transition-colors lg:flex ${viewMode === 'compact' ? 'border-primary bg-primary text-secondary' : 'border-primary/15 bg-main-bg text-primary/60 hover:text-terciary'}`}>
                    <FaTh size={14} />
                </button>
            </div>
        </div>
    );
}
