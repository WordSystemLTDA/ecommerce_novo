import { useEffect, useMemo } from 'react';
import { FaCheck, FaStore, FaTruck } from 'react-icons/fa';
import Loader from '~/components/loader';
import { getDeliveryPrice, getDeliveryTime } from '~/utils/delivery';
import { calcularDataChegada, currencyFormatter } from '~/utils/formatters';
import { useCarrinho } from './context/CarrinhoContext';
import type { TipoDeEntrega } from '~/types/TipoDeEntrega';

const pickupDelivery: TipoDeEntrega = {
  id: 0,
  name: 'Retirar na loja',
  price: '0',
  delivery_time: 0,
  company: {
    id: 0,
    picture: '',
    name: 'Retirar na loja',
  },
};

export default function DeliveryPage() {

  let {
    listarTipoDeEntregas,
    tipoDeEntregas,
    erroTipoDeEntregas,
    setTipoDeEntregaSelecionada,
    tipoDeEntregaSelecionada,
    enderecoSelecionado,
    carregandoTipoDeEntregas
  } = useCarrinho();

  const entregasDisponiveis = useMemo(
    () => tipoDeEntregas.filter((tipoDeEntrega) => tipoDeEntrega.error == null),
    [tipoDeEntregas]
  );

  const errosDeEntrega = useMemo(
    () => tipoDeEntregas
      .filter((tipoDeEntrega) => tipoDeEntrega.error != null)
      .map((tipoDeEntrega) => tipoDeEntrega.error)
      .filter(Boolean),
    [tipoDeEntregas]
  );

  useEffect(() => {
    if (enderecoSelecionado != null) {
      listarTipoDeEntregas(enderecoSelecionado?.cep);
    }
  }, [enderecoSelecionado?.cep]);

  if (tipoDeEntregas == undefined) {
    return (
      <div>
        <p>não tem transportes</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">

      {carregandoTipoDeEntregas ? (
        <div className="flex items-center justify-center w-full">
          <Loader />
        </div>
      )
        :
        (
          <div>
            <div className="mb-5 rounded-md border border-primary/15 bg-primary/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/70">
                Endereço selecionado
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {enderecoSelecionado && (
                  <>
                    <span className="font-bold">
                      {enderecoSelecionado.endereco && <span>{enderecoSelecionado.endereco}</span>}
                      {enderecoSelecionado.endereco && enderecoSelecionado.numero && <span>, </span>}
                      {enderecoSelecionado.numero && <span>{enderecoSelecionado.numero}</span>}
                    </span>

                    {(enderecoSelecionado.endereco || enderecoSelecionado.numero) && ' - '}

                    {enderecoSelecionado.nome_cidade && <span>{enderecoSelecionado.nome_cidade}</span>}
                    {enderecoSelecionado.nome_cidade && enderecoSelecionado.sigla_estado && <span>, </span>}
                    {enderecoSelecionado.sigla_estado && <span>{enderecoSelecionado.sigla_estado}</span>}

                    {(enderecoSelecionado.nome_cidade || enderecoSelecionado.sigla_estado) && enderecoSelecionado.cep && <span>, </span>}
                    {enderecoSelecionado.cep && <span>CEP {enderecoSelecionado.cep}</span>}
                  </>
                )}
              </p>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o tipo de entrega</h2>

            <div className="space-y-3">
              {!enderecoSelecionado && (
                <DeliveryErrorMessage
                  message="Selecione um endereço para calcular o frete."
                />
              )}

              {enderecoSelecionado && erroTipoDeEntregas && entregasDisponiveis.length === 0 && (
                <DeliveryErrorMessage
                  message={erroTipoDeEntregas}
                  details={errosDeEntrega}
                  onRetry={() => listarTipoDeEntregas(enderecoSelecionado.cep)}
                />
              )}

              {enderecoSelecionado && !erroTipoDeEntregas && entregasDisponiveis.length === 0 && (
                <DeliveryErrorMessage
                  message="Não conseguimos encontrar uma opção de frete para este endereço."
                  details={errosDeEntrega}
                  onRetry={() => listarTipoDeEntregas(enderecoSelecionado.cep)}
                />
              )}

              {entregasDisponiveis.map((tipoDeEntrega) => (
                (
                  <label
                    key={`${tipoDeEntrega.company.id}-${tipoDeEntrega.id}-${tipoDeEntrega.name}`}
                    className={`
                      block rounded-md border p-4 cursor-pointer transition-all
                      ${tipoDeEntregaSelecionada?.id == tipoDeEntrega.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'border-gray-300 hover:border-primary/60 hover:bg-gray-50'}
                    `}
                    onClick={() => {
                      setTipoDeEntregaSelecionada(tipoDeEntrega);
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center">
                        <input
                          type="radio"
                          name="delivery"
                          checked={tipoDeEntregaSelecionada?.id == tipoDeEntrega.id}
                          onChange={() => setTipoDeEntregaSelecionada(tipoDeEntrega)}
                          className="w-4 h-4 accent-primary"
                        />
                        <div className="ml-3 min-w-0 text-sm">
                          <div className='flex flex-row items-center gap-2'>

                            {tipoDeEntrega.company.picture ? (
                              <img src={tipoDeEntrega.company.picture} alt={tipoDeEntrega.company.name} className='max-h-3' />
                            ) : (
                              <FaTruck className="text-primary" />
                            )}
                            <span className="font-bold">{tipoDeEntrega.name}</span>
                            {tipoDeEntregaSelecionada?.id == tipoDeEntrega.id && (
                              <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                                <FaCheck size={9} /> Selecionada
                              </span>
                            )}
                          </div>

                          {tipoDeEntrega.error == null && (
                            <p className="text-gray-600">Chegará até {calcularDataChegada(new Date(), getDeliveryTime(tipoDeEntrega))}</p>
                          )}
                        </div>
                      </div>

                      <span className="shrink-0 text-sm font-bold">{currencyFormatter.format(getDeliveryPrice(tipoDeEntrega))}</span>
                    </div>
                  </label>
                )
              ))}

              <label
                className={`
                  block rounded-md border p-4 cursor-pointer transition-all
                  ${tipoDeEntregaSelecionada?.id == 0
                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                    : 'border-gray-300 hover:border-primary/60 hover:bg-gray-50'}
                `}
                onClick={() => {
                  setTipoDeEntregaSelecionada(pickupDelivery);
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      checked={tipoDeEntregaSelecionada?.id == 0}
                      onChange={() => {
                        setTipoDeEntregaSelecionada(pickupDelivery);
                      }}
                      className="w-4 h-4 accent-primary"
                    />
                    <div className="ml-3 text-sm">
                      <div className='flex flex-row items-center gap-2'>
                        <FaStore className="text-primary" />
                        <span className="font-bold">Retirar na loja</span>
                        {tipoDeEntregaSelecionada?.id == 0 && (
                          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                            <FaCheck size={9} /> Selecionada
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">Sem custo de frete.</p>
                    </div>
                  </div>

                  <span className="shrink-0 text-sm font-bold">
                    {currencyFormatter.format(0)}
                  </span>
                </div>
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-4">*Mediante a confirmação de pagamento até às <span className="font-bold">13 horas</span>.</p>
          </div>
        )
      }


    </div >
  );
}

interface DeliveryErrorMessageProps {
  message: string;
  details?: (string | undefined)[];
  onRetry?: () => void;
}

function DeliveryErrorMessage({
  message,
  details = [],
  onRetry
}: DeliveryErrorMessageProps) {
  const visibleDetails = details.slice(0, 3);

  return (
    <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p className="font-semibold">{message}</p>
      <p className="mt-1 text-red-600">
        Verifique se o CEP está correto e se os produtos possuem peso e dimensões cadastrados.
      </p>

      {visibleDetails.length > 0 && (
        <ul className="mt-2 list-disc pl-5 text-xs text-red-600">
          {visibleDetails.map((detail, index) => (
            <li key={`${detail}-${index}`}>{detail}</li>
          ))}
        </ul>
      )}

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-red-700 underline"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
