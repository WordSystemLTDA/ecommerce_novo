/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  FaMinus,
  FaPlus,
  FaTrash
} from 'react-icons/fa';

import { useCarrinho } from '~/features/carrinho/context/CarrinhoContext';
import type { Produto } from '../produto/types';
import { currencyFormatter } from '~/utils/formatters';


// const TimerMessage = () => (
//   <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-md flex items-center gap-3">
//     <span className="shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">!</span>
//     <p className="text-sm">
//       <span className="font-bold">Não deixe seus itens acabarem 02h 58m 31s.</span>
//       <span className="text-blue-700"> Corra! Itens podem esgotar. Finalize a compra e garanta agora</span>
//     </p>
//   </div>
// );

const QuantityInput = ({ quantity, onDecrease, onIncrease }: { quantity: number, onDecrease: () => void, onIncrease: () => void }) => (
  <div className="flex items-center border border-gray-300 rounded overflow-hidden h-8">
    <button onClick={onDecrease} className="px-2 text-gray-500 hover:bg-gray-100 h-full"><FaMinus size={10} /></button>
    <span className="px-4 text-sm font-medium">{quantity}</span>
    <button onClick={onIncrease} className="px-2 text-primary hover:bg-gray-100 h-full"><FaPlus size={10} /></button>
  </div>
);

const CartItem = ({ produto }: { produto: Produto }) => {
  const [quantity, setQuantity] = useState(1);
  let { removerProduto } = useCarrinho();

  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex gap-3">

        {/* Checkbox */}
        <div className="shrink-0 flex items-start pt-1">
          <input
            type="checkbox"
            defaultChecked
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Imagem */}
        <div className="shrink-0">
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
            <h3 className="text-sm text-gray-900 font-normal leading-tight line-clamp-2">
              {produto.nome}
            </h3>
            <button className="text-gray-400 hover:text-red-500 p-1" onClick={() => removerProduto(produto)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>

          {/* Atributos (Cor/Tamanho) */}
          <div className="mt-1">
            {produto.tamanhoSelecionado != null && (
              <p className="text-xs text-gray-500">
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
                onChange={setQuantity}
              />
            </div>

            <div className="text-right">
              <span className="text-xl font-normal text-gray-900">
                {currencyFormatter.format(parseFloat(produto.preco))}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

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
        {[1, 2, 3, 4, 5, 6].map((num) => (
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
  let { produtos, removerTodosProdutos } = useCarrinho();

  return (
    <div className="space-y-6">
      {/* <TimerMessage /> */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Produtos</h2>
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