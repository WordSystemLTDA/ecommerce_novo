import { useEffect, useMemo, useState } from 'react';
import { BsBoxes, BsCartPlus } from "react-icons/bs";
import { MdFavorite, MdFavoriteBorder, MdOutlineAddShoppingCart, MdShoppingCartCheckout } from "react-icons/md";
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';
import { useAuth } from '~/features/auth/context/AuthContext';
import { useCarrinho } from "~/features/carrinho/context/CarrinhoContext";
import { useFavorito } from '~/features/favoritos/context/FavoritoContext';
import { favoritoService } from '~/features/favoritos/services/favoritoService';
import type { Produto } from "~/features/produto/types";
import { useSecondTicker } from "~/hooks/useSecondTicker";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import { getProductImageFallback } from "~/utils/imagePlaceholders";
import { OptimizedImage } from "./OptimizedImage";

interface ProductCardProps {
    produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
    let navigate = useNavigate();
    const { adicionarNovoProduto, verificarAdicionadoCarrinho } = useCarrinho();
    const estaNoCarrinho = verificarAdicionadoCarrinho(produto);
    const now = useSecondTicker();
    const productImageFallback = getProductImageFallback(produto.nome);

    const { cliente } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const { atualizarQuantidade } = useFavorito();
    // Debug favorite status
    // console.log(`Product ${produto.id} (${produto.nome}): ehFavorito=${produto.ehFavorito}, isFavorite=${isFavorite}`);

    useEffect(() => {
        if (cliente?.id) {
            setIsFavorite(produto.ehFavorito === 'Sim');
        } else {
            setIsFavorite(false);
        }
    }, [cliente, produto.ehFavorito]);

    useEffect(() => {
        setIsImageLoading(true);
    }, [produto.id, produto.fotos?.m?.[0]]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!cliente?.id) {
            toast.info("Faça login para favoritar.");
            return;
        }

        // Optimistic update
        const newState = !isFavorite;
        setIsFavorite(newState);

        try {
            if (newState) {
                await favoritoService.adicionar(cliente.id, produto.id);
            } else {
                await favoritoService.remover(cliente.id, produto.id);
            }
            atualizarQuantidade();
        } catch (error) {
            setIsFavorite(!newState); // Revert
            toast.error("Erro ao atualizar favorito");
        }
    };

    const timeLeft = useMemo(() => {
        if (produto.promocaoAtiva === 'Nao' || !produto.dataLimitePromocao || !produto.horaLimitePromocao || produto.tipoDaPromocao === 4) {
            return null;
        }

        const targetDate = new Date(`${produto.dataLimitePromocao}T${produto.horaLimitePromocao}`);
        const difference = targetDate.getTime() - now;

        if (difference <= 0) {
            return null;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        let formattedTime = "";
        if (days > 0) {
            formattedTime += `${days}D `;
        }

        formattedTime += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return formattedTime;
    }, [now, produto.dataLimitePromocao, produto.horaLimitePromocao, produto.promocaoAtiva, produto.tipoDaPromocao]);

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
            className="flex flex-col h-full border-t border-primary/15 bg-product-bg cursor-pointer group relative shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-500"
            onClick={() => {
                navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
            }}
        >
            <div className="relative overflow-hidden">
                <div className="flex absolute top-2 right-2 group-hover:opacity-100 opacity-0 transition-opacity duration-300 gap-2 p-1 z-10 cursor-auto">
                    <button onClick={toggleFavorite} className="hover:scale-110 transition-transform duration-300">
                        {isFavorite ? (
                            <MdFavorite size={20} className="text-terciary" />
                        ) : (
                            <MdFavoriteBorder size={20} className="text-primary" />
                        )}
                    </button>
                    {estaNoCarrinho ? (
                        <MdShoppingCartCheckout size={20} className="cursor-pointer text-primary" onClick={handleAdicionarCarrinho} />
                    ) : (
                        <MdOutlineAddShoppingCart size={20} className="cursor-pointer text-primary" onClick={handleAdicionarCarrinho} />
                    )}
                </div>

                {isImageLoading && (
                    <div className="absolute inset-0 px-4 pt-4 pb-0 z-1">
                        <div className="h-full w-full animate-pulse bg-primary/8" />
                    </div>
                )}

                <OptimizedImage
                    src={produto.fotos?.m?.[0]}
                    alt={produto.nome}
                    className={`w-full min-h-48 max-h-48 object-contain px-4 pt-4 pb-0 transition-all duration-900 ease-out group-hover:scale-[1.03] ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    fallbackSrc={productImageFallback}
                    onLoad={() => setIsImageLoading(false)}
                />
            </div>

            <div className="flex-1 p-3 lg:p-4 flex flex-col justify-between border-t border-primary/8">
                <div className="flex-1">
                    <h3 className="text-xs font-normal text-primary mb-2 overflow-hidden text-ellipsis leading-relaxed group-hover:text-terciary transition-colors duration-500">
                        {produto.nome}
                    </h3>

                    {precoAntigo && (
                        <span className="text-xs text-primary/70 line-through block mb-0.5">
                            {currencyFormatter.format(produto.precoAntigo)}
                        </span>
                    )}

                    <div className="flex items-baseline gap-2 mb-0">
                        <span className="text-base font-medium text-primary">
                            {currencyFormatter.format(parseFloat(precoExibido))}
                        </span>

                        {descontoTotal > 0 && (
                            <span className="text-tiny font-medium text-terciary border border-terciary px-1 py-0.5 tracking-wider">
                                -{descontoTotal}%
                            </span>
                        )}

                        {produto.promocaoAtiva === 'Sim' && (Number(produto.quantidadeLimiteDesconto) <= Number(produto.estoque) && produto.idPromocoesEcommerce) ? (
                            <span className="text-medium-tiny font-bold text-white bg-primary px-1 py-0.5 flex items-center gap-0.5 absolute top-2 left-2">
                                <BsBoxes />
                                Restam {(Number(produto.quantidadeLimiteDesconto) - Number(produto.quantidadeCompradoPromocao)).toFixed(0)} un.
                            </span>

                        )
                            :
                            produto.idPromocoesEcommerce && produto.promocaoAtiva === 'Sim' &&
                            (
                                <span className="text-medium-tiny font-bold text-primary border border-primary px-1 py-0.5 flex items-center gap-0.5 absolute top-2 left-2">
                                    OFERTA
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
                        <span className="text-xs text-primary/70 mt-1 block">
                            ou até <span className="font-medium text-primary">{produto.parcelaMaxima}</span>
                        </span>
                    )}
                </div>

                <div className="flex gap-0.5">
                    <button
                        className="mt-2 w-10 h-9 bg-primary text-secondary font-medium text-xs py-2 flex items-center justify-center hover:bg-terciary transition-colors duration-500 cursor-pointer z-10"
                        onClick={handleAdicionarCarrinho}
                    >
                        <BsCartPlus size={18} aria-hidden />
                    </button>

                    {
                        (timeLeft) ?
                            (
                                <>
                                    <p className="mt-2 w-full h-9 bg-product-bg border border-primary/20 text-primary font-medium text-xs py-2 flex flex-col leading-none items-center justify-center cursor-default z-10 lg:group-hover:hidden">
                                        <span className="text-[8px] lg:text-tiny font-normal mb-0.5 tracking-wider uppercase">Termina em</span>
                                        <span>{timeLeft}</span>
                                    </p>

                                    <button className="mt-2 w-full h-9 bg-primary text-secondary font-medium text-xs py-2 hidden lg:group-hover:flex items-center justify-center hover:bg-terciary transition-colors duration-500 cursor-pointer z-10 tracking-widest uppercase" onClick={handleComprar}>
                                        Comprar
                                    </button>
                                </>
                            )
                            : produto.tipoDaPromocao === 4 && produto.promocaoAtiva === 'Sim' ?
                                (
                                    <>
                                        <p className="mt-2 w-full h-9 bg-product-bg border border-primary/20 text-primary font-medium text-xs py-2 flex flex-col leading-none items-center justify-center cursor-default z-10 lg:group-hover:hidden">
                                            <span className="text-[8px] lg:text-tiny font-normal mb-0.5 tracking-wider uppercase">Restam</span>
                                            <span>{(Number(produto.quantidadeLimiteDesconto) - Number(produto.quantidadeCompradoPromocao)).toFixed(0)} Unidades</span>
                                        </p>

                                        <button className="mt-2 w-full h-9 bg-primary text-secondary font-medium text-xs py-2 hidden lg:group-hover:flex items-center justify-center hover:bg-terciary transition-colors duration-500 cursor-pointer z-10 tracking-widest uppercase" onClick={handleComprar}>
                                            Comprar
                                        </button>
                                    </>
                                )
                                : (
                                    <button
                                        className="mt-2 w-full h-9 bg-primary text-secondary font-medium text-xs py-2 flex items-center justify-center hover:bg-terciary transition-colors duration-500 cursor-pointer z-10 tracking-widest uppercase"
                                        onClick={handleComprar}
                                    >
                                        Comprar
                                    </button>
                                )
                    }
                </div>
            </div>
        </div>
    );
}

