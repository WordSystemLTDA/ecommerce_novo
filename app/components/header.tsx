import { useState } from "react";
import { MdKeyboardArrowDown, MdOutlineSearch, MdOutlineFavorite, MdPerson } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

export function Header() {
    return (
        <header className="w-full mx-auto py-5 px-8 max-w-[1920px] flex gap-5 items-start bg-header-light h-32 p-4 sticky top-0 z-50">
            <img src="/logo_wordsystem.png" alt="" className="w-32 self-center" />

            <div className="flex flex-col gap-5 w-full">
                <SearchBar />

                <div className="flex gap-2">
                    <ButtonDepartamentos />
                    <ButtonCupons />
                    <ButtonMaisVendidos />
                    <ButtonOthers titulo="Novidades" />
                    <ButtonOthers titulo="Ofertas do Dia" />
                    <ButtonOthers titulo="Lançamentos" />
                    <ButtonOthers titulo="PC Gamer" />
                    <ButtonOthers titulo="Computadores" />
                    <ButtonOthers titulo="Periféricos" />
                    <ButtonOthers titulo="Escritório" />
                    <ButtonOthers titulo="Venda no SITE" />
                    <ButtonMore />
                </div>
            </div>

            <ButtonEntreOuCadastrese />
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
    return (
        <div
            className="pl-4 pr-3 py-1 flex gap-2 cursor-pointer justify-start items-center w-42"
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
        <div
            className="pl-4 pr-3 py-1 flex gap-2 cursor-pointer justify-start items-center w-41"
        >
            <MdOutlineFavorite size={24} color="white" />
        </div>
    );
}

export function ButtonCarrinho() {
    return (
        <div
            className="pl-4 pr-3 py-1 flex gap-2 cursor-pointer justify-start items-center w-41"
        >
            <HiOutlineLocationMarker size={24} color="white" />
        </div>
    );
}

export function ButtonDepartamentos() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            // O onMouseEnter no pai define o estado inicial
            onMouseEnter={() => setIsHovered(true)}
            // O onMouseLeave no pai é o que fecha o menu
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* O Botão de Trigger */}
            <div
                className="border-solid border-white border rounded-sm pl-4 pr-3 py-1 flex gap-2 cursor-pointer justify-center items-center z-20"
            >
                <p className="text-white text-xs font-bold">Departamentos</p>
                <MdKeyboardArrowDown
                    color="white"
                    size={20}
                    className={`transition-transform duration-300 ${isHovered ? '-rotate-180' : 'rotate-0'}`}
                />
            </div>

            {/* O Menu Dropdown (COM A CORREÇÃO) */}
            <div
                // 1. Trocamos 'mt-2' por 'pt-2' (padding-top)
                // 2. Movemos os estilos visuais (bg, shadow, rounded) para a <ul>
                className={`absolute left-0 top-full pt-2 w-64 text-black z-60 transition-opacity duration-200 ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                role="menu"
                // 3. O onMouseEnter aqui "cancela" o onMouseLeave do pai, impedindo o menu de fechar
                onMouseEnter={() => setIsHovered(true)}
            >
                <ul className="text-sm bg-white rounded shadow-lg">
                    <li className="px-2 py-2 hover:bg-gray-100 rounded cursor-pointer">Informática</li>
                    <li className="px-2 py-2 hover:bg-gray-100 rounded cursor-pointer">Periféricos</li>
                    <li className="px-2 py-2 hover:bg-gray-100 rounded cursor-pointer">Monitores</li>
                    <li className="px-2 py-2 hover:bg-gray-100 rounded cursor-pointer">Componentes</li>
                    <li className="px-2 py-2 hover:bg-gray-100 rounded cursor-pointer">Acessórios</li>
                </ul>
            </div>
        </div>
    );
}

export function ButtonCupons() {
    return (
        <div
            className="bg-orange-600 hover:bg-gray-700 border rounded-sm px-4 py-1 flex gap-2 cursor-pointer justify-center items-center"
        >
            <p className="text-white text-xs font-bold">Cupons</p>
        </div>
    );
}

export function ButtonMaisVendidos() {
    return (
        <div
            className="bg-blue-900 hover:bg-gray-700 border rounded-sm px-4 py-1 flex gap-2 cursor-pointer justify-center items-center"
        >
            <p className="text-white text-xs font-bold">Mais Vendidos</p>
        </div>
    );
}

export function ButtonOthers({ titulo }: { titulo: string }) {
    return (
        <div
            className="hover:bg-gray-700 border rounded-sm px-4 py-1 flex gap-2 cursor-pointer justify-center items-center"
        >
            <p className="text-white text-xs font-bold">{titulo}</p>
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
            <p className="text-white text-xs font-bold">Mais</p>
            <MdKeyboardArrowDown
                color="white"
                size={20}
                className={`transition-transform duration-300 ${isHovered ? '-rotate-180' : 'rotate-0'}`}
            />
        </div>
    );
}