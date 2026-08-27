import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineSearch } from "react-icons/md";
import { useNavigate } from "react-router";
import { produtoService } from "~/features/produto/services/produtoService";
import type { Produto } from "~/features/produto/types";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import { getProductImageFallback } from "~/utils/imagePlaceholders";
import { OptimizedImage } from "./OptimizedImage";

export function SearchBar({ ref }: { ref: React.RefObject<HTMLInputElement | null> }) {
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
        <div className="group relative flex h-11 w-full" ref={wrapperRef}>
            <input
                type="search"
                name="busca"
                id="busca"
                autoComplete="off"
                value={searchTerm}
                ref={ref}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                    if (searchResults.length > 0) setShowResults(true);
                }}
                className="w-full rounded-full border border-primary/12 bg-main-bg px-5 py-2 pr-12 text-sm text-primary outline-none transition-all duration-300 placeholder:text-primary/45 focus:border-terciary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--dynamic-terciary)_12%,transparent)]"
                placeholder="Busque por produto, marca ou categoria"
            />
            <button type="button" aria-label="Buscar" className="absolute right-0 top-0 h-full bg-transparent px-4 text-primary transition-colors hover:text-terciary">
                <MdOutlineSearch size={24} className="max-lg:hidden" />
                <IoMdClose size={24} className="hidden max-lg:block" />
            </button>


            {showResults && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-96 w-full overflow-y-auto border border-primary/10 bg-product-bg text-primary shadow-xl">
                    {isSearching ? (
                        <div className="p-4 text-center text-sm text-primary/55">Buscando...</div>
                    ) : searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((produto) => (
                                <li
                                    key={produto.id}
                                    onClick={() => handleProductClick(produto)}
                                    className="flex cursor-pointer items-center gap-3 border-b border-primary/8 p-3 transition-colors last:border-0 hover:bg-primary/5"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-main-bg">
                                        <OptimizedImage
                                            src={produto.imagens?.[0] ?? produto.fotos?.m?.[0]}
                                            fallbackSrc={getProductImageFallback(produto.nome)}
                                            alt={produto.nome}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="line-clamp-1 text-sm font-medium text-primary">{produto.nome}</span>
                                        <span className="text-xs font-bold text-primary">
                                            {currencyFormatter.format(parseFloat(produto.preco))}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm text-primary/55">Nenhum produto encontrado.</div>
                    )}
                </div>
            )}
        </div>
    );
}

