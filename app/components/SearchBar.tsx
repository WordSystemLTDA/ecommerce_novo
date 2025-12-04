import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { MdOutlineSearch } from "react-icons/md";
import type { Produto } from "~/features/produto/types";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import { produtoService } from "~/features/produto/services/produtoService";

export function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Produto[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 2) {
                setIsSearching(true);
                try {
                    const response = await produtoService.listarProdutos(`pesquisa=${searchTerm}`);
                    if (response.data) {
                        setSearchResults(response.data.produtos);
                        setShowResults(true);
                    } else {
                        setSearchResults([]);
                    }
                } catch (error) {
                    console.error("Erro na busca:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleProductClick = (produto: Produto) => {
        navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
        setShowResults(false);
        setSearchTerm("");
    };

    return (
        <div className="flex h-10 relative w-full group" ref={wrapperRef}>
            <input
                type="search"
                name="busca"
                id="busca"
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                    if (searchResults.length > 0) setShowResults(true);
                }}
                className="bg-white w-full rounded text-sm px-4 border-0 outline-none text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-secondary transition-shadow"
                placeholder="Busque na Loja!"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-transparent text-primary hover:text-secondary transition-colors">
                <MdOutlineSearch size={24} />
            </button>

            {showResults && (
                <div className="absolute top-full left-0 w-full bg-white rounded-b-md shadow-xl border-t border-gray-100 z-50 max-h-96 overflow-y-auto mt-1">
                    {isSearching ? (
                        <div className="p-4 text-center text-gray-500 text-sm">Buscando...</div>
                    ) : searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((produto) => (
                                <li
                                    key={produto.id}
                                    onClick={() => handleProductClick(produto)}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                                >
                                    <div className="w-12 h-12 shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                        {produto.imagens && produto.imagens.length > 0 ? (
                                            <img
                                                src={produto.imagens[0]}
                                                alt={produto.nome}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-xs text-gray-400">Sem img</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800 line-clamp-1">{produto.nome}</span>
                                        <span className="text-xs font-bold text-primary">
                                            {currencyFormatter.format(parseFloat(produto.preco))}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">Nenhum produto encontrado.</div>
                    )}
                </div>
            )}
        </div>
    );
}
