import { FaList, FaTh } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { useHome } from "~/features/home/context/HomeContext";

interface FilterToolbarProps {
    onOpenMobileFilter: () => void;
    enableSortPerPage?: boolean;
    onPerPageChange?: (val: number) => void;
    totalProdutos: number,
}

export default function FilterToolbar({ onOpenMobileFilter, enableSortPerPage = false, onPerPageChange, totalProdutos }: FilterToolbarProps) {
    const { activeFilters, applyFilters } = useHome();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        applyFilters({ ...activeFilters, ordenacao: e.target.value });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-row justify-between items-center mx-4 lg:mx-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="ordenar" className="text-sm font-medium text-gray-700 hidden md:block">Ordenar:</label>
                    <select
                        id="ordenar"
                        value={activeFilters.ordenacao}
                        onChange={handleSortChange}
                        className="lg:appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm max-lg:text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="mais_procurados">Mais procurados</option>
                        <option value="mais_recentes">Mais recentes</option>
                        <option value="menor_preco">Menor preço</option>
                        <option value="maior_preco">Maior preço</option>
                    </select>
                </div>


                {enableSortPerPage && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="exibir" className="text-sm font-medium text-gray-700">Exibir:</label>
                        <select
                            id="exibir"
                            className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            onChange={(e) => onPerPageChange && onPerPageChange(Number(e.target.value.split(' ')[0]))}
                        >
                            <option>20 por página</option>
                            <option>40 por página</option>
                            <option>60 por página</option>
                        </select>
                    </div>
                )}

                <span className="text-sm text-gray-500 hidden md:block">{totalProdutos} produtos</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    className="lg:hidden p-2 text-gray-600 hover:text-terciary bg-gray-100 rounded cursor-pointer flex items-center gap-2"
                    onClick={onOpenMobileFilter}
                >
                    <IoFilter size={18} />
                    <span className="font-medium">Filtrar</span>
                </button>
                <button className="hidden lg:block p-2 text-gray-600 hover:text-terciary bg-gray-100 rounded cursor-pointer">
                    <FaList size={16} />
                </button>
                <button className="hidden lg:block p-2 text-terciary bg-gray-100 rounded cursor-pointer">
                    <FaTh size={16} />
                </button>
            </div>
        </div>
    );
};