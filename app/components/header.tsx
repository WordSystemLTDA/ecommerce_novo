import { useState } from "react";
import { MdMenu, MdLocationOn, MdHeadsetMic, MdKeyboardArrowDown, MdClose } from "react-icons/md";
import { useNavigate } from "react-router";
import DepartmentMenu from "./departament";
import { useAuth } from "~/features/auth/context/AuthContext";
import { AddressSelectionModal } from "./AddressSelectionModal";
import type { Endereco } from "~/features/minhaconta/types";
import { gerarSlug } from "~/utils/formatters";
import { useHeader } from "~/context/HeaderContext";
import { SearchBar } from "./SearchBar";
import { ButtonEntreOuCadastrese, ButtonFavoritos, ButtonCarrinho, ButtonMaisVendidos, ButtonMore } from "./HeaderButtons";

export default function Header() {
    let navigate = useNavigate();
    const { cliente, isAuthenticated } = useAuth();
    const { categorias, categoriasMenu, selectedAddress, handleAddressSelect } = useHeader();

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const onAddressSelect = async (address: Endereco) => {
        await handleAddressSelect(address);
        setIsAddressModalOpen(false);
    };

    return (
        <header className="w-full bg-primary sticky top-0 z-50 flex flex-col relative">
            <div className="flex flex-row items-center w-full">
                <div className="w-auto px-4 lg:px-0 lg:w-55 flex items-center justify-center">
                    <img
                        onClick={() => {
                            const currentParams = new URLSearchParams(window.location.search);
                            navigate('/' + (currentParams.toString() ? '?' + currentParams.toString() : ''));
                        }}
                        src="/logo_wordsystem.png"
                        alt="Logo"
                        className="w-28 lg:w-40 cursor-pointer object-contain"
                    />
                </div>

                <div className="flex-1 w-full px-2 lg:px-8 py-3">

                    <div className="flex items-center gap-2 lg:gap-8 justify-end lg:justify-between">
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

                        <div className="hidden lg:block flex-1 w-full max-w-2xl">
                            <SearchBar />
                        </div>

                        <div className="flex items-center gap-2 lg:gap-6 text-white shrink-0">
                            <ButtonEntreOuCadastrese />

                            <div className="hidden lg:flex items-center gap-4">
                                <MdHeadsetMic size={24} className="cursor-pointer hover:text-gray-200" title="Atendimento" />
                                <ButtonFavoritos />
                                <ButtonCarrinho />
                            </div>

                            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1">
                                <MdMenu size={28} className="cursor-pointer" />
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center justify-between mt-3 pt-2">
                        <div className="flex items-center gap-2 w-full">
                            <div className="flex items-center gap-2 shrink-0">
                                <DepartmentMenu categorias={categorias} />
                                <ButtonMaisVendidos />
                            </div>

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

                        <div className="w-64 ml-4 hidden xl:block">
                            <div className="bg-white text-primary px-4 py-1 rounded-full text-xs font-bold flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                                Seja um sócio
                                <MdKeyboardArrowDown className="-rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden px-4 pb-3 w-full">
                <SearchBar />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative bg-white w-[80%] max-w-xs h-full shadow-xl flex flex-col overflow-y-auto">
                        <div className="p-4 bg-primary text-white flex justify-between items-center">
                            <span className="font-bold text-lg">Menu</span>
                            <MdClose size={24} className="cursor-pointer" onClick={() => setIsMobileMenuOpen(false)} />
                        </div>

                        <div className="p-4 border-b border-gray-100">
                            <div
                                className="flex items-center gap-2 text-gray-700 cursor-pointer"
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

                        <div className="p-4 grid grid-cols-4 gap-4 border-b border-gray-100 text-center">
                            <div className="flex flex-col items-center gap-1" onClick={() => { setIsMobileMenuOpen(false); /* Navigate favored */ }}>
                                <div className="bg-primary p-2 rounded-full text-white">
                                    <MdHeadsetMic size={20} />
                                </div>
                                <span className="text-[10px] text-gray-600">Atend.</span>
                            </div>
                            {/* Wrapper for existing buttons if they don't have text labels internally, otherwise simpler icons */}
                            <div className="flex flex-col items-center gap-1">
                                <div className="bg-primary p-2 rounded-full text-white flex items-center justify-center">
                                    {/* This might need adjustment if ButtonFavoritos renders a button. Assuming it renders an icon wrapped in button */}
                                    <ButtonFavoritos />
                                </div>
                                <span className="text-[10px] text-gray-600">Favoritos</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="bg-primary p-2 rounded-full text-white flex items-center justify-center">
                                    <ButtonCarrinho />
                                </div>
                                <span className="text-[10px] text-gray-600">Carrinho</span>
                            </div>
                        </div>


                        <div className="p-4 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <h3 className="font-bold text-gray-800">Departamentos</h3>
                                {categoriasMenu?.map((categoria) => (
                                    <a
                                        key={categoria.id}
                                        onClick={() => {
                                            navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="text-gray-600 py-2 border-b border-gray-50 hover:text-primary cursor-pointer"
                                    >
                                        {categoria.nome}
                                    </a>
                                ))}
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