import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "~/components/button";
import Loader from "~/components/loader";
import { useAuth } from "~/features/auth/context/AuthContext";
import { favoritoService } from "~/features/favoritos/services/favoritoService";
import type { Produto } from "~/features/produto/types";
import { Heart } from "lucide-react";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import { useCarrinho } from "~/features/carrinho/context/CarrinhoContext";
import { BsCartPlus } from "react-icons/bs";

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
        <div className="bg-white p-4 border-b border-gray-200 last:border-0">
            <div className="flex gap-3">
                {/* Imagem */}
                <div className="shrink-0 cursor-pointer" onClick={() => navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`)}>
                    <img
                        src={produto.fotos.m[0]}
                        alt={produto.nome}
                        className="w-20 h-20 object-contain rounded bg-gray-50 mix-blend-multiply"
                    />
                </div>

                {/* Informações */}
                <div className="grow flex flex-col justify-between min-h-20">
                    {/* Topo: Título e Lixeira */}
                    <div className="flex justify-between items-start gap-2">
                        <Link to={`/produto/${produto.id}/${gerarSlug(produto.nome)}`}>
                            <h3 className="text-sm text-gray-900 font-normal leading-tight line-clamp-2 hover:text-primary transition-colors">
                                {produto.nome}
                            </h3>
                        </Link>
                        <button
                            className="text-red-500 p-1 hover:bg-red-50 rounded transition-colors"
                            onClick={() => onRemove(produto.id)}
                            title="Remover dos favoritos"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>

                    {/* Rodapé: Preço e Botão Adicionar */}
                    <div className="flex justify-between items-end mt-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-primary font-semibold">
                                {currencyFormatter.format(parseFloat(produto.preco))}
                            </span>
                        </div>

                        <button
                            onClick={handleAdicionarCarrinho}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${estaNoCarrinho
                                ? "text-green-600 hover:text-green-700"
                                : "text-primary hover:text-secondary"
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
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Heart className="text-primary" /> Meus Favoritos
            </h1>

            {produtos.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
                    <Heart size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">Você ainda não tem produtos favoritos.</p>
                    <Link to="/">
                        <Button variant="primary">Explorar Produtos</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
