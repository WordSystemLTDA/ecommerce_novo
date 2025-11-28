import React, { useState } from 'react';
import { Search, Heart, User, ShoppingBag, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCarrinho } from '~/features/carrinho/context/CarrinhoContext';

// --- Tipos e Interfaces ---

// Define o tipo do estado do menu (pode ser o nome da categoria ou null)
type MenuCategory = string | null;

interface NavItemProps {
    text: string;
    isRed?: boolean; // ? indica opcional
    activeMenu: MenuCategory;
    setActiveMenu: (menu: MenuCategory) => void;
    hasMegaMenu?: boolean; // ? indica opcional
}

interface PromoCardProps {
    image: string;
    title: string;
    price1: string;
    price2: string;
    bigPrice: string;
    suffix: string;
}

// --- Componente Principal ---

export default function Header() {

    let navigate = useNavigate();
    let { produtos } = useCarrinho();

    // Tipando o useState explicitamente para aceitar string ou null
    const [activeMenu, setActiveMenu] = useState<MenuCategory>(null);

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 font-sans">

            {/* BARRA SUPERIOR */}
            <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between bg-white relative z-20">

                {/* Logo */}
                <div
                    className="flex items-center text-4xl tracking-tighter cursor-pointer"
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <span className="font-bold text-black">WORD</span>
                    {/* TypeScript pode reclamar do WebkitTextStroke se não estiver nas definições padrão, 
              mas geralmente funciona. Se der erro, use 'as React.CSSProperties' */}
                    <span
                        className="font-bold text-transparent"
                        style={{ WebkitTextStroke: '1px black' } as React.CSSProperties}
                    >
                        SYSTEM
                    </span>
                </div>

                {/* Nav */}
                <nav className="hidden lg:flex items-center gap-8 h-full">
                    <NavItem text="Novidades" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                    <NavItem text="Masculino" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                    <NavItem text="Feminino" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

                    <NavItem
                        text="Kids"
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        hasMegaMenu={true}
                    />

                    <NavItem text="Jeans" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                    <NavItem text="Calçados" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                    <NavItem text="Acessórios" activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                    <NavItem text="OFF" isRed activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                </nav>

                {/* Ícones */}
                <div className="flex items-center gap-6">
                    <div className="relative hidden xl:block">
                        <input
                            type="text"
                            placeholder="O que você procura?"
                            className="bg-gray-100 text-gray-600 text-sm rounded-full pl-5 pr-10 py-2.5 w-[280px] focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer" />
                    </div>
                    <div className="flex items-center gap-5">
                        <Heart className="w-6 h-6 stroke-[1.5] cursor-pointer hover:text-gray-600" />
                        <User
                            className="w-6 h-6 stroke-[1.5] cursor-pointer hover:text-gray-600"
                            onClick={() => {
                                navigate('/minhaconta');
                            }}
                        />
                        <div
                            className="relative cursor-pointer hover:text-gray-600"
                            onClick={() => {
                                navigate('/carrinho');
                            }}

                        >
                            <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                            <span className="absolute -top-1 -right-1 bg-black text-white text-tiny font-bold h-4 w-4 flex items-center justify-center rounded-full">{produtos.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MEGA MENU - Renderização Condicional */}
            <div
                className={`absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${activeMenu === 'Kids' ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
                    }`}
                onMouseEnter={() => setActiveMenu('Kids')}
                onMouseLeave={handleMouseLeave}
            >
                <div className="max-w-[1200px] mx-auto py-8 px-8 flex">

                    {/* Coluna de Links */}
                    <div className="w-1/4 pr-8 border-r border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Roupas</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li className="hover:text-black cursor-pointer">T-Shirts</li>
                            <li className="hover:text-black cursor-pointer">Regatas</li>
                            <li className="hover:text-black cursor-pointer">Polos</li>
                            <li className="hover:text-black cursor-pointer">Camisas</li>
                            <li className="hover:text-black cursor-pointer">Calças Jeans</li>
                            <li className="hover:text-black cursor-pointer">Bermudas</li>
                            <li className="hover:text-black cursor-pointer">Shorts</li>
                            <li className="font-bold text-black border-b border-black inline-block mt-2 cursor-pointer">Ver tudo</li>
                        </ul>
                    </div>

                    {/* Coluna de Promoções */}
                    <div className="w-3/4 pl-12 flex gap-6">
                        <PromoCard
                            image="https://images.unsplash.com/photo-1519238263496-6543b3102fc8?q=80&w=600&auto=format&fit=crop"
                            title="T-SHIRTS ESTAMPADAS KIDS"
                            price1="1 PEÇA POR R$ 59,90"
                            price2="3 PEÇAS POR"
                            bigPrice="R$ 49,90"
                            suffix="cada"
                        />
                        <PromoCard
                            image="https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop"
                            title="CALÇAS JEANS"
                            price1="1 PEÇA POR R$ 139,90"
                            price2="2 PEÇAS POR"
                            bigPrice="R$ 119,90"
                            suffix="cada"
                        />
                    </div>
                </div>
            </div>

        </header>
    );
}

// --- Sub-componentes Tipados ---

function NavItem({ text, isRed, activeMenu, setActiveMenu, hasMegaMenu }: NavItemProps) {
    return (
        <div
            className="h-full flex items-center relative group py-4"
            onMouseEnter={() => hasMegaMenu ? setActiveMenu(text) : setActiveMenu(null)}
        >
            <a
                href="#"
                className={`text-sm font-medium transition-colors hover:underline underline-offset-4 decoration-2 ${isRed ? 'text-red-600 hover:text-red-700' : 'text-gray-700 hover:text-black'
                    } ${activeMenu === text ? 'underline text-black' : ''}`}
            >
                {text}
            </a>
        </div>
    );
}

function PromoCard({ image, title, price1, price2, bigPrice, suffix }: PromoCardProps) {
    return (
        <div className="relative w-1/2 h-[350px] group overflow-hidden cursor-pointer">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>

            <div className="absolute top-1/2 left-4 text-white">
                <Plus className="w-8 h-8 opacity-70" />
            </div>

            <div className="absolute bottom-6 left-6 text-white">
                <h4 className="font-bold text-xl mb-2 uppercase leading-tight w-2/3">{title}</h4>
                <p className="text-xs font-medium opacity-90 mb-1">{price1}</p>
                <div className="border-t border-white/30 my-2 w-full"></div>
                <p className="text-xs uppercase opacity-90">{price2}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{bigPrice}</span>
                    <span className="text-xs font-light">{suffix}</span>
                </div>
            </div>
        </div>
    );
}