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
    let { isAuthenticated, cliente } = useAuth();
    const isPrietoKouros = config.EMPRESAS.includes('3');

    return (
        <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity max-lg:hidden"
            onClick={() => {
                if (isAuthenticated) {
                    navigate('/minha-conta');
                } else {
                    navigate('/entrar');
                }
            }}
        >
            <div className={`p-1 border-2 rounded-full ${isPrietoKouros ? 'border-primary' : 'border-white'}`}>
                <MdPerson size={20} className={isPrietoKouros ? 'text-primary' : 'text-white'} />
            </div>

            {isAuthenticated ? (
                <div>
                    <span className="text-tiny uppercase font-bold">Olá, <span className={`font-bold ${isPrietoKouros ? 'text-primary' : 'text-white'}`}>{cliente?.nome}</span></span>
                </div>
            )
                :
                (
                    <div className="flex flex-col leading-none sm:hidden lg:flex">
                        <span className="text-tiny uppercase font-bold opacity-80">Olá, faça seu login</span>
                        <span className="text-xs font-bold">ou cadastre-se</span>
                    </div>
                )

            }
        </div>
    );
}

import config from "~/config/config";
import { useFavorito } from "~/features/favoritos/context/FavoritoContext";
import { gerarSlug } from "~/utils/formatters";

export function ButtonFavoritos() {
    let navigate = useNavigate();
    const { quantidade } = useFavorito();
    const isPrietoKouros = config.EMPRESAS.includes('3');

    return (
        <div
            className={`cursor-pointer transition-colors relative ${isPrietoKouros ? 'hover:text-primary/80' : 'hover:text-gray-200'}`}
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
    const isPrietoKouros = config.EMPRESAS.includes('3');
    return (
        <div
            className={`cursor-pointer transition-colors relative ${isPrietoKouros ? 'hover:text-primary/80' : 'hover:text-gray-200'}`}
            onClick={aoClicar}
        >
            <MdOutlineSearch size={24} />
        </div>
    );
}


export function ButtonConta() {
    let navigate = useNavigate();
    let { isAuthenticated } = useAuth();
    const isPrietoKouros = config.EMPRESAS.includes('3');

    return (
        <div
            className={`cursor-pointer transition-colors relative ${isPrietoKouros ? 'hover:text-primary/80' : 'hover:text-gray-200'}`}
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
    const isPrietoKouros = config.EMPRESAS.includes('3');

    return (
        <div
            className={`cursor-pointer transition-colors relative ${isPrietoKouros ? 'hover:text-primary/80' : 'hover:text-gray-200'}`}
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
    const isPrietoKouros = config.EMPRESAS.includes('3');
    return (
        <div className={`${isPrietoKouros ? 'bg-primary hover:bg-terciary text-secondary' : 'bg-primary hover:bg-terciary text-white'} px-4 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors whitespace-nowrap`}>
            Mais Vendidos
        </div>
    );
}

export function ButtonOthers({ titulo }: { titulo: string }) {
    const isPrietoKouros = config.EMPRESAS.includes('3');
    return (
        <a href="#" className={`${isPrietoKouros ? 'text-primary' : 'text-white'} text-xs font-bold hover:underline whitespace-nowrap px-2`}>
            {titulo}
        </a>
    );
}


export function ButtonMore({ hiddenCategories }: { hiddenCategories: Categoria[] }) {
    const [isHovered, setIsHovered] = useState(false);
    const isPrietoKouros = config.EMPRESAS.includes('3');

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
            className={`flex items-center gap-0 cursor-pointer relative ${isPrietoKouros ? 'text-primary hover:text-primary/80' : 'text-white hover:text-gray-200'}`}
            ref={menuRef} onMouseLeave={handleMouseLeave}
        >

            <button
                onClick={toggleMenu}
                className={`flex h-full items-center py-1.5 text-xs font-bold transition-colors cursor-pointer ${isPrietoKouros ? 'text-primary' : 'text-secondary'}`}
            >
                <span className="text-xs font-bold">Mais</span>

                <MdKeyboardArrowDown
                    size={16}
                    className={`transition-transform duration-300 ${isHovered ? '-rotate-180' : 'rotate-0'}`}
                />
            </button>

            {isHovered && (
                <div className="absolute left-0 top-full mt-0 w-64 h-96 bg-white border border-gray-200 shadow-xl z-50 text-gray-800">
                    {/* Descomentei seu código original para mostrar como ficaria dentro da caixa corrigida */}
                    <div className="w-full h-full py-2">
                        <ul className="max-h-[375px] overflow-y-auto">
                            {hiddenCategories.map((categoria) => (
                                <li key={categoria.id}>
                                    <a
                                        onMouseEnter={() => { }}
                                        className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`)}
                                    >
                                        <span className="font-medium">{categoria.nome}</span>
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