import { useEffect, useState } from 'react';
import {
  FaCheckSquare,
  FaShoppingBag,
  FaTrash,
} from 'react-icons/fa';
import { Link } from 'react-router';

import { OptimizedImage } from '~/components/OptimizedImage';
import { useCarrinho } from '~/features/carrinho/context/CarrinhoContext';
import { currencyFormatter } from '~/utils/formatters';
import { getProductImageFallback } from '~/utils/imagePlaceholders';
import type { CartItem as CartItemType } from './context/CarrinhoContext';


const CartItem = ({ produto }: { produto: CartItemType }) => {
  const [quantity, setQuantity] = useState(produto.quantidade); // Initialize with product quantity
  let { removerProduto, editarQuantidadeProduto, toggleProdutoSelecao, verificarProdutoSelecionado } = useCarrinho(); // Get editarQuantidadeProduto

  useEffect(() => {
    setQuantity(produto.quantidade);
  }, [produto.quantidade]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    editarQuantidadeProduto({ ...produto, quantidade: newQuantity });
  }

  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex gap-3">

        {/* Checkbox */}
        <div className="shrink-0 flex items-start pt-1">
          <input
            type="checkbox"
            checked={verificarProdutoSelecionado(produto.internalId)}
            onChange={() => toggleProdutoSelecao(produto.internalId)}
            className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Imagem */}
        <div className="shrink-0">
          <OptimizedImage
            src={produto.fotos?.m?.[0]}
            fallbackSrc={getProductImageFallback(produto.nome)}
            alt={produto.nome}
            className="w-20 h-20 object-contain rounded bg-gray-50 mix-blend-multiply"
          />
        </div>

        {/* Informações */}
        <div className="grow flex flex-col justify-between min-h-20">

          {/* Topo: Título e Lixeira */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-xs text-gray-900 font-normal leading-tight line-clamp-2">
              {produto.nome}
            </h3>
            <button className="text-red-500 p-1" onClick={() => removerProduto(produto)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>

          {/* Atributos (Cor/Tamanho) */}
          <div className="mt-1">
            {produto.tamanhoSelecionado != null && (
              <p className="text-tiny text-gray-500">
                Tamanho: <span className="text-gray-700 font-medium">{produto.tamanhoSelecionado?.tamanho}</span>
              </p>
            )}
          </div>

          {/* Rodapé: Seletor Novo e Preço */}
          <div className="flex justify-between items-end mt-3">

            {/* Novo Seletor de Quantidade estilo Print */}
            <div>
              <QuantitySelector
                quantity={quantity}
                onChange={handleQuantityChange}
              />
            </div>

            <div className="text-right">
              <span className="text-sm text-primary font-semibold">
                {currencyFormatter.format(parseCartPrice(produto.preco))}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

function parseCartPrice(preco: string | number) {
  if (typeof preco === 'number') {
    return preco;
  }

  const normalizedPrice = preco
    .replace(/[^\d,.]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.');
  const parsedPrice = Number(normalizedPrice);

  return Number.isFinite(parsedPrice) ? parsedPrice : 0;
}

interface QuantitySelectorProps {
  quantity: number;
  onChange?: (value: number) => void;
}

const QuantitySelector = ({ quantity, onChange }: QuantitySelectorProps) => {
  return (
    <div className="relative inline-block">
      {/* Elemento Select Nativo (Invisível) para manter funcionalidade simples */}
      <select
        value={quantity}
        onChange={(e) => onChange && onChange(parseInt(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <option key={num} value={num}>
            {num} un.
          </option>
        ))}
      </select>

      {/* O Visual do Botão (Idêntico ao Print) */}
      <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg py-1.5 px-3 shadow-sm min-w-20">
        <span className="text-sm font-medium text-gray-900">
          {quantity} un.
        </span>

        {/* Ícone de Seta para Baixo (Chevron) na cor Azul */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-3.5 h-3.5 text-blue-500"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
};

export default function CartPage() {
  let {
    produtos,
    removerTodosProdutos,
    selecionarTodos,
    deselecionarTodos,
    selectedItems,
  } = useCarrinho();

  const allSelected = produtos.length > 0 && selectedItems.length === produtos.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 p-4 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Produtos</h2>
            <p className="text-xs text-gray-500">
              {selectedItems.length} de {produtos.length} selecionado{produtos.length === 1 ? '' : 's'}
            </p>
          </div>

          {produtos.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 text-xs font-bold text-primary hover:text-terciary"
                onClick={() => {
                  allSelected ? deselecionarTodos() : selecionarTodos();
                }}
              >
                <FaCheckSquare />
                {allSelected ? 'DESMARCAR TODOS' : 'SELECIONAR TODOS'}
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 font-medium"
                onClick={() => {
                  removerTodosProdutos();
                }}
              >
                <FaTrash /> REMOVER TODOS
              </button>
            </div>
          )}
        </div>

        {produtos.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/8 text-primary">
              <FaShoppingBag />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-800">
              Seu carrinho está vazio
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Adicione produtos para iniciar uma compra.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-terciary"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          produtos.map(produto => (
            <CartItem key={produto.internalId} produto={produto} />
          ))
        )}
      </div>
    </div>
  );
}
