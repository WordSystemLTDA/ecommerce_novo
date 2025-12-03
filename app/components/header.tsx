import { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdMenu, MdOutlineFavorite, MdOutlineSearch, MdPerson, MdLocationOn, MdHeadsetMic, MdAccessibility, MdNotifications } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router";
import { categoriaService } from "~/features/categoria/services/categoriaService";
import type { Categoria } from "~/features/categoria/types";
import DepartmentMenu from "./departament";
import { useAuth } from "~/features/auth/context/AuthContext";
import { AddressSelectionModal } from "./AddressSelectionModal";
import type { Endereco } from "~/features/minhaconta/types";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";

export default function Header() {
    let navigate = useNavigate();
    const { cliente, isAuthenticated } = useAuth();

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriasMenu, setCategoriasMenu] = useState<Categoria[]>([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Endereco | null>(null);

    const handleAddressSelect = async (address: Endereco) => {
        if (!cliente?.id) return;

        try {
            // Optimistic update
            setSelectedAddress(address);
            setIsAddressModalOpen(false);

            // Update backend
            await minhacontaService.editarEndereco(address.id, {
                cep: address.cep,
                logradouro: address.endereco,
                numero: address.numero,
                bairro: address.nome_bairro,
                cidade: address.nome_cidade,
                uf: address.sigla_estado,
                id_cliente: cliente.id,
                padrao: 'Sim',
                complemento: address.complemento
            });
        } catch (error) {
            console.error("Erro ao atualizar endereço padrão:", error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const { data } = await categoriaService.listarCategoriasComSubCategorias();
                const { data: dataMenu } = await categoriaService.listarCategoriasMenu();
                setCategorias(data ?? []);
                setCategoriasMenu(dataMenu ?? []);

                // Load default address if logged in
                if (isAuthenticated && cliente?.id) {
                    const response = await minhacontaService.listarEnderecos(cliente.id);
                    if (response && Array.isArray(response.data)) {
                        const defaultAddress = response.data.find(addr => addr.padrao === 'Sim');
                        if (defaultAddress) {
                            setSelectedAddress(defaultAddress);
                        } else if (response.data.length > 0) {
                            setSelectedAddress(response.data[0]);
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar categorias", error);
            }
        };

        loadInitialData();
    }, [isAuthenticated, cliente]);

    return (
        <header className="w-full bg-primary sticky top-0 z-50 flex flex-row items-center">
            {/* Logo */}
            <div className="w-55 flex items-center justify-center">
                <img
                    onClick={() => navigate('/')}
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
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <DepartmentMenu categorias={categorias} />
                        <ButtonMaisVendidos />

                        <nav className="flex items-center gap-4 ml-2">
                            {(categoriasMenu ?? []).map((categoria) => (
                                <a key={categoria.id} href="#" className="text-white text-xs font-bold hover:underline whitespace-nowrap">{categoria.nome}</a>
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
                onSelectAddress={handleAddressSelect}
                selectedAddressId={selectedAddress?.id}
            />
        </header>
    );
}

export function SearchBar() {
    return (
        <div className="flex h-10 relative w-full group">
            <input
                type="search"
                name="busca"
                id="busca"
                autoComplete="off"
                className="bg-white w-full rounded text-sm px-4 border-0 outline-none text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-secondary transition-shadow"
                placeholder="Busque na Loja!"
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-transparent text-primary hover:text-secondary transition-colors">
                <MdOutlineSearch size={24} />
            </button>
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

    return (
        <div
            className="cursor-pointer hover:text-gray-200 transition-colors relative"
            onClick={() => navigate('/carrinho')}
        >
            <FaShoppingCart size={24} />
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