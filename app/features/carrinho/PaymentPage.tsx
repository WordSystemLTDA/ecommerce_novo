import { useEffect } from 'react';
import { FaQrcode } from 'react-icons/fa';
import { useCarrinho } from './context/CarrinhoContext';
import Loader from '~/components/loader';

// --- PÁGINA DA ETAPA 4 ---
export default function PaymentPage() {
  let { pagamentoSelecionado, pagamentos, setPagamentoSelecionado, listarPagamentos, carregandoPagamentos } = useCarrinho();

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
            <h2 className="text-lg font-bold text-gray-800 mb-4">FORMA DE PAGAMENTO</h2>
            <div className="space-y-3">
              {pagamentos.map((pagamento) => {
                return (
                  <label className={`block border rounded-md p-4 cursor-pointer ${pagamento?.id === pagamentoSelecionado?.id ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="radio" name="payment" value="pix" checked={pagamento?.id === pagamentoSelecionado?.id} onChange={() => setPagamentoSelecionado(pagamento)} className="w-4 h-4 accent-orange-500" />
                        <div className="ml-3 text-sm">
                          <span className="font-bold">PIX</span>
                        </div>
                      </div>
                      <FaQrcode className="text-gray-500" size={20} />
                    </div>

                    {pagamento?.id === pagamentoSelecionado?.id && (
                      <p className="text-sm text-gray-600 mt-3 ml-7">Até <span className="font-bold">22% de desconto</span> com <span className="font-bold">aprovação imediata</span> que torna a <span className="font-bold">expedição mais rápida</span> do pedido.</p>
                    )}
                  </label>
                )
              })}
            </div>
          </div>
        )
      }
    </div>
  );
}