import { useEffect } from 'react';
import { FaCheck, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useCarrinho } from './context/CarrinhoContext';
import Loader from '~/components/loader';

export default function AddressPage() {
  let { enderecos, enderecoSelecionado, setEnderecoSelecionado, listarEnderecos, carregandoEnderecos } = useCarrinho();

  let navigate = useNavigate();

  useEffect(() => {
    listarEnderecos();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">

      {carregandoEnderecos ? (
        <div className="flex items-center justify-center w-full">
          <Loader />
        </div>
      )
        :
        (
          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/70">
                  Entrega
                </p>
                <h2 className="text-lg font-bold text-gray-800">
                  Selecione seu endereço
                </h2>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/5"
                onClick={() => {
                  navigate('/minha-conta/enderecos/novo');
                }}
              >
                <FaPlus /> Novo endereço
              </button>
            </div>

            {enderecos.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-300 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/8 text-primary">
                  <FaMapMarkerAlt />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-800">
                  Nenhum endereço cadastrado
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Cadastre um endereço para calcular o frete e continuar a compra.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {enderecos.map((endereco) => {
                  const isSelected = enderecoSelecionado?.id == endereco.id;

                  return (
                    <label
                      key={endereco.id}
                      className={`
                        block rounded-md border p-4 cursor-pointer transition-all
                        ${isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary'
                          : 'border-gray-300 hover:border-primary/60 hover:bg-gray-50'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          value={endereco.id}
                          checked={isSelected}
                          onChange={() => setEnderecoSelecionado(endereco)}
                          className="mt-1 w-4 h-4 accent-primary"
                        />
                        <div className="min-w-0 grow text-sm">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-gray-900">
                              {endereco.endereco && <span>{endereco.endereco}</span>}
                              {endereco.endereco && endereco.numero && <span>, </span>}
                              {endereco.numero && <span>{endereco.numero}</span>}
                            </span>
                            {endereco.padrao === 'S' && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                Principal
                              </span>
                            )}
                            {isSelected && (
                              <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                                <FaCheck size={9} /> Selecionado
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-gray-600">
                            {endereco.nome_bairro && <span>{endereco.nome_bairro}</span>}
                            {endereco.nome_bairro && (endereco.nome_cidade || endereco.sigla_estado) && <span> - </span>}
                            {endereco.nome_cidade && <span>{endereco.nome_cidade}</span>}
                            {endereco.nome_cidade && endereco.sigla_estado && <span>, </span>}
                            {endereco.sigla_estado && <span>{endereco.sigla_estado}</span>}
                            {(endereco.nome_cidade || endereco.sigla_estado) && endereco.cep && <span>, </span>}
                            {endereco.cep && <span>CEP {endereco.cep}</span>}
                          </p>
                          {endereco.complemento && (
                            <p className="mt-1 text-xs text-gray-500">
                              Complemento: {endereco.complemento}
                            </p>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="mt-5 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
              O frete será recalculado automaticamente depois que você escolher
              o endereço.
            </div>
          </div>
        )
      }
    </div>
  );
}
