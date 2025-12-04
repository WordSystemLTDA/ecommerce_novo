import { useNavigate } from "react-router";
import { MdFavoriteBorder, MdOutlineAddShoppingCart } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import RatingStars from "~/components/rating_stars";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import type { Produto } from "~/features/produto/types";

interface ProductCardProps {
    produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
    let navigate = useNavigate();

    return (
        <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => {
            navigate(`/produto/${produto.id}/${gerarSlug(produto.nome)}`);
        }}>
            <div className="relative">
                <div className="absolute top-2 right-2 group-hover:opacity-0 opacity-100 transition-opacity p-1">
                    {produto.avaliacao !== undefined && (
                        <div className="flex items-center gap-0.5">
                            <RatingStars rating={produto.avaliacao} variant="tiny" />
                            <span className="text-tiny text-gray-400">({produto.avaliacao.toFixed(0)})</span>
                        </div>
                    )}
                </div>

                <div className="flex absolute top-2 right-2 group-hover:opacity-100 opacity-0 transition-opacity gap-2 p-1 z-10 cursor-auto">
                    <MdFavoriteBorder size={20} color="gray" className="cursor-pointer" />
                    <MdOutlineAddShoppingCart size={20} color="gray" className="cursor-pointer" />
                </div>


                <img src={produto.fotos.m[0]} alt={produto.nome} className="w-full h-48 object-contain p-4" loading="lazy" />
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="flex-1">
                    <h3 className="text-sm text-gray-600 font-bold mb-2 h-10 overflow-hidden text-ellipsis">
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

                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-bold text-primary">
                            {currencyFormatter.format(parseFloat(produto.preco))}
                        </span>
                        {produto.precoAntigo && (
                            <span className="text-xs font-bold text-terciary bg-green-100 px-1 py-0.5 rounded">
                                {Math.round(((produto.precoAntigo - parseFloat(produto.preco)) / produto.precoAntigo) * 100)}% OFF
                            </span>
                        )}
                    </div>

                    <span className="text-xs text-gray-600 block">
                        À vista no PIX
                    </span>
                    {produto.parcelaMaxima && (
                        <span className="text-xs text-gray-600 mt-1 block">
                            ou até <span className="font-bold">{produto.parcelaMaxima}</span>
                        </span>
                    )}
                </div>
                <button className="mt-4 w-full bg-primary text-white font-bold text-xs py-2 rounded-sm flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer z-11">
                    <span className="flex items-center">
                        <span className="inline-block w-0 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:w-5 group-hover:mr-2 transition-all">
                            <FaShoppingCart size={18} aria-hidden />
                        </span>
                        COMPRAR
                    </span>
                </button>
            </div>
        </div>
    );
}
