import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
}

function getVisiblePages(currentPage: number, totalPages: number) {
    const pages: Array<number | "ellipsis"> = [];

    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    pages.push(1);

    if (currentPage > 4) {
        pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
        pages.push(page);
    }

    if (currentPage < totalPages - 3) {
        pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const visiblePages = getVisiblePages(currentPage, totalPages);
    const startItem = totalItems && pageSize
        ? ((currentPage - 1) * pageSize) + 1
        : null;
    const endItem = totalItems && pageSize
        ? Math.min(currentPage * pageSize, totalItems)
        : null;

    return (
        <nav
            className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-primary/10 bg-white p-4 sm:flex-row"
            aria-label="Paginação"
        >
            {startItem != null && endItem != null && totalItems != null && (
                <p className="text-sm text-gray-500">
                    Exibindo <span className="font-semibold text-gray-800">{startItem}-{endItem}</span> de{" "}
                    <span className="font-semibold text-gray-800">{totalItems}</span>
                </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45"
                    aria-label="Página anterior"
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Anterior</span>
                </button>

                {visiblePages.map((page, index) => {
                    if (page === "ellipsis") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-10 w-10 items-center justify-center text-gray-400"
                            >
                                <MoreHorizontal size={18} />
                            </span>
                        );
                    }

                    const isCurrent = page === currentPage;

                    return (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            aria-current={isCurrent ? "page" : undefined}
                            className={`h-10 min-w-10 rounded-md border px-3 text-sm font-semibold transition-colors ${isCurrent
                                ? "border-primary bg-primary text-white"
                                : "border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5"
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45"
                    aria-label="Próxima página"
                >
                    <span className="hidden sm:inline">Próxima</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </nav>
    );
}
