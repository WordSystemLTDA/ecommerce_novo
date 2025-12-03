import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCarrinho } from './context/CarrinhoContext';
import Loader from '~/components/loader';
// Removi o import do Loading se não for usar em outro lugar

// --- PÁGINA DA ETAPA 2 ---
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
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione seu endereço:</h2>
            <div className="space-y-3">
              {enderecos.map((endereco) => {
                return (
                  <label key={endereco.id} className={`block border rounded-md p-4 cursor-pointer ${enderecoSelecionado?.id == endereco.id ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                    <div className="flex items-center">
                      <input type="radio" name="address" value={endereco.id} checked={enderecoSelecionado?.id == endereco.id} onChange={() => setEnderecoSelecionado(endereco)} className="w-4 h-4 accent-primary" />
                      <div className="ml-3 text-sm">
                        {endereco && (
                          <p>
                            <span className="font-bold">
                              {endereco.endereco && <span>{endereco.endereco}</span>}
                              {endereco.endereco && endereco.numero && <span>, </span>}
                              {endereco.numero && <span>{endereco.numero}</span>}
                            </span>

                            {(endereco.endereco || endereco.numero) && ' - '}

                            {endereco.nome_cidade && <span>{endereco.nome_cidade}</span>}
                            {endereco.nome_cidade && endereco.sigla_estado && <span>, </span>}
                            {endereco.sigla_estado && <span>{endereco.sigla_estado}</span>}

                            {(endereco.nome_cidade || endereco.sigla_estado) && endereco.cep && <span>, </span>}
                            {endereco.cep && <span>CEP {endereco.cep}</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <button
              className="mt-6 text-xs font-bold text-primary hover:text-primary cursor-pointer"
              onClick={() => {
                navigate('/minha-conta/enderecos/novo');
              }}
            >
              CADASTRAR NOVO ENDEREÇO
            </button>
          </div>
        )
      }
    </div>
  );
}