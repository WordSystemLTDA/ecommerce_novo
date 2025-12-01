import React, { useEffect } from 'react';
import { useProduto } from '../produto/context/ProdutoContext';
import { useCarrinho } from './context/CarrinhoContext';
import { calcularDataChegada } from '~/utils/formatters';
import Loader from '~/components/loader';

// --- PÁGINA DA ETAPA 3 ---
export default function DeliveryPage() {

  let { listarTransportadoras, transportadoras, setTransportadoraSelecionada, transportadoraSelecionada, enderecoSelecionado, carregandoTransportadoras } = useCarrinho();

  useEffect(() => {
    if (enderecoSelecionado != null) {
      listarTransportadoras(enderecoSelecionado?.cep);
    }
  }, []);

  const currencyFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 3,
  });

  if (transportadoras == undefined) {
    return (
      <div>
        <p>não tem transportes</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">

      {carregandoTransportadoras ? (
        <div className="flex items-center justify-center w-full">
          <Loader />
        </div>
      )
        :
        (
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Endereço selecionado: {enderecoSelecionado && (
                <>
                  <span className="font-bold">
                    {/* 1. Endereço e Número: Juntos e separados por vírgula SÓ SE ambos existirem */}
                    {enderecoSelecionado.endereco && <span>{enderecoSelecionado.endereco}</span>}
                    {enderecoSelecionado.endereco && enderecoSelecionado.numero && <span>, </span>}
                    {enderecoSelecionado.numero && <span>{enderecoSelecionado.numero}</span>}
                  </span>

                  {/* Adiciona o hífen de separação SOMENTE se houver algo antes dele (ou seja, se endereco.endereco ou endereco.numero existir) */}
                  {(enderecoSelecionado.endereco || enderecoSelecionado.numero) && ' - '}

                  {/* 2. Cidade e Estado: Separados por vírgula SÓ SE ambos existirem */}
                  {enderecoSelecionado.nome_cidade && <span>{enderecoSelecionado.nome_cidade}</span>}
                  {enderecoSelecionado.nome_cidade && enderecoSelecionado.sigla_estado && <span>, </span>}
                  {enderecoSelecionado.sigla_estado && <span>{enderecoSelecionado.sigla_estado}</span>}

                  {/* 3. CEP: Adiciona o prefixo 'CEP ' SÓ SE o CEP existir */}
                  {(enderecoSelecionado.nome_cidade || enderecoSelecionado.sigla_estado) && enderecoSelecionado.cep && <span>, </span>}
                  {enderecoSelecionado.cep && <span>CEP {enderecoSelecionado.cep}</span>}
                </>
              )}</p>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o tipo de entrega</h2>
            {/* <p className="text-sm font-medium mb-2">Vendido e entregue por: <span className="font-bold">Word System!</span></p> */}

            <div className="space-y-3">
              {transportadoras.filter((t) => t.error == null).map((transportadora) => (
                (
                  <label
                    className="block border border-orange-500 ring-2 ring-orange-500 rounded-md p-4 cursor-pointer"
                    onClick={() => {
                      setTransportadoraSelecionada(transportadora);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="radio" name="delivery" checked={transportadoraSelecionada?.id == transportadora.id} className="w-4 h-4 accent-orange-500" />
                        <div className="ml-3 text-sm">
                          <div className='flex flex-row items-center gap-2'>

                            <img src={transportadora.company.picture} className='max-h-3' />
                            <span className="font-bold">{transportadora.name}</span>
                          </div>

                          {transportadora.error == null && (
                            <p className="text-gray-600">Chegará até {calcularDataChegada(new Date('2025-12-01T10:00:00'), transportadora.delivery_time)}</p>
                          )}
                        </div>
                      </div>

                      <span className="text-sm font-bold">{currencyFormatter.format(parseFloat(transportadora.price))}</span>
                    </div>
                  </label>
                )
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">*Mediante a confirmação de pagamento até às <span className="font-bold">13 horas</span>.</p>
          </div>
        )
      }

    </div>
  );
}