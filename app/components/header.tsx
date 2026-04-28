import { useRef, useState } from "react";
import { MdClose, MdHeadsetMic, MdKeyboardArrowDown, MdLocationOn, MdMenu, MdOutlineFavoriteBorder, MdOutlineShoppingCart, MdPersonOutline } from "react-icons/md";
import { useNavigate } from "react-router";
import config from "~/config/config";
import { useHeader } from "~/context/HeaderContext";
import type { Endereco } from "~/features/minhaconta/types";
import { gerarSlug } from "~/utils/formatters";
import { AddressSelectionModal } from "./AddressSelectionModal";
import DepartmentMenu from "./departament";
import { ButtonBuscar, ButtonCarrinho, ButtonConta, ButtonEntreOuCadastrese, ButtonFavoritos, ButtonMaisVendidos, ButtonMore } from "./HeaderButtons";
import { OptimizedImage } from "./OptimizedImage";
import { SearchBar } from "./SearchBar";

export default function Header() {
    let navigate = useNavigate();
    const { categorias, categoriasMenu, selectedAddress, handleAddressSelect } = useHeader();
    const mobileCategorias = (categoriasMenu && categoriasMenu.length > 0 ? categoriasMenu : categorias) ?? [];

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const onAddressSelect = async (address: Endereco) => {
        await handleAddressSelect(address);
        setIsAddressModalOpen(false);
    };

    const navigateHome = () => {
        const currentParams = new URLSearchParams(window.location.search);
        navigate('/' + (currentParams.toString() ? '?' + currentParams.toString() : ''));
    };

    return (
        <header className="w-full sticky top-0 z-50 flex flex-col bg-header-bg border-b border-primary/10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-x-clip">
            <div className="flex flex-row items-center w-full relative min-w-0">
                <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 ml-2 text-primary hover:text-terciary transition-colors duration-300">
                    <MdMenu size={28} className="cursor-pointer" />
                </button>

                <div className="w-auto px-4 lg:px-0 lg:w-48 xl:w-55 flex items-center justify-center absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
                    {config.LOGO_HEADER_TIPO === 'mask' ? (
                        <button
                            type="button"
                            aria-label="Ir para a página inicial"
                            onClick={navigateHome}
                            className="cursor-pointer"
                        >
                            <div
                                className={`${config.LOGO_MASK?.classe ?? 'w-20 lg:w-36 xl:w-40'} ${config.LOGO_MASK?.aspect ?? 'aspect-2048/431'} bg-primary`}
                                style={{
                                    WebkitMaskImage: `url('${config.LOGO_HEADER}')`,
                                    maskImage: `url('${config.LOGO_HEADER}')`,
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                    maskPosition: 'center',
                                    WebkitMaskSize: 'contain',
                                    maskSize: 'contain',
                                }}
                            />
                        </button>
                    ) : (
                        <OptimizedImage
                            onClick={navigateHome}
                            src={config.LOGO_HEADER}
                            alt={config.LOGO_ALT}
                            priority
                            className="w-20 lg:w-36 xl:w-40 cursor-pointer object-contain"
                        />
                    )}
                </div>

                <div className="flex-1 w-full px-2 lg:px-4 xl:px-8 py-4 min-w-0">
                    <div className="flex items-center gap-2 lg:gap-4 xl:gap-8 justify-end lg:justify-between min-w-0">
                        <div
                            className="hidden 2xl:flex items-center gap-2 min-w-fit cursor-pointer text-primary/70 hover:text-terciary transition-colors duration-500"
                            onClick={() => setIsAddressModalOpen(true)}
                        >
                            <MdLocationOn size={20} />
                            <div className="flex flex-col text-xs leading-tight">
                                <span className="opacity-70 tracking-wide">Enviar para</span>
                                <span className="font-medium text-primary border-b border-primary/30">
                                    {selectedAddress
                                        ? `${selectedAddress.endereco}, ${selectedAddress.numero}`
                                        : "Selecione o endereço"
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="hidden lg:block flex-1 w-full min-w-0 max-w-[620px] 2xl:max-w-none">
                            <SearchBar ref={inputRef} />
                        </div>

                        <div className="flex items-center gap-3 xl:gap-6 max-lg:pr-3 shrink-0 text-primary">
                            <ButtonEntreOuCadastrese />

                            <div className="lg:hidden">
                                <ButtonBuscar
                                    aoClicar={() => {
                                        if (inputRef.current) {
                                            inputRef.current.focus();
                                        }
                                        setIsSearchBarOpen(isSearchBarOpen => !isSearchBarOpen);
                                    }}
                                />
                            </div>

                            <div className="lg:hidden">
                                <ButtonConta />
                            </div>

                            <div className="lg:hidden">
                                <ButtonCarrinho />
                            </div>

                            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
                                <MdHeadsetMic size={22} className="cursor-pointer text-primary/70 hover:text-terciary transition-colors duration-300" title="Atendimento" />
                                <ButtonFavoritos />
                                <ButtonCarrinho />
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center justify-between mt-3 pt-2 border-t border-primary/8 min-w-0">
                        <div className="flex items-center gap-2 w-full min-w-0">
                            <div className="flex items-center gap-2 shrink-0">
                                <DepartmentMenu categorias={categorias} />
                                <ButtonMaisVendidos />
                            </div>

                            <nav className="flex items-center gap-4 xl:gap-6 ml-2 no-scrollbar flex-1 min-w-0 overflow-x-auto overflow-y-hidden whitespace-nowrap">
                                {(categoriasMenu ?? []).slice(0, 12).map((categoria) => (
                                    <a
                                        key={categoria.id}
                                        onClick={() => navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`)}
                                        className="text-tiny uppercase tracking-[0.15em] font-medium text-primary/70 hover:text-terciary whitespace-nowrap cursor-pointer transition-colors duration-500">
                                        {categoria.nome}
                                    </a>
                                ))}
                                {categoriasMenu.length > 12 && (
                                    <div className="shrink-0 ml-2">
                                        <ButtonMore hiddenCategories={categoriasMenu.slice(12)} />
                                    </div>
                                )}
                            </nav>
                        </div>

                        <div className="w-64 ml-4 hidden 2xl:block shrink-0">
                            <div className="border border-primary/20 px-4 py-1.5 text-tiny uppercase tracking-[0.2em] font-medium text-primary flex items-center justify-between gap-2 cursor-pointer hover:border-terciary hover:text-terciary transition-colors duration-500">
                                Seja um sócio
                                <MdKeyboardArrowDown className="-rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`lg:hidden px-4 pb-3 w-full ${isSearchBarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                <SearchBar ref={inputRef} />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-60 flex lg:hidden">
                    <div className="absolute inset-0 bg-primary/40 z-0" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative z-10 w-[88%] max-w-sm h-full shadow-xl flex flex-col overflow-y-auto bg-header-bg text-primary">
                        <div className="p-4 flex justify-between items-center sticky top-0 z-10 bg-primary border-b border-primary">
                            <span className="text-tiny uppercase tracking-[0.25em] font-medium text-secondary">Menu</span>
                            <MdClose size={24} className="cursor-pointer text-secondary hover:text-terciary transition-colors" onClick={() => setIsMobileMenuOpen(false)} />
                        </div>

                        <div className="p-4 border-b border-primary/10">
                            <div
                                className="flex items-center gap-2 cursor-pointer text-primary/70 hover:text-terciary transition-colors duration-300"
                                onClick={() => {
                                    setIsAddressModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <MdLocationOn size={18} />
                                <div className="flex flex-col text-xs leading-tight">
                                    <span className="opacity-70">Enviar para</span>
                                    <span className="font-medium text-primary">
                                        {selectedAddress
                                            ? `${selectedAddress.endereco}, ${selectedAddress.numero}`
                                            : "Selecione o endereço"
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-3 gap-3 border-b border-primary/10 text-center">
                            <button className="flex flex-col items-center gap-2" onClick={() => { navigate('/minha-conta'); setIsMobileMenuOpen(false); }}>
                                <div className="bg-primary text-secondary p-2.5">
                                    <MdPersonOutline size={20} />
                                </div>
                                <span className="text-tiny text-primary/70 tracking-wider uppercase">Conta</span>
                            </button>
                            <button className="flex flex-col items-center gap-2" onClick={() => { navigate('/minha-conta/favoritos'); setIsMobileMenuOpen(false); }}>
                                <div className="bg-primary text-secondary p-2.5">
                                    <MdOutlineFavoriteBorder size={20} />
                                </div>
                                <span className="text-tiny text-primary/70 tracking-wider uppercase">Favoritos</span>
                            </button>
                            <button className="flex flex-col items-center gap-2" onClick={() => { navigate('/carrinho'); setIsMobileMenuOpen(false); }}>
                                <div className="bg-primary text-secondary p-2.5">
                                    <MdOutlineShoppingCart size={20} />
                                </div>
                                <span className="text-tiny text-primary/70 tracking-wider uppercase">Carrinho</span>
                            </button>
                        </div>

                        <div className="p-4 flex flex-col gap-4 pb-8">
                            <div className="flex flex-col gap-0">
                                <h3 className="text-tiny uppercase tracking-[0.25em] font-medium text-primary/70 mb-4">Departamentos</h3>
                                {mobileCategorias.map((categoria) => (
                                    <a
                                        key={categoria.id}
                                        onClick={() => {
                                            navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="py-3 border-b border-primary/8 cursor-pointer text-sm text-primary hover:text-terciary hover:pl-2 transition-all duration-300"
                                    >
                                        {categoria.nome}
                                    </a>
                                ))}

                                {mobileCategorias.length === 0 && (
                                    <div className="mt-2 border border-primary/15 px-3 py-4 text-sm text-primary/70">
                                        Nenhum departamento disponível no momento.
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <ButtonMaisVendidos />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AddressSelectionModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSelectAddress={onAddressSelect}
                selectedAddressId={selectedAddress?.id}
            />
        </header>
    );
}
