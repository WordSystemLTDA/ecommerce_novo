/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  FaCheck,
  FaCheckCircle,
  FaCreditCard,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaQrcode,
  FaRegCopy,
  FaShoppingCart,
  FaTruck,
  FaExternalLinkAlt
} from 'react-icons/fa';
import QRCode from 'react-qr-code';
import { useLocation, useNavigate } from 'react-router';
import Footer from '~/components/footer';
import Header from '~/components/header';

const CheckoutStepper = ({ activeStep }: { activeStep: number }) => {
  const steps = [
    { name: 'Carrinho', icon: FaShoppingCart },
    { name: 'Endereço', icon: FaMapMarkerAlt },
    { name: 'Entrega', icon: FaTruck },
    { name: 'Pagamento', icon: FaCreditCard },
    { name: 'Confirmação', icon: FaCheckCircle },
    { name: 'Concluído', icon: FaCheckCircle },
  ];

  return (
    <div className="mb-5 rounded-lg bg-white shadow-sm sm:mb-6">
      <div className="flex items-center justify-between gap-1 px-3 py-4 sm:gap-2 sm:px-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === activeStep;
          const isCompleted = stepNumber < activeStep;

          return (
            <React.Fragment key={step.name}>
              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10
                    ${isActive ? 'border-primary bg-primary text-white' : ''}
                    ${isCompleted ? 'border-primary bg-white text-primary' : ''}
                    ${!isActive && !isCompleted ? 'border-gray-300 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? <FaCheck size={20} /> : <step.icon size={20} />}
                </div>
                <span
                  className={`
                    mt-2 hidden text-xs font-medium sm:block
                    ${(isActive || isCompleted) ? 'text-primary' : 'text-gray-400'}
                  `}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-1 h-0.5 min-w-2 flex-auto sm:mx-2 ${(isCompleted || isActive) ? 'bg-primary' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import Loader from '~/components/loader';
import { useAuth } from '../auth/context/AuthContext';
import { carrinhoService } from './services/carrinhoService';
import { mercadoPagoService, mercadoPagoStatus } from
  '~/features/mercado_pago/mercado_pago_service';
import type {
  MercadoPagoOrderResult,
  MercadoPagoPaymentStatus,
} from
  '~/features/mercado_pago/types';

type PagamentoVisualStatus = 'aprovado' | 'pendente' | 'recusado';

const toPagamentoVisualStatus = (
  status?: string | null,
): PagamentoVisualStatus => {
  if (!status) {
    return 'pendente';
  }

  return mercadoPagoStatus.toVisualStatus(
    status as MercadoPagoPaymentStatus,
  );
};

const getPixValidityLabel = (
  order: MercadoPagoOrderResult | null,
  venda: any,
) => {
  if (order?.expiresAt) {
    const expirationDate = new Date(order.expiresAt);
    if (!Number.isNaN(expirationDate.getTime())) {
      return `até ${new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(expirationDate)}`;
    }
  }

  const minutes = order?.pixExpirationMinutes ??
    venda?.pagamento_ecommerce?.pix_expiracao_minutos ??
    venda?.pagamento?.tempo_cancel ??
    30;
  if (minutes < 60) return `por ${minutes} minutos`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hourLabel = `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (remainingMinutes === 0) return `por ${hourLabel}`;

  return `por ${hourLabel} e ${remainingMinutes} ${
    remainingMinutes === 1 ? 'minuto' : 'minutos'
  }`;
};

const Step6_Success = () => {
  const { id } = useParams();
  const { cliente } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = React.useState(true);
  const [venda, setVenda] = React.useState<any>(null);
  const [pixData, setPixData] = React.useState<any>(null);
  const [pagamentoStatus, setPagamentoStatus] = React.useState<string>('pendente');
  const [mercadoPagoOrder, setMercadoPagoOrder] =
    React.useState<MercadoPagoOrderResult | null>(null);

  React.useEffect(() => {
    if (id) {
      loadOrder(Number(id));
      const storedOrder = mercadoPagoService.getStoredOrder(Number(id));
      if (storedOrder) {
        setMercadoPagoOrder(storedOrder);
        setPagamentoStatus(toPagamentoVisualStatus(storedOrder.status));
        setVenda((currentVenda: any) => currentVenda ?? {
          id: storedOrder.saleId,
          status: storedOrder.status,
          pagamento: {
            tipo: 'MERCADO_PAGO',
            nome: storedOrder.method === 'pix'
              ? 'PIX via Mercado Pago'
              : 'Mercado Pago',
          },
          pagamento_ecommerce: {
            gateway: 'mercado_pago',
            order_id: storedOrder.orderId,
            payment_id: storedOrder.paymentId,
            status: storedOrder.status,
            pix_expiracao_minutos: storedOrder.pixExpirationMinutes,
          },
        });
        if (storedOrder.method === 'pix' && storedOrder.qrCode) {
          setPixData({
            copia_cola: storedOrder.qrCode,
            imagem_base64: storedOrder.qrCodeBase64,
            txid: storedOrder.orderId,
          });
        }
      }
    }
  }, [id]);

  const loadOrder = async (orderId: number) => {
    try {
      const response = await carrinhoService.pegarVenda(orderId);

      if (response && response.sucesso) {
        setVenda(response.data);
        return;
      }

      if (response) {
        setVenda(response);
        return;
      }

      toast.error('Não conseguimos carregar os dados do pedido.', {
        position: 'top-center',
      });
    } catch (error) {
      console.error("Erro ao carregar venda", error);
      toast.error('Erro ao carregar os dados do pedido.', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Se for PIX e tivermos os dados da venda, configurar dados do PIX vindos do backend
    if (venda && venda.pagamento && venda.pagamento.tipo === 'PIX') {
      if (venda.codigo_pix && venda.txid) {
        setPixData({
          copia_cola: venda.codigo_pix,
          txid: venda.txid,
          // O backend pode não retornar a imagem base64 salva, então o front gerará o QRCode a partir do copia_cola
        });
      }
    }
  }, [venda]);

  React.useEffect(() => {
    if (mercadoPagoOrder) {
      return;
    }

    const status = venda?.pagamento_ecommerce?.status || venda?.pagamento?.status;
    if (status) {
      setPagamentoStatus(toPagamentoVisualStatus(status));
    }
  }, [mercadoPagoOrder, venda]);

  React.useEffect(() => {
    const orderId = venda?.pagamento_ecommerce?.order_id;
    if (mercadoPagoOrder || !orderId) {
      return;
    }

    void mercadoPagoService.getOrder(orderId)
      .then((order) => {
        mercadoPagoService.storeOrder(order);
        setMercadoPagoOrder(order);
        setPagamentoStatus(toPagamentoVisualStatus(order.status));
        if (order.method === 'pix' && order.qrCode) {
          setPixData({
            copia_cola: order.qrCode,
            imagem_base64: order.qrCodeBase64,
            txid: order.orderId,
          });
        }
      })
      .catch((error) => {
        console.error('Erro ao recuperar pagamento Mercado Pago.', error);
      });
  }, [mercadoPagoOrder, venda]);

  const [checkingPayment, setCheckingPayment] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    const shouldPoll =
      pagamentoStatus === 'pendente' &&
      (mercadoPagoOrder != null ||
        (pixData && venda?.pagamento?.tipo === 'PIX'));
    if (shouldPoll) {
      interval = setInterval(() => checkPixStatus(), 5000);
    }
    return () => clearInterval(interval);
  }, [mercadoPagoOrder, pixData, pagamentoStatus, venda]);


  const checkPixStatus = async (manual = false) => {
    if (mercadoPagoOrder) {
      try {
        const refreshedOrder = await mercadoPagoService.getOrder(
          mercadoPagoOrder.orderId,
        );
        mercadoPagoService.storeOrder(refreshedOrder);
        setMercadoPagoOrder(refreshedOrder);
        setPagamentoStatus(toPagamentoVisualStatus(refreshedOrder.status));
        if (refreshedOrder.qrCode) {
          setPixData({
            copia_cola: refreshedOrder.qrCode,
            imagem_base64: refreshedOrder.qrCodeBase64,
            txid: refreshedOrder.orderId,
          });
        }
        if (manual && mercadoPagoStatus.isFailure(refreshedOrder.status)) {
          toast.error(
            'Este PIX foi recusado. Nao tente pagar novamente este codigo.',
            { position: 'top-center' },
          );
        } else if (
          manual &&
          !mercadoPagoStatus.isApproved(refreshedOrder.status)
        ) {
          toast.info('Pagamento ainda nao identificado.', {
            position: 'top-center',
          });
        }
      } catch (error) {
        console.error('Erro ao verificar PIX do Mercado Pago.', error);
        if (manual) {
          toast.error('Erro ao verificar status do pagamento.', {
            position: 'top-center',
          });
        }
      }
      return;
    }

    // Verifica se temos ID do banco para chamar a verificação
    if (!pixData || !venda.pagamento.id) return;
    try {
      const response = await carrinhoService.verificarPix(venda.pagamento.id, pixData.txid);
      if (response.sucesso && response.data.sucesso) {
        setPagamentoStatus('aprovado');
      } else if (manual) {
        alert('Pagamento ainda não identificado. Por favor, aguarde alguns instantes e tente novamente.');
      }
    } catch (error) {
      console.error("Erro ao verificar PIX", error);
      if (manual) {
        alert('Erro ao verificar status do pagamento.');
      }
    }
  };

  React.useEffect(() => {
    if (!mercadoPagoOrder?.challengeUrl || pagamentoStatus !== 'pendente') {
      return;
    }

    const handleChallengeMessage = (event: MessageEvent) => {
      const status = typeof event.data === 'object' && event.data !== null
        ? (event.data as { status?: unknown }).status
        : event.data;
      const normalizedStatus = String(status ?? '').toUpperCase();

      if (
        [
          'COMPLETE',
          'COMPLETED',
          'CHALLENGE_COMPLETED',
          'SUCCESS',
        ].includes(normalizedStatus)
      ) {
        void checkPixStatus(true);
      }
    };

    window.addEventListener('message', handleChallengeMessage);
    return () => {
      window.removeEventListener('message', handleChallengeMessage);
    };
  }, [mercadoPagoOrder?.challengeUrl, pagamentoStatus]);

  if (loading) {
    return <div className="flex justify-center p-6 sm:p-8"><Loader /></div>;
  }

  if (!venda) {
    return (
      <div className="rounded-lg bg-white p-5 text-center shadow-sm sm:p-8">
        <FaExclamationCircle className="mx-auto mb-4 text-4xl text-amber-500" />
        <h1 className="text-xl font-bold text-gray-800">
          Não conseguimos abrir o comprovante do pedido.
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Verifique seus pedidos ou tente atualizar a página.
        </p>
        <button
          className="mt-5 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-terciary"
          onClick={() => {
            navigate('/minha-conta/pedidos');
          }}
        >
          Ir para meus pedidos
        </button>
      </div>
    );
  }

  const isMercadoPagoPix = mercadoPagoOrder?.method === 'pix';
  const isPix =
    isMercadoPagoPix ||
    (venda.pagamento && venda.pagamento.tipo === 'PIX');
  const isMercadoPago =
    mercadoPagoOrder != null ||
    venda.pagamento?.tipo === 'MERCADO_PAGO' ||
    venda.pagamento_ecommerce?.gateway === 'mercado_pago';
  const showPix =
    isMercadoPagoPix ||
    (venda.pagamento?.tipo === 'PIX' &&
      venda.pagamento.pix_dinamico === 'Sim');
  const pixExpirationTimestamp = mercadoPagoOrder?.expiresAt
    ? new Date(mercadoPagoOrder.expiresAt).getTime()
    : Number.NaN;
  const isPixExpired = Number.isFinite(pixExpirationTimestamp)
    && pixExpirationTimestamp <= Date.now();
  const canPayPix = showPix
    && pagamentoStatus === 'pendente'
    && !isPixExpired;
  const routeState = location.pathname.includes('/falha')
    ? 'falha'
    : location.pathname.includes('/pendente')
      ? 'pendente'
      : 'sucesso';
  const entrega = venda.entrega;
  const trackingCode = entrega?.codigo_rastreio || entrega?.melhor_envio_order_id;
  const pixValidityLabel = getPixValidityLabel(mercadoPagoOrder, venda);

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-4 shadow-sm sm:p-8">
      <div className="text-center mb-8">
        <FaCheckCircle className="text-(--dynamic-success) text-5xl mx-auto mb-4" />
        <h1 className="text-xl font-bold text-(--dynamic-success-strong) sm:text-2xl">PEDIDO REALIZADO COM SUCESSO!</h1>
        {isPix ? (
          pagamentoStatus === 'aprovado' ? (
            <div className="mt-4 bg-(--dynamic-success-bg) text-(--dynamic-success-strong) p-4 rounded text-lg font-bold">
              PAGAMENTO CONFIRMADO!
            </div>
          ) : pagamentoStatus === 'recusado' ? (
            <div className="mt-4 rounded bg-red-50 p-4 text-lg font-bold text-red-700">
              PIX RECUSADO PELO MERCADO PAGO
            </div>
          ) : (
            <p className="text-lg text-gray-600">AGORA É SÓ REALIZAR O PAGAMENTO</p>
          )
        ) : isMercadoPago ? (
          <div className={`mt-4 p-4 rounded text-lg font-bold ${pagamentoStatus === 'aprovado'
            ? 'bg-(--dynamic-success-bg) text-(--dynamic-success-strong)'
            : routeState === 'falha' || pagamentoStatus === 'recusado'
              ? 'bg-red-50 text-red-700'
              : 'bg-amber-50 text-amber-700'
            }`}>
            {pagamentoStatus === 'aprovado'
              ? 'PAGAMENTO CONFIRMADO!'
              : routeState === 'falha' || pagamentoStatus === 'recusado'
                ? 'PAGAMENTO NAO APROVADO'
                : 'PAGAMENTO EM ANALISE'}
          </div>
        ) : (
          <p className="text-lg text-gray-600">AGORA É SÓ ESPERAR O PEDIDO CHEGAR</p>
        )}
      </div>

      {mercadoPagoOrder?.challengeUrl && pagamentoStatus === 'pendente' && (
        <section className="mb-8 rounded-lg border border-primary/20 bg-white p-4">
          <h2 className="mb-2 text-lg font-bold text-gray-800">
            Confirme a compra com seu banco
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Conclua a verificacao de seguranca abaixo. Esta etapa acontece
            dentro da loja e pode levar alguns instantes para ser confirmada.
          </p>
          <iframe
            src={mercadoPagoOrder.challengeUrl}
            title="Autenticacao de seguranca do cartao"
            className="h-[70dvh] min-h-96 w-full rounded-md border border-gray-200 sm:max-h-150"
            sandbox="allow-forms allow-scripts allow-same-origin"
          />
        </section>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {canPayPix && pixData && (
          <div className="flex-1 flex flex-col items-center">
            <div className="mx-auto flex aspect-square w-full max-w-64 items-center justify-center overflow-hidden rounded-lg border-4 border-gray-300 bg-white">
              {/* Se tiver imagem base64 usa, senão gera qrcode do copia e cola */}
              {pixData.imagem_base64 ? (
                <img src={`data:image/png;base64,${pixData.imagem_base64}`} alt="QR Code Pix" className="w-full h-full object-contain" />
              ) : (
                <QRCode
                  value={pixData.copia_cola || ""}
                  className="p-2 w-full h-full"
                />
              )}
            </div>

            <button
              className="mt-4 flex w-full max-w-64 items-center justify-center gap-2 rounded-md bg-primary py-3 font-bold text-white transition-colors hover:bg-terciary"
              onClick={() => {
                if (pixData.copia_cola) {
                  navigator.clipboard.writeText(pixData.copia_cola);
                  toast.success('Código PIX copiado para a área de transferência');
                }
              }}
            >
              <FaRegCopy /> COPIAR CÓDIGO PIX
            </button>

            <button
              className="mt-4 flex w-full max-w-64 items-center justify-center gap-2 rounded-md bg-(--dynamic-success) py-3 font-bold text-white transition-colors hover:bg-(--dynamic-success-strong)"
              onClick={async () => {
                setCheckingPayment(true);
                await checkPixStatus(true);
                setCheckingPayment(false);
              }}
              disabled={checkingPayment}
            >
              {checkingPayment ? (
                <>Verificando...</>
              ) : (
                <>
                  <FaCheck /> JÁ PAGUEI
                </>
              )}
            </button>
          </div>
        )}

        {canPayPix && (
          <div className="flex-1">
            <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-md flex items-start gap-3 mb-6">
              <FaExclamationCircle className="text-2xl mt-1" />
              <div>
                <p className="font-bold">
                  Aproveite! Este código é válido {pixValidityLabel}.
                </p>
                <p className="text-sm">Ao realizar o pagamento você será informado por e-mail.</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-sm text-gray-600">O número do seu pedido é:</p>
              <p className="overflow-wrap-anywhere text-3xl font-bold tracking-wider text-gray-800 sm:text-5xl">{venda.numero_pedido ?? venda.id}</p>
            </div>

            <p className="text-sm text-gray-600 mb-4">Escaneie o <span className="font-bold">QR Code</span> ou copie o <span className="font-bold">código PIX</span>. Abra o app da instituição que você possui o PIX cadastrado e realize o pagamento.</p>

            <h3 className="font-bold text-lg text-gray-800 mb-3">Como pagar seu Pix</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="flex items-center gap-2"><FaQrcode className="text-xl text-primary" /> Utilize o aplicativo do seu banco copiando o código PIX ou escaneando o QR-Code.</p>
              <p className="flex items-center gap-2"><FaCheckCircle className="text-sm text-primary" /> Confirme os dados de pagamento e o valor do seu pedido.</p>
              <p className="flex items-center gap-2"><FaCheckCircle className="text-xl text-primary" /> Seu pagamento será processado e debitado do valor disponível em sua conta-corrente.</p>
            </div>
          </div>
        )}

        {showPix && (pagamentoStatus === 'recusado' || isPixExpired) && (
          <div className="flex-1 rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
            <p className="font-bold">
              Este código PIX não pode mais ser pago.
            </p>
            <p className="mt-2 text-sm">
              {isPixExpired
                ? 'A validade deste QR Code terminou. Volte aos seus pedidos e clique em Pagar com PIX para gerar um novo código.'
                : 'O Mercado Pago recusou a transação durante a análise de segurança. Não tente novamente com este QR Code.'}
            </p>
          </div>
        )}

        {!isPix && (
          <div className="flex-1 text-center">
            <p className="text-lg mb-4">Seu pedido foi recebido e está sendo processado.</p>
            <div className="text-center mb-8">
              <p className="text-sm text-gray-600">O número do seu pedido é:</p>
              <p className="overflow-wrap-anywhere text-3xl font-bold tracking-wider text-gray-800 sm:text-5xl">{venda.numero_pedido ?? venda.id}</p>
            </div>
          </div>
        )}
      </div>

      {entrega && (
        <div className="mt-8 rounded-lg border border-primary/10 bg-primary/5 p-5">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <FaTruck className="text-primary" /> Entrega
          </h3>
          <div className="mt-3 grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Servico</p>
              <p className="font-semibold">{entrega.servico_nome || 'Envio'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Status</p>
              <p className="font-semibold">{entrega.status || 'Aguardando postagem'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">Rastreio</p>
              <p className="font-semibold">{trackingCode || 'Ainda nao informado'}</p>
            </div>
          </div>
          {entrega.tracking_url && (
            <a
              href={entrega.tracking_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm hover:text-terciary"
            >
              Abrir rastreio <FaExternalLinkAlt />
            </a>
          )}
        </div>
      )}

      <button
        className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-terciary transition-colors flex items-center justify-center gap-2 mt-5"
        onClick={() => {
          navigate('/minha-conta/pedidos');
        }}
      >
        <FaCheck /> Ir para meus pedidos
      </button>
    </div>
  );
};

export default function OrderSuccessPage() {
  return (
    <div>
      <Header />

      <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
        <div className="page-container">

          <div className="bg-white rounded-lg shadow-sm mb-6">
            <CheckoutStepper activeStep={6} />
          </div>

          <Step6_Success />

        </div>
      </div>

      <Footer />
    </div>
  );
}
