import { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdOutlineSearch, MdOutlineFavorite, MdPerson, MdMenu } from "react-icons/md";

import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router";
import DepartmentMenu from "./departament";
import type { Categoria } from "~/features/categoria/types";
import { categoriaService } from "~/features/categoria/services/categoriaService";

export function Header() {
    let navigate = useNavigate();

    const [categorias, setCategorias] = useState<Categoria[]>([]);

    useEffect(() => {
        const listarCategoriasComSubCategorias = async () => {
            try {
                const { data } = await categoriaService.listarCategoriasComSubCategorias();
                setCategorias(data);
                console.log('Categorias carregadas');
            } catch (error) {
                console.error("Erro ao buscar categorias", error);
            }
        };

        listarCategoriasComSubCategorias();
    }, []);

    return (
        <header className="w-full mx-auto lg:py-5 lg:px-8 flex gap-5 items-start bg-primary h-32 p-4 sticky top-0 z-50">
            <div className="max-lg:hidden lg:flex lg:gap-5 lg:items-start lg:mx-auto lg:w-full">
                <img onClick={() => navigate('/')} src="/logo_wordsystem.png" alt="" className="w-32 self-center cursor-pointer" />

                <div className="flex flex-col gap-5 ">
                    <SearchBar />

                    <div className="flex gap-2">
                        <DepartmentMenu categorias={categorias} />
                        <ButtonCupons />
                        <ButtonMaisVendidos />
                        <ButtonOthers titulo="Novidades" />
                        <ButtonOthers titulo="Ofertas do Dia" />
                        <ButtonOthers titulo="Lançamentos" />
                        {/* <ButtonMore /> */}
                    </div>
                </div>

                <ButtonEntreOuCadastrese />

                <div className="flex gap-4 justify-start items-center py-1 h-9">
                    <ButtonFavoritos />
                    <ButtonCarrinho />
                </div>
            </div>

            <div className="max-lg:flex max-lg:flex-col lg:hidden max-lg:w-full gap-3">
                <div className="flex flex-row justify-between items-center w-full">
                    <MdMenu size={28} className="text-white" />

                    <img onClick={() => navigate('/')} src="/logo_wordsystem.png" alt="" className="w-32 self-center cursor-pointer" />

                    <div className="flex gap-4 justify-start items-center py-1 h-9">
                        <ButtonFavoritos />
                        <ButtonCarrinho />
                    </div>
                </div>

                <SearchBar />
            </div>
        </header>
    );
}

export function SearchBar() {
    return (
        <div className="flex h-9 relative w-full">
            <input
                type="search"
                name="busca"
                id="busca"
                autoComplete="off"
                className="bg-white w-full rounded-sm text-sm px-5 border placeholder:text-gray-500 outline-none z-10 focus:border-secondary"
                placeholder="O que você está procurando? Digite aqui..."
            />

            <div className="bg-primary flex justify-center items-center w-10 rounded-r-sm cursor-pointer hover:bg-secondary z-11 absolute top-0 bottom-0 right-0">
                <MdOutlineSearch size={28} color="white" className="cursor-pointer" />
            </div>
        </div>
    );
}

export function ButtonEntreOuCadastrese() {
    let navigate = useNavigate();

    return (
        <div
            className="pl-4 pr-3 py-1 flex gap-2 cursor-pointer justify-start items-center w-52"
            onClick={() => navigate('/entrar')}
        >
            <MdPerson size={24} color="white" className="border border-white rounded-xl" />

            <div className="flex flex-col">
                <p className="text-white text-xs font-bold"><span className="underline">Entre</span> ou</p>
                <p className="text-white text-xs font-bold underline">Cadastre-se</p>
            </div>
        </div>
    );
}

export function ButtonFavoritos() {
    return (
        <div>
            <MdOutlineFavorite size={20} color="white" />
        </div>
    );
}

export function ButtonCarrinho() {
    let navigate = useNavigate();

    return (
        <div
            className="cursor-pointer"
            onClick={() => navigate('/carrinho')}
        >
            <FaShoppingCart size={20} color="white" />
        </div>
    );
}

export function ButtonCupons() {
    return (
        <div
            className="border border-terciary hover:bg-gray-700 rounded-sm px-4 py-1 flex gap-2 cursor-pointer justify-center items-center"
        >
            <p className="text-secondary text-xs font-bold">Cupons</p>
        </div>
    );
}

export function ButtonMaisVendidos() {
    return (
        <div
            className="border border-terciary hover:bg-gray-700 rounded-sm px-4 py-1 flex gap-2 cursor-pointer justify-center items-center"
        >
            <p className="text-secondary text-xs font-bold">Mais Vendidos</p>
        </div>
    );
}

export function ButtonOthers({ titulo }: { titulo: string }) {
    return (
        <div
            className="border border-secondary hover:bg-gray-700 rounded-sm px-4 py-1 flex gap-2 cursor-pointer justify-center items-center"
        >
            <p className="text-secondary text-xs font-bold">{titulo}</p>
        </div>
    );
}

export function ButtonMore() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="pl-4 pr-3 py-1 flex gap-2 cursor-pointer justify-center items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <p className="text-secondary text-xs font-bold">Mais</p>
            <MdKeyboardArrowDown
                size={20}
                className={`text-secondary transition-transform duration-300 ${isHovered ? '-rotate-180' : 'rotate-0'}`}
            />
        </div>
    );
}