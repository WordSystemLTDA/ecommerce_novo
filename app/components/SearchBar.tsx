import { useEffect, useRef, useState, type FormEvent } from "react";
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
    const [suggestion, setSuggestion] = useState("");
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        let isCurrentSearch = true;
        const delayDebounceFn = setTimeout(async () => {
            const normalizedTerm = searchTerm.trim();
            if (normalizedTerm.length > 1) {
                setIsSearching(true);
                try {
                    const params = new URLSearchParams({
                        pesquisa: normalizedTerm,
                        por_pagina: "8",
                        pagina: "1",
                    });
                    const response = await produtoService.listarProdutos(params.toString());
                    if (!isCurrentSearch) return;

                    setSearchResults(response.data?.produtos ?? []);
                    setSuggestion(String(response.data?.sugestao ?? ""));
                    setShowResults(true);
                } catch (error) {
                    if (!isCurrentSearch) return;
                    console.error("Erro na busca:", error);
                    setSearchResults([]);
                    setSuggestion("");
                    setShowResults(true);
                } finally {
                    if (isCurrentSearch) setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setSuggestion("");
                setShowResults(false);
                setIsSearching(false);
            }
        }, 350);

        return () => {
            isCurrentSearch = false;
            clearTimeout(delayDebounceFn);
        };
    }, [searchTerm]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProductClick = (produto: Produto) => {
        navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
        setShowResults(false);
        setSearchTerm("");
    };

    const submitSearch = (event?: FormEvent, term = searchTerm) => {
        event?.preventDefault();
        const normalizedTerm = term.trim();
        if (normalizedTerm.length < 2) return;

        const params = new URLSearchParams({ q: normalizedTerm });
        navigate(`/?${params.toString()}#catalogo`);
        setShowResults(false);
    };

    return (
        <form className="group relative flex h-11 w-full" ref={wrapperRef} onSubmit={submitSearch} role="search">
            <input
                type="search"
                name="busca"
                id="busca"
                autoComplete="off"
                value={searchTerm}
                ref={ref}
                onChange={(event) => setSearchTerm(event.target.value)}
                onFocus={() => {
                    if (searchTerm.trim().length > 1) setShowResults(true);
                }}
                className="w-full rounded-full border border-primary/12 bg-main-bg px-5 py-2 pr-12 text-sm text-primary outline-none transition-all duration-300 placeholder:text-primary/45 focus:border-terciary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--dynamic-terciary)_12%,transparent)]"
                placeholder="Busque por produto, marca, cor ou tamanho"
                aria-controls="resultados-busca"
                aria-expanded={showResults}
            />
            <button type="submit" aria-label="Buscar" className="absolute right-0 top-0 h-full bg-transparent px-4 text-primary transition-colors hover:text-terciary">
                <MdOutlineSearch size={24} className="max-lg:hidden" />
                <IoMdClose size={24} className="hidden max-lg:block" />
            </button>

            {showResults && (
                <div id="resultados-busca" className="absolute left-0 top-full z-50 mt-2 max-h-96 w-full overflow-y-auto border border-primary/10 bg-product-bg text-primary shadow-xl" role="dialog" aria-label="Resultados da busca">
                    {isSearching ? (
                        <div className="p-4 text-center text-sm text-primary/55">Buscando...</div>
                    ) : searchResults.length > 0 ? (
                        <ul role="listbox">
                            {searchResults.map((produto) => (
                                <li
                                    key={produto.id}
                                    onClick={() => handleProductClick(produto)}
                                    className="flex cursor-pointer items-center gap-3 border-b border-primary/8 p-3 transition-colors last:border-0 hover:bg-primary/5"
                                    role="option"
                                    aria-selected="false"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-main-bg">
                                        <OptimizedImage
                                            src={produto.imagens?.[0] ?? produto.fotos?.m?.[0]}
                                            fallbackSrc={getProductImageFallback(produto.nome)}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex min-w-0 flex-col">
                                        <span className="line-clamp-1 text-sm font-medium text-primary">{produto.nome}</span>
                                        <span className="text-xs text-primary/55">{produto.nomeMarca || produto.nomeCategoria}</span>
                                        <span className="text-xs font-bold text-primary">
                                            {currencyFormatter.format(parseFloat(produto.preco))}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : suggestion ? (
                        <button type="button" onClick={() => submitSearch(undefined, suggestion)} className="w-full p-4 text-left text-sm text-primary hover:bg-primary/5">
                            Você quis dizer <strong>“{suggestion}”</strong>?
                        </button>
                    ) : (
                        <div className="p-4 text-center text-sm text-primary/55">Nenhum produto encontrado. Tente outra palavra.</div>
                    )}

                    {!isSearching && searchTerm.trim().length > 1 && (
                        <button type="button" onClick={() => submitSearch()} className="sticky bottom-0 w-full border-t border-primary/10 bg-product-bg px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-terciary hover:bg-primary/5">
                            Ver todos os resultados para “{searchTerm.trim()}”
                        </button>
                    )}
                </div>
            )}
        </form>
    );
}
