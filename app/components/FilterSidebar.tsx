import { FilterContent } from '~/features/home/components/FilterContent';

interface FilterSidebarProps {
    filterOptions: any;
    activeFilters: any;
    onFilterChange: (newFilters: any) => void;
    isLoading?: boolean;
    className?: string;
}

export default function FilterSidebar({
    filterOptions,
    activeFilters,
    onFilterChange,
    isLoading = false,
    className = 'hidden lg:block lg:col-span-1 w-full lg:w-60 xl:w-64 min-w-60'
}: FilterSidebarProps) {
    return (
        <aside className={className}>
            <div className="sticky top-36 border border-primary/10 bg-sidebar-bg shadow-[0_4px_20px_rgba(0,0,0,0.035)]">
                <div className="border-b border-primary/10 px-4 py-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/45">Refine sua busca</span>
                    <h2 className="mt-1 font-serif text-xl font-medium text-primary">Filtros</h2>
                </div>
                <div className="max-h-[calc(100vh-11rem)] overflow-y-auto px-4 no-scrollbar">
                {isLoading ? (
                    <SidebarSkeleton />
                ) : (
                    <FilterContent
                        activeFilters={activeFilters}
                        filterOptions={filterOptions}
                        onFilterChange={onFilterChange}
                    />
                )}
                </div>
            </div>
        </aside>
    );
}

function SidebarSkeleton() {
    return (
        <div className="flex animate-pulse flex-col gap-4 py-4">
            {Array.from({ length: 4 }).map((_, sectionIndex) => (
                <div key={sectionIndex} className="border-b border-primary/10 pb-4 last:border-0 last:pb-0">
                    <div className="h-4 w-28 bg-primary/10 mb-3" />
                    <div className="space-y-2">
                        {Array.from({ length: sectionIndex === 3 ? 3 : 5 }).map((__, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-primary/10 shrink-0" />
                                <div className="h-3 w-full bg-primary/8" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
