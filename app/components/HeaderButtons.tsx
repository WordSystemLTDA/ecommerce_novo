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
    let { isAuthenticated } = useAuth();

    return (
        <button
            type="button"
            aria-label={isAuthenticated ? "Acessar minha conta" : "Entrar ou cadastrar"}
            title={isAuthenticated ? "Logado" : "Entrar ou cadastrar"}
            className={`max-lg:hidden flex h-8 w-8 items-center justify-center border transition-all duration-500 ${isAuthenticated
                ? "border-primary bg-primary text-secondary shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:bg-terciary hover:border-terciary"
                : "border-primary/25 text-primary hover:border-terciary hover:text-terciary"
                }`}
            onClick={() => {
                if (isAuthenticated) {
                    navigate('/minha-conta');
                } else {
                    navigate('/entrar');
                }
            }}
        >
            {isAuthenticated ? (
                <BsPersonFillCheck size={18} />
            ) : (
                <MdPerson size={18} />
            )}
        </button>
    );
}

import { useFavorito } from "~/features/favoritos/context/FavoritoContext";
import { gerarSlug } from "~/utils/formatters";

export function ButtonFavoritos() {
    let navigate = useNavigate();
    const { quantidade } = useFavorito();

    return (
        <div
            className="cursor-pointer transition-colors duration-500 relative text-primary hover:text-terciary"
            onClick={() => navigate('/minha-conta/favoritos')}
        >
            <MdOutlineFavorite size={24} />
            {quantidade > 0 && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1 py-0 text-xs font-medium text-white bg-red-500 rounded-full">
                    {quantidade}
                </span>
            )}
        </div>
    );
}

interface ButtonBuscarProps {
    aoClicar: () => void;
}

export function ButtonBuscar({ aoClicar }: ButtonBuscarProps) {
    return (
        <div
            className="cursor-pointer transition-colors duration-500 relative text-primary hover:text-terciary"
            onClick={aoClicar}
        >
            <MdOutlineSearch size={24} />
        </div>
    );
}


export function ButtonConta() {
    let navigate = useNavigate();
    let { isAuthenticated } = useAuth();

    return (
        <div
            className="cursor-pointer transition-colors duration-500 relative text-primary hover:text-terciary"
            onClick={() => {
                if (isAuthenticated) {
                    navigate('/minha-conta');
                } else {
                    navigate('/entrar');
                }
            }}
        >
            {isAuthenticated ?
                <BsPersonFillCheck size={24} />
                :
                <BsPersonFill size={24} />
            }

        </div>
    );
}

export function ButtonCarrinho() {
    let navigate = useNavigate();
    let { produtos } = useCarrinho();

    return (
        <div
            className="cursor-pointer transition-colors duration-500 relative text-primary hover:text-terciary"
            onClick={() => navigate('/carrinho')}
        >
            <FaShoppingCart size={20} className="max-lg:hidden" />
            <FaShoppingCart size={18} className="hidden max-lg:block" />

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
        <div className="bg-primary hover:bg-terciary text-secondary px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-medium cursor-pointer transition-colors duration-500 whitespace-nowrap border border-primary">
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
            className="flex items-center gap-0 cursor-pointer relative text-primary hover:text-terciary"
            ref={menuRef} onMouseLeave={handleMouseLeave}
        >

            <button
                onClick={toggleMenu}
                className="flex h-full items-center py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-500 cursor-pointer"
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
