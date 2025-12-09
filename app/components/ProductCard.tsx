import { useNavigate } from "react-router";
import { MdFavoriteBorder, MdOutlineAddShoppingCart, MdShoppingCartCheckout } from "react-icons/md";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { useCarrinho } from "~/features/carrinho/context/CarrinhoContext";
import RatingStars from "~/components/rating_stars";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import type { Produto } from "~/features/produto/types";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { BsCartPlus } from "react-icons/bs";

interface ProductCardProps {
    produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
    let navigate = useNavigate();
    const { adicionarNovoProduto, verificarAdicionadoCarrinho } = useCarrinho();
    const estaNoCarrinho = verificarAdicionadoCarrinho(produto);

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

    return (
        <div
            className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow group"
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
                        {produto.precoAntigo && (
                            <span className="text-xs text-gray-500 line-through">
                                {currencyFormatter.format(produto.precoAntigo)}
                            </span>
                        )}
                        {produto.estoque <= 100 && (
                            <span className="text-tiny text-gray-600">
                                Restam {produto.estoque} unid.
                            </span>
                        )}
                    </div>

                    <div className="flex items-baseline gap-2 mb-0">
                        <span className="text-base font-medium text-primary">
                            {currencyFormatter.format(parseFloat(produto.preco))}
                        </span>
                        {produto.precoAntigo && (
                            <span className="text-xs font-bold text-terciary bg-green-100 px-1 py-0.5 rounded">
                                {Math.round(((produto.precoAntigo - parseFloat(produto.preco)) / produto.precoAntigo) * 100)}% OFF
                            </span>
                        )}
                    </div>

                    {/* <span className="text-medium-tiny text-gray-600 block"> */}
                    <span className="text-medium-tiny text-pix block">
                        À vista no PIX
                    </span>
                    {produto.parcelaMaxima && (
                        <span className="text-xs text-gray-600 mt-1 block">
                            ou até <span className="font-bold">{produto.parcelaMaxima}</span>
                        </span>
                    )}
                </div>

                <div className="flex gap-0.5">
                    <button className="mt-2 w-10 bg-primary text-white font-bold text-xs py-2 rounded-sm flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer z-11" onClick={handleAdicionarCarrinho}>
                        <BsCartPlus size={18} aria-hidden />
                    </button>

                    <button className="mt-2 w-full bg-primary text-white font-bold text-xs py-2 rounded-sm flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer z-11" onClick={handleComprar}>
                        <span className="flex items-center">
                            {/* <span className="inline-block w-0 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:w-5 group-hover:mr-2 transition-all">
                                <FaShoppingCart size={18} aria-hidden />
                            </span> */}
                            COMPRAR
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
