import { useState } from "react";
import { MdMenu, MdLocationOn, MdHeadsetMic, MdKeyboardArrowDown } from "react-icons/md";
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