import { useEffect, useState } from 'react';
import { BsBoxes, BsCartPlus } from "react-icons/bs";
import { MdFavoriteBorder, MdOutlineAddShoppingCart, MdShoppingCartCheckout } from "react-icons/md";
import { useNavigate } from "react-router";
import RatingStars from "~/components/rating_stars";
import { useCarrinho } from "~/features/carrinho/context/CarrinhoContext";
import type { Produto } from "~/features/produto/types";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";

interface ProductCardProps {
    produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
    let navigate = useNavigate();
    const { adicionarNovoProduto, verificarAdicionadoCarrinho } = useCarrinho();
    const estaNoCarrinho = verificarAdicionadoCarrinho(produto);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);

    useEffect(() => {
        if (produto.promocaoAtiva == 'Nao' || !produto.dataLimitePromocao || !produto.horaLimitePromocao || !(produto.tipoDaPromocao != 4)) {
            setTimeLeft(null);
            return;
        }

        const calculateTimeLeft = () => {
            const now = new Date();
            const targetDate = new Date(`${produto.dataLimitePromocao}T${produto.horaLimitePromocao}`);
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft(null);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            let formattedTime = "";
            if (days > 0) formattedTime += `${days}D `;
            formattedTime += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            setTimeLeft(formattedTime);
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Immediate call

        return () => clearInterval(timer);
    }, [produto.dataLimitePromocao, produto.horaLimitePromocao, produto.tipoDeDesconto]);

    const handleAdicionarCarrinho = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (estaNoCarrinho) {
            navigate("/carrinho");
        } else {
            if ((produto.tamanhos?.length ?? 0) > 0) {
                navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
            } else {
                adicionarNovoProduto(produto);
            }
        }
    };

    const handleComprar = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
    };

    const valorDescontoPix = parseFloat(produto.valorDescontoPix || '0');
    const percentualPix = parseFloat(produto.percentualPix || '0');
    const preco = parseFloat(produto.preco);
    const precoComPix = preco - valorDescontoPix;
    const precoExibido = (percentualPix > 0 ? precoComPix : preco).toFixed(2);

    const precoAntigo = produto.precoAntigo ? parseFloat(produto.precoAntigo.toString()) : null;
    const descontoTotal = precoAntigo
        ? Math.round(((precoAntigo - parseFloat(precoExibido)) / precoAntigo) * 100)
        : percentualPix > 0
            ? Math.round(percentualPix)
            : 0;

    return (
        <div
            className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow group relative"
            onClick={() => {
                navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
            }}
        >
            <div className="relative">
                <div className="absolute top-2 right-2 group-hover:opacity-0 opacity-100 transition-opacity p-1">
                    {produto.avaliacao !== undefined && (
                        <div className="flex items-center gap-0.5">
                            <RatingStars rating={produto.avaliacao} variant="tiny" />
                            <span className="text-tiny text-gray-400">({produto.avaliacao})</span>
                        </div>
                    )}
                </div>

                <div className="flex absolute top-2 right-2 group-hover:opacity-100 opacity-0 transition-opacity gap-2 p-1 z-10 cursor-auto">
                    <MdFavoriteBorder size={20} color="gray" className="cursor-pointer" />
                    {estaNoCarrinho ? (
                        <MdShoppingCartCheckout size={20} color="green" className="cursor-pointer" onClick={handleAdicionarCarrinho} />
                    ) : (
                        <MdOutlineAddShoppingCart size={20} color="gray" className="cursor-pointer" onClick={handleAdicionarCarrinho} />
                    )}
                </div>

                <img src={produto.fotos.m[0]} alt={produto.nome} className="w-full min-h-48 max-h-48 object-contain px-4 pt-4 pb-0" loading="lazy" />
            </div>

            <div className="flex-1 p-2 lg:p-4 flex flex-col justify-between">
                <div className="flex-1">
                    <h3 className="text-xs font-medium text-gray-600 mb-2 overflow-hidden text-ellipsis">
                        {produto.nome}
                    </h3>

                    <div className="flex justify-between">
                        {precoAntigo && (
                            <span className="text-xs text-gray-500 line-through">
                                {currencyFormatter.format(produto.precoAntigo)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-baseline gap-2 mb-0">
                        <span className="text-base font-medium text-primary">
                            {currencyFormatter.format(parseFloat(precoExibido))}
                        </span>

                        {descontoTotal > 0 && (
                            <span className="text-xs font-bold text-terciary bg-green-100 px-1 py-0.5 rounded">
                                {descontoTotal}% OFF
                            </span>
                        )}

                        {produto.promocaoAtiva === 'Sim' && (Number(produto.quantidadeLimiteDesconto) <= Number(produto.estoque) && produto.idPromocoesEcommerce) ? (
                            <span className="text-medium-tiny font-bold text-white bg-red-400 px-1 py-0.5 rounded-full flex items-center gap-0.5 absolute top-2 left-2">
                                <BsBoxes />
                                Restam {(Number(produto.quantidadeLimiteDesconto) - Number(produto.quantidadeCompradoPromocao)).toFixed(0)} un.
                            </span>

                        )
                            :
                            produto.idPromocoesEcommerce && produto.promocaoAtiva === 'Sim' &&
                            (
                                <span className="text-medium-tiny font-bold text-white bg-blue-700 px-1 py-0.5 rounded-full flex items-center gap-0.5 absolute top-2 left-2">
                                    TOP OFERTA
                                </span>
                            )
                        }
                    </div>

                    <span className="text-medium-tiny text-pix block">
                        {percentualPix > 0
                            ? <>À vista no PIX com <span className='font-semibold'>{percentualPix}% de desconto</span></>
                            : 'À vista no PIX'
                        }
                    </span>
                    {produto.parcelaMaxima && (
                        <span className="text-xs text-gray-600 mt-1 block">
                            ou até <span className="font-bold">{produto.parcelaMaxima}</span>
                        </span>
                    )}
                </div>

                <div className="flex gap-0.5">
                    <button
                        className="mt-2 w-10 h-9 bg-primary text-white font-bold text-xs py-2 rounded-sm flex items-center justify-center transition-colors cursor-pointer z-11"
                        onClick={handleAdicionarCarrinho}
                    >
                        <BsCartPlus size={18} aria-hidden />
                    </button>

                    {
                        (timeLeft) ?
                            (
                                <>
                                    <p className="mt-2 w-full h-9 bg-white border border-primary text-primary font-bold text-xs py-2 rounded-sm flex flex-col leading-none items-center justify-center hover:bg-secondary transition-colors cursor-pointer z-11 lg:group-hover:hidden">
                                        <span className="text-[8px] lg:text-[10px] font-normal mb-0.5">TERMINA EM:</span>
                                        <span>{timeLeft}</span>
                                    </p>

                                    <button className="mt-2 w-full h-9 bg-primary text-white font-bold text-xs py-2 rounded-sm hidden lg:group-hover:flex items-center justify-center transition-colors cursor-pointer z-11" onClick={handleComprar}>
                                        <span className="flex items-center">
                                            COMPRAR
                                        </span>
                                    </button>
                                </>
                            )
                            : produto.tipoDaPromocao === 4 && produto.promocaoAtiva === 'Sim' ?
                                (
                                    <>
                                        <p className="mt-2 w-full h-9 bg-white border border-primary text-primary font-bold text-xs py-2 rounded-sm flex flex-col leading-none items-center justify-center hover:bg-secondary transition-colors cursor-pointer z-11 lg:group-hover:hidden">
                                            <span className="text-[8px] lg:text-[10px] font-normal mb-0.5">RESTAM:</span>
                                            <span>{(Number(produto.quantidadeLimiteDesconto) - Number(produto.quantidadeCompradoPromocao)).toFixed(0)} Unidades</span>
                                        </p>

                                        <button className="mt-2 w-full h-9 bg-primary text-white font-bold text-xs py-2 rounded-sm hidden lg:group-hover:flex items-center justify-center transition-colors cursor-pointer z-11" onClick={handleComprar}>
                                            <span className="flex items-center">
                                                COMPRAR
                                            </span>
                                        </button>
                                    </>
                                )
                                : (
                                    <button
                                        className="mt-2 w-full h-9 bg-primary text-white font-bold text-xs py-2 rounded-sm flex items-center justify-center transition-colors cursor-pointer z-11"
                                        onClick={handleComprar}
                                    >
                                        <span className="flex items-center">
                                            COMPRAR
                                        </span>
                                    </button>
                                )
                    }
                </div>
            </div>
        </div>
    );
}
