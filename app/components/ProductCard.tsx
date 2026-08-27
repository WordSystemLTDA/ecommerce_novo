import { useEffect, useMemo, useState } from 'react';
import { BsBoxes, BsCartPlus } from "react-icons/bs";
import { MdFavorite, MdFavoriteBorder, MdOutlineAddShoppingCart, MdShoppingCartCheckout, MdStar } from "react-icons/md";
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
}

export function ProductCard({ produto, compact = false }: ProductCardProps) {
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
            setIsFavorite(false);
        }
    }, [cliente, produto.ehFavorito]);

    useEffect(() => {
        setIsImageLoading(true);
    }, [produto.id, productImage]);

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
            className="group relative flex h-full w-full min-w-0 cursor-pointer flex-col overflow-hidden border border-primary/10 bg-white shadow-[0_3px_14px_rgba(0,0,0,0.045)] transition-all duration-500 hover:z-10 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_30px_rgba(0,0,0,0.09)]"
            onClick={() => {
                navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
            }}
        >
            <div className={`relative shrink-0 overflow-hidden bg-white ${compact ? 'h-44 sm:h-48 xl:h-52' : 'h-52 sm:h-60 xl:h-64'}`}>
                <div className="absolute right-2 top-2 z-10 flex cursor-auto gap-1 bg-product-bg/90 p-1 opacity-100 shadow-sm transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
                    <button onClick={toggleFavorite} className="flex h-8 w-8 items-center justify-center transition-transform duration-300 hover:scale-110" aria-label="Adicionar aos favoritos">
                        {isFavorite ? (
                            <MdFavorite size={20} className="text-terciary" />
                        ) : (
                            <MdFavoriteBorder size={20} className="text-primary" />
                        )}
                    </button>
                    {estaNoCarrinho ? (
                        <button type="button" className="flex h-8 w-8 items-center justify-center" onClick={handleAdicionarCarrinho} aria-label="Ver no carrinho">
                            <MdShoppingCartCheckout size={20} className="cursor-pointer text-primary" />
                        </button>
                    ) : (
                        <button type="button" className="flex h-8 w-8 items-center justify-center" onClick={handleAdicionarCarrinho} aria-label="Adicionar ao carrinho">
                            <MdOutlineAddShoppingCart size={20} className="cursor-pointer text-primary" />
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
                    isLoading={isImageLoading}
                    onLoad={() => setIsImageLoading(false)}
                />
            </div>

            <div className="flex min-h-[14rem] flex-1 flex-col border-t border-primary/8 p-3 lg:p-4">
                <div className="flex flex-1 flex-col">
                    <div className="mb-2 flex min-h-4 items-center justify-between gap-2 text-[9px] uppercase tracking-[0.16em] text-primary/45">
                        <span className="truncate">{produto.nomeMarca || produto.marca?.nome || produto.nomeCategoria || 'Produto'}</span>
                        {Number(produto.avaliacao) > 0 && (
                            <span className="flex shrink-0 items-center gap-1 normal-case tracking-normal text-primary/60">
                                <MdStar className="text-terciary" size={12} />
                                {Number(produto.avaliacao).toFixed(1)}
                            </span>
                        )}
                    </div>

                    <h3 className="line-clamp-2 h-10 shrink-0 overflow-hidden text-ellipsis text-sm font-semibold leading-snug text-primary transition-colors duration-500 group-hover:text-terciary">
                        {produto.nome}
                    </h3>

                    <span
                        className={`mb-0.5 block h-4 shrink-0 text-xs text-primary/70 line-through ${precoAntigo ? '' : 'invisible'}`}
                        aria-hidden={!precoAntigo}
                    >
                        {precoAntigo ? currencyFormatter.format(produto.precoAntigo) : '\u00A0'}
                    </span>

                    <div className="mb-0 flex min-h-7 flex-wrap items-center gap-1 sm:gap-2">
                        <span className="text-lg font-semibold tracking-tight text-primary">
                            {currencyFormatter.format(parseFloat(precoExibido))}
                        </span>

                        {descontoTotal > 0 && (
                            <span className="text-tiny font-medium text-terciary border border-terciary px-1 py-0.5 tracking-wider">
                                -{descontoTotal}%
                            </span>
                        )}

                        {produto.promocaoAtiva === 'Sim' && (Number(produto.quantidadeLimiteDesconto) <= Number(produto.estoque) && produto.idPromocoesEcommerce) ? (
                            <span className="text-medium-tiny absolute left-2 top-2 flex items-center gap-0.5 bg-primary px-1 py-0.5 font-bold text-secondary">
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

                    <span className="block min-h-3 text-medium-tiny text-pix">
                        {percentualPix > 0
                            ? <>À vista no PIX com <span className='font-semibold'>{percentualPix}% de desconto</span></>
                            : 'À vista no PIX'
                        }
                    </span>
                    <span
                        className={`mt-1 block min-h-4 text-xs text-primary/70 ${produto.parcelaMaxima ? '' : 'invisible'}`}
                        aria-hidden={!produto.parcelaMaxima}
                    >
                        {produto.parcelaMaxima
                            ? <>ou até <span className="font-medium text-primary">{produto.parcelaMaxima}</span></>
                            : '\u00A0'
                        }
                    </span>
                    <span className={`mt-1 min-h-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-terciary ${produto.temFreteGratis ? '' : 'invisible'}`} aria-hidden={!produto.temFreteGratis}>
                        Frete grátis
                    </span>
                </div>

                <div className="mt-auto flex shrink-0 gap-0.5">
                    <button
                        className="z-10 mt-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center bg-primary py-2 text-xs font-medium text-secondary transition-colors duration-500 hover:bg-terciary"
                        aria-label="Adicionar ao carrinho"
                        onClick={handleAdicionarCarrinho}
                    >
                        <BsCartPlus size={18} aria-hidden />
                    </button>

                    {
                        (timeLeft) ?
                            (
                                <>
                                    <p className="mt-2 w-full h-10 bg-product-bg border border-primary/20 text-primary font-medium text-xs py-2 flex flex-col leading-none items-center justify-center cursor-default z-10 lg:group-hover:hidden">
                                        <span className="text-[8px] lg:text-tiny font-normal mb-0.5 tracking-wider uppercase">Termina em</span>
                                        <span>{timeLeft}</span>
                                    </p>

                                    <button className="mt-2 w-full h-10 bg-primary text-secondary font-medium text-xs py-2 hidden lg:group-hover:flex items-center justify-center hover:bg-terciary transition-colors duration-500 cursor-pointer z-10 tracking-widest uppercase" onClick={handleComprar}>
                                        Comprar
                                    </button>
                                </>
                            )
                            : produto.tipoDaPromocao === 4 && produto.promocaoAtiva === 'Sim' ?
                                (
                                    <>
                                        <p className="mt-2 w-full h-10 bg-product-bg border border-primary/20 text-primary font-medium text-xs py-2 flex flex-col leading-none items-center justify-center cursor-default z-10 lg:group-hover:hidden">
                                            <span className="text-[8px] lg:text-tiny font-normal mb-0.5 tracking-wider uppercase">Restam</span>
                                            <span>{(Number(produto.quantidadeLimiteDesconto) - Number(produto.quantidadeCompradoPromocao)).toFixed(0)} Unidades</span>
                                        </p>

                                        <button className="mt-2 w-full h-10 bg-primary text-secondary font-medium text-xs py-2 hidden lg:group-hover:flex items-center justify-center hover:bg-terciary transition-colors duration-500 cursor-pointer z-10 tracking-widest uppercase" onClick={handleComprar}>
                                            Comprar
                                        </button>
                                    </>
                                )
                                : (
                                    <button
                                        className="mt-2 w-full h-10 bg-primary text-secondary font-medium text-xs py-2 flex items-center justify-center hover:bg-terciary transition-colors duration-500 cursor-pointer z-10 tracking-widest uppercase"
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

