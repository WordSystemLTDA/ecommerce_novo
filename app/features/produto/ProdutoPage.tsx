import { useEffect, useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'

import Header from '~/components/header'

import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import {
    FaTruck,
} from 'react-icons/fa'

import {
    IoHeartOutline,
    IoShareOutline
} from 'react-icons/io5'

import { AiFillInfoCircle } from "react-icons/ai"
import { MdOutlineDescription } from "react-icons/md"

import { ShoppingBag } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import Breadcrumb from '~/components/breadcrumb'
import Button from '~/components/button'
import Footer from '~/components/footer'
import RatingStars from '~/components/rating_stars'
import { useCarrinho } from '~/features/carrinho/context/CarrinhoContext'
import { currencyFormatter, gerarSlug } from '~/utils/formatters'
import type { Produto } from './types'

interface ProdutoProps {
    produto: Produto,
}

// --- 1. COMPONENTE PRINCIPAL (A PÁGINA) ---
export default function ProdutoPage({ produto }: ProdutoProps) {
    const { id, slug } = useParams();
    const { tamanhoSelecionado, setTamanhoSelecionado } = useCarrinho();

    useEffect(() => {
        // Reset selected size when product changes
        if ((produto.tamanhos ?? []).length > 0) {
            setTamanhoSelecionado(produto.tamanhos![0]);
        } else {
            setTamanhoSelecionado(null);
        }
    }, [id, setTamanhoSelecionado]);

    useEffect(() => {
        if (produto && produto.id) {
            const slugCorreto = gerarSlug(produto.nome);

            // Se a URL atual não tem o slug ou o slug está errado
            if (slug !== slugCorreto) {
                // Atualiza a URL no navegador sem recarregar a página
                window.history.replaceState(null, '', `/produto/${id}/${slugCorreto}`);
            }
        }
    }, [produto, id, slug]);

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
                            <ProdutoNameInfo produto={produto} />
                        </div>

                        {/* Coluna 1: Galeria de Imagens (5/12) */}
                        {produto.imagens != null &&
                            <div className='lg:col-span-5'>
                                <ProdutoGallery images={produto.imagens} />
                            </div>
                        }

                        {/* Coluna 2: Informações do Produto (4/12) */}
                        <div className='lg:col-span-4'>
                            <ProdutoInfo
                                produto={produto}
                            />
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
                                <p>{produto.descricaolonga1}<br /><br /> {produto.descricaolonga2}</p>
                            </div>
                        </div>

                        {/* MODIFICATION #2:
                          The sidebar is told to start on column 10
                          and row 1 on large screens (lg:).
                        */}
                        <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:row-span-2">
                            <PurchaseSidebar produto={produto} />
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
interface ProdutoGalleryProps {
    images: string[]
}

function ProdutoGallery({ images }: ProdutoGalleryProps) {
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
function ProdutoInfo({ produto }: ProdutoProps) {
    let navigate = useNavigate();
    const { tamanhoSelecionado, setTamanhoSelecionado } = useCarrinho();

    return (
        <div className="flex flex-col gap-4">
            <div className='max-lg:hidden flex flex-col gap-4'>
                <ProdutoNameInfo produto={produto} />
            </div>

            {/* Divisória */}
            <hr className="my-2 border-gray-200" />

            {/* Sobre o Produto */}
            <div className="flex flex-col gap-3">
                <div className='flex gap-2 items-center text-terciary'>
                    <AiFillInfoCircle />
                    <h2 className="text-sm font-semibold">SOBRE O PRODUTO</h2>
                </div>

                {/* Colors */}
                {produto.cores && produto.cores.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                        <span className="text-sm font-semibold text-gray-700">
                            Cor: <span className="font-normal text-gray-600">{produto.cores.find(c => c.id == produto.id)?.nome}</span>
                        </span>
                        <div className="flex gap-2 flex-wrap">
                            {produto.cores.map((cor) => (
                                <a
                                    key={cor.id}
                                    onClick={() => {
                                        navigate(`/produto/${cor.id}/${gerarSlug(cor.nome)}`);
                                    }}
                                    className="group relative w-10 h-10 cursor-pointer"
                                >
                                    <div className={`w-full h-full rounded-full border-2 overflow-hidden ${cor.id == produto.id ? 'border-terciary' : 'border-gray-200 group-hover:border-gray-400'}`}>
                                        <img src={cor.imagem} alt={cor.nome} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                        {cor.nome}
                                        {/* Arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes */}
                {produto.tamanhos && produto.tamanhos.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                        <span className="text-sm font-semibold text-gray-700">Tamanhos:</span>
                        <div className="flex gap-2 flex-wrap">
                            {produto.tamanhos.map((tamanho) => (
                                <div
                                    key={tamanho.id}
                                    onClick={() => {
                                        if (tamanho.tipodeestoque == '2' || tamanho.estoque > 0) {
                                            setTamanhoSelecionado(tamanho);
                                        }
                                    }}
                                    className={`relative px-3 py-1 border rounded-md text-sm cursor-pointer overflow-hidden ${tamanhoSelecionado?.id === tamanho.id
                                        ? 'border-terciary bg-terciary text-white'
                                        : ((tamanho.tipodeestoque == '2' || tamanho.estoque > 0) ? 'border-gray-300 text-gray-700 hover:border-terciary' : 'border-gray-200 text-gray-400 bg-gray-200 cursor-not-allowed')
                                        }`}
                                    title={`Estoque: ${tamanho.estoque}`}
                                >
                                    {tamanho.tamanho}
                                    {!(tamanho.tipodeestoque == '2' || tamanho.estoque > 0) && (
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                                            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#9ca3af" strokeWidth="1" />
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function ProdutoNameInfo({ produto }: ProdutoProps) {
    return (
        <>
            {/* Ícone e Botões */}
            <div className="flex items-center justify-between">
                {produto.marca != null &&
                    <img src={produto.marca.img} className="text-gray-800" />
                }
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
            <h1 className="text-2xl font-semibold leading-tight">{produto.nome}</h1>

            {/* Avaliações */}
            <div className="flex items-center gap-2">
                <RatingStars rating={produto.avaliacao} variant='normal' />
                <span className="text-sm text-gray-600">
                    ({produto.quantidadeAvaliacoes} avaliações)
                </span>
            </div>

            {/* Vendido por */}
            <div className="text-sm text-gray-600">
                Vendido e entregue por:{" "}
                <span className="font-semibold text-terciary">{produto.vendidoPor}</span>
            </div>
        </>
    );
}

function PurchaseSidebar({ produto }: ProdutoProps) {
    let navigate = useNavigate();
    let { adicionarNovoProduto, verificarAdicionadoCarrinho, tamanhoSelecionado } = useCarrinho();

    // Calculate dynamic price
    const precoBase = parseFloat(produto.preco);
    const valorAdicional = tamanhoSelecionado ? parseFloat(tamanhoSelecionado.valorGrade) : 0;
    const precoFinal = precoBase + valorAdicional;

    // Create a modified product object for cart checks/addition
    const produtoComTamanho = {
        ...produto,
        quantidade: 1,
        preco: precoFinal.toString(),
        tamanhoSelecionado: tamanhoSelecionado!
    };

    return (
        <div className="flex flex-col gap-4 lg:sticky top-42">
            {/* Box de Preço */}
            <div className="flex flex-col gap-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                {produto.precoAntigo && (
                    <span className="text-xs text-gray-500 line-through">
                        {currencyFormatter.format(produto.precoAntigo)}
                    </span>
                )}
                <span className="text-3xl font-bold text-primary">
                    {currencyFormatter.format(precoFinal)}
                </span>
                <span className="text-xs text-gray-700 mt-1">
                    À vista no PIX com <span className='font-semibold'>15% de desconto</span>
                </span>
                <div className='my-2'></div>
                <span className="text-tiny text-gray-600">
                    {/* {produto.price.installments} */}
                    <span className='font-bold'>R$ 2.699,90</span> em até 10x de <span className='font-bold'>R$ 269,99</span> sem juros ou 1x com <span className='font-bold'>10% de desconto</span> no cartão
                </span>
                <a href="#" className="text-tiny font-semibold text-black underline mt-2">
                    Ver mais opções de pagamento e parcelamento
                </a>

                {produto.estoque > 0 &&
                    <div className="my-2 text-xs font-semibold text-green-600">
                        Em estoque
                    </div>
                }
                {produto.estoque <= 0 &&
                    <div className="my-2 text-xs font-semibold text-red-600">
                        Sem estoque
                    </div>
                }

                {/* Botões */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        onClick={async () => {
                            if (!verificarAdicionadoCarrinho(produto)) {
                                const success = await adicionarNovoProduto(produtoComTamanho);
                                if (success) {
                                    navigate('/carrinho');
                                }
                            } else {
                                navigate('/carrinho');
                            }
                        }}
                    >
                        Comprar agora
                    </Button>
                    <Button
                        variant="grayOutline"
                        onClick={() => {
                            adicionarNovoProduto(produtoComTamanho);
                        }}
                    >
                        <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                        {verificarAdicionadoCarrinho(produto) ? 'Remover' : 'Adicionar'} ao Carrinho
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
