import { useState } from "react";
import { useNavigate } from "react-router";
import { MdPerson, MdOutlineFavorite, MdKeyboardArrowDown } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "~/features/auth/context/AuthContext";
import { useCarrinho } from "~/features/carrinho/context/CarrinhoContext";
import type { Categoria } from "~/features/categoria/types";

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
        <div className="bg-primary hover:bg-terciary text-white px-4 py-1.5 rounded text-xs font-bold cursor-pointer transition-colors whitespace-nowrap">
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
