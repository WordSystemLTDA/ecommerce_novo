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
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaTruck,
    FaPlus,
    FaMinus,
} from 'react-icons/fa' // Caminho específico para Font Awesome
import {
    IoShareOutline,
    IoHeartOutline,
    IoCartOutline,
    IoShieldCheckmarkOutline,
} from 'react-icons/io5' // Caminho específico para Ionicons 5

// --- DADOS MOCKADOS (EXEMPLO) ---
// Você substituirá isso por dados da sua API
const mockProduct = {
    title:
        'Apple Watch SE GPS, Caixa Meia-Noite de Alumínio de 44 mm, Pulseira Esportiva Meia-Noite, Tamanho M/G - MXEK3BE/A',
    brandIcon: FaApple,
    rating: 4.5,
    reviewCount: 722,
    gallery: [
        'https://placehold.co/600x600/F5F5F5/333?text=Imagem+1',
        'https://placehold.co/600x600/F5F5F5/333?text=Imagem+2',
        'https://placehold.co/600x600/F5F5F5/333?text=Imagem+3',
        'https://placehold.co/600x600/F5F5F5/333?text=Imagem+4',
        'https://placehold.co/600x600/F5F5F5/333?text=Imagem+5',
        'https://placehold.co/600x600/F5F5F5/333?text=Imagem+6',
    ],
    soldBy: 'KaBuM!',
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
            <div className="flex flex-col items-center bg-gray-100 p-4 py-8 text-gray-900">

                {/* Box de conteúdo centralizado */}
                <main className="w-full max-w-7xl">
                    {/* Breadcrumbs (exemplo) */}
                    <div className="mb-4 text-sm text-gray-600">
                        Home &gt; Apple &gt; Apple Watch
                    </div>

                    {/* Grid principal da página */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

                        {/* Coluna 1: Galeria de Imagens (5/12) */}
                        <div className="lg:col-span-5">
                            <ProductGallery images={mockProduct.gallery} />
                        </div>

                        {/* Coluna 2: Informações do Produto (4/12) */}
                        <div className="lg:col-span-4">
                            <ProductInfo product={mockProduct} />
                        </div>

                        {/* Coluna 3: Box de Compra (3/12) */}
                        <div className="lg:col-span-3">
                            <PurchaseSidebar product={mockProduct} />
                        </div>
                    </div>
                </main>

                {/* Outras seções (ex: "Produtos Relacionados") viriam aqui */}

            </div>
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
        <div className="flex flex-col gap-4">
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
                <RatingStars rating={product.rating} />
                <span className="text-sm text-gray-600">
                    ({product.reviewCount} avaliações)
                </span>
            </div>

            {/* Vendido por */}
            <div className="text-sm text-gray-600">
                Vendido e entregue por:{" "}
                <span className="font-semibold text-blue-600">{product.soldBy}</span>
            </div>

            {/* Divisória */}
            <hr className="my-2 border-gray-200" />

            {/* Sobre o Produto */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold">Sobre o produto</h2>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                    <IoShieldCheckmarkOutline size={18} />
                    <span>Resumo gerado por IA</span>
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                    {product.specs.map((spec) => (
                        <li key={spec.title}>
                            <span className="font-semibold">{spec.title}:</span>{" "}
                            {spec.description}
                        </li>
                    ))}
                </ul>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">
                    Ver mais
                </a>
            </div>
        </div>
    )
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
        <div className="flex flex-col gap-4">
            {/* Banner Promocional (Exemplo) */}
            <div className="h-28 w-full rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold">
                [Banner]
            </div>

            {/* Box de Preço */}
            <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                {product.price.old && (
                    <span className="text-sm text-gray-500 line-through">
                        {currencyFormatter.format(product.price.old)}
                    </span>
                )}
                <span className="text-3xl font-bold text-red-600">
                    {currencyFormatter.format(product.price.current)}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                    À vista no PIX com 15% de desconto
                </span>
                <span className="text-sm text-gray-600">
                    {product.price.installments}
                </span>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                    Ver mais opções de pagamento e parcelamento
                </a>

                <div className="my-2 text-sm font-semibold text-green-600">
                    Em estoque
                </div>

                {/* Quantidade */}
                <QuantitySelector />

                {/* Botões */}
                <div className="mt-2 flex flex-col gap-3">
                    <Button variant="blue">Comprar agora</Button>
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

// --- COMPONENTES MENORES (Helpers) ---

// --- Seletor de Quantidade ---
function QuantitySelector() {
    const [quantity, setQuantity] = useState(1)

    const decrement = () => setQuantity(q => Math.max(1, q - 1))
    const increment = () => setQuantity(q => q + 1)

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Quantidade:</span>
            <div className="flex items-center rounded-md border border-gray-300">
                <button onClick={decrement} className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={quantity === 1}>
                    <FaMinus size={12} />
                </button>
                <span className="w-10 select-none px-3 py-1 text-center font-semibold">
                    {quantity}
                </span>
                <button onClick={increment} className="px-3 py-2 text-gray-600 hover:bg-gray-100">
                    <FaPlus size={12} />
                </button>
            </div>
        </div>
    )
}


// --- Calculadora de Frete ---
function FreightCalculator() {
    const [cep, setCep] = useState('')

    return (
        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold">
                <FaTruck size={18} className="text-gray-700" />
                <span>Consulte o frete</span>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="w-full rounded-md border border-gray-400 bg-white p-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button variant="grayOutline" className="w-auto! px-4!">
                    OK
                </Button>
            </div>
            <a href="#" className="text-xs text-blue-600 hover:underline">
                Não sei meu CEP
            </a>
            {/* Aqui você pode renderizar os resultados do frete */}
        </div>
    )
}

// --- Estrelas de Avaliação ---
function RatingStars({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5 ? 1 : 0
    const emptyStars = 5 - fullStars - halfStar

    return (
        <div className="flex text-yellow-500">
            {Array(fullStars)
                .fill(0)
                .map((_, i) => (
                    <FaStar key={`full-${i}`} />
                ))}
            {halfStar === 1 && <FaStarHalfAlt />}
            {Array(emptyStars)
                .fill(0)
                .map((_, i) => (
                    <FaRegStar key={`empty-${i}`} />
                ))}
        </div>
    )
}

// --- Botão Customizado (Versão desta página) ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'blue' | 'greenOutline' | 'grayOutline'
}

function Button({ variant, children, ...props }: ButtonProps) {
    const variants = {
        blue: 'bg-blue-600 hover:bg-blue-700 text-white',
        greenOutline:
            'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300',
        grayOutline: 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-400',
    }

    return (
        <button
            {...props}
            className={`flex w-full items-center justify-center gap-2 rounded-md p-3 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${props.className}`}
        >
            {children}
        </button>
    )
}