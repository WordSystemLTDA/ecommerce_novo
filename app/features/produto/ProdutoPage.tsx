import { useEffect, useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { toast } from 'react-toastify';


import Header from '~/components/header'

import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import {
    FaTruck,
} from 'react-icons/fa'

import {
    IoShareSocialOutline
} from 'react-icons/io5'

import { AiFillInfoCircle } from "react-icons/ai"
import { MdOutlineDescription } from "react-icons/md"

import { ShoppingBag } from 'lucide-react'
import { BsBoxes } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router'
import Breadcrumb from '~/components/breadcrumb'
import Button from '~/components/button'
import Footer from '~/components/footer'
import RatingStars from '~/components/rating_stars'
import { useCarrinho } from '~/features/carrinho/context/CarrinhoContext'
import { currencyFormatter, gerarSlug } from '~/utils/formatters'
import type { Produto } from './types'
import { produtoService } from './services/produtoService'
import type { TipoDeEntrega } from '~/types/TipoDeEntrega'
import Loader from '~/components/loader'

interface ProdutoProps {
    produto: Produto,
}

export default function ProdutoPage({ produto }: ProdutoProps) {
    const { id, slug } = useParams();
    const { tamanhoSelecionado, setTamanhoSelecionado } = useCarrinho();

    const [erroTamanho, setErroTamanho] = useState(false);

    useEffect(() => {
        // Reset tamanho ao mudar de produto
        setTamanhoSelecionado(null);
        setErroTamanho(false);
    }, [id, setTamanhoSelecionado]);

    useEffect(() => {
        if (produto && produto.id) {
            const slugCorreto = gerarSlug(produto.nome);

            if (slug !== slugCorreto) {
                window.history.replaceState(null, '', `/produto/${id}/${slugCorreto}`);
            }
        }
    }, [produto, id, slug]);

    return (
        <div>
            <Header />

            <div className="flex flex-col items-center bg-white text-gray-900 pb-8">
                <div className="w-full px-4 lg:px-10 py-0">
                    <div className='lg:hidden flex justify-between items-center pt-5 pb-2'>
                        <Breadcrumb />
                        <Avalicoes produto={produto} />
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 relative lg:pt-5">
                        <div className='lg:hidden flex flex-col gap-2'>
                            <ProdutoNameInfo produto={produto} />
                        </div>

                        {produto.imagens != null &&
                            <div className='lg:col-span-5'>
                                <ProdutoGallery images={produto.imagens} produtoId={produto.id} />
                            </div>
                        }

                        <div className='lg:col-span-4'>
                            <ProdutoInfo
                                produto={produto}
                                erroTamanho={erroTamanho}
                                setErroTamanho={setErroTamanho}
                            />
                        </div>

                        <div className="flex flex-col max-w-full relative lg:col-span-9 lg:col-start-1 lg:row-start-2 max-lg:hidden">
                            <div className='mt-8'>
                                <div className='flex gap-2 items-center '>
                                    <MdOutlineDescription className='text-terciary' size={24} />
                                    <h2 className="text-xl font-semibold">DESCRIÇÃO DO PRODUTO</h2>
                                </div>
                                <p>{produto.descricaolonga1}<br /><br /> {produto.descricaolonga2}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:row-span-2">
                            <PurchaseSidebar produto={produto} setErroTamanho={setErroTamanho} />
                        </div>
                    </div>

                    <div className='flex flex-row gap-2 items-center text-terciary mt-6 lg:hidden'>
                        <AiFillInfoCircle />
                        <h2 className="text-sm font-semibold">SOBRE O PRODUTO</h2>
                    </div>

                    <div className="flex flex-col max-w-full relative max-lg:block lg:hidden">
                        <div className='mt-6'>
                            <div className='flex gap-2 items-center '>
                                <MdOutlineDescription className='text-terciary' size={24} />
                                <h2 className="text-xl font-semibold">DESCRIÇÃO DO PRODUTO</h2>
                            </div>
                            <p>{produto.descricaolonga1}<br /><br /> {produto.descricaolonga2}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

interface AvalicoesProps {
    produto: Produto,
}

function Avalicoes({ produto }: AvalicoesProps) {
    return (
        <div className="flex items-center gap-1">
            <span className="text-tiny text-gray-600">
                {produto.avaliacao ?? 0}
            </span>
            <RatingStars rating={produto.avaliacao} variant='tiny' />
            <span className="text-tiny text-gray-600">
                ({produto.quantidadeAvaliacoes ?? 0})
            </span>
        </div>
    )
}

import { favoritoService } from '~/features/favoritos/services/favoritoService'
import { useAuth } from '~/features/auth/context/AuthContext'
import { useFavorito } from '~/features/favoritos/context/FavoritoContext'
import { IoHeart, IoHeartOutline } from 'react-icons/io5'

// ... (imports remain)

interface ProdutoGalleryProps {
    images: string[],
    produtoId: number
}

function ProdutoGallery({ images, produtoId }: ProdutoGalleryProps) {
    let { atualizarQuantidade } = useFavorito();
    const [thumbsSwiper, setThumbsSwiper] =
        useState<SwiperInstance | null>(null)

    const [currentSlide, setCurrentSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false);
    const { cliente } = useAuth();

    useEffect(() => {
        if (cliente?.id && produtoId) {
            favoritoService.verificar(cliente.id, produtoId)
                .then(setIsFavorite)
                .catch(console.error);
        }
    }, [cliente, produtoId]);

    const toggleFavorite = async () => {
        if (!cliente?.id) {
            toast.info("Faça login para favoritar produtos.");
            return;
        }

        try {
            if (isFavorite) {
                await favoritoService.remover(cliente.id, produtoId);
                toast.success("Removido dos favoritos");
            } else {
                await favoritoService.adicionar(cliente.id, produtoId);
                toast.success("Adicionado aos favoritos");
            }
            setIsFavorite(!isFavorite);
            atualizarQuantidade();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao atualizar favoritos");
        }
    };

    return (
        <div className="flex flex-col gap-2 max-w-full relative">

            <div className="overflow-hidden rounded-lg lg:border lg:border-gray-400 relative">
                <div className="flex items-center gap-2 absolute left-2 lg:left-4 top-3 bg-white z-30 px-0 rounded-sm text-xs font-semibold">
                    <span>{currentSlide + 1} / {images.length}</span>
                </div>

                <div className="flex items-center gap-2 absolute right-2 lg:right-4 top-3 bg-white z-30 px-0 rounded-sm text-xs font-semibold">
                    <button
                        className={`text-gray-600 hover:text-red-600 transition-colors ${isFavorite ? 'text-red-600' : ''}`}
                        onClick={toggleFavorite}
                    >
                        {isFavorite ? <IoHeart size={22} /> : <IoHeartOutline size={22} />}
                    </button>
                </div>

                <div className="flex items-center gap-2 absolute right-2 lg:right-4 bottom-3 bg-white z-30 px-0 rounded-sm text-xs font-semibold">
                    <button className="text-gray-600 hover:text-red-600">
                        <IoShareSocialOutline size={22} />
                    </button>
                </div>

                <Swiper
                    modules={[FreeMode, Navigation, Thumbs]}
                    spaceBetween={10}
                    navigation={false}
                    thumbs={{
                        swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                    }}
                    onSlideChange={(swiper) => {
                        setCurrentSlide(swiper.realIndex)
                    }}
                    className="lg:max-h-130! max-lg:min-h-96! lg:w-full!"
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index} className='lg:h-130! max-lg:min-h-96!'>
                            <img
                                src={img}
                                alt={`Imagem ${index + 1} do produto`}
                                className="lg:h-130! max-lg:min-h-96! lg:w-full! lg:object-contain! max-lg:object-cover!"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="h-24 max-lg:hidden">
                <Swiper
                    modules={[FreeMode, Navigation, Thumbs]}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}

                    className="h-full! w-full!"
                >
                    {images.map((img, index) => (
                        <SwiperSlide
                            key={index}
                            className="cursor-pointer overflow-hidden rounded-md border border-gray-400"
                        >
                            <img
                                src={img}
                                alt={`Miniatura ${index + 1}`}
                                className="h-full! w-full! object-contain!"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className='lg:hidden flex gap-1 items-center justify-center'>
                {images.map((img, index) => (
                    <div className='rounded-full bg-gray-600 w-1.5 h-1.5'></div>
                ))}
            </div>
        </div>
    )
}

interface ProdutoInfoProps extends ProdutoProps {
    erroTamanho: boolean;
    setErroTamanho: (erro: boolean) => void;
}

function ProdutoInfo({ produto, erroTamanho, setErroTamanho }: ProdutoInfoProps) {
    let navigate = useNavigate();
    const { tamanhoSelecionado, setTamanhoSelecionado } = useCarrinho();

    return (
        <div className="flex flex-col gap-4">
            <div className='max-lg:hidden flex flex-col gap-4'>
                <ProdutoNameInfo produto={produto} />
            </div>

            <hr className="my-2 border-gray-200 max-lg:hidden" />

            <div className="flex flex-col gap-3">
                {produto.cores && produto.cores.length > 0 && (
                    <div className="flex flex-col gap-2 mb-0">
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
                                    className="group relative w-24 min-h-24 max-h-32 cursor-pointer"
                                >
                                    <div className={`p-1 w-full h-full rounded-lg border overflow-hidden ${cor.id == produto.id ? 'border-terciary' : 'border-gray-400 group-hover:border-gray-400'}`}>
                                        <img src={cor.imagem} alt={cor.nome} className="w-full max-h-20 object-cover" />
                                        <p className="text-tiny text-center mt-1">{cor.nome}</p>
                                    </div>

                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                        {cor.nome}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {produto.tamanhos && produto.tamanhos.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                        <span className="text-sm text-gray-700">Tamanho: <span className='font-semibold'>{tamanhoSelecionado?.tamanho}</span></span>
                        <div className="flex gap-2 flex-wrap">
                            {produto.tamanhos.map((tamanho) => (
                                <div
                                    key={tamanho.id}
                                    onClick={() => {
                                        if (tamanho.estoque > 0) {
                                            setTamanhoSelecionado(tamanho);
                                            setErroTamanho(false);
                                        }
                                    }}
                                    className={`relative px-3 py-1 border rounded-md text-sm cursor-pointer overflow-hidden ${tamanhoSelecionado?.id === tamanho.id && tamanho.estoque > 0
                                        ? 'border-terciary text-terciary'
                                        : erroTamanho && tamanho.estoque > 0
                                            ? 'border-red-500 text-red-500'
                                            : tamanho.estoque > 0
                                                ? 'border-gray-300 text-gray-700 hover:border-terciary'
                                                : 'border-gray-400 text-gray-400 bg-gray-200 cursor-not-allowed'
                                        }`}
                                    title={`Estoque: ${tamanho.estoque}`}
                                >
                                    {tamanho.tamanho}
                                    {!(tamanho.estoque > 0) && (
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                                            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#9ca3af" strokeWidth="1" />
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className='flex gap-2 items-center text-terciary max-lg:hidden'>
                    <AiFillInfoCircle />
                    <h2 className="text-sm font-semibold">SOBRE O PRODUTO</h2>
                </div>
            </div>
        </div>
    )
}

function ProdutoNameInfo({ produto }: ProdutoProps) {
    return (
        <div className='lg:pt-5 flex flex-col gap-2'>

            <div className="flex justify-between items-center max-lg:hidden">
                <Breadcrumb />

                <Avalicoes produto={produto} />
            </div>

            <h1 className="text-base font-normal leading-tight">{produto.nome}</h1>
        </div>
    );
}

interface PurchaseSidebarProps extends ProdutoProps {
    setErroTamanho: (erro: boolean) => void;
}

function PurchaseSidebar({ produto, setErroTamanho }: PurchaseSidebarProps) {
    let navigate = useNavigate();
    let { adicionarNovoProduto, verificarAdicionadoCarrinho, tamanhoSelecionado } = useCarrinho();
    const { cliente } = useAuth();
    const [avisoAtivo, setAvisoAtivo] = useState(false);
    const [loadingAviso, setLoadingAviso] = useState(false);

    useEffect(() => {
        if (cliente?.id && produto?.id) {
            produtoService.verificarAvisoEstoque(produto.id, cliente.id)
                .then(response => {
                    setAvisoAtivo(response.status);
                })
                .catch(err => console.error(err));
        }
    }, [cliente, produto]);

    const handleAvisarMe = async () => {
        if (!cliente?.id) {
            // TODO: Navigate to login or open modal
            alert("Faça login para ativar o aviso.");
            return;
        }

        setLoadingAviso(true);
        try {
            const response = await produtoService.toggleAvisoEstoque(produto.id, cliente.id);
            setAvisoAtivo(response.status);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAviso(false);
        }
    };

    const valorDescontoPix = parseFloat(produto.valorDescontoPix || '0');
    const percentualPix = parseFloat(produto.percentualPix || '0');

    // Calcula o preço base a ser exibido (com desconto Pix se houver)
    const precoBaseNum = parseFloat(produto.preco);
    const precoComPix = precoBaseNum - valorDescontoPix;
    const precoExibidoBase = percentualPix > 0 ? precoComPix : precoBaseNum;

    // Adiciona o valor do tamanho selecionado
    const valorAdicional = tamanhoSelecionado ? parseFloat(tamanhoSelecionado.valorGrade) : 0;
    const precoFinal = (precoExibidoBase + valorAdicional).toFixed(2);

    // Recalcula o preço antigo (base) + adicional se existir
    const precoAntigoBase = produto.precoAntigo ? parseFloat(produto.precoAntigo.toString()) : null;
    const precoAntigoFinal = precoAntigoBase ? precoAntigoBase + valorAdicional : null;

    // Calcula o percentual de desconto total exibido
    const descontoTotal = precoAntigoFinal
        ? Math.round(((precoAntigoFinal - parseFloat(precoFinal)) / precoAntigoFinal) * 100)
        : percentualPix > 0
            ? Math.round(percentualPix)
            : 0;

    const produtoComTamanho = {
        ...produto,
        quantidade: 1,
        preco: precoFinal.toString(),
        tamanhoSelecionado: tamanhoSelecionado!
    };

    return (
        <div className="flex flex-col gap-4 lg:sticky top-30">
            <div className="flex flex-col gap-0 rounded-lg border border-gray-200 bg-white px-4 pb-4 shadow-sm relative overflow-hidden">

                {/* Badges do ProductCard */}
                {produto.promocaoAtiva === 'Sim' && (Number(produto.quantidadeLimiteDesconto) <= Number(produto.estoque) && produto.idPromocoesEcommerce) ? (
                    <div className="absolute top-0 right-0">
                        <span className="text-xs font-bold text-white bg-red-400 px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm">
                            <BsBoxes />
                            Restam {(Number(produto.quantidadeLimiteDesconto) - Number(produto.quantidadeCompradoPromocao)).toFixed(0)} un.
                        </span>
                    </div>
                ) : produto.idPromocoesEcommerce && produto.promocaoAtiva === 'Sim' && (
                    <div className="absolute top-0 right-0">
                        <span className="text-xs font-bold text-white bg-blue-700 px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm">
                            TOP OFERTA
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-2 mt-4">
                    {precoAntigoFinal && (
                        <span className="text-sm text-gray-500 line-through">
                            {currencyFormatter.format(precoAntigoFinal)}
                        </span>
                    )}
                    {descontoTotal > 0 && (
                        <span className="text-xs font-bold text-terciary bg-green-100 px-2 py-0.5 rounded">
                            {descontoTotal}% OFF
                        </span>
                    )}
                </div>

                <span className="text-3xl font-bold text-primary">
                    {currencyFormatter.format(parseFloat(precoFinal))}
                </span>

                <span className="text-medium-tiny text-pix mt-1">
                    {percentualPix > 0
                        ? <>À vista no PIX com <span className='font-semibold'>{percentualPix}% de desconto</span></>
                        : 'À vista no PIX'
                    }
                </span>

                <div className='my-0.5'></div>
                <span className="text-tiny text-gray-600">
                    <span className='font-bold'>{currencyFormatter.format(precoBaseNum + valorAdicional)}</span> em até 6x de <span className='font-bold'>
                        {currencyFormatter.format(parseFloat(((precoBaseNum + valorAdicional) / 6).toFixed(2)))}</span> sem juros no cartão de crédito
                </span>
                <a href="#" className="text-tiny font-semibold text-black underline mt-2">
                    Ver mais opções de pagamento e parcelamento
                </a>

                {produto.estoque > 0 &&
                    <div className="my-2 text-xs font-semibold text-green-600">
                        Em estoque ({Number(produto.estoque).toFixed(0)} disponíveis)
                    </div>
                }
                {produto.estoque <= 0 &&
                    <div className="my-2 text-xs font-semibold text-red-600">
                        Sem estoque
                    </div>
                }

                {produto.habilitarAviso == 'Sim' ?
                    (
                        <Button
                            variant={avisoAtivo ? "primaryOutline" : "primary"}
                            onClick={handleAvisarMe}
                            disabled={loadingAviso}
                        >
                            {loadingAviso ? <Loader size="small" /> : (avisoAtivo ? "Avisaremos você" : "Avisar-me")}
                        </Button>
                    )
                    :
                    (
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="primary"
                                disabled={produto.estoque <= 0}
                                onClick={async () => {
                                    if (produto.tamanhos && produto.tamanhos.length > 0 && !tamanhoSelecionado) {
                                        setErroTamanho(true);
                                        toast.error("Selecione um tamanho", { position: 'top-center' });
                                        return;
                                    }

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
                                disabled={produto.estoque <= 0}
                                onClick={() => {
                                    if (produto.tamanhos && produto.tamanhos.length > 0 && !tamanhoSelecionado) {
                                        setErroTamanho(true);
                                        toast.error("Selecione um tamanho", { position: 'top-center' });
                                        return;
                                    }
                                    adicionarNovoProduto(produtoComTamanho);
                                }}
                            >
                                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                                {verificarAdicionadoCarrinho(produto) ? 'Remover' : 'Adicionar'} ao Carrinho
                            </Button>
                        </div>
                    )
                }
            </div>

            <FreightCalculator produto={produto} />
        </div >
    )
}

function FreightCalculator({ produto }: { produto: Produto }) {
    const [cep, setCep] = useState('');
    const [loading, setLoading] = useState(false);
    const [freteOptions, setFreteOptions] = useState<TipoDeEntrega[]>([]);

    const maskCep = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{5})(\d)/, '$1-$2')
            .substring(0, 9);
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = maskCep(e.target.value);
        setCep(masked);
    };

    const handleCalculateFreight = async () => {
        if (cep.length < 9) return;

        setLoading(true);
        try {
            const cleanCep = cep.replace('-', '');
            // Pass array with single product as expected by backend/service often
            const options = await produtoService.calcularFrete(cleanCep, [produto]);
            setFreteOptions(options.data.filter(option => option.price != null) || []);
        } catch (error) {
            console.error(error);
            setFreteOptions([]);
        } finally {
            setLoading(false);
        }
    };

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
                    onChange={handleCepChange}
                    maxLength={9}
                    className="w-full rounded-md border border-gray-400 bg-white p-2 text-xs text-gray-900 placeholder-gray-500 focus:border-terciary focus:outline-none focus:ring-1 focus:ring-terciary"
                />
                <Button
                    variant="primaryOutline"
                    className="w-auto! px-4! relative"
                    onClick={handleCalculateFreight}
                    disabled={loading}
                >
                    {loading ? <Loader size="small" /> : 'OK'}
                </Button>
            </div>
            <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target='_blank' rel="noreferrer" className="text-tiny text-primary underline">
                Não sei meu CEP
            </a>

            {freteOptions.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                    {freteOptions.map((option) => (
                        <div key={option.id} className="flex justify-between items-center text-xs border-b border-gray-100 pb-2 last:border-0">
                            <span className="text-gray-700 font-medium">{option.name || option.company.name}</span>
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-gray-900">
                                    {option.price === "0.00" || option.price === "0"
                                        ? "Grátis"
                                        : currencyFormatter.format(Number(option.price))}
                                </span>
                                <span className="text-tiny text-gray-500">
                                    até {option.delivery_time} dia{option.delivery_time > 1 ? 's' : ''} úteis
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
