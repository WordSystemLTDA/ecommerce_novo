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
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center py-4 px-2 overflow-x-auto whitespace-nowrap">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === activeStep;
          const isCompleted = stepNumber < activeStep;

          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 
                    ${isActive ? 'border-primary bg-primary text-white' : ''}
                    ${isCompleted ? 'border-primary bg-white text-primary' : ''}
                    ${!isActive && !isCompleted ? 'border-gray-300 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? <FaCheck size={20} /> : <step.icon size={20} />}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium 
                    ${(isActive || isCompleted) ? 'text-primary' : 'text-gray-400'}
                  `}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-auto h-0.5 mx-2 ${(isCompleted || isActive) ? 'bg-primary' : 'bg-gray-300'}`}></div>
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

const Step6_Success = () => {
  const { id } = useParams();
  const { cliente } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = React.useState(true);
  const [venda, setVenda] = React.useState<any>(null);
  const [pixData, setPixData] = React.useState<any>(null);
  const [pagamentoStatus, setPagamentoStatus] = React.useState<string>('pendente');

  React.useEffect(() => {
    if (id) {
      loadOrder(Number(id));
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
    const status = venda?.pagamento_ecommerce?.status || venda?.pagamento?.status;
    if (status === 'approved') {
      setPagamentoStatus('aprovado');
    } else if (status === 'rejected') {
      setPagamentoStatus('recusado');
    } else if (status) {
      setPagamentoStatus('pendente');
    }
  }, [venda]);

  const [checkingPayment, setCheckingPayment] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    // Só verificar se tivermos pixData E o status não for aprovado E for pagamento PIX
    if (pixData && pagamentoStatus !== 'aprovado' && venda?.pagamento?.tipo === 'PIX') {
      interval = setInterval(() => checkPixStatus(), 5000);
    }
    return () => clearInterval(interval);
  }, [pixData, pagamentoStatus, venda]);


  const checkPixStatus = async (manual = false) => {
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

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader /></div>;
  }

  if (!venda) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
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

  const isPix = venda.pagamento && venda.pagamento.tipo === 'PIX';
  const isMercadoPago = venda.pagamento?.tipo === 'MERCADO_PAGO' || venda.pagamento_ecommerce?.gateway === 'mercado_pago';
  const showPix = isPix && venda.pagamento.pix_dinamico === 'Sim';
  const routeState = location.pathname.includes('/falha')
    ? 'falha'
    : location.pathname.includes('/pendente')
      ? 'pendente'
      : 'sucesso';
  const entrega = venda.entrega;
  const trackingCode = entrega?.codigo_rastreio || entrega?.melhor_envio_order_id;

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <FaCheckCircle className="text-(--dynamic-success) text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-(--dynamic-success-strong)">PEDIDO REALIZADO COM SUCESSO!</h1>
        {isPix ? (
          pagamentoStatus === 'aprovado' ? (
            <div className="mt-4 bg-(--dynamic-success-bg) text-(--dynamic-success-strong) p-4 rounded text-lg font-bold">
              PAGAMENTO CONFIRMADO!
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

      <div className="flex flex-col md:flex-row gap-8">
        {showPix && pagamentoStatus !== 'aprovado' && pixData && (
          <div className="flex-1 flex flex-col items-center">
            <div className="w-64 h-64 border-4 border-gray-300 rounded-lg mx-auto flex items-center justify-center bg-white overflow-hidden">
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
              className="mt-4 w-64 bg-primary text-white font-bold py-3 rounded-md hover:bg-terciary transition-colors flex items-center justify-center gap-2"
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
              className="mt-4 w-64 bg-(--dynamic-success) text-white font-bold py-3 rounded-md hover:bg-(--dynamic-success-strong) transition-colors flex items-center justify-center gap-2"
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

        {showPix && (
          <div className="flex-1">
            <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-md flex items-start gap-3 mb-6">
              <FaExclamationCircle className="text-2xl mt-1" />
              <div>
                <p className="font-bold">Aproveite! Este código tem validade de {(() => {
                  const minutes = venda.pagamento.tempo_cancel || 30;
                  if (minutes < 60) return `${minutes} minutos`;
                  const hours = Math.floor(minutes / 60);
                  const remainingMinutes = minutes % 60;
                  if (remainingMinutes === 0) return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
                  return `${hours} ${hours === 1 ? 'hora' : 'horas'} e ${remainingMinutes} ${remainingMinutes === 1 ? 'minuto' : 'minutos'}`;
                })()}.</p>
                <p className="text-sm">Ao realizar o pagamento você será informado por e-mail.</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-sm text-gray-600">O número do seu pedido é:</p>
              <p className="text-5xl font-bold text-gray-800 tracking-wider">{venda.id}</p>
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

        {!isPix && (
          <div className="flex-1 text-center">
            <p className="text-lg mb-4">Seu pedido foi recebido e está sendo processado.</p>
            <div className="text-center mb-8">
              <p className="text-sm text-gray-600">O número do seu pedido é:</p>
              <p className="text-5xl font-bold text-gray-800 tracking-wider">{venda.id}</p>
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

      <div className="bg-gray-100 min-h-screen py-8">
        <div className="max-w-387 mx-auto px-4">

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
