import { useEffect, useMemo, useState } from 'react';
import { BsBoxes, BsCartPlus } from "react-icons/bs";
import { MdFavorite, MdFavoriteBorder, MdLocalShipping, MdOutlineAddShoppingCart, MdShoppingCartCheckout, MdStar } from "react-icons/md";
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
import { NormalizedProductImage } from "./NormalizedProductImage";

interface ProductCardProps {
    produto: Produto;
    compact?: boolean;
    onFavoriteChange?: (produto: Produto, isFavorite: boolean) => void;
}

export function ProductCard({ produto, compact = false, onFavoriteChange }: ProductCardProps) {
    let navigate = useNavigate();
    const { adicionarNovoProduto, verificarAdicionadoCarrinho } = useCarrinho();
    const estaNoCarrinho = verificarAdicionadoCarrinho(produto);
    const now = useSecondTicker();
    const productImageFallback = getProductImageFallback(produto.nome);
    const productImage = produto.fotos?.m?.[0];
    const shouldNormalizeImage = !!productImage && !/sem[-_]?foto/i.test(productImage);

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
            setIsFavorite(favoritoService.verificarLocal(produto.id));
        }
    }, [cliente, produto.ehFavorito, produto.id]);

    useEffect(() => {
        setIsImageLoading(true);
    }, [produto.id, productImage]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!cliente?.id) {
            const newState = !isFavorite;
            setIsFavorite(newState);
            if (newState) favoritoService.adicionarLocal(produto.id);
            else favoritoService.removerLocal(produto.id);
            await atualizarQuantidade();
            onFavoriteChange?.(produto, newState);
            toast.success(newState ? "Produto salvo nos favoritos deste dispositivo." : "Produto removido dos favoritos.");
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
            onFavoriteChange?.(produto, newState);
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
            className="group relative flex h-full w-full min-w-0 cursor-pointer flex-col overflow-hidden border border-primary/10 bg-white shadow-[0_3px_14px_rgba(0,0,0,0.045)] transition-all duration-500 hover:z-10 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_30px_rgba(0,0,0,0.09)]"
            onClick={() => {
                navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
            }}
        >
            <div className={`relative shrink-0 overflow-hidden bg-white ${compact ? 'h-36 min-[380px]:h-40 sm:h-48 xl:h-52' : 'h-40 min-[380px]:h-44 sm:h-56 xl:h-64'}`}>
                <div className="pointer-events-none absolute left-1.5 top-1.5 z-20 flex max-w-[calc(100%-4rem)] flex-col items-start gap-1.5 sm:left-2 sm:top-2">
                    {produto.temFreteGratis && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_14px_rgba(5,150,105,0.3)] sm:text-[10px]">
                            <MdLocalShipping size={14} aria-hidden />
                            Frete grátis
                        </span>
                    )}
                    {produto.promocaoAtiva === 'Sim' && (Number(produto.quantidadeLimiteDesconto) <= Number(produto.estoque) && produto.idPromocoesEcommerce) ? (
                        <span className="inline-flex items-center gap-1 bg-primary px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-secondary shadow-sm sm:text-[10px]">
                            <BsBoxes aria-hidden />
                            Restam {(Number(produto.quantidadeLimiteDesconto) - Number(produto.quantidadeCompradoPromocao)).toFixed(0)} un.
                        </span>
                    ) : produto.idPromocoesEcommerce && produto.promocaoAtiva === 'Sim' ? (
                        <span className="inline-flex border border-primary bg-white/95 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-primary shadow-sm sm:text-[10px]">
                            Oferta
                        </span>
                    ) : null}
                </div>

                <div className="absolute right-1.5 top-1.5 z-10 flex cursor-auto gap-0.5 bg-white/95 p-0.5 opacity-100 shadow-sm transition-opacity duration-300 sm:right-2 sm:top-2 sm:gap-1 sm:p-1 lg:opacity-0 lg:group-hover:opacity-100">
                    <button onClick={toggleFavorite} className="flex h-7 w-7 items-center justify-center transition-transform duration-300 hover:scale-110 sm:h-8 sm:w-8" aria-label="Adicionar aos favoritos">
                        {isFavorite ? (
                            <MdFavorite size={18} className="text-terciary" />
                        ) : (
                            <MdFavoriteBorder size={18} className="text-primary" />
                        )}
                    </button>
                    {estaNoCarrinho ? (
                        <button type="button" className="flex h-7 w-7 items-center justify-center sm:h-8 sm:w-8" onClick={handleAdicionarCarrinho} aria-label="Ver no carrinho">
                            <MdShoppingCartCheckout size={18} className="cursor-pointer text-primary" />
                        </button>
                    ) : (
                        <button type="button" className="flex h-7 w-7 items-center justify-center sm:h-8 sm:w-8" onClick={handleAdicionarCarrinho} aria-label="Adicionar ao carrinho">
                            <MdOutlineAddShoppingCart size={18} className="cursor-pointer text-primary" />
                        </button>
                    )}
                </div>

                {isImageLoading && (
                    <div className="absolute inset-0 px-4 pt-4 pb-0 z-1">
                        <div className="h-full w-full animate-pulse bg-primary/8" />
                    </div>
                )}

                <NormalizedProductImage
                    src={productImage}
                    alt={produto.nome}
                    fallbackSrc={productImageFallback}
                    normalizeContent={shouldNormalizeImage}
                    contentInset={12}
                    isLoading={isImageLoading}
                    onLoad={() => setIsImageLoading(false)}
                />
            </div>

            <div className="flex flex-1 flex-col border-t border-primary/8 p-2.5 sm:p-3 lg:p-4">
                <div className="flex flex-col">
                    <div className="mb-1.5 flex min-h-4 items-center justify-between gap-1.5 text-[8px] uppercase tracking-[0.14em] text-primary/45 sm:mb-2 sm:gap-2 sm:text-[9px] sm:tracking-[0.16em]">
                        <span className="truncate">{produto.nomeMarca || produto.marca?.nome || produto.nomeCategoria || 'Produto'}</span>
                        {Number(produto.avaliacao) > 0 && (
                            <span className="flex shrink-0 items-center gap-1 normal-case tracking-normal text-primary/60">
                                <MdStar className="text-terciary" size={11} />
                                {Number(produto.avaliacao).toFixed(1)}
                            </span>
                        )}
                    </div>

                    <h3 className="line-clamp-2 h-9 shrink-0 overflow-hidden text-ellipsis text-[13px] font-semibold leading-snug text-primary transition-colors duration-500 group-hover:text-terciary sm:h-10 sm:text-sm">
                        {produto.nome}
                    </h3>

                    <span
                        className={`mb-0.5 block h-4 shrink-0 text-[11px] text-primary/70 line-through sm:text-xs ${precoAntigo ? '' : 'invisible'}`}
                        aria-hidden={!precoAntigo}
                    >
                        {precoAntigo ? currencyFormatter.format(produto.precoAntigo) : '\u00A0'}
                    </span>

                    <div className="mb-0 flex min-h-7 flex-wrap items-center gap-1 sm:gap-2">
                        <span className="text-base font-semibold tracking-tight text-primary sm:text-lg">
                            {currencyFormatter.format(parseFloat(precoExibido))}
                        </span>

                        {descontoTotal > 0 && (
                            <span className="border border-terciary px-1 py-0.5 text-[10px] font-medium tracking-wider text-terciary">
                                -{descontoTotal}%
                            </span>
                        )}

                    </div>

                    <span className="block min-h-3 text-[8px] leading-snug text-pix sm:text-medium-tiny">
                        {percentualPix > 0
                            ? <>À vista no PIX com <span className='font-semibold'>{percentualPix}% de desconto</span></>
                            : 'À vista no PIX'
                        }
                    </span>
                    {produto.parcelaMaxima && (
                        <span className="mt-1 block text-[10px] text-primary/70 sm:text-xs">
                            ou até <span className="font-medium text-primary">{produto.parcelaMaxima}</span>
                        </span>
                    )}
                    {produto.temFreteGratis && (
                        <span className="mt-2 inline-flex w-fit items-center gap-1.5 border-l-2 border-emerald-600 bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-800 sm:text-[10px]">
                            <MdLocalShipping size={13} aria-hidden />
                            Você não paga o frete
                        </span>
                    )}
                </div>

                <div className="mt-auto flex shrink-0 gap-0.5 pt-3">
                    <button
                        className="z-10 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center bg-primary py-2 text-xs font-medium text-secondary transition-colors duration-500 hover:bg-terciary sm:h-10 sm:w-10"
                        aria-label="Adicionar ao carrinho"
                        onClick={handleAdicionarCarrinho}
                    >
                        <BsCartPlus size={18} aria-hidden />
                    </button>

                    {
                        (timeLeft) ?
                            (
                                <>
                                    <p className="z-10 flex h-9 w-full cursor-default flex-col items-center justify-center border border-primary/20 bg-product-bg py-2 text-[10px] font-medium leading-none text-primary sm:h-10 sm:text-xs lg:group-hover:hidden">
                                        <span className="text-[8px] lg:text-tiny font-normal mb-0.5 tracking-wider uppercase">Termina em</span>
                                        <span>{timeLeft}</span>
                                    </p>

                                    <button className="z-10 hidden h-9 w-full cursor-pointer items-center justify-center bg-primary py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-secondary transition-colors duration-500 hover:bg-terciary sm:h-10 sm:text-xs sm:tracking-widest lg:group-hover:flex" onClick={handleComprar}>
                                        Comprar
                                    </button>
                                </>
                            )
                            : produto.tipoDaPromocao === 4 && produto.promocaoAtiva === 'Sim' ?
                                (
                                    <>
                                        <p className="z-10 flex h-9 w-full cursor-default flex-col items-center justify-center border border-primary/20 bg-product-bg py-2 text-[10px] font-medium leading-none text-primary sm:h-10 sm:text-xs lg:group-hover:hidden">
                                            <span className="text-[8px] lg:text-tiny font-normal mb-0.5 tracking-wider uppercase">Restam</span>
                                            <span>{(Number(produto.quantidadeLimiteDesconto) - Number(produto.quantidadeCompradoPromocao)).toFixed(0)} Unidades</span>
                                        </p>

                                        <button className="z-10 hidden h-9 w-full cursor-pointer items-center justify-center bg-primary py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-secondary transition-colors duration-500 hover:bg-terciary sm:h-10 sm:text-xs sm:tracking-widest lg:group-hover:flex" onClick={handleComprar}>
                                            Comprar
                                        </button>
                                    </>
                                )
                                : (
                                    <button
                                        className="z-10 flex h-9 w-full cursor-pointer items-center justify-center bg-primary py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-secondary transition-colors duration-500 hover:bg-terciary sm:h-10 sm:text-xs sm:tracking-widest"
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

