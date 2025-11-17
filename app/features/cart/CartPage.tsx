/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  FaInfoCircle,
  FaTrash,
  FaPlus,
  FaMinus,
  FaShieldAlt,
  FaExclamationCircle,
  FaTag
} from 'react-icons/fa';

import { IoIosArrowDown } from "react-icons/io";

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const mockProducts = [
  {
    id: 1,
    vendor: 'KaBuM!',
    image: 'https://img.ibxk.com.br/2023/09/13/13101859188151.jpg?imgo=REDIM_CONTENT&size=500x281',
    title: 'iPhone 16 Plus Apple 512GB, Câmera Dupla de 48MP, Tela 6,7", Preto',
    price: 8299.90,
    discountPrice: 8239.90,
    installments: 'cartão sem juros R$ 9.222,11',
    services: [
      { id: 's1-none', name: 'Sem garantia', price: 0 },
      { id: 's1-12m', name: '12 Meses de Garantia Estendida Kabum', price: 175.13, perMonth: 10 },
    ],
    subtotalServices: 1751.34,
  },
  {
    id: 2,
    vendor: 'KaBuM!',
    image: 'https://images.kabum.com.br/produtos/fotos/114385/cadeira-gamer-husky-gaming-tempest-700-preto-hct-700_1594994640_m.jpg',
    title: 'Cadeira Gamer Husky Tempest 700, Até 145kg, Almofadas, Reclinável 150°, Tecido, Descanso para Pés, Cinza - HCT-070C2T',
    price: 779.90,
    discountPrice: 779.90,
    installments: 'cartão sem juros R$ 866.56',
    services: [
      { id: 's2-none', name: 'Sem garantia', price: 0 },
      { id: 's2-12m', name: '12 Meses de Garantia Estendida Kabum', price: 25.62, perMonth: 10 },
      { id: 's2-24m', name: '24 Meses de Garantia Estendida Kabum', price: 48.85, perMonth: 10 },
    ],
    subtotalServices: 0,
  },
];

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
    <button onClick={onIncrease} className="px-2 text-orange-500 hover:bg-gray-100 h-full"><FaPlus size={10} /></button>
  </div>
);

// --- COMPONENTE: Acordeão de Serviços ---
const ServicesAccordion = ({ services, subtotal }: { services: any[], subtotal: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedService, setSelectedService] = useState(services[0].id);

  return (
    <div className="bg-gray-50 rounded-md border border-gray-200 mt-4">
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full p-4">
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-gray-600" size={16} />
          <span className="font-bold text-sm text-gray-800">SERVIÇOS</span>
        </div>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <IoIosArrowDown />
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="font-bold text-xs uppercase text-gray-700 mb-3">GARANTIA ESTENDIDA ORIGINAL AMPLIADA</p>
          <div className="space-y-3">
            {services.map((service, index) => (
              <label key={service.id} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`service-${services[0].id}`}
                    value={service.id}
                    checked={selectedService === service.id}
                    onChange={() => setSelectedService(service.id)}
                    className="accent-orange-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{service.name}</span>
                  {index > 0 && <FaExclamationCircle className="text-orange-500" />}
                </div>
                {service.price > 0 && (
                  <span className="text-sm text-gray-700">Até {service.perMonth}x sem juros de R$ {service.price.toFixed(2).replace('.', ',')}</span>
                )}
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Ao adicionar a <span className="font-bold">Garantia Estendida Original Ampliada</span>, declaro que li e aceito as <a href="#" className="text-orange-500">Condições gerais</a>.</p>
          <div className="flex justify-end items-center mt-4">
            <span className="text-xs text-gray-500 mr-2">Subtotal serviços:</span>
            <span className="text-sm font-bold text-gray-800">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE: Item do Carrinho (Produto + Serviços) ---
const CartItem = ({ product }: { product: any }) => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="shrink-0"><img src={product.image} alt={product.title} className="w-24 h-24 object-contain rounded" /></div>
        <div className="grow">
          <h3 className="text-sm text-gray-800 font-medium mb-1">{product.title}</h3>
          <p className="text-xs text-gray-500">Vendido e entregue por: {product.vendor}</p>
          <p className="text-xs text-gray-500">Com desconto no PIX: <span className="text-gray-700">R$ {product.discountPrice.toFixed(2).replace('.', ',')}</span></p>
          <p className="text-xs text-gray-500">Parcelado no cartão sem juros: <span className="text-gray-700">R$ {product.installments}</span></p>
          <div className="flex gap-2 mt-2"><span className="flex items-center gap-1 text-xs text-orange-500"><FaTag size={12} /> OFERTA NINJA</span></div>
        </div>
        <div className="flex md:flex-col items-end md:items-end justify-between md:justify-start gap-2">
          <QuantityInput
            quantity={quantity}
            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
            onIncrease={() => setQuantity(q => q + 1)}
          />
          <div className="text-right">
            <span className="text-xs text-gray-500">Preço à vista no PIX:</span>
            <p className="text-lg font-bold text-orange-500">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      </div>
      <ServicesAccordion services={product.services} subtotal={product.subtotalServices} />
    </div>
  );
};

// --- PÁGINA DA ETAPA 1 ---
export default function CartPage() {
  return (
    <div className="space-y-6">
      <TimerMessage />
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800 uppercase">PRODUTO E SERVIÇO</h2>
          <button className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 font-medium">
            <FaTrash /> REMOVER TODOS OS PRODUTOS
          </button>
        </div>
        {mockProducts.map(product => (
          <CartItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}