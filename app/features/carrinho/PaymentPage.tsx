import { useEffect, useMemo, useState } from 'react';
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaQrcode,
  FaUniversity,
} from 'react-icons/fa';
import Loader from '~/components/loader';
import { mercadoPagoService } from
  '~/features/mercado_pago/mercado_pago_service';
import type { MercadoPagoConfigResponse } from
  '~/features/mercado_pago/types';
import type { Pagamento } from '~/types/Pagamento';
import { useCarrinho } from './context/CarrinhoContext';

function getPaymentLabel(pagamento: Pagamento) {
  if (pagamento.nome) {
    return pagamento.nome;
  }

  switch (pagamento.tipo) {
    case 'PIX':
      return 'PIX';
    case 'CREDITO':
      return 'Cartao de credito';
    case 'DEBITO':
      return 'Cartao de debito';
    case 'DINHEIRO':
      return 'Dinheiro';
    case 'MERCADO_PAGO':
    case 'CHECKOUT_PRO':
      return 'Mercado Pago';
    default:
      return 'Pagamento';
  }
}

function getPaymentIcon(pagamento: Pagamento) {
  switch (pagamento.tipo) {
    case 'PIX':
      return <FaQrcode className="text-gray-500" size={20} />;
    case 'CREDITO':
    case 'DEBITO':
    case 'MERCADO_PAGO':
    case 'CHECKOUT_PRO':
      return <FaCreditCard className="text-gray-500" size={20} />;
    case 'DINHEIRO':
      return <FaMoneyBillWave className="text-gray-500" size={20} />;
    default:
      return <FaUniversity className="text-gray-500" size={20} />;
  }
}

function isGatewayPayment(pagamento: Pagamento) {
  return pagamento.tipo === 'MERCADO_PAGO' ||
    pagamento.tipo === 'CHECKOUT_PRO';
}

export default function PaymentPage() {
  const {
    pagamentoSelecionado,
    pagamentos,
    setPagamentoSelecionado,
    listarPagamentos,
    carregandoPagamentos,
    tipoDeEntregaSelecionada,
  } = useCarrinho();
  const [gatewayConfig, setGatewayConfig] =
    useState<MercadoPagoConfigResponse | null>(null);
  const [gatewayError, setGatewayError] = useState<string | null>(null);

  useEffect(() => {
    void listarPagamentos();
    void mercadoPagoService.getPublicConfig()
      .then(setGatewayConfig)
      .catch(() => {
        setGatewayError('Nao foi possivel consultar o Mercado Pago.');
        setGatewayConfig({
          enabled: false,
          publicKey: null,
          paymentMethodId: null,
          maxInstallments: 12,
          pixExpirationMinutes: 30,
          sandbox: false,
        });
      });
  }, []);

  const regularPayments = useMemo(
    () => pagamentos.filter((pagamento) => !isGatewayPayment(pagamento)),
    [pagamentos],
  );
  const gatewayPayment = useMemo(() => {
    return pagamentos.find(isGatewayPayment) ?? null;
  }, [pagamentos]);
  const gatewayMethods = useMemo(() => {
    if (!gatewayPayment) {
      return [];
    }

    return gatewayPayment.mercado_pago_methods?.length
      ? gatewayPayment.mercado_pago_methods
      : ['pix', 'credit_card'];
  }, [gatewayPayment]);

  const selectGatewayMethod = (method: 'pix' | 'credit_card') => {
    if (!gatewayPayment) {
      return;
    }

    setPagamentoSelecionado({
      ...gatewayPayment,
      tipo: 'MERCADO_PAGO',
      checkout_pro: false,
      checkout_transparente: true,
      mercado_pago_method: method,
      nome: method === 'pix'
        ? 'PIX via Mercado Pago'
        : 'Cartao de credito via Mercado Pago',
    });
  };

  const isLoading = carregandoPagamentos || gatewayConfig == null;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      {isLoading ? (
        <div className="flex w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/70">
              Pagamento
            </p>
            <h2 className="text-lg font-bold text-gray-800">
              Escolha como pagar
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              O pagamento e concluido nesta loja, sem redirecionamentos.
            </p>
          </div>

          {gatewayConfig.sandbox && gatewayConfig.enabled && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Ambiente de testes do Mercado Pago ativo. Nenhuma cobranca real
              sera realizada.
            </div>
          )}

          <div className="space-y-3">
            {gatewayPayment && gatewayConfig.enabled && (
              <>
                {gatewayMethods.includes('pix') && (
                  <PaymentOption
                    checked={
                      pagamentoSelecionado?.id === gatewayPayment.id &&
                      pagamentoSelecionado.mercado_pago_method === 'pix'
                    }
                    description="QR Code e Pix Copia e Cola gerados na hora."
                    icon={<FaQrcode className="text-primary" size={22} />}
                    label="PIX via Mercado Pago"
                    onSelect={() => selectGatewayMethod('pix')}
                    value={`${gatewayPayment.id}-pix`}
                  />
                )}
                {gatewayMethods.includes('credit_card') && (
                  <PaymentOption
                    checked={
                      pagamentoSelecionado?.id === gatewayPayment.id &&
                      pagamentoSelecionado.mercado_pago_method ===
                        'credit_card'
                    }
                    description={`Pagamento seguro em ate ${
                      gatewayPayment.max_parcelas ??
                      gatewayConfig.maxInstallments
                    }x.`}
                    icon={<FaCreditCard className="text-primary" size={22} />}
                    label="Cartao de credito"
                    onSelect={() => selectGatewayMethod('credit_card')}
                    value={`${gatewayPayment.id}-credit-card`}
                  />
                )}
              </>
            )}

            {regularPayments.map((pagamento) => {
              const isSelected =
                pagamento.id === pagamentoSelecionado?.id &&
                !pagamentoSelecionado.mercado_pago_method;

              return (
                <PaymentOption
                  key={pagamento.id}
                  checked={isSelected}
                  description={
                    pagamento.tipo === 'PIX'
                      ? 'Aprovacao rapida para acelerar a separacao do pedido.'
                      : pagamento.nome_banco || undefined
                  }
                  icon={getPaymentIcon(pagamento)}
                  label={getPaymentLabel(pagamento)}
                  onSelect={() => setPagamentoSelecionado(pagamento)}
                  value={String(pagamento.id)}
                />
              );
            })}

            {tipoDeEntregaSelecionada?.id === 0 && (
              <PaymentOption
                checked={pagamentoSelecionado?.id === 0}
                description="Disponivel para retirada na loja."
                icon={<FaMoneyBillWave className="text-gray-500" size={20} />}
                label="Pagar na retirada"
                onSelect={() => {
                  setPagamentoSelecionado({
                    id: 0,
                    tipo: 'DINHEIRO',
                    nome: 'Pagar na retirada',
                    nome_banco: '',
                    pix_dinamico: '',
                  });
                }}
                value="store"
              />
            )}

            {regularPayments.length === 0 &&
              !(gatewayPayment && gatewayConfig.enabled) && (
              <div className="rounded-md border border-dashed border-gray-300 p-6 text-center">
                <FaCreditCard className="mx-auto text-primary" size={28} />
                <p className="mt-3 text-sm font-semibold text-gray-800">
                  Nenhuma forma de pagamento disponivel.
                </p>
              </div>
            )}

            {(!gatewayConfig.enabled || gatewayError) && (
              <p className="rounded-md bg-gray-50 p-3 text-xs text-gray-500">
                {gatewayError ||
                  'Mercado Pago indisponivel ate as credenciais serem configuradas.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentOption({
  checked,
  description,
  icon,
  label,
  onSelect,
  value,
}: {
  checked: boolean;
  description?: string;
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
  value: string;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-md border p-4 transition-all ${
        checked
          ? 'border-primary bg-primary/5 ring-2 ring-primary'
          : 'border-gray-300 hover:border-primary/60 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          <input
            type="radio"
            name="payment"
            value={value}
            checked={checked}
            onChange={onSelect}
            className="h-4 w-4 accent-primary"
          />
          <div className="ml-3 text-sm">
            <span className="font-bold">{label}</span>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {icon}
      </div>
    </label>
  );
}
