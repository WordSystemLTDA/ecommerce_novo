import React, { useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'

// --- SEU HEADER ---
// O alias '~/' não foi resolvido. Trocando para um caminho relativo.
// Ajuste este caminho se 'product-page.tsx' não estiver um nível abaixo de 'app/'
import { Header } from '~/components/header' // Você usará seu header aqui

// --- SWIPER (PARA A GALERIA DE IMAGENS) ---
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'

// --- ÍCONES (TENTANDO IMPORTAÇÕES ESPECÍFICAS) ---
// Tentando caminhos específicos para 'fa' e 'io5'
import {
    FaApple,
    FaTruck,
} from 'react-icons/fa' // Caminho específico para Font Awesome

import {
    IoShareOutline,
    IoHeartOutline,
    IoCartOutline,
    IoShieldCheckmarkOutline,
} from 'react-icons/io5' // Caminho específico para Ionicons 5

import { AiFillInfoCircle } from "react-icons/ai";
import { MdOutlineDescription } from "react-icons/md";


import Button from '~/components/button'
import RatingStars from '~/components/rating_stars'
import Breadcrumb from '~/components/breadcrumb'
import Footer from '~/components/footer'

// --- DADOS MOCKADOS (EXEMPLO) ---
// Você substituirá isso por dados da sua API
const mockProduct = {
    title:
        'Apple Watch SE GPS, Caixa Meia-Noite de Alumínio de 44 mm, Pulseira Esportiva Meia-Noite, Tamanho M/G - MXEK3BE/A',
    brandIcon: FaApple,
    rating: 4.5,
    reviewCount: 722,
    gallery: [
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860075_gg.jpg',
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860073_gg.jpg',
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860074_gg.jpg',
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860077_gg.jpg',
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860076_gg.jpg',
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860078_gg.jpg',
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860079_gg.jpg',
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860081_gg.jpg',
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860080_gg.jpg',
        'https://images6.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860082_gg.jpg',
    ],
    soldBy: 'Word System!',
    specs: [
        {
            title: 'Sistema e Performance',
            description: 'Chip S8 SiP para processamento ágil e eficiente.',
        },
        {
            title: 'Display e Visualização',
            description:
                'Tela de 44mm com alta resolução e excelente área de visualização.',
        },
        {
            title: 'Conectividade e Recursos',
            description:
                'Monitoramento cardíaco, detecção de quedas, SOS de emergência e resistência à água até 50 metros.',
        },
    ],
    price: {
        old: 2599.0,
        current: 2399.9,
        pix: 2203.41,
        installments: 'em até 10x R$ 250,24 sem juros',
    },
}

// --- 1. COMPONENTE PRINCIPAL (A PÁGINA) ---

export default function ProductPage() {
    return (
        <div>
            <Header />

            {/* Container principal - fundo cinza claro, padding vertical */}
            <div className="flex flex-col items-center bg-white text-gray-900 pb-8">
                {/* MODIFICATION: Changed max-w-387 to w-full and added px/py */}
                <div className="w-full px-10 py-0">
                    <Breadcrumb />

                    {/* Grid principal da página */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 relative">
                        <div className='lg:hidden flex flex-col gap-4'>
                            {/* This is the mobile-only title */}
                            <ProductNameInfo product={mockProduct} />
                        </div>

                        {/* Coluna 1: Galeria de Imagens (5/12) */}
                        <div className='lg:col-span-5'>
                            <ProductGallery images={mockProduct.gallery} />
                        </div>

                        {/* Coluna 2: Informações do Produto (4/12) */}
                        <div className='lg:col-span-4'>
                            <ProductInfo product={mockProduct} />
                        </div>

                        {/* MODIFICATION #1:
                          This description block is told to start on column 1 
                          and row 2 on large screens (lg:).
                        */}
                        <div className="flex flex-col max-w-full relative lg:col-span-9 lg:col-start-1 lg:row-start-2">
                            <div className='mt-8'>
                                <div className='flex gap-2 items-center'>
                                    <MdOutlineDescription className='text-terciary' size={24} />
                                    <h2 className="text-xl font-semibold">DESCRIÇÃO O PRODUTO</h2>
                                </div>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed repudiandae, atque labore illo incidunt eveniet hic iusto esse voluptate, impedit blanditiis culpa necessitatibus omnis cumque soluta ut modi temporibus vel. <br /><br /> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste velit sequi quae vel quod animi expedita eos architecto, magni, iusto quo id. Fuga, cupiditate. Autem tenetur praesentium neque voluptatem fuga.</p>
                            </div>
                        </div>

                        {/* MODIFICATION #2:
                          The sidebar is told to start on column 10
                          and row 1 on large screens (lg:).
                        */}
                        <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:row-span-2">
                            <PurchaseSidebar product={mockProduct} />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

// --- 2. COMPONENTES FILHOS (Auxiliares da Página) ---

// --- GALERIA DE IMAGENS (COM SWIPER) ---
interface ProductGalleryProps {
    images: string[]
}

function ProductGallery({ images }: ProductGalleryProps) {
    // Estado para linkar os dois Swipers (galeria principal e miniaturas)
    const [thumbsSwiper, setThumbsSwiper] =
        useState<SwiperInstance | null>(null)

    return (
        <div className="flex flex-col gap-4 max-w-full">
            {/* Galeria Principal (Imagem Grande) */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <Swiper
                    modules={[FreeMode, Navigation, Thumbs]}
                    spaceBetween={10}
                    navigation={true}
                    // Conecta este Swiper com o Swiper das miniaturas
                    thumbs={{
                        swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                    }}
                    className="h-96 w-full"
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={img}
                                alt={`Imagem ${index + 1} do produto`}
                                className="h-full w-full object-contain"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Galeria de Miniaturas (Thumbnails) */}
            <div className="h-24">
                <Swiper
                    modules={[FreeMode, Navigation, Thumbs]}
                    onSwiper={setThumbsSwiper} // Guarda a instância deste Swiper no estado
                    spaceBetween={10}
                    slidesPerView={4} // Mostra 4 miniaturas por vez
                    freeMode={true}
                    watchSlidesProgress={true}

                    className="h-full w-full"
                >
                    {images.map((img, index) => (
                        <SwiperSlide
                            key={index}
                            className="cursor-pointer overflow-hidden rounded-md border border-gray-300"
                        >
                            <img
                                src={img}
                                alt={`Miniatura ${index + 1}`}
                                className="h-full w-full object-contain"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

// --- INFORMAÇÕES DO PRODUTO (Coluna Central) ---
interface ProductInfoProps {
    product: typeof mockProduct
}

function ProductInfo({ product }: ProductInfoProps) {
    const BrandIcon = product.brandIcon

    return (
        <div className="flex flex-col gap-4">
            <div className='max-lg:hidden flex flex-col gap-4'>
                <ProductNameInfo product={product} />
            </div>

            {/* Divisória */}
            <hr className="my-2 border-gray-200" />

            {/* Sobre o Produto */}
            <div className="flex flex-col gap-3">
                <div className='flex gap-2 items-center text-terciary'>
                    <AiFillInfoCircle />
                    <h2 className="text-sm font-semibold">SOBRE O PRODUTO</h2>
                </div>

                <ul className="list-disc space-y-2 pl-5 text-sm">
                    {product.specs.map((spec) => (
                        <li key={spec.title}>
                            <span className="font-semibold">{spec.title}:</span>{" "}
                            {spec.description}
                        </li>
                    ))}
                </ul>
                <a href="#" className="text-sm font-semibold text-terciary hover:underline">
                    Ver mais
                </a>
            </div>
        </div>
    )
}
function ProductNameInfo({ product }: ProductInfoProps) {
    const BrandIcon = product.brandIcon

    return (
        <>
            {/* Ícone e Botões */}
            <div className="flex items-center justify-between">
                <BrandIcon size={24} className="text-gray-800" />
                <div className="flex gap-4">
                    <button className="text-gray-600 hover:text-red-600">
                        <IoShareOutline size={22} />
                    </button>
                    <button className="text-gray-600 hover:text-red-600">
                        <IoHeartOutline size={22} />
                    </button>
                </div>
            </div>

            {/* Título */}
            <h1 className="text-2xl font-semibold leading-tight">{product.title}</h1>

            {/* Avaliações */}
            <div className="flex items-center gap-2">
                <RatingStars rating={product.rating} variant='normal' />
                <span className="text-sm text-gray-600">
                    ({product.reviewCount} avaliações)
                </span>
            </div>

            {/* Vendido por */}
            <div className="text-sm text-gray-600">
                Vendido e entregue por:{" "}
                <span className="font-semibold text-terciary">{product.soldBy}</span>
            </div>
        </>
    );
}

// --- SIDEBAR DE COMPRA (Coluna Direita) ---
interface PurchaseSidebarProps {
    product: typeof mockProduct
}

function PurchaseSidebar({ product }: PurchaseSidebarProps) {
    const currencyFormatter = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 3,
    });

    return (
        <div className="flex flex-col gap-4 lg:sticky top-42">
            {/* Box de Preço */}
            <div className="flex flex-col gap-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                {product.price.old && (
                    <span className="text-xs text-gray-500 line-through">
                        {currencyFormatter.format(product.price.old)}
                    </span>
                )}
                <span className="text-3xl font-bold text-primary">
                    {currencyFormatter.format(product.price.current)}
                </span>
                <span className="text-xs text-gray-700 mt-1">
                    À vista no PIX com <span className='font-semibold'>15% de desconto</span>
                </span>
                <div className='my-2'></div>
                <span className="text-tiny text-gray-600">
                    {/* {product.price.installments} */}
                    <span className='font-bold'>R$ 2.699,90</span> em até 10x de <span className='font-bold'>R$ 269,99</span> sem juros ou 1x com <span className='font-bold'>10% de desconto</span> no cartão
                </span>
                <a href="#" className="text-tiny font-semibold text-black underline mt-2">
                    Ver mais opções de pagamento e parcelamento
                </a>

                <div className="my-2 text-xs font-semibold text-green-600">
                    Em estoque
                </div>

                {/* Botões */}
                <div className="flex flex-col gap-3">
                    <Button variant="primary">Comprar agora</Button>
                    <Button variant="greenOutline">
                        <IoCartOutline size={20} />
                        Adicionado ao carrinho
                    </Button>
                </div>
            </div>

            {/* Box de Frete */}
            <FreightCalculator />
        </div>
    )
}
// --- Calculadora de Frete ---
function FreightCalculator() {
    const [cep, setCep] = useState('');

    return (
        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-primary text-xs">
                <FaTruck size={18} />
                <span>CONSULTE FRETE</span>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="w-full rounded-md border border-gray-400 bg-white p-2 text-xs text-gray-900 placeholder-gray-500 focus:border-terciary focus:outline-none focus:ring-1 focus:ring-terciary"
                />
                <Button variant="primaryOutline" className="w-auto! px-4!">
                    OK
                </Button>
            </div>
            <a href="#" className="text-tiny text-primary underline">
                Não sei meu CEP
            </a>
            {/* Aqui você pode renderizar os resultados do frete */}
        </div>
    )
}

