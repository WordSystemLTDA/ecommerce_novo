import { useRef, useState } from "react";
import { MdClose, MdHeadsetMic, MdKeyboardArrowDown, MdLocationOn, MdMenu, MdOutlineFavoriteBorder, MdOutlineShoppingCart, MdPersonOutline } from "react-icons/md";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import config from "~/config/config";
import { useHeader } from "~/context/HeaderContext";
import { useAuth } from "~/features/auth/context/AuthContext";
import type { Endereco } from "~/features/minhaconta/types";
import { gerarSlug } from "~/utils/formatters";
import { AddressSelectionModal } from "./AddressSelectionModal";
import DepartmentMenu from "./departament";
import { ButtonBuscar, ButtonCarrinho, ButtonConta, ButtonEntreOuCadastrese, ButtonFavoritos, ButtonMaisVendidos, ButtonMore } from "./HeaderButtons";
import { OptimizedImage } from "./OptimizedImage";
import { SearchBar } from "./SearchBar";

export default function Header() {
    let navigate = useNavigate();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { categorias, categoriasMenu, selectedAddress, handleAddressSelect } = useHeader();
    const mobileCategorias = categorias ?? [];

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsMobileMenuOpen(false);
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (!isPartnerModalOpen) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsPartnerModalOpen(false);
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPartnerModalOpen]);

    const onAddressSelect = async (address: Endereco) => {
        await handleAddressSelect(address);
        setIsAddressModalOpen(false);
    };

    const navigateHome = () => {
        const currentParams = new URLSearchParams(window.location.search);
        navigate('/' + (currentParams.toString() ? '?' + currentParams.toString() : ''));
    };

    return (
        <header className="sticky top-0 z-50 flex w-full flex-col overflow-x-clip border-b border-primary/10 bg-header-bg pt-[env(safe-area-inset-top)] shadow-[0_3px_18px_rgba(0,0,0,0.06)]">
            <div className="page-container relative flex min-h-[4.25rem] w-full min-w-0 flex-row items-center gap-1 px-3 sm:px-4 lg:min-h-16 lg:gap-0">
                <button
                    type="button"
                    aria-label="Abrir menu"
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-secondary/30 text-primary shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-terciary/40 hover:bg-primary hover:text-secondary active:scale-95 lg:hidden"
                >
                    <MdMenu size={24} className="cursor-pointer" />
                </button>

                <div className="flex min-w-0 flex-1 items-center justify-start overflow-hidden px-2 lg:w-48 lg:flex-none lg:justify-center lg:overflow-visible lg:px-0 xl:w-55">
                    {config.LOGO_HEADER_TIPO === 'mask' ? (
                        <button
                            type="button"
                            aria-label="Ir para a página inicial"
                            onClick={navigateHome}
                            className="flex min-h-10 max-w-full cursor-pointer items-center transition-opacity hover:opacity-75"
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

                <div className="w-auto min-w-0 shrink-0 lg:w-full lg:flex-1 lg:px-4 lg:py-4 xl:px-8">
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

                        <div className="flex shrink-0 items-center gap-1.5 text-primary sm:gap-2">
                            <div className="lg:hidden">
                                <ButtonConta compact />
                            </div>

                            <div className="flex items-center gap-0.5 rounded-full border border-primary/10 bg-secondary/25 p-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] sm:gap-1 lg:rounded-xl lg:bg-secondary/20 lg:p-1 lg:shadow-[0_2px_10px_rgba(0,0,0,0.035)]">
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
                                    <ButtonFavoritos />
                                </div>

                                <div className="lg:hidden">
                                    <ButtonCarrinho />
                                </div>

                                <div className="hidden items-center gap-0.5 lg:flex">
                                    <button
                                        type="button"
                                        aria-label="Abrir atendimento"
                                        title="Atendimento"
                                        onClick={() => navigate('/contato')}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-primary/70 transition-all duration-300 hover:bg-primary/[0.07] hover:text-terciary active:scale-95"
                                    >
                                        <MdHeadsetMic size={21} />
                                    </button>
                                    <ButtonFavoritos />
                                    <ButtonCarrinho />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center justify-between mt-3 pt-2 border-t border-primary/8 min-w-0">
                        <div className="flex items-center gap-2 w-full min-w-0">
                            <div className="flex items-center gap-2 shrink-0">
                                <DepartmentMenu categorias={categorias} />
                                <ButtonMaisVendidos />
                            </div>

                            <nav className="no-scrollbar ml-2 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto overflow-y-hidden whitespace-nowrap xl:gap-2">
                                {(categoriasMenu ?? []).slice(0, 5).map((categoria) => (
                                    <a
                                        key={categoria.id}
                                        title={categoria.nome}
                                        onClick={() => navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`)}
                                        className="inline-flex h-[34px] min-w-[4.25rem] max-w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-secondary/35 px-2.5 text-tiny font-medium uppercase tracking-[0.15em] text-primary/70 transition-all duration-300 hover:bg-primary/[0.06] hover:text-primary">
                                        <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                            {categoria.nome}
                                        </span>
                                    </a>
                                ))}
                                {categoriasMenu.length > 5 && (
                                    <div className="ml-0.5 shrink-0">
                                        <ButtonMore hiddenCategories={categoriasMenu.slice(5)} />
                                    </div>
                                )}
                            </nav>
                        </div>

                        <div className="ml-4 hidden w-56 shrink-0 xl:block 2xl:w-64">
                            <button
                                type="button"
                                aria-haspopup="dialog"
                                aria-expanded={isPartnerModalOpen}
                                onClick={() => setIsPartnerModalOpen(true)}
                                className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-primary/20 px-4 py-2 text-tiny font-medium uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:border-primary/35 hover:bg-primary/[0.045]"
                            >
                                Seja um sócio
                                <MdKeyboardArrowDown className="-rotate-90" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`w-full border-t border-primary/8 px-3 pb-3 pt-2 transition-all duration-300 lg:hidden ${isSearchBarOpen ? 'block' : 'hidden'}`}>
                <SearchBar ref={inputRef} />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-60 flex h-dvh lg:hidden">
                    <button type="button" aria-label="Fechar menu" className="absolute inset-0 z-0 bg-primary/45 backdrop-blur-[2px]" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="relative z-10 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto rounded-r-[1.75rem] bg-header-bg text-primary shadow-[12px_0_40px_rgba(0,0,0,0.2)]">
                        <div className="sticky top-0 z-10 flex items-center justify-between bg-primary px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
                            <div>
                                <span className="block text-[10px] font-medium uppercase tracking-[0.28em] text-secondary/65">Navegação</span>
                                <span className="mt-0.5 block text-base font-semibold text-secondary">Menu principal</span>
                            </div>
                            <button type="button" aria-label="Fechar menu" className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/20 text-secondary transition-all hover:rotate-90 hover:border-terciary hover:text-terciary" onClick={() => setIsMobileMenuOpen(false)}>
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="border-b border-primary/10 p-4">
                            <div
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-primary/10 bg-secondary/25 p-3 text-primary/70 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors duration-300 hover:border-terciary/40 hover:text-terciary"
                                onClick={() => {
                                    setIsAddressModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-secondary">
                                    <MdLocationOn size={18} />
                                </div>
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

                        <div className="grid grid-cols-3 gap-2 border-b border-primary/10 p-4 text-center">
                            <button
                                type="button"
                                disabled={isAuthLoading}
                                aria-busy={isAuthLoading}
                                className={`flex min-w-0 flex-col items-center gap-2 rounded-xl border px-1 py-3 transition-all ${isAuthLoading
                                    ? 'cursor-wait border-primary/10 bg-primary/5 opacity-60'
                                    : isAuthenticated
                                        ? 'border-primary/15 bg-primary/8 hover:-translate-y-0.5 hover:border-terciary/40'
                                        : 'border-terciary/30 bg-terciary/10 hover:-translate-y-0.5 hover:border-terciary'
                                    }`}
                                onClick={() => {
                                    if (isAuthLoading) return;
                                    navigate(isAuthenticated ? '/minha-conta' : '/entrar');
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-secondary ${isAuthenticated ? 'bg-primary' : 'bg-terciary'}`}>
                                    <MdPersonOutline size={20} />
                                </div>
                                <span className="flex flex-col text-primary/75">
                                    <span className="text-[9px] font-semibold uppercase leading-tight tracking-[0.08em]">
                                        {isAuthLoading ? 'Verificando' : isAuthenticated ? 'Minha Conta' : 'Entrar ou'}
                                    </span>
                                    <span className="mt-0.5 text-[8px] leading-tight">
                                        {isAuthLoading ? 'sua conta' : isAuthenticated ? 'Pedidos e dados' : 'Cadastre-se'}
                                    </span>
                                </span>
                            </button>
                            <button className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-primary/10 bg-secondary/20 px-1 py-3 transition-all hover:-translate-y-0.5 hover:border-terciary/40" onClick={() => { navigate('/minha-conta/favoritos'); setIsMobileMenuOpen(false); }}>
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-secondary">
                                    <MdOutlineFavoriteBorder size={20} />
                                </div>
                                <span className="text-tiny text-primary/70 tracking-wider uppercase">Favoritos</span>
                            </button>
                            <button className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-primary/10 bg-secondary/20 px-1 py-3 transition-all hover:-translate-y-0.5 hover:border-terciary/40" onClick={() => { navigate('/carrinho'); setIsMobileMenuOpen(false); }}>
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-secondary">
                                    <MdOutlineShoppingCart size={20} />
                                </div>
                                <span className="text-tiny text-primary/70 tracking-wider uppercase">Carrinho</span>
                            </button>
                        </div>

                        <div className="safe-bottom flex flex-col gap-4 p-4 pb-8">
                            <div className="flex flex-col gap-0">
                                <h3 className="mb-2 px-1 text-tiny font-semibold uppercase tracking-[0.25em] text-primary/70">Departamentos</h3>
                                {mobileCategorias.map((categoria) => (
                                    <a
                                        key={categoria.id}
                                        onClick={() => {
                                            navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex cursor-pointer items-center justify-between border-b border-primary/8 px-1 py-3 text-sm text-primary transition-all duration-300 hover:pl-2 hover:text-terciary"
                                    >
                                        <span>{categoria.nome}</span>
                                        <MdKeyboardArrowDown size={18} className="-rotate-90 opacity-45" />
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

            {isPartnerModalOpen && (
                <div
                    className="fixed inset-0 z-[70] flex items-end justify-center bg-primary/55 px-4 pb-4 backdrop-blur-sm sm:items-center sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="partner-modal-title"
                    aria-describedby="partner-modal-description"
                >
                    <button
                        type="button"
                        aria-label="Fechar aviso de projeto em desenvolvimento"
                        tabIndex={-1}
                        className="absolute inset-0 cursor-default"
                        onClick={() => setIsPartnerModalOpen(false)}
                    />

                    <div className="relative w-full max-w-md border border-primary/10 bg-product-bg p-6 text-primary shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-7">
                        <button
                            type="button"
                            onClick={() => setIsPartnerModalOpen(false)}
                            aria-label="Fechar"
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-primary/10 text-primary/60 transition-colors hover:border-terciary hover:text-terciary"
                        >
                            <MdClose size={20} />
                        </button>

                        <p className="mb-3 text-tiny font-semibold uppercase tracking-[0.25em] text-terciary">
                            Em breve
                        </p>
                        <h2 id="partner-modal-title" className="pr-10 font-serif text-2xl leading-tight text-primary">
                            Projeto em Desenvolvimento
                        </h2>
                        <p id="partner-modal-description" className="mt-4 text-sm leading-7 text-primary/72">
                            Estamos preparando uma novidade para que você possa escolher essa opção e participar como Parceiro ou Sócio.
                        </p>

                        <button
                            type="button"
                            onClick={() => setIsPartnerModalOpen(false)}
                            autoFocus
                            className="mt-6 inline-flex min-h-11 w-full items-center justify-center bg-primary px-5 text-xs font-semibold uppercase tracking-[0.16em] text-secondary transition-colors hover:bg-terciary"
                        >
                            Entendi
                        </button>
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
