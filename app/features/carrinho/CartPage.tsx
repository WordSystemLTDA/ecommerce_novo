/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  FaExclamationCircle,
  FaMinus,
  FaPlus,
  FaShieldAlt,
  FaTag,
  FaTrash
} from 'react-icons/fa';

import { IoIosArrowDown } from "react-icons/io";
import { useCarrinho } from '~/features/carrinho/context/CarrinhoContext';
import type { Produto } from '../produto/types';
import { currencyFormatter } from '~/utils/formatters';


// --- COMPONENTE: Mensagem de Tempo ---
const TimerMessage = () => (
  <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-md flex items-center gap-3">
    <span className="shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">!</span>
    <p className="text-sm">
      <span className="font-bold">Não deixe seus itens acabarem 02h 58m 31s.</span>
      <span className="text-blue-700"> Corra! Itens podem esgotar. Finalize a compra e garanta agora</span>
    </p>
  </div>
);

// --- COMPONENTE: Seletor de Quantidade ---
const QuantityInput = ({ quantity, onDecrease, onIncrease }: { quantity: number, onDecrease: () => void, onIncrease: () => void }) => (
  <div className="flex items-center border border-gray-300 rounded overflow-hidden h-8">
    <button onClick={onDecrease} className="px-2 text-gray-500 hover:bg-gray-100 h-full"><FaMinus size={10} /></button>
    <span className="px-4 text-sm font-medium">{quantity}</span>
    <button onClick={onIncrease} className="px-2 text-primary hover:bg-gray-100 h-full"><FaPlus size={10} /></button>
  </div>
);

// --- COMPONENTE: Item do Carrinho (Produto + Serviços) ---
const CartItem = ({ produto }: { produto: Produto }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="shrink-0"><img src={produto.atributos.fotos.m[0]} alt={produto.atributos.nome} className="w-24 h-24 object-contain rounded" /></div>
        <div className="grow">
          <h3 className="text-sm text-gray-800 font-medium mb-1">{produto.atributos.nome}</h3>
          <p className="text-xs text-gray-500">Vendido e entregue por: {produto.atributos.vendidoPor}</p>
          {/* <p className="text-xs text-gray-500">Com desconto no PIX: <span className="text-gray-700">{currencyFormatter.format(produto.atributos.precoComDesconto)}</span></p> */}
          {produto.atributos.tamanhoSelecionado != null && <p className="text-xs text-gray-500">Tamanho: <span className="text-gray-700">{produto.atributos.tamanhoSelecionado?.tamanho}</span></p>}
          {/* <div className="flex gap-2 mt-2"><span className="flex items-center gap-1 text-xs text-primary"><FaTag size={12} /> OFERTA NINJA</span></div> */}
        </div>
        <div className="flex md:flex-col items-end md:items-end justify-between md:justify-start gap-2">
          <QuantityInput
            quantity={quantity}
            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
            onIncrease={() => setQuantity(q => q + 1)}
          />
          <div className="text-right">
            <span className="text-xs text-gray-500">Preço à vista no PIX:</span>
            <p className="text-lg font-bold text-primary">{currencyFormatter.format(produto.atributos.preco)}</p>
          </div>
        </div>
      </div>
      {/* <ServicesAccordion services={product.services} subtotal={product.subtotalServices} /> */}
    </div>
  );
};

// --- PÁGINA DA ETAPA 1 ---
export default function CartPage() {
  let { produtos, removerTodosProdutos } = useCarrinho();

  return (
    <div className="space-y-6">
      <TimerMessage />
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800 uppercase">PRODUTO E SERVIÇO</h2>
          <button
            className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 font-medium"
            onClick={() => {
              removerTodosProdutos();
            }}
          >
            <FaTrash /> REMOVER TODOS OS PRODUTOS
          </button>
        </div>
        {produtos.map(produto => (
          <CartItem key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}