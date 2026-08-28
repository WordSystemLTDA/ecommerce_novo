import { useEffect, useMemo, useRef, useState, type FormEvent, type RefObject } from "react";
import {
    Check,
    ChevronRight,
    Heart,
    Minus,
    Package,
    Plus,
    RotateCcw,
    Ruler,
    Share2,
    ShieldCheck,
    ShoppingBag,
    Star,
    Truck,
    X,
    ZoomIn,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import Footer from "~/components/footer";
import Header from "~/components/header";
import Loader from "~/components/loader";
import { OptimizedImage } from "~/components/OptimizedImage";
import { ProductCard } from "~/components/ProductCard";
import RatingStars from "~/components/rating_stars";
import { useAuth } from "~/features/auth/context/AuthContext";
import { useCarrinho } from "~/features/carrinho/context/CarrinhoContext";
import { useFavorito } from "~/features/favoritos/context/FavoritoContext";
import { favoritoService } from "~/features/favoritos/services/favoritoService";
import type { TipoDeEntrega } from "~/types/TipoDeEntrega";
import { getDeliveryPrice, getDeliveryTime } from "~/utils/delivery";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import { getProductImageFallback } from "~/utils/imagePlaceholders";
import { getProductDescription } from "~/utils/seo";
import config from "~/config/config";
import { produtoService } from "./services/produtoService";
import type { Produto, ProdutoCor, ProdutoTamanho } from "./types";
import { getRecentlyViewed, rememberRecentlyViewed } from "./recentlyViewed";

interface ProdutoProps {
    produto: Produto;
}

interface PriceDetails {
    basePrice: number;
    cardPrice: number;
    pixPrice: number;
    oldPrice: number | null;
    discount: number;
    pixPercentage: number;
}

interface ProductPreview {
    id: number;
    name: string;
    image: string;
    price?: number;
    tag?: string;
}

export default function ProdutoPage({ produto }: ProdutoProps) {
    const { id, slug } = useParams();
    const { tamanhoSelecionado, setTamanhoSelecionado } = useCarrinho();
    const [erroTamanho, setErroTamanho] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const sizeSectionRef = useRef<HTMLDivElement>(null);

    const productImages = useMemo(() => getProductImages(produto), [produto]);

    useEffect(() => {
        setTamanhoSelecionado(null);
        setErroTamanho(false);
        setQuantity(1);
    }, [id, setTamanhoSelecionado]);

    useEffect(() => {
        if (!produto?.id) return;

        const correctSlug = gerarSlug(produto.nome);
        if (slug !== correctSlug) {
            window.history.replaceState(null, "", `/produto/${produto.id}/${correctSlug}`);
        }
        rememberRecentlyViewed(produto);
    }, [produto, slug]);

    const handleMissingSize = () => {
        setErroTamanho(true);
        sizeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <div className="min-h-screen bg-main-bg text-primary">
            <Header />

            <main className="min-h-screen bg-main-bg">
                <div className="page-container pb-16 pt-5 sm:pt-7 lg:pb-24">
                    <div className="mx-auto max-w-[1280px]">
                        <ProductBreadcrumb produto={produto} />

                        <div className="grid gap-9 lg:grid-cols-[minmax(0,1.06fr)_minmax(24rem,0.94fr)] lg:gap-14">
                            <ProductGallery
                                images={productImages}
                                produtoId={produto.id}
                                produtoNome={produto.nome}
                            />

                            <section className="min-w-0">
                                <ProductHeading produto={produto} />
                                <PriceBlock produto={produto} tamanhoSelecionado={tamanhoSelecionado} />
                                <ColorSelector produto={produto} />
                                <SizeSelector
                                    sectionRef={sizeSectionRef}
                                    produto={produto}
                                    erroTamanho={erroTamanho}
                                    onSelect={(size) => {
                                        setTamanhoSelecionado(size);
                                        setErroTamanho(false);
                                        setQuantity(1);
                                    }}
                                />
                                <PurchaseActions
                                    produto={produto}
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                    onMissingSize={handleMissingSize}
                                />
                                <FreightCalculator produto={produto} />
                            </section>
                        </div>

                        <ProductDetails produto={produto} />
                        <ProductRecommendations produto={produto} />
                    </div>
                </div>
            </main>

            <a
                href="#comprar-produto"
                className="fixed inset-x-0 bottom-0 z-40 grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-primary/15 bg-product-bg/96 px-4 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur lg:hidden"
            >
                <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-primary/50">Preço no PIX</span>
                    <strong className="block truncate text-base text-primary">{currencyFormatter.format(getPriceDetails(produto, tamanhoSelecionado).pixPrice)}</strong>
                </span>
                <span className="max-w-[55vw] bg-primary px-3 py-3 text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.12em] text-secondary sm:px-4 sm:text-[11px]">
                    {Number(produto.estoque) > 0 ? "Escolher e comprar" : "Ver disponibilidade"}
                </span>
            </a>

            <Footer />
        </div>
    );
}

function ProductBreadcrumb({ produto }: ProdutoProps) {
    const items = [produto.vendidoPor, produto.nomeCategoria, produto.nomeSubCategoria, produto.nome]
        .map((item) => String(item ?? "").trim())
        .filter(Boolean);

    return (
        <nav
            aria-label="Navegação estrutural"
            className="mb-6 flex min-w-0 items-center gap-2 overflow-hidden text-[11px] font-medium uppercase tracking-[0.14em] text-primary/55 sm:mb-8"
        >
            {items.map((item, index) => (
                <span key={`${item}-${index}`} className="flex min-w-0 items-center gap-2">
                    {index > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-primary/30" aria-hidden />}
                    <span className={index === items.length - 1 ? "truncate text-primary/80" : "truncate"}>
                        {item}
                    </span>
                </span>
            ))}
        </nav>
    );
}

interface ProductGalleryProps {
    images: string[];
    produtoId: number;
    produtoNome: string;
}

function ProductGallery({ images, produtoId, produtoNome }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const { cliente } = useAuth();
    const { atualizarQuantidade } = useFavorito();
    const imageFallback = getProductImageFallback(produtoNome);

    useEffect(() => {
        setActiveImage(0);
    }, [produtoId]);

    useEffect(() => {
        if (!isZoomOpen) return;

        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsZoomOpen(false);
        };
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isZoomOpen]);

    useEffect(() => {
        if (!cliente?.id) {
            setIsFavorite(favoritoService.verificarLocal(produtoId));
            return;
        }

        favoritoService.verificar(cliente.id, produtoId)
            .then(setIsFavorite)
            .catch((error) => console.error("Erro ao verificar favorito:", error));
    }, [cliente?.id, produtoId]);

    const toggleFavorite = async () => {
        if (!cliente?.id) {
            const nextState = !isFavorite;
            setIsFavorite(nextState);
            if (nextState) favoritoService.adicionarLocal(produtoId);
            else favoritoService.removerLocal(produtoId);
            await atualizarQuantidade();
            toast.success(nextState ? "Produto salvo nos favoritos deste dispositivo." : "Produto removido dos favoritos.");
            return;
        }

        const nextState = !isFavorite;
        setIsFavorite(nextState);

        try {
            if (nextState) {
                await favoritoService.adicionar(cliente.id, produtoId);
            } else {
                await favoritoService.remover(cliente.id, produtoId);
            }
            atualizarQuantidade();
            toast.success(nextState ? "Produto adicionado aos favoritos." : "Produto removido dos favoritos.");
        } catch (error) {
            setIsFavorite(!nextState);
            console.error("Erro ao atualizar favorito:", error);
            toast.error("Não foi possível atualizar os favoritos.");
        }
    };

    const shareProduct = async () => {
        const shareData = {
            title: produtoNome,
            text: `Confira ${produtoNome}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(shareData.url);
            toast.success("Link do produto copiado.");
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            toast.error("Não foi possível compartilhar o produto.");
        }
    };

    const safeActiveIndex = Math.min(activeImage, Math.max(images.length - 1, 0));
    const activeSource = images[safeActiveIndex] ?? imageFallback;

    return (
        <section className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-square overflow-hidden bg-product-bg">
                <OptimizedImage
                    src={activeSource}
                    fallbackSrc={imageFallback}
                    alt={`${produtoNome} - imagem ${safeActiveIndex + 1}`}
                    className="h-full! w-full! object-contain! p-5 sm:p-8"
                    priority
                />

                <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-secondary sm:left-4 sm:top-4">
                    {safeActiveIndex + 1} / {images.length}
                </span>

                <button
                    type="button"
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-product-bg/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary shadow-sm sm:bottom-4 sm:left-4"
                    aria-label="Ampliar imagem do produto"
                >
                    <ZoomIn className="h-3.5 w-3.5" /> Ampliar
                </button>

                <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 sm:right-4 sm:top-4">
                    <button
                        type="button"
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-product-bg/95 text-primary shadow-sm transition-colors hover:border-primary/25"
                    >
                        <Heart className={`h-4 w-4 ${isFavorite ? "fill-terciary text-terciary" : ""}`} />
                    </button>
                    <button
                        type="button"
                        onClick={shareProduct}
                        aria-label="Compartilhar produto"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-product-bg/95 text-primary shadow-sm transition-colors hover:border-primary/25"
                    >
                        <Share2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1 sm:mt-4">
                {images.map((image, index) => (
                    <button
                        type="button"
                        key={`${image}-${index}`}
                        onClick={() => setActiveImage(index)}
                        aria-label={`Ver imagem ${index + 1} de ${produtoNome}`}
                        aria-current={safeActiveIndex === index}
                        className={`h-24 w-24 shrink-0 overflow-hidden border bg-product-bg transition-colors sm:h-28 sm:w-28 ${
                            safeActiveIndex === index
                                ? "border-primary"
                                : "border-primary/10 hover:border-primary/35"
                        }`}
                    >
                        <OptimizedImage
                            src={image}
                            fallbackSrc={imageFallback}
                            alt={`Miniatura ${index + 1} de ${produtoNome}`}
                            className="h-full! w-full! object-contain! p-2"
                            priority
                        />
                    </button>
                ))}
            </div>

            {isZoomOpen && (
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-3 sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Imagem ampliada de ${produtoNome}`}
                    onClick={() => setIsZoomOpen(false)}
                >
                    <button type="button" onClick={() => setIsZoomOpen(false)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg" aria-label="Fechar imagem ampliada">
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex h-full w-full items-center justify-center" onClick={(event) => event.stopPropagation()}>
                        <OptimizedImage
                            src={activeSource}
                            fallbackSrc={imageFallback}
                            alt={`${produtoNome} ampliado`}
                            className="max-h-[92vh]! max-w-[94vw]! object-contain!"
                            priority
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

function ProductHeading({ produto }: ProdutoProps) {
    const description = getProductDescription(produto, 240);
    const rating = Number(produto.avaliacao) || 0;
    const reviewCount = Number(produto.quantidadeAvaliacoes) || 0;
    const badge = produto.selo?.titulo || (produto.promocaoAtiva === "Sim" ? "Oferta" : "");

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                {badge && <span className="bg-primary px-2.5 py-1 text-secondary">{badge}</span>}
                <span className="text-primary/55">Produto disponível</span>
                {rating > 0 && reviewCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-primary/65">
                        <Star className="h-3 w-3 fill-terciary text-terciary" />
                        {rating.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ({reviewCount})
                    </span>
                )}
            </div>

            <h1 className="mt-3 overflow-wrap-anywhere text-[1.4rem] font-semibold leading-[1.08] tracking-[-0.02em] text-primary sm:text-[1.7rem] lg:text-[2.05rem]">
                {produto.nome}
            </h1>

            {description && (
                <p className="mt-3 max-w-2xl text-sm leading-5 text-primary/65">
                    {description}
                </p>
            )}

            {rating > 0 && reviewCount > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-primary/55 sm:hidden">
                    <RatingStars rating={rating} variant="tiny" />
                    <span>{reviewCount} avaliações</span>
                </div>
            )}
        </div>
    );
}

function PriceBlock({ produto, tamanhoSelecionado }: ProdutoProps & { tamanhoSelecionado: ProdutoTamanho | null }) {
    const price = getPriceDetails(produto, tamanhoSelecionado);
    const installments = Math.max(1, Number(produto.numeroParcelas) || 1);
    const installmentPrice = price.cardPrice / installments;

    return (
        <div className="mt-5 border-y border-primary/10 py-4 sm:mt-6 sm:py-5">
            <div className="flex flex-wrap items-center gap-3">
                {price.oldPrice !== null && price.oldPrice > price.pixPrice && (
                    <span className="text-sm text-primary/50 line-through">
                        {currencyFormatter.format(price.oldPrice)}
                    </span>
                )}
                {price.discount > 0 && (
                    <span className="bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                        {price.discount}% off
                    </span>
                )}
            </div>
            <p className="mt-1 text-[1.35rem] font-semibold tracking-[-0.015em] text-primary sm:text-[1.75rem]">
                {currencyFormatter.format(price.pixPrice)}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-primary/60 sm:text-sm">
                À vista no PIX
                {price.pixPercentage > 0 && ` com ${formatNumber(price.pixPercentage)}% de desconto`}
                {installments > 1 && (
                    <>
                        <span className="px-1.5 text-primary/30">·</span>
                        ou <strong className="font-semibold text-primary">{installments}x de {currencyFormatter.format(installmentPrice)}</strong>
                    </>
                )}
            </p>
        </div>
    );
}

function ColorSelector({ produto }: ProdutoProps) {
    const navigate = useNavigate();
    const colors = produto.cores ?? [];

    if (colors.length === 0) return null;

    const selectedColor = colors.find((color) => Number(color.id) === Number(produto.id));

    return (
        <div className="mt-5 sm:mt-6">
            <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Cor</h2>
                <span className="text-sm text-primary/55">{selectedColor?.nome || "Selecionada"}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
                {colors.map((color) => {
                    const isSelected = Number(color.id) === Number(produto.id);
                    return (
                        <button
                            type="button"
                            key={color.id}
                            onClick={() => navigate(`/produto/${color.id}/${gerarSlug(color.nome || produto.nome)}`)}
                            aria-label={`Ver produto na cor ${color.nome || "selecionada"}`}
                            aria-current={isSelected}
                            title={color.nome || "Cor do produto"}
                            className={`h-16 w-16 overflow-hidden border-2 bg-product-bg p-1 transition-colors ${
                                isSelected ? "border-primary" : "border-transparent hover:border-primary/25"
                            }`}
                        >
                            <OptimizedImage
                                src={color.imagem}
                                fallbackSrc={getProductImageFallback(color.nome || produto.nome)}
                                alt={color.nome || produto.nome}
                                className="h-full! w-full! object-contain!"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

interface SizeSelectorProps extends ProdutoProps {
    erroTamanho: boolean;
    onSelect: (size: ProdutoTamanho) => void;
    sectionRef: RefObject<HTMLDivElement | null>;
}

function SizeSelector({ produto, erroTamanho, onSelect, sectionRef }: SizeSelectorProps) {
    const { tamanhoSelecionado } = useCarrinho();
    const [showGuide, setShowGuide] = useState(false);
    const sizes = produto.tamanhos ?? [];

    if (sizes.length === 0) return null;

    return (
        <div ref={sectionRef} className="mt-5 scroll-mt-32 sm:mt-6">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Tamanho</h2>
                <button
                    type="button"
                    onClick={() => setShowGuide((current) => !current)}
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-primary/60 underline underline-offset-4 transition-colors hover:text-primary"
                    aria-expanded={showGuide}
                >
                    <Ruler className="h-3.5 w-3.5" />
                    Tabela de medidas
                </button>
            </div>

            <div className="mt-2.5 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {sizes.map((size) => {
                    const outOfStock = Number(size.estoque) <= 0;
                    const isSelected = Number(tamanhoSelecionado?.id) === Number(size.id);
                    return (
                        <button
                            type="button"
                            key={size.id}
                            disabled={outOfStock}
                            onClick={() => onSelect(size)}
                            title={outOfStock ? "Sem estoque" : `${size.estoque} em estoque`}
                            className={`relative min-h-11 border px-2 py-2 text-sm font-semibold transition-colors ${
                                outOfStock
                                    ? "cursor-not-allowed border-primary/10 bg-primary/5 text-primary/30 line-through"
                                    : isSelected
                                        ? "border-primary bg-primary text-secondary"
                                        : erroTamanho
                                            ? "border-red-500 text-red-600"
                                            : "border-primary/15 text-primary hover:border-primary"
                            }`}
                        >
                            {getDisplaySize(size.tamanho)}
                        </button>
                    );
                })}
            </div>

            <p className={`mt-1.5 text-xs ${erroTamanho ? "font-medium text-red-600" : "text-primary/55"}`}>
                {tamanhoSelecionado
                    ? `Tamanho ${getDisplaySize(tamanhoSelecionado.tamanho)} · ${tamanhoSelecionado.estoque} em estoque`
                    : erroTamanho
                        ? "Selecione um tamanho para continuar."
                        : "Selecione o tamanho desejado."}
            </p>

            {showGuide && (
                <div className="mt-3 border border-primary/10 bg-product-bg p-3 text-xs leading-5 text-primary/65 sm:p-4">
                    <p className="font-semibold text-primary">Tamanho / grade da peça</p>
                    <p className="mt-1">
                        As opções exibidas são as grades cadastradas para este produto. As opções riscadas estão sem estoque.
                    </p>
                </div>
            )}

            <div className="mt-3 border border-primary/10 bg-product-bg p-3 sm:p-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Grade da peça</h3>
                <p className="mt-1 text-xs leading-5 text-primary/55">
                    Cada tamanho acima corresponde a uma grade disponível no estoque.
                </p>
                {tamanhoSelecionado && (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-3 text-sm">
                        <span>Grade <strong className="font-semibold">{getDisplaySize(tamanhoSelecionado.tamanho)}</strong></span>
                        <span className="text-primary/60">
                            {Number(tamanhoSelecionado.valorGrade) > 0
                                ? `Adicional de ${currencyFormatter.format(Number(tamanhoSelecionado.valorGrade))}`
                                : "Sem valor adicional"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

interface PurchaseActionsProps extends ProdutoProps {
    quantity: number;
    setQuantity: (quantity: number) => void;
    onMissingSize: () => void;
}

function PurchaseActions({ produto, quantity, setQuantity, onMissingSize }: PurchaseActionsProps) {
    const navigate = useNavigate();
    const { cliente } = useAuth();
    const { adicionarNovoProduto, tamanhoSelecionado } = useCarrinho();
    const [isAdding, setIsAdding] = useState(false);
    const [stockAlertEnabled, setStockAlertEnabled] = useState(false);
    const [stockAlertLoading, setStockAlertLoading] = useState(false);
    const hasSizes = (produto.tamanhos?.length ?? 0) > 0;
    const selectedStock = hasSizes ? Number(tamanhoSelecionado?.estoque ?? 0) : Number(produto.estoque ?? 0);
    const availableStock = Math.max(0, selectedStock);
    const maximumQuantity = Math.max(1, Math.min(99, availableStock || 1));
    const isOutOfStock = Number(produto.estoque) <= 0;

    useEffect(() => {
        if (!cliente?.id || !produto.id) return;

        produtoService.verificarAvisoEstoque(produto.id, cliente.id)
            .then((response) => setStockAlertEnabled(Boolean(response?.status)))
            .catch((error) => console.error("Erro ao verificar aviso de estoque:", error));
    }, [cliente?.id, produto.id]);

    useEffect(() => {
        if (quantity > maximumQuantity) setQuantity(maximumQuantity);
    }, [maximumQuantity, quantity, setQuantity]);

    const validateSelection = () => {
        if (hasSizes && !tamanhoSelecionado) {
            onMissingSize();
            toast.error("Selecione um tamanho para continuar.", { position: "top-center" });
            return false;
        }
        return true;
    };

    const addProduct = async (goToCart: boolean) => {
        if (!validateSelection()) return;

        const price = getPriceDetails(produto, tamanhoSelecionado);
        const cartProduct: Produto = {
            ...produto,
            quantidade: quantity,
            preco: price.pixPrice.toFixed(2),
            tamanhoSelecionado: tamanhoSelecionado ?? undefined,
        };

        setIsAdding(true);
        try {
            const success = await adicionarNovoProduto(cartProduct);
            if (!success) return;

            if (goToCart) {
                navigate("/carrinho");
            } else {
                toast.success(quantity > 1 ? `${quantity} unidades adicionadas ao carrinho.` : "Produto adicionado ao carrinho.");
            }
        } finally {
            setIsAdding(false);
        }
    };

    const toggleStockAlert = async () => {
        if (!cliente?.id) {
            toast.info("Faça login para ativar o aviso de estoque.");
            return;
        }

        setStockAlertLoading(true);
        try {
            const response = await produtoService.toggleAvisoEstoque(produto.id, cliente.id);
            setStockAlertEnabled(Boolean(response?.status));
            toast.success(response?.message || "Preferência de aviso atualizada.");
        } catch (error) {
            console.error("Erro ao atualizar aviso de estoque:", error);
            toast.error("Não foi possível atualizar o aviso de estoque.");
        } finally {
            setStockAlertLoading(false);
        }
    };

    if (isOutOfStock && produto.habilitarAviso === "Sim") {
        return (
            <div id="comprar-produto" className="mt-5 scroll-mt-32 sm:mt-6">
                <p className="mb-3 text-sm font-semibold text-red-600">Produto sem estoque.</p>
                <button
                    type="button"
                    onClick={toggleStockAlert}
                    disabled={stockAlertLoading}
                    className="flex h-12 w-full items-center justify-center gap-2 bg-primary px-5 text-xs font-semibold uppercase tracking-[0.16em] text-secondary disabled:opacity-60"
                >
                    {stockAlertLoading ? <Loader size="small" /> : stockAlertEnabled ? "Aviso de estoque ativado" : "Avise-me quando chegar"}
                </button>
            </div>
        );
    }

    return (
        <div id="comprar-produto" className="mt-5 scroll-mt-32 sm:mt-6">
            <p className={`mb-3 text-xs font-semibold ${isOutOfStock ? "text-red-600" : "text-emerald-700"}`}>
                {isOutOfStock
                    ? "Produto sem estoque"
                    : hasSizes && !tamanhoSelecionado
                        ? "Selecione um tamanho para ver a disponibilidade"
                        : `Em estoque (${availableStock} ${availableStock === 1 ? "disponível" : "disponíveis"})`}
            </p>

            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                <div className="flex h-12 items-center border border-primary/15">
                    <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        aria-label="Diminuir quantidade"
                        className="flex h-full w-11 items-center justify-center text-primary/60 transition-colors hover:text-primary disabled:opacity-30"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => setQuantity(Math.min(maximumQuantity, quantity + 1))}
                        disabled={quantity >= maximumQuantity || isOutOfStock}
                        aria-label="Aumentar quantidade"
                        className="flex h-full w-11 items-center justify-center text-primary/60 transition-colors hover:text-primary disabled:opacity-30"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => addProduct(true)}
                    disabled={isOutOfStock || isAdding}
                    className="flex h-12 items-center justify-center bg-primary px-5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                >
                    {isAdding ? <Loader size="small" /> : "Comprar agora"}
                </button>
            </div>

            <button
                type="button"
                onClick={() => addProduct(false)}
                disabled={isOutOfStock || isAdding}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 border border-primary bg-transparent px-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-45"
            >
                <ShoppingBag className="h-4 w-4" />
                Adicionar ao carrinho
            </button>
        </div>
    );
}

function FreightCalculator({ produto }: ProdutoProps) {
    const [cep, setCep] = useState("");
    const [loading, setLoading] = useState(false);
    const [freightOptions, setFreightOptions] = useState<TipoDeEntrega[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const calculateFreight = async (event?: FormEvent) => {
        event?.preventDefault();
        const cleanCep = cep.replace(/\D/g, "");

        if (cleanCep.length !== 8) {
            setErrorMessage("Digite um CEP válido com 8 números.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setFreightOptions([]);

        try {
            const response = await produtoService.calcularFrete(cleanCep, [produto]);
            const options = Array.isArray(response?.data) ? response.data : [];
            const availableOptions = options.filter((option) =>
                !option.error && (option.price != null || option.custom_price != null)
            );

            setFreightOptions(availableOptions);
            if (availableOptions.length === 0) {
                setErrorMessage("Nenhuma opção de entrega foi encontrada para este CEP.");
            }
        } catch (error) {
            console.error("Erro ao calcular frete:", error);
            setErrorMessage(getRequestErrorMessage(error, "Não foi possível calcular o frete. Confira o CEP e tente novamente."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-5 border border-primary/10 bg-product-bg p-3.5 sm:mt-6 sm:p-4">
            <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.17em]">Calcular frete e prazo</h2>
            </div>

            <form onSubmit={calculateFreight} className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <input
                    type="text"
                    inputMode="numeric"
                    value={cep}
                    onChange={(event) => setCep(maskCep(event.target.value))}
                    placeholder="Digite seu CEP"
                    aria-label="CEP para cálculo de frete"
                    maxLength={9}
                    className="h-11 min-w-0 border border-primary/15 bg-main-bg px-3 text-sm text-primary outline-none placeholder:text-primary/40 focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 min-w-16 items-center justify-center bg-primary px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary disabled:opacity-60"
                >
                    {loading ? <Loader size="small" /> : "OK"}
                </button>
            </form>

            {errorMessage && <p role="alert" className="mt-2 text-xs leading-5 text-red-600">{errorMessage}</p>}

            {freightOptions.length > 0 && (
                <div className="mt-3 divide-y divide-primary/10 border-t border-primary/10">
                    {freightOptions.map((option) => {
                        const time = getDeliveryTime(option);
                        const price = getDeliveryPrice(option);
                        return (
                            <div key={option.id} className="flex items-center justify-between gap-4 py-2.5 text-xs">
                                <div>
                                    <p className="font-semibold text-primary">{option.name || option.company?.name || "Entrega"}</p>
                                    <p className="mt-0.5 text-primary/55">até {time} {time === 1 ? "dia útil" : "dias úteis"}</p>
                                </div>
                                <strong className="font-semibold text-primary">
                                    {price === 0 ? "Grátis" : currencyFormatter.format(price)}
                                </strong>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-3 grid gap-2 border-t border-primary/10 pt-3 text-[11px] text-primary/55 sm:grid-cols-3">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0" /> Compra protegida</span>
                <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4 shrink-0" /> Troca facilitada</span>
                <span className="flex items-center gap-2"><Package className="h-4 w-4 shrink-0" /> Embalagem segura</span>
            </div>
            <a
                href={`${config.WHATSAPP_URL}?text=${encodeURIComponent(`Olá! Gostaria de consultar a retirada de ${produto.nome} na loja física.`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-xs font-semibold text-terciary underline underline-offset-4"
            >
                Consultar retirada na loja física
            </a>
        </div>
    );
}

function ProductDetails({ produto }: ProdutoProps) {
    const descriptions = [produto.descricaolonga1, produto.descricaolonga2, produto.descricao]
        .map((description) => String(description ?? "").trim())
        .filter((description, index, all) => description && all.indexOf(description) === index);

    const technicalDetails = ([
        ["Código", produto.codigo],
        ["Categoria", produto.nomeCategoria],
        ["Subcategoria", produto.nomeSubCategoria],
        ["Marca", produto.nomeMarca || produto.marca?.nome],
        ["Cor", produto.nomeCor],
        ["Tipo de estoque", produto.habil_tipo === "Grade" ? "Por grade / tamanho" : produto.tipodeestoque],
        ["Garantia", produto.garantia],
    ] as Array<[string, unknown]>)
        .filter((detail) => Boolean(detail[1]))
        .map(([label, value]): [string, string] => [label, String(value)]);

    const dimensions = formatDimensions(produto);
    const weight = formatMeasurement(produto.peso, "kg");

    return (
        <section className="mt-7 grid gap-4 border-t border-primary/10 pt-5 sm:mt-8 sm:pt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-6">
            <div>
                <h2 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">Sobre o produto</h2>
                {descriptions.length > 0 ? (
                    <div className="mt-2 space-y-2 text-sm leading-6 text-primary/65">
                        {descriptions.map((description, index) => <p key={`${description}-${index}`}>{description}</p>)}
                    </div>
                ) : null}

                {technicalDetails.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]">Ficha técnica</h3>
                        <dl className="mt-2 grid gap-x-8 sm:grid-cols-2">
                            {technicalDetails.map(([label, value]) => (
                                <div key={label} className="flex justify-between gap-4 border-b border-primary/10 py-2 text-sm">
                                    <dt className="text-primary/55">{label}</dt>
                                    <dd className="text-right font-medium text-primary">{String(value)}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </div>

            <aside className="h-fit border border-primary/10 bg-product-bg p-3 sm:p-4">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em]">Embalagem e envio</h2>
                </div>
                <dl className="mt-2 divide-y divide-primary/10">
                    <PackagingRow label="Peso do pacote" value={weight} />
                    <PackagingRow label="Dimensões" value={dimensions} />
                    <PackagingRow label="Conteúdo" value="1 unidade do produto" />
                    <PackagingRow label="Embalagem" value="Protegida para transporte" />
                </dl>
                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-primary/55">
                    <DetailCheck text="Produto acondicionado para evitar avarias" />
                    <DetailCheck text="Nota fiscal eletrônica enviada por e-mail" />
                    <DetailCheck text="Rastreio disponibilizado após a postagem" />
                </ul>
            </aside>
        </section>
    );
}

function PackagingRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 py-2 text-sm">
            <dt className="text-primary/55">{label}</dt>
            <dd className="text-right font-medium text-primary">{value}</dd>
        </div>
    );
}

function DetailCheck({ text }: { text: string }) {
    return (
        <li className="flex gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span>{text}</span>
        </li>
    );
}

function ProductRecommendations({ produto }: ProdutoProps) {
    const [colorProducts, setColorProducts] = useState<Produto[]>([]);
    const [similarProducts, setSimilarProducts] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(false);
    const [recentProducts, setRecentProducts] = useState<Produto[]>([]);
    const linkedColors = useMemo(
        () => (produto.cores ?? []).filter((color) => Number(color.id) !== Number(produto.id)),
        [produto.cores, produto.id],
    );
    const colorIdsKey = linkedColors.map((color) => color.id).join(",");

    useEffect(() => {
        let active = true;
        const recentItems = getRecentlyViewed(produto.id);

        if (recentItems.length === 0) {
            setRecentProducts([]);
            return;
        }

        const loadRecentProducts = async () => {
            const loadedProducts = await Promise.all(recentItems.slice(0, 5).map(async (item) => {
                try {
                    const response = await produtoService.listarProduto(String(item.id));
                    return response.data;
                } catch {
                    return previewToProduct(item);
                }
            }));

            if (active) {
                setRecentProducts(loadedProducts.filter((item): item is Produto => Boolean(item)));
            }
        };

        void loadRecentProducts();
        return () => {
            active = false;
        };
    }, [produto.id]);

    useEffect(() => {
        let active = true;

        const loadRecommendations = async () => {
            setLoading(true);
            try {
                const colorRequests = linkedColors.slice(0, 6).map(async (color) => {
                    try {
                        const response = await produtoService.listarProduto(String(color.id));
                        return response.data;
                    } catch {
                        return null;
                    }
                });

                const filterParams = new URLSearchParams({ por_pagina: "15", pagina: "1", order_by: "nome_asc" });
                if (produto.categoriaId) filterParams.set("categoria", String(produto.categoriaId));

                const [loadedColors, similarResponse] = await Promise.all([
                    Promise.all(colorRequests),
                    produtoService.listarProdutos(filterParams.toString()).catch(() => null),
                ]);

                if (!active) return;

                setColorProducts(loadedColors.filter((item): item is Produto => Boolean(item)));

                const excludedIds = new Set<number>([
                    Number(produto.id),
                    ...linkedColors.map((color) => Number(color.id)),
                ]);
                const products = similarResponse?.data?.produtos ?? [];
                setSimilarProducts(products.filter((item) => !excludedIds.has(Number(item.id))).slice(0, 5));
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadRecommendations();
        return () => {
            active = false;
        };
    }, [colorIdsKey, produto.categoriaId, produto.id]);

    const otherColorCards = linkedColors.map((color) => {
        const fullProduct = colorProducts.find((item) => Number(item.id) === Number(color.id));
        return productToPreview(fullProduct, color, produto.nome);
    });
    if (!loading && otherColorCards.length === 0 && similarProducts.length === 0 && recentProducts.length === 0) return null;

    return (
        <div>
            {otherColorCards.length > 0 && (
                <ProductShelf
                    title="Este modelo em outras cores"
                    subtitle="Mesma modelagem, outras opções cadastradas para o produto."
                    products={otherColorCards}
                    columns="three"
                />
            )}

            {similarProducts.length > 0 && (
                <RelatedProductShelf
                    title="Quem viu este, também levou"
                    subtitle="Produtos semelhantes da mesma categoria."
                    products={similarProducts}
                />
            )}

            {recentProducts.length > 0 && (
                <RelatedProductShelf
                    title="Vistos recentemente"
                    subtitle="Continue de onde parou neste dispositivo"
                    products={recentProducts}
                />
            )}

            {loading && otherColorCards.length === 0 && similarProducts.length === 0 && (
                <div className="mt-6 flex items-center justify-center border-t border-primary/10 pt-5 text-primary/45">
                    <Loader size="small" />
                    <span className="ml-2 text-xs uppercase tracking-[0.14em]">Carregando produtos relacionados</span>
                </div>
            )}
        </div>
    );
}

function RelatedProductShelf({ title, subtitle, products }: {
    title: string;
    subtitle: string;
    products: Produto[];
}) {
    return (
        <section className="mt-6 border-t border-primary/10 pt-5 sm:mt-7 sm:pt-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-[-0.025em]">{title}</h2>
                <p className="mt-1 text-sm text-primary/55">{subtitle}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 items-stretch gap-1.5 sm:gap-2 lg:grid-cols-5">
                {products.map((product) => <ProductCard key={product.id} produto={product} />)}
            </div>
        </section>
    );
}

function ProductShelf({ title, subtitle, products, columns }: {
    title: string;
    subtitle: string;
    products: ProductPreview[];
    columns: "three" | "four";
}) {
    return (
        <section className="mt-6 border-t border-primary/10 pt-5 sm:mt-7 sm:pt-6">
            <div>
                <h2 className="text-2xl font-semibold tracking-[-0.025em]">{title}</h2>
                <p className="mt-1 text-sm text-primary/55">{subtitle}</p>
            </div>
            <div className={`mt-4 grid gap-x-4 gap-y-5 sm:grid-cols-2 ${columns === "three" ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
                {products.map((product) => <ProductPreviewCard key={product.id} product={product} />)}
            </div>
        </section>
    );
}

function ProductPreviewCard({ product }: { product: ProductPreview }) {
    return (
        <Link to={`/produto/${product.id}/${gerarSlug(product.name)}`} className="group min-w-0">
            <div className="relative aspect-square overflow-hidden bg-product-bg">
                <OptimizedImage
                    src={product.image}
                    fallbackSrc={getProductImageFallback(product.name)}
                    alt={product.name}
                    className="h-full! w-full! object-contain! p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {product.tag && (
                    <span className="absolute left-3 top-3 bg-product-bg/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary shadow-sm">
                        {product.tag}
                    </span>
                )}
            </div>
            <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-primary">{product.name}</h3>
            {product.price != null && <p className="mt-0.5 text-sm text-primary/60">{currencyFormatter.format(product.price)}</p>}
        </Link>
    );
}

function previewToProduct(product: ProductPreview): Produto {
    const price = String(product.price ?? 0);

    return {
        sucesso: true,
        mensagem: undefined,
        id: product.id,
        nome: product.name,
        preco: price,
        precoAntigo: 0,
        valorDescontoPix: "0",
        percentualPix: "0",
        fotos: {
            p: [product.image],
            m: [product.image],
            g: [product.image],
            gg: [product.image],
        },
        imagens: [product.image],
        estoque: 1,
        avaliacao: 0,
        quantidadeAvaliacoes: 0,
        temFreteGratis: false,
        promocaoAtiva: product.tag ? "Sim" : "Nao",
        ehFavorito: "Nao",
        nomeCategoria: "Produto",
        nomeSubCategoria: "",
        links: { self: "" },
        menu: "",
        categoriaId: 0,
        descricaolonga1: "",
        descricaolonga2: "",
        descricao: "",
        peso: 0,
        quantidade: 0,
        descontoPorcentagem: 0,
        precoComDesconto: 0,
        ehPreEncomenda: false,
        dataPreEncomenda: 0,
        disponivel: true,
        tipo_de_estoque: "",
        limiteCompra: 0,
        tipo: 0,
        garantia: "",
        ehMarketplace: false,
        tagDescricao: "",
        produtoEmDestaque: false,
        parcelaMaxima: "",
        linkProduto: "",
        vendidoPor: "",
        dataLimitePromocao: "",
        horaLimitePromocao: "",
        tipoDeDesconto: "",
        tipoDaPromocao: 0,
        quantidadeLimiteDesconto: "",
        idPromocoesEcommerce: "",
        tipodeestoque: "",
        dataHoraLimitePromocao: "",
        quantidadeCompradoPromocao: "",
        habilitarAviso: "",
    };
}

function getProductImages(produto: Produto) {
    const candidates = [
        ...(produto.imagens ?? []),
        ...(produto.fotos?.g ?? []),
        ...(produto.fotos?.m ?? []),
        ...(produto.fotos?.gg ?? []),
    ].filter((image): image is string => typeof image === "string" && image.trim().length > 0);

    const uniqueImages = Array.from(new Set(candidates));
    return uniqueImages.length > 0 ? uniqueImages : [getProductImageFallback(produto.nome)];
}

function getPriceDetails(produto: Produto, tamanhoSelecionado?: ProdutoTamanho | null): PriceDetails {
    const basePrice = parseNumber(produto.preco);
    const gradeAddition = parseNumber(tamanhoSelecionado?.valorGrade);
    const pixDiscountValue = parseNumber(produto.valorDescontoPix);
    const pixPercentage = parseNumber(produto.percentualPix);
    const cardPrice = basePrice + gradeAddition;
    const pixPrice = Math.max(0, basePrice - pixDiscountValue + gradeAddition);
    const oldBasePrice = parseNumber(produto.precoAntigo);
    const oldPrice = oldBasePrice > 0 ? oldBasePrice + gradeAddition : null;
    const comparisonPrice = oldPrice && oldPrice > pixPrice ? oldPrice : cardPrice;
    const discount = comparisonPrice > pixPrice && comparisonPrice > 0
        ? Math.round(((comparisonPrice - pixPrice) / comparisonPrice) * 100)
        : Math.round(pixPercentage);

    return { basePrice, cardPrice, pixPrice, oldPrice, discount: Math.max(0, discount), pixPercentage };
}

function productToPreview(product?: Produto | null, fallbackColor?: ProdutoCor, fallbackName?: string): ProductPreview {
    if (product) {
        const image = getProductImages(product)[0] ?? getProductImageFallback(product.nome);
        return {
            id: product.id,
            name: product.nome,
            image,
            price: getPriceDetails(product).pixPrice,
            tag: product.promocaoAtiva === "Sim" ? "Oferta" : undefined,
        };
    }

    const colorName = fallbackColor?.nome || "Outra cor";
    return {
        id: Number(fallbackColor?.id ?? 0),
        name: `${fallbackName || "Produto"} · ${colorName}`,
        image: fallbackColor?.imagem || getProductImageFallback(fallbackName || "Produto"),
    };
}

function parseNumber(value: unknown) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value !== "string") return 0;

    const normalized = value
        .replace(/[^\d,.-]/g, "")
        .replace(/\.(?=\d{3}(?:\D|$))/g, "")
        .replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value: number) {
    return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function formatMeasurement(value: unknown, unit: string) {
    const number = parseNumber(value);
    return number > 0 ? `${formatNumber(number)} ${unit}` : "Não informado";
}

function formatDimensions(produto: Produto) {
    const values = [produto.comprimento, produto.largura, produto.altura].map(parseNumber);
    if (values.some((value) => value <= 0)) return "Não informado";
    return `${formatNumber(values[0])} × ${formatNumber(values[1])} × ${formatNumber(values[2])} cm`;
}

function getDisplaySize(value: unknown) {
    const rawSize = String(value ?? "").trim().replace(/\s+/g, " ");
    if (!rawSize) return "—";

    if (/^(?:PP|P|M|G|GG|XG|XGG|ÚNICO|UNICO)$/i.test(rawSize)) {
        return rawSize.toLocaleUpperCase("pt-BR");
    }

    if (/^\d{1,3}(?:\s*[/-]\s*\d{1,3})?$/.test(rawSize)) {
        return rawSize.replace(/\s+/g, "");
    }

    const leadingNumber = rawSize.match(/^\d{1,3}/)?.[0];
    return leadingNumber || rawSize;
}

function maskCep(value: string) {
    return value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
}

function getRequestErrorMessage(error: unknown, fallback: string) {
    const payload = error as {
        originalError?: string;
        message?: string;
        error?: string | { error?: string; message?: string; mensagem?: string; data?: { detalhes?: string } };
    };

    if (typeof payload?.originalError === "string" && payload.originalError.trim()) return payload.originalError;
    if (typeof payload?.error === "string" && payload.error.trim()) return payload.error;
    if (typeof payload?.error === "object") {
        return payload.error.data?.detalhes || payload.error.error || payload.error.message || payload.error.mensagem || fallback;
    }
    if (typeof payload?.message === "string" && payload.message.trim()) return payload.message;
    return fallback;
}
