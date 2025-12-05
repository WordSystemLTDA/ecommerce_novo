/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaBoxes, FaRegUserCircle } from 'react-icons/fa';
import { useCarrinho } from './context/CarrinhoContext';
import { useAuth } from '../auth/context/AuthContext';
import { currencyFormatter } from '~/utils/formatters';


export default function ConfirmationPage() {
  let { cliente } = useAuth();
  let { produtos, enderecoSelecionado } = useCarrinho();

  if (cliente == undefined) {
    return (
      <div>
        <p>Você precisa estar logado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
          <FaRegUserCircle /> DADOS PESSOAIS
        </h2>
        <p className="text-xs text-gray-500 mb-4">Informações que serão inseridas na nota fiscal do pedido.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-bold">Nome:</span> {cliente.nome}</p>
            <p><span className="font-bold">Celular:</span> {cliente.celular}</p>
            <p><span className="font-bold">CEP:</span> {enderecoSelecionado?.cep}</p>
          </div>
          <div>
            <p><span className="font-bold">CPF/CNPJ:</span> {cliente.doc}</p>
            <p><span className="font-bold">E-mail:</span> {cliente.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
          <FaBoxes /> LISTA DE PRODUTOS
        </h2>
        <p className="text-xs text-gray-500 mb-4">Vendido e entregue por: <span className="font-bold">Word System!</span></p>

        {produtos.map((produto) => {
          return (
            <div className="flex gap-4 border-b pb-4 mb-4">
              <img src={produto.fotos.m[0]} alt={produto.nome} className="w-16 h-16 object-contain rounded" />
              <div className="grow">
                <p className="text-sm text-gray-700">{produto.nome}</p>
                {produto.tamanhoSelecionado != null && <p className="text-xs text-gray-500">Tamanho: {produto.tamanhoSelecionado?.tamanho}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Quant: {produto.quantidade}</p>
                <p className="text-sm text-gray-500">Preço à vista no PIX:</p>
                <p className="text-lg font-bold text-primary">{currencyFormatter.format(parseFloat(produto.preco))}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}