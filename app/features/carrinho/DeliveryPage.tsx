import { useEffect } from 'react';
import Loader from '~/components/loader';
import { calcularDataChegada, currencyFormatter } from '~/utils/formatters';
import { useCarrinho } from './context/CarrinhoContext';

export default function DeliveryPage() {

  let { listarTipoDeEntregas, tipoDeEntregas, setTipoDeEntregaSelecionada, tipoDeEntregaSelecionada, enderecoSelecionado, carregandoTipoDeEntregas } = useCarrinho();

  useEffect(() => {
    if (enderecoSelecionado != null) {
      listarTipoDeEntregas(enderecoSelecionado?.cep);
    }
  }, []);

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
            <div className="mb-4">
              <p className="text-sm text-gray-600">Endereço selecionado: {enderecoSelecionado && (
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
              )}</p>
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o tipo de entrega</h2>

            <div className="space-y-3">
              {tipoDeEntregas.filter((t) => t.error == null).map((tipoDeEntrega) => (
                (
                  <label
                    className="block border border-primary ring-2 ring-primary rounded-md p-4 cursor-pointer"
                    onClick={() => {
                      setTipoDeEntregaSelecionada(tipoDeEntrega);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="radio" name="delivery" checked={tipoDeEntregaSelecionada?.id == tipoDeEntrega.id} className="w-4 h-4 accent-primary" />
                        <div className="ml-3 text-sm">
                          <div className='flex flex-row items-center gap-2'>

                            <img src={tipoDeEntrega.company.picture} className='max-h-3' />
                            <span className="font-bold">{tipoDeEntrega.name}</span>
                          </div>

                          {tipoDeEntrega.error == null && (
                            <p className="text-gray-600">Chegará até {calcularDataChegada(new Date('2025-12-01T10:00:00'), tipoDeEntrega.delivery_time)}</p>
                          )}
                        </div>
                      </div>

                      <span className="text-sm font-bold">{currencyFormatter.format(parseFloat(tipoDeEntrega.price))}</span>
                    </div>
                  </label>
                )
              ))}

              <label
                className="block border border-primary ring-2 ring-primary rounded-md p-4 cursor-pointer"
                onClick={() => {
                  setTipoDeEntregaSelecionada({
                    id: 0,
                    name: "Retirar na loja",
                    price: '0',
                    delivery_time: 0,
                    company: {
                      id: 0,
                      picture: "https://via.placeholder.com/150",
                      name: "Retirar na loja"
                    }
                  });
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="radio" name="delivery" checked={tipoDeEntregaSelecionada?.id == 0} className="w-4 h-4 accent-primary" />
                    <div className="ml-3 text-sm">
                      <div className='flex flex-row items-center gap-2'>

                        <span className="font-bold">Retirar na loja</span>
                      </div>
                    </div>
                  </div>

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
