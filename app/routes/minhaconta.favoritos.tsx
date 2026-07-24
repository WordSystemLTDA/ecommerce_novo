import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "~/components/button";
import Loader from "~/components/loader";
import { OptimizedImage } from "~/components/OptimizedImage";
import { useAuth } from "~/features/auth/context/AuthContext";
import { useCarrinho } from "~/features/carrinho/context/CarrinhoContext";
import { favoritoService } from "~/features/favoritos/services/favoritoService";
import type { Produto } from "~/features/produto/types";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import { getProductImageFallback } from "~/utils/imagePlaceholders";

import { useFavorito } from "~/features/favoritos/context/FavoritoContext";

const FavoriteItem = ({ produto, onRemove }: { produto: Produto, onRemove: (id: number) => void }) => {
    let navigate = useNavigate();
    const { adicionarNovoProduto, verificarAdicionadoCarrinho } = useCarrinho();
    const estaNoCarrinho = verificarAdicionadoCarrinho(produto);

    const handleAdicionarCarrinho = () => {
        if (estaNoCarrinho) {
            navigate('/carrinho');
            return;
        }

        if ((produto.tamanhos?.length ?? 0) > 0) {
            navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
        } else {
            adicionarNovoProduto(produto);
        }
    };

    return (
        <div className="border-b border-gray-200 bg-white p-3 transition-colors last:border-0 hover:bg-gray-50 sm:p-4">
            <div className="flex min-w-0 gap-2 sm:gap-3">
                <div className="shrink-0 cursor-pointer" onClick={() => navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`)}>
                    <OptimizedImage
                        src={produto.fotos?.m?.[0]}
                        fallbackSrc={getProductImageFallback(produto.nome)}
                        alt={produto.nome}
                        className="h-16 w-16 rounded bg-gray-50 object-contain mix-blend-multiply sm:h-20 sm:w-20"
                    />
                </div>

                <div className="flex min-h-20 min-w-0 grow flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                        <Link to={`/produto/${produto.id}/${gerarSlug(produto.nome)}`}>
                            <h3 className="text-sm text-gray-900 font-medium leading-tight line-clamp-2 hover:text-primary transition-colors">
                                {produto.nome}
                            </h3>
                        </Link>
                        <button
                            type="button"
                            className="text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
                            onClick={() => onRemove(produto.id)}
                            title="Remover dos favoritos"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 mt-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-primary font-semibold">
                                {currencyFormatter.format(parseProductPrice(produto.preco))}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleAdicionarCarrinho}
                            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition-colors ${estaNoCarrinho
                                ? "bg-(--dynamic-success-bg) text-(--dynamic-success) hover:bg-(--dynamic-success)"
                                : "bg-primary text-white hover:bg-terciary"
                                }`}
                        >
                            <BsCartPlus size={18} />
                            <span className="hidden sm:inline">
                                {estaNoCarrinho ? "Ver no Carrinho" : "Adicionar ao Carrinho"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function parseProductPrice(preco: string | number) {
    if (typeof preco === "number") {
        return preco;
    }

    const normalizedPrice = preco
        .replace(/[^\d,.]/g, "")
        .replace(/\.(?=\d{3}(?:\D|$))/g, "")
        .replace(",", ".");
    const parsedPrice = Number(normalizedPrice);

    return Number.isFinite(parsedPrice) ? parsedPrice : 0;
}

export default function MinhaContaFavoritosPage() {
    const { cliente } = useAuth();
    const { atualizarQuantidade } = useFavorito();
    const [loading, setLoading] = useState(true);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const carregarFavoritos = async () => {
        if (!cliente?.id) return;

        setLoading(true);
        try {
            const data = await favoritoService.listar(cliente.id, page);
            // Ensure data.produtos is an array
            const lista = Array.isArray(data.produtos) ? data.produtos : [];
            setProdutos(lista);
            setTotal(data.total);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar favoritos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarFavoritos();
    }, [cliente, page]);

    const handleRemover = async (idProduto: number) => {
        if (!cliente?.id) return;

        try {
            await favoritoService.remover(cliente.id, idProduto);
            // Optimistic update for smoother UI
            setProdutos(prev => prev.filter(p => p.id !== idProduto));
            setTotal(prev => prev - 1);
            atualizarQuantidade(); // Update global count
            // toast.success("Produto removido.");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao remover dos favoritos.");
            carregarFavoritos(); // Revert on error
            atualizarQuantidade(); // Revert count
        }
    };

    if (loading && page === 1) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 border-b border-primary/10 pb-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-primary md:text-2xl">
                        Meus favoritos
                    </h1>
                    <p className="mt-1 text-sm text-primary/55">
                        {total > 0
                            ? `${total} produto${total === 1 ? "" : "s"} salvo${total === 1 ? "" : "s"}.`
                            : "Nenhum produto salvo."}
                    </p>
                </div>
            </div>

            {produtos.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center bg-main-bg rounded-lg border border-dashed border-primary/20">
                    <Heart size={48} className="text-primary/30 mb-4" />
                    <h3 className="text-lg font-semibold text-primary">
                        Nenhum favorito ainda
                    </h3>
                    <Link to="/" className="mt-5">
                        <Button variant="primary">
                            <ShoppingBag size={16} />
                            Ver produtos
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-primary/10 overflow-hidden">
                    {produtos.map((produto) => (
                        <FavoriteItem
                            key={produto.id}
                            produto={produto}
                            onRemove={handleRemover}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {total > 10 && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        variant="grayOutline"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="w-auto px-4"
                    >
                        Anterior
                    </Button>
                    <span className="flex items-center px-4 font-semibold text-gray-700">
                        Página {page}
                    </span>
                    <Button
                        variant="grayOutline"
                        disabled={page * 10 >= total}
                        onClick={() => setPage(p => p + 1)}
                        className="w-auto px-4"
                    >
                        Próxima
                    </Button>
                </div>
            )}
        </div>
    );
}
