import { useEffect, useState, useRef } from "react";
import { MdKeyboardArrowDown, MdMenu, MdOutlineFavorite, MdOutlineSearch, MdPerson, MdLocationOn, MdHeadsetMic, MdAccessibility, MdNotifications } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router";
import type { Categoria } from "~/features/categoria/types";
import DepartmentMenu from "./departament";
import { useAuth } from "~/features/auth/context/AuthContext";
import { AddressSelectionModal } from "./AddressSelectionModal";
import type { Endereco } from "~/features/minhaconta/types";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import { produtoService } from "~/features/produto/services/produtoService";
import type { Produto } from "~/features/produto/types";
import { useCarrinho } from "~/features/carrinho/context/CarrinhoContext";
import { useHeader } from "~/context/HeaderContext";

export default function Header() {
    let navigate = useNavigate();
    const { cliente, isAuthenticated } = useAuth();
    const { categorias, categoriasMenu, selectedAddress, handleAddressSelect } = useHeader();

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const onAddressSelect = async (address: Endereco) => {
        await handleAddressSelect(address);
        setIsAddressModalOpen(false);
    };

    return (
        <header className="w-full bg-primary sticky top-0 z-50 flex flex-row items-center">
            {/* Logo */}
            <div className="w-55 flex items-center justify-center">
                <img
                    onClick={() => {
                        const currentParams = new URLSearchParams(window.location.search);
                        navigate('/' + (currentParams.toString() ? '?' + currentParams.toString() : ''));
                    }}
                    src="/logo_wordsystem.png"
                    alt="Logo"
                    className="w-32 lg:w-40 cursor-pointer object-contain"
                />
            </div>

            <div className="w-full px-4 lg:px-8 py-3">

                {/* Top Row */}
                <div className="flex items-center gap-4 lg:gap-8">
                    {/* Location (Hidden on mobile) */}
                    <div
                        className="hidden lg:flex items-center gap-2 text-white min-w-fit cursor-pointer hover:opacity-90"
                        onClick={() => setIsAddressModalOpen(true)}
                    >
                        <MdLocationOn size={24} />
                        <div className="flex flex-col text-xs leading-tight">
                            <span className="opacity-80">Enviar para:</span>
                            <span className="font-bold underline">
                                {selectedAddress
                                    ? `${selectedAddress.endereco}, ${selectedAddress.numero}`
                                    : "Selecione o endereço"
                                }
                            </span>
                        </div>
                    </div>

                    {/* Search Bar (Flexible width) */}
                    <div className="flex-1 w-full">
                        <SearchBar />
                    </div>

                    {/* User & Icons */}
                    <div className="flex items-center gap-4 lg:gap-6 text-white shrink-0">
                        <ButtonEntreOuCadastrese />

                        <div className="hidden lg:flex items-center gap-4">
                            <MdHeadsetMic size={24} className="cursor-pointer hover:text-gray-200" title="Atendimento" />
                            {/* <MdAccessibility size={24} className="cursor-pointer hover:text-gray-200" title="Acessibilidade" />
                            <MdNotifications size={24} className="cursor-pointer hover:text-gray-200" title="Notificações" /> */}
                            <ButtonFavoritos />
                            <ButtonCarrinho />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <MdMenu size={28} className="lg:hidden cursor-pointer" />
                    </div>
                </div>

                {/* Bottom Row (Navigation) - Hidden on mobile */}
                <div className="hidden lg:flex items-center justify-between mt-3 pt-2">
                    <div className="flex items-center gap-2 w-full">
                        {/* Static Left Side (Menu + Mais Vendidos) - No overflow here */}
                        <div className="flex items-center gap-2 shrink-0">
                            <DepartmentMenu categorias={categorias} />
                            <ButtonMaisVendidos />
                        </div>

                        {/* Scrollable Right Side (Categories) */}
                        <nav className="flex items-center gap-4 ml-2 overflow-x-auto no-scrollbar flex-1">
                            {(categoriasMenu ?? []).map((categoria) => (
                                <a
                                    key={categoria.id}
                                    onClick={() => navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`)}
                                    className="text-white text-xs font-bold hover:underline whitespace-nowrap cursor-pointer">{categoria.nome}
                                </a>
                            ))}

                            {categoriasMenu.length > 10 && (
                                <ButtonMore hiddenCategories={categoriasMenu.slice(10)} />
                            )}
                        </nav>
                    </div>

                    {/* Banner Right */}
                    <div className="w-64 ml-4 hidden xl:block">
                        <div className="bg-white text-primary px-4 py-1 rounded-full text-xs font-bold flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                            Seja um sócio
                            <MdKeyboardArrowDown className="-rotate-90" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search (Visible only on mobile) */}
            <div className="lg:hidden px-4 pb-3">
                <SearchBar />
            </div>

            <AddressSelectionModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSelectAddress={onAddressSelect}
                selectedAddressId={selectedAddress?.id}
            />
        </header>
    );
}

export function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Produto[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 2) {
                setIsSearching(true);
                try {
                    // Using simple query param as supported by backend fallback
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

    // Close on click outside
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

            {/* Dropdown de Resultados */}
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

export function ButtonEntreOuCadastrese() {
    let navigate = useNavigate();
    let { isAuthenticated, cliente } = useAuth();

    return (
        <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
                if (isAuthenticated) {
                    navigate('/minha-conta');
                } else {
                    navigate('/entrar');
                }
            }}
        >
            <div className="p-1 border-2 border-white rounded-full">
                <MdPerson size={20} className="text-white" />
            </div>

            {isAuthenticated ? (
                <div>
                    <span className="text-[10px] uppercase font-bold">Olá, <span className="font-bold text-white">{cliente?.nome}</span></span>
                </div>
            )
                :
                (
                    <div className="flex flex-col leading-none sm:hidden lg:flex">
                        <span className="text-[10px] uppercase font-bold opacity-80">Olá, faça seu login</span>
                        <span className="text-xs font-bold">ou cadastre-se</span>
                    </div>
                )

            }
        </div>
    );
}

export function ButtonFavoritos() {
    return (
        <div className="cursor-pointer hover:text-gray-200 transition-colors relative">
            <MdOutlineFavorite size={24} />
        </div>
    );
}

export function ButtonCarrinho() {
    let navigate = useNavigate();
    let { produtos } = useCarrinho();

    return (
        <div
            className="cursor-pointer hover:text-gray-200 transition-colors relative"
            onClick={() => navigate('/carrinho')}
        >
            <FaShoppingCart size={24} />
            {produtos.length > 0 && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1 py-0 text-xs font-medium text-white bg-red-500 rounded-full">
                    {produtos.length}
                </span>
            )}
        </div>
    );
}

export function ButtonMaisVendidos() {
    return (
        <div className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors whitespace-nowrap">
            Mais Vendidos
        </div>
    );
}

export function ButtonOthers({ titulo }: { titulo: string }) {
    return (
        <a href="#" className="text-white text-xs font-bold hover:underline whitespace-nowrap px-2">
            {titulo}
        </a>
    );
}

export function ButtonMore({ hiddenCategories }: { hiddenCategories: Categoria[] }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="flex items-center gap-1 cursor-pointer text-white hover:text-gray-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="text-xs font-bold">Mais</span>
            <MdKeyboardArrowDown
                size={16}
                className={`transition-transform duration-300 ${isHovered ? '-rotate-180' : 'rotate-0'}`}
            />
        </div>
    );
}