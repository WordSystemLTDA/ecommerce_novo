/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaBoxes, FaRegUserCircle, FaTag } from 'react-icons/fa';
import { useCarrinho } from './context/CarrinhoContext';
import { useAuth } from '../auth/context/AuthContext';


// --- PÁGINA DA ETAPA 5 ---
export default function ConfirmationPage() {
  let { cliente } = useAuth();
  let { produtos } = useCarrinho();

  const currencyFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 3,
  });

  if (cliente == undefined) {
    return (
      <div>
        <p>Você precisa estar logado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dados Pessoais */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
          <FaRegUserCircle /> DADOS PESSOAIS
        </h2>
        <p className="text-xs text-gray-500 mb-4">Informações que serão inseridas na nota fiscal do pedido.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-bold">Nome:</span> {cliente.nome}</p>
            <p><span className="font-bold">RG:</span></p>
            <p><span className="font-bold">Celular:</span> 4499198369</p>
            <p><span className="font-bold">CEP:</span> 86770000</p>
          </div>
          <div>
            <p><span className="font-bold">CPF/CNPJ:</span> 07795533905</p>
            <p><span className="font-bold">Telefone:</span></p>
            <p><span className="font-bold">E-mail:</span> {cliente.email}</p>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
          <FaBoxes /> LISTA DE PRODUTOS
        </h2>
        <p className="text-xs text-gray-500 mb-4">Vendido e entregue por: <span className="font-bold">Word System!</span></p>

        {/* Item 1 */}
        {produtos.map((produto) => {
          return (
            <div className="flex gap-4 border-b pb-4 mb-4">
              <img src={produto.atributos.fotos.m[0]} alt={produto.atributos.nome} className="w-16 h-16 object-contain rounded" />
              <div className="grow">
                <p className="text-sm text-gray-700">{produto.atributos.nome}</p>
                <p className="text-xs text-gray-500">Com desconto no PIX: R$ 8.239,90</p>
                <p className="text-xs text-gray-500">Parcelado no cartão sem juros: R$ 9.222,11</p>
                <span className="flex items-center gap-1 text-xs text-orange-500 mt-1"><FaTag size={12} /> OFERTA NINJA</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Quant: {produto.atributos.quantidade}</p>
                <p className="text-sm text-gray-500">Preço à vista no PIX:</p>
                <p className="text-lg font-bold text-orange-500">{currencyFormatter.format(produto.atributos.preco)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}