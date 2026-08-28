import { useEffect, useRef, useState } from "react";
import { BsPersonFill, BsPersonFillCheck } from "react-icons/bs";
import { FaChevronRight, FaShoppingCart } from "react-icons/fa";
import { MdKeyboardArrowDown, MdOutlineFavorite, MdOutlineSearch, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router";
import { useAuth } from "~/features/auth/context/AuthContext";
import { useCarrinho } from "~/features/carrinho/context/CarrinhoContext";
import type { Categoria } from "~/features/categoria/types";

export function ButtonEntreOuCadastrese() {
    let navigate = useNavigate();
    let { isAuthenticated, isLoading } = useAuth();

    const primaryLabel = isLoading
        ? "Verificando"
        : isAuthenticated
            ? "Minha Conta"
            : "Entrar ou";
    const secondaryLabel = isLoading
        ? "sua conta"
        : isAuthenticated
            ? "Pedidos e dados"
            : "Cadastre-se";

    return (
        <button
            type="button"
            aria-label={isLoading ? "Verificando sua conta" : isAuthenticated ? "Acessar minha conta e meus pedidos" : "Entrar ou cadastrar-se"}
            aria-busy={isLoading}
            title={isAuthenticated ? "Minha Conta e meus pedidos" : "Entrar ou cadastre-se"}
            disabled={isLoading}
            className={`hidden min-h-10 min-w-[132px] items-center gap-2 rounded-lg border border-transparent px-2 py-1 text-left text-primary transition-all duration-300 lg:flex ${isLoading
                ? "cursor-wait bg-primary/[0.025] text-primary/50"
                : isAuthenticated
                    ? "bg-primary/[0.055] hover:border-primary/10 hover:bg-primary/[0.09]"
                    : "bg-transparent hover:border-primary/10 hover:bg-primary/[0.055]"
                }`}
            onClick={() => {
                if (isLoading) return;

                if (isAuthenticated) {
                    navigate('/minha-conta');
                } else {
                    navigate('/entrar');
                }
            }}
        >
            <span className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${isLoading
                ? "animate-pulse border-primary/10 bg-primary/[0.025]"
                : "border-primary/15 bg-header-bg"
                }`}>
                {isAuthenticated ? (
                    <BsPersonFillCheck size={16} />
                ) : (
                    <MdPerson size={17} />
                )}
                {isAuthenticated && !isLoading && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-header-bg bg-emerald-500" aria-hidden="true" />
                )}
            </span>

            <span className="flex min-w-0 flex-col leading-none">
                <span className="whitespace-nowrap text-[11px] font-semibold">{primaryLabel}</span>
                <span className="mt-1 whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.08em] text-primary/50">
                    {secondaryLabel}
                </span>
            </span>
        </button>
    );
}

import { useFavorito } from "~/features/favoritos/context/FavoritoContext";
import { gerarSlug } from "~/utils/formatters";

export function ButtonFavoritos() {
    let navigate = useNavigate();
    const { quantidade } = useFavorito();

    return (
        <button
            type="button"
            aria-label="Abrir favoritos"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-primary transition-all duration-300 hover:bg-primary/8 hover:text-terciary active:scale-95 sm:h-10 sm:w-10 lg:h-9 lg:w-9 lg:rounded-lg lg:text-primary/70 lg:hover:bg-primary/[0.07]"
            onClick={() => navigate('/minha-conta/favoritos')}
        >
            <MdOutlineFavorite size={24} />
            {quantidade > 0 && (
                <span className="absolute right-0 top-0 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
                    {quantidade}
                </span>
            )}
        </button>
    );
}

interface ButtonBuscarProps {
    aoClicar: () => void;
}

export function ButtonBuscar({ aoClicar }: ButtonBuscarProps) {
    return (
        <button
            type="button"
            aria-label="Abrir busca"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-primary transition-all duration-300 hover:bg-primary/8 hover:text-terciary active:scale-95 sm:h-10 sm:w-10"
            onClick={aoClicar}
        >
            <MdOutlineSearch size={22} />
        </button>
    );
}


export function ButtonConta({ compact = false }: { compact?: boolean } = {}) {
    let navigate = useNavigate();
    let { isAuthenticated, isLoading } = useAuth();

    const primaryLabel = isLoading
        ? "Verificando"
        : isAuthenticated
            ? "Minha Conta"
            : "Entrar ou";
    const secondaryLabel = isLoading
        ? "sua conta"
        : isAuthenticated
            ? "Pedidos"
            : "Cadastre-se";

    if (compact) {
        return (
            <button
                type="button"
                aria-label={isLoading ? "Verificando sua conta" : isAuthenticated ? "Abrir minha conta e meus pedidos" : "Entrar ou cadastrar-se"}
                aria-busy={isLoading}
                disabled={isLoading}
                className={`relative flex h-9 min-w-[104px] items-center justify-center gap-1.5 rounded-full border px-2 text-left transition-all duration-300 active:scale-95 max-[380px]:w-9 max-[380px]:min-w-0 max-[380px]:px-0 ${isLoading
                    ? "cursor-wait border-primary/8 bg-primary/[0.025] text-primary/50"
                    : isAuthenticated
                        ? "cursor-pointer border-primary/12 bg-primary/[0.055] text-primary hover:bg-primary/[0.09]"
                        : "cursor-pointer border-primary/10 bg-primary/[0.035] text-primary hover:border-primary/15 hover:bg-primary/[0.07]"
                    }`}
                onClick={() => {
                    if (isLoading) return;

                    if (isAuthenticated) {
                        navigate('/minha-conta');
                    } else {
                        navigate('/entrar');
                    }
                }}
            >
                <span className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${isLoading
                    ? "animate-pulse border-primary/10 bg-primary/[0.025]"
                    : "border-primary/15 bg-header-bg"
                    }`}>
                    {isAuthenticated ?
                        <BsPersonFillCheck size={16} />
                        :
                        <BsPersonFill size={16} />
                    }
                    {isAuthenticated && !isLoading && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-header-bg bg-emerald-500" aria-hidden="true" />
                    )}
                </span>

                <span className="flex min-w-0 flex-col leading-none max-[380px]:hidden">
                    <span className="whitespace-nowrap text-[10px] font-semibold">{primaryLabel}</span>
                    <span className="mt-0.5 whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.06em] opacity-80">
                        {secondaryLabel}
                    </span>
                </span>
            </button>
        );
    }

    return (
        <button
            type="button"
            aria-label={isLoading ? "Verificando sua conta" : isAuthenticated ? "Abrir minha conta e meus pedidos" : "Entrar ou cadastrar-se"}
            aria-busy={isLoading}
            disabled={isLoading}
            className={`relative mx-auto flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border px-3 text-left transition-all duration-300 active:scale-[0.99] sm:max-w-xs ${isLoading
                ? "cursor-wait border-primary/8 bg-primary/[0.025] text-primary/50"
                : isAuthenticated
                    ? "cursor-pointer border-primary/12 bg-primary/[0.055] text-primary hover:bg-primary/[0.09]"
                    : "cursor-pointer border-primary/10 bg-primary/[0.035] text-primary hover:border-primary/15 hover:bg-primary/[0.07]"
                }`}
            onClick={() => {
                if (isLoading) return;

                if (isAuthenticated) {
                    navigate('/minha-conta');
                } else {
                    navigate('/entrar');
                }
            }}
        >
            <span className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isLoading
                ? "animate-pulse border-primary/10 bg-primary/[0.025]"
                : "border-primary/15 bg-header-bg"
                }`}>
                {isAuthenticated ?
                    <BsPersonFillCheck size={18} />
                    :
                    <BsPersonFill size={18} />
                }
                {isAuthenticated && !isLoading && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-header-bg bg-emerald-500" aria-hidden="true" />
                )}
            </span>

            <span className="flex min-w-0 flex-col leading-none">
                <span className="whitespace-nowrap text-[11px] font-semibold">{primaryLabel}</span>
                <span className="mt-0.5 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.06em] opacity-80">
                    {secondaryLabel}
                </span>
            </span>
        </button>
    );
}

export function ButtonCarrinho() {
    let navigate = useNavigate();
    let { produtos } = useCarrinho();

    return (
        <button
            type="button"
            aria-label="Abrir carrinho"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-primary transition-all duration-300 hover:bg-primary/8 hover:text-terciary active:scale-95 sm:h-10 sm:w-10 lg:h-9 lg:w-9 lg:rounded-lg lg:text-primary/70 lg:hover:bg-primary/[0.07]"
            onClick={() => navigate('/carrinho')}
        >
            <FaShoppingCart size={20} className="max-lg:hidden" />
            <FaShoppingCart size={17} className="hidden max-lg:block" />

            {produtos.length > 0 && (
                <span className="absolute right-0 top-0 inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white shadow-[0_1px_4px_rgba(0,0,0,0.25)] lg:-right-2 lg:-top-1">
                    {produtos.length}
                </span>
            )}
        </button>
    );
}

export function ButtonMaisVendidos() {
    return (
        <div className="cursor-pointer whitespace-nowrap rounded-md border border-primary bg-primary px-5 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-secondary transition-all duration-300 hover:border-terciary hover:bg-terciary">
            Mais Vendidos
        </div>
    );
}

export function ButtonOthers({ titulo }: { titulo: string }) {
    return (
        <a href="#" className="text-xs uppercase tracking-[0.15em] font-medium text-primary/70 hover:text-terciary whitespace-nowrap px-2 transition-colors duration-500">
            {titulo}
        </a>
    );
}


export function ButtonMore({ hiddenCategories }: { hiddenCategories: Categoria[] }) {
    const [isHovered, setIsHovered] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    let navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsHovered(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const toggleMenu = () => {
        setIsHovered(!isHovered);
    };

    return (
        <div
            className="relative flex cursor-pointer items-center gap-0 text-primary hover:text-terciary"
            ref={menuRef} onMouseLeave={handleMouseLeave}
        >

            <button
                type="button"
                onClick={toggleMenu}
                className="flex h-[34px] w-24 cursor-pointer items-center justify-center gap-1 rounded-md bg-secondary/35 px-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:bg-primary/[0.06]"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Mais</span>

                <MdKeyboardArrowDown
                    size={16}
                    className={`transition-transform duration-300 ${isHovered ? '-rotate-180' : 'rotate-0'}`}
                />
            </button>

            {isHovered && (
                <div className="absolute left-0 top-full mt-1 w-64 h-96 bg-secondary border border-primary/15 shadow-[0_8px_24px_rgba(0,0,0,0.06)] z-50 text-primary">
                    <div className="w-full h-full py-2">
                        <ul className="max-h-[375px] overflow-y-auto">
                            {hiddenCategories.map((categoria) => (
                                <li key={categoria.id}>
                                    <a
                                        onMouseEnter={() => { }}
                                        className="flex items-center justify-between px-4 py-3 text-sm text-primary hover:bg-primary/8 cursor-pointer transition-colors duration-300"
                                        onClick={() => navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`)}
                                    >
                                        <span className="font-normal">{categoria.nome}</span>
                                        {(categoria.subCategorias?.length > 0) && <FaChevronRight size={10} />}
                                    </a>
                                </li>
                            ))}
                            {hiddenCategories.length === 0 && <p className="p-4 text-sm">Nenhuma categoria extra.</p>}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
