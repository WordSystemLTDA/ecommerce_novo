import { useEffect } from 'react';
import { FaCreditCard, FaMoneyBillWave, FaQrcode, FaUniversity } from 'react-icons/fa';
import { useCarrinho } from './context/CarrinhoContext';
import Loader from '~/components/loader';
import type { Pagamento } from '~/types/Pagamento';

const getPaymentLabel = (pagamento: Pagamento) => {
  if (pagamento.nome) {
    return pagamento.nome;
  }

  switch (pagamento.tipo) {
    case 'MERCADO_PAGO':
    case 'CHECKOUT_PRO':
      return 'Mercado Pago';
    case 'PIX':
      return 'PIX';
    case 'CREDITO':
      return 'Cartão de crédito';
    case 'DEBITO':
      return 'Cartão de débito';
    case 'DINHEIRO':
      return 'Dinheiro';
    default:
      return 'Pagamento';
  }
};

const getPaymentIcon = (pagamento: Pagamento) => {
  switch (pagamento.tipo) {
    case 'MERCADO_PAGO':
    case 'CHECKOUT_PRO':
      return <FaCreditCard className="text-gray-500" size={20} />;
    case 'PIX':
      return <FaQrcode className="text-gray-500" size={20} />;
    case 'CREDITO':
    case 'DEBITO':
      return <FaCreditCard className="text-gray-500" size={20} />;
    case 'DINHEIRO':
      return <FaMoneyBillWave className="text-gray-500" size={20} />;
    default:
      return <FaUniversity className="text-gray-500" size={20} />;
  }
};

export default function PaymentPage() {
  let { pagamentoSelecionado, pagamentos, setPagamentoSelecionado, listarPagamentos, carregandoPagamentos, tipoDeEntregaSelecionada } = useCarrinho();

  useEffect(() => {
    listarPagamentos();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">

      {carregandoPagamentos ? (
        <div className="flex items-center justify-center w-full">
          <Loader />
        </div>
      )
        :
        (
          <div>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/70">
                Pagamento
              </p>
              <h2 className="text-lg font-bold text-gray-800">
                Escolha como pagar
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                A opção escolhida será usada para gerar o pedido na próxima etapa.
              </p>
            </div>

            <div className="space-y-3">
              {pagamentos.length === 0 && (
                <div className="rounded-md border border-dashed border-gray-300 p-6 text-center">
                  <FaCreditCard className="mx-auto text-primary" size={28} />
                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    Nenhuma forma de pagamento disponível.
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Tente novamente em instantes ou entre em contato com a loja.
                  </p>
                </div>
              )}

              {pagamentos.map((pagamento) => {
                const isSelected = pagamento?.id === pagamentoSelecionado?.id;
                const label = getPaymentLabel(pagamento);

                return (
                  <label
                    key={pagamento.id}
                    className={`
                      block rounded-md border p-4 cursor-pointer transition-all
                      ${isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'border-gray-300 hover:border-primary/60 hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value={pagamento.id}
                          checked={isSelected}
                          onChange={() => setPagamentoSelecionado(pagamento)}
                          className="w-4 h-4 accent-primary"
                        />
                        <div className="ml-3 text-sm">
                          <span className="font-bold">{label}</span>
                          {pagamento.nome_banco && (
                            <p className="text-xs text-gray-500">
                              {pagamento.nome_banco}
                            </p>
                          )}
                          {(pagamento.tipo === 'MERCADO_PAGO' || pagamento.tipo === 'CHECKOUT_PRO') && (
                            <p className="text-xs text-gray-500">
                              {`Cartao, Pix e boleto${pagamento.max_parcelas ? ` em ate ${pagamento.max_parcelas}x` : ''}.`}
                            </p>
                          )}
                        </div>
                      </div>
                      {getPaymentIcon(pagamento)}
                    </div>

                    {isSelected && (pagamento.tipo === 'MERCADO_PAGO' || pagamento.tipo === 'CHECKOUT_PRO') && (
                      <p className="text-sm text-gray-600 mt-3 ml-7">
                        Voce sera redirecionado para finalizar o pagamento no ambiente seguro do Mercado Pago.
                      </p>
                    )}

                    {isSelected && pagamento.tipo === 'PIX' && (
                      <p className="text-sm text-gray-600 mt-3 ml-7">
                        Aprovação rápida para acelerar a separação do pedido.
                      </p>
                    )}
                  </label>
                )
              })}
              {tipoDeEntregaSelecionada?.id == 0 && (
                <label
                  className={`
                    block rounded-md border p-4 cursor-pointer transition-all
                    ${0 === pagamentoSelecionado?.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'border-gray-300 hover:border-primary/60 hover:bg-gray-50'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="store"
                        checked={0 === pagamentoSelecionado?.id}
                        onChange={() => setPagamentoSelecionado({
                          id: 0,
                          tipo: 'DINHEIRO',
                          nome: "Pagar na retirada",
                          nome_banco: '',
                          pix_dinamico: '',
                        })}
                        className="w-4 h-4 accent-primary"
                      />
                      <div className="ml-3 text-sm">
                        <span className="font-bold">Pagar na retirada</span>
                        <p className="text-xs text-gray-500">
                          Disponível para retirada na loja.
                        </p>
                      </div>
                    </div>
                    <FaMoneyBillWave className="text-gray-500" size={20} />
                  </div>
                </label>
              )}
            </div>
          </div>
        )
      }
    </div>
  );
}
