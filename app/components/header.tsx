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
    const isPrietoKouros = config.EMPRESAS.includes('3');
    const mobileCategorias = (categoriasMenu && categoriasMenu.length > 0 ? categoriasMenu : categorias) ?? [];

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const onAddressSelect = async (address: Endereco) => {
        await handleAddressSelect(address);
        setIsAddressModalOpen(false);
    };

    return (
        <header className={`w-full sticky top-0 z-50 flex flex-col backdrop-blur-none lg:backdrop-blur-md shadow-[0_8px_30px_rgba(2,6,23,0.16)] ${isPrietoKouros ? 'bg-secondary/95' : 'bg-primary/95'}`}>
            <div className={`flex flex-row items-center w-full relative ${isPrietoKouros ? 'border-b border-primary/15' : 'border-b border-white/10'}`}>
                <button onClick={() => setIsMobileMenuOpen(true)} className={`lg:hidden p-2 ml-2 rounded-lg ${isPrietoKouros ? 'text-primary hover:bg-primary/10' : 'text-white hover:bg-white/10'}`}>
                    <MdMenu size={28} className="cursor-pointer" />
                </button>

                <div className="w-auto px-4 lg:px-0 lg:w-55 flex items-center justify-center absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
                    {isPrietoKouros ? (
                        <button
                            type="button"
                            aria-label="Ir para a página inicial"
                            onClick={() => {
                                const currentParams = new URLSearchParams(window.location.search);
                                navigate('/' + (currentParams.toString() ? '?' + currentParams.toString() : ''));
                            }}
                            className="cursor-pointer"
                        >
                            <div
                                className="w-20 lg:w-40 aspect-[2048/431] bg-primary"
                                style={{
                                    WebkitMaskImage: "url('/logo_prieto_kouros_preto.png')",
                                    maskImage: "url('/logo_prieto_kouros_preto.png')",
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
                            onClick={() => {
                                const currentParams = new URLSearchParams(window.location.search);
                                navigate('/' + (currentParams.toString() ? '?' + currentParams.toString() : ''));
                            }}
                            src="/logo.png"
                            alt="Logo"
                            priority
                            className="w-20 lg:w-40 cursor-pointer object-contain"
                        />
                    )}
                </div>

                <div className="flex-1 w-full px-2 lg:px-8 py-4">

                    <div className="flex items-center gap-2 lg:gap-8 justify-end lg:justify-between">
                        <div
                            className={`hidden lg:flex items-center gap-2 min-w-fit cursor-pointer hover:opacity-90 ${isPrietoKouros ? 'text-primary' : 'text-white'}`}
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

                        <div className="hidden lg:block flex-1 w-full">
                            <SearchBar ref={inputRef} />
                        </div>

                        <div className={`flex items-center gap-4 lg:gap-6 max-lg:pr-3 shrink-0 ${isPrietoKouros ? 'text-primary' : 'text-white'}`}>
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

                            <div className="hidden lg:flex items-center gap-4">
                                <MdHeadsetMic size={24} className={`cursor-pointer ${isPrietoKouros ? 'hover:text-primary/75' : 'hover:text-gray-200'}`} title="Atendimento" />
                                <ButtonFavoritos />
                                <ButtonCarrinho />
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center justify-between mt-3 pt-2">
                        <div className="flex items-center gap-2 w-full">
                            <div className="flex items-center gap-2 shrink-0">
                                <DepartmentMenu categorias={categorias} />
                                <ButtonMaisVendidos />
                            </div>

                            <nav className="flex items-center gap-4 ml-2  no-scrollbar flex-1">
                                {(categoriasMenu ?? []).slice(0, 12).map((categoria) => (
                                    <a
                                        key={categoria.id}
                                        onClick={() => navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`)}
                                        className={`${isPrietoKouros ? 'text-primary' : 'text-white'} text-xs font-bold hover:underline whitespace-nowrap cursor-pointer`}>
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

                        <div className="w-64 ml-4 hidden xl:block">
                            <div className={`${isPrietoKouros ? 'bg-primary text-secondary hover:opacity-90' : 'bg-white text-primary hover:bg-gray-100'} px-4 py-1 rounded-full text-xs font-bold flex items-center justify-between gap-2 cursor-pointer transition-colors`}>
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
                <div className="fixed inset-0 z-[60] flex lg:hidden">
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] z-0" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className={`relative z-10 w-[88%] max-w-sm h-full shadow-xl flex flex-col overflow-y-auto ${isPrietoKouros ? 'bg-secondary text-primary' : 'bg-white text-gray-800'}`}>
                        <div className={`p-4 flex justify-between items-center sticky top-0 z-10 ${isPrietoKouros ? 'bg-secondary border-b border-primary/15' : 'bg-primary text-white'}`}>
                            <span className="font-bold text-lg">Menu</span>
                            <MdClose size={24} className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)} />
                        </div>

                        <div className={`p-4 border-b ${isPrietoKouros ? 'border-primary/15' : 'border-gray-100'}`}>
                            <div
                                className={`flex items-center gap-2 cursor-pointer ${isPrietoKouros ? 'text-primary' : 'text-gray-700'}`}
                                onClick={() => {
                                    setIsAddressModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <MdLocationOn size={20} className="text-primary" />
                                <div className="flex flex-col text-xs leading-tight">
                                    <span className="opacity-80">Enviar para:</span>
                                    <span className="font-bold underline text-primary">
                                        {selectedAddress
                                            ? `${selectedAddress.endereco}, ${selectedAddress.numero}`
                                            : "Selecione o endereço"
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 grid grid-cols-3 gap-3 border-b text-center ${isPrietoKouros ? 'border-primary/15' : 'border-gray-100'}`}>
                            <button className="flex flex-col items-center gap-2" onClick={() => { navigate('/minha-conta'); setIsMobileMenuOpen(false); }}>
                                <div className={`${isPrietoKouros ? 'bg-primary text-secondary' : 'bg-primary text-white'} p-2.5 rounded-xl`}>
                                    <MdPersonOutline size={20} />
                                </div>
                                <span className={`text-tiny ${isPrietoKouros ? 'text-primary/90' : 'text-gray-600'}`}>Conta</span>
                            </button>
                            <button className="flex flex-col items-center gap-2" onClick={() => { navigate('/minha-conta/favoritos'); setIsMobileMenuOpen(false); }}>
                                <div className={`${isPrietoKouros ? 'bg-primary text-secondary' : 'bg-primary text-white'} p-2.5 rounded-xl`}>
                                    <MdOutlineFavoriteBorder size={20} />
                                </div>
                                <span className={`text-tiny ${isPrietoKouros ? 'text-primary/90' : 'text-gray-600'}`}>Favoritos</span>
                            </button>
                            <button className="flex flex-col items-center gap-2" onClick={() => { navigate('/carrinho'); setIsMobileMenuOpen(false); }}>
                                <div className={`${isPrietoKouros ? 'bg-primary text-secondary' : 'bg-primary text-white'} p-2.5 rounded-xl`}>
                                    <MdOutlineShoppingCart size={20} />
                                </div>
                                <span className={`text-tiny ${isPrietoKouros ? 'text-primary/90' : 'text-gray-600'}`}>Carrinho</span>
                            </button>
                        </div>


                        <div className="p-4 flex flex-col gap-4 pb-8">
                            <div className="flex flex-col gap-2">
                                <h3 className={`font-bold ${isPrietoKouros ? 'text-primary' : 'text-gray-800'}`}>Departamentos</h3>
                                {mobileCategorias.map((categoria) => (
                                    <a
                                        key={categoria.id}
                                        onClick={() => {
                                            navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`py-3 border-b cursor-pointer text-sm ${isPrietoKouros ? 'text-primary/90 border-primary/10 hover:text-primary' : 'text-gray-600 border-gray-50 hover:text-primary'}`}
                                    >
                                        {categoria.nome}
                                    </a>
                                ))}

                                {mobileCategorias.length === 0 && (
                                    <div className={`mt-2 rounded-xl border px-3 py-4 text-sm ${isPrietoKouros ? 'border-primary/20 text-primary/80 bg-primary/5' : 'border-gray-200 text-gray-500 bg-gray-50'}`}>
                                        Nenhum departamento disponivel no momento.
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