import { Heart, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Button from "~/components/button";
import Loader from "~/components/loader";
import { ProductCard } from "~/components/ProductCard";
import { useAuth } from "~/features/auth/context/AuthContext";
import { favoritoService } from "~/features/favoritos/services/favoritoService";
import type { Produto } from "~/features/produto/types";

export default function MinhaContaFavoritosPage() {
    const { cliente } = useAuth();
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

    const handleFavoriteChange = (produto: Produto, isFavorite: boolean) => {
        if (isFavorite) {
            return;
        }

        setProdutos(prev => prev.filter(item => item.id !== produto.id));
        setTotal(prev => Math.max(0, prev - 1));
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
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
                    {produtos.map((produto) => (
                        <ProductCard
                            key={produto.id}
                            produto={{ ...produto, ehFavorito: "Sim" }}
                            onFavoriteChange={handleFavoriteChange}
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
