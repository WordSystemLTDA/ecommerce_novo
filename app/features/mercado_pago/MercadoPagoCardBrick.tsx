import { loadMercadoPago } from '@mercadopago/sdk-js';
import { useEffect, useId, useState } from 'react';
import { FaLock } from 'react-icons/fa';
import Loader from '~/components/loader';
import { mercadoPagoService } from './mercado_pago_service';
import type { MercadoPagoCardData } from './types';

interface BrickFormData {
  token?: string;
  payment_method_id?: string;
  installments?: number | string;
  payer?: {
    email?: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
}

interface BrickController {
  unmount: () => void | Promise<void>;
}

interface MercadoPagoInstance {
  bricks: () => {
    create: (
      type: 'cardPayment',
      containerId: string,
      settings: Record<string, unknown>,
    ) => Promise<BrickController>;
  };
}

declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: { locale: string },
    ) => MercadoPagoInstance;
  }
}

export function MercadoPagoCardBrick({
  amount,
  email,
  installments,
  onSubmit,
  processing = false,
}: {
  amount: number;
  email: string;
  installments: number;
  onSubmit: (payment: MercadoPagoCardData) => Promise<void>;
  processing?: boolean;
}) {
  const reactId = useId();
  const containerId = `mercado-pago-card-${reactId.replace(/:/g, '')}`;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let controller: BrickController | null = null;

    async function renderBrick() {
      try {
        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error('O valor do pedido é inválido.');
        }
        if (!Number.isSafeInteger(installments) || installments < 1) {
          throw new Error('O parcelamento escolhido é inválido.');
        }

        const configuration = await mercadoPagoService.getPublicConfig();
        if (!configuration.enabled || !configuration.publicKey) {
          throw new Error('O Mercado Pago ainda nao foi configurado.');
        }
        if (installments > configuration.maxInstallments) {
          throw new Error(
            'O parcelamento escolhido excede o limite configurado.',
          );
        }

        await loadMercadoPago();
        if (disposed || !window.MercadoPago) {
          return;
        }

        const mercadoPago = new window.MercadoPago(configuration.publicKey, {
          locale: 'pt-BR',
        });
        const bricksBuilder = mercadoPago.bricks();
        controller = await bricksBuilder.create(
          'cardPayment',
          containerId,
          {
            initialization: {
              amount,
              payer: { email },
            },
            customization: {
              paymentMethods: {
                minInstallments: installments,
                maxInstallments: installments,
                types: {
                  excluded: ['debit_card', 'prepaid_card'],
                },
              },
              visual: {
                style: { theme: 'default' },
              },
            },
            callbacks: {
              onReady: () => {
                if (!disposed) {
                  setError(null);
                  setReady(true);
                }
              },
              onSubmit: async (
                formData: BrickFormData,
                additionalData?: { paymentTypeId?: string },
              ) => {
                const brickInstallments = Number(formData.installments);

                if (
                  !formData.token ||
                  !formData.payment_method_id ||
                  (additionalData?.paymentTypeId != null &&
                    additionalData.paymentTypeId !== 'credit_card') ||
                  !Number.isSafeInteger(brickInstallments) ||
                  brickInstallments !== installments
                ) {
                  throw new Error(
                    'Confira os dados do cartão e o parcelamento escolhido.',
                  );
                }

                try {
                  setError(null);
                  await onSubmit({
                    method: 'credit_card',
                    token: formData.token,
                    paymentMethodId: formData.payment_method_id,
                    installments,
                  });
                } catch (submitError) {
                  if (!disposed) {
                    setError(
                      submitError instanceof Error
                        ? submitError.message
                        : 'Não foi possível processar o cartão.',
                    );
                  }
                  throw submitError;
                }
              },
              onError: (brickError: unknown) => {
                console.error('Erro no Card Payment Brick.', brickError);
                if (!disposed) {
                  setError(
                    'Não foi possível carregar o formulário do cartão.',
                  );
                }
              },
            },
          },
        );
      } catch (brickError) {
        console.error('Falha ao iniciar o Mercado Pago.', brickError);
        if (!disposed) {
          setError(
            brickError instanceof Error
              ? brickError.message
              : 'Não foi possível carregar o Mercado Pago.',
          );
        }
      }
    }

    void renderBrick();

    return () => {
      disposed = true;
      if (controller) {
        void controller.unmount();
      }
    };
  }, [amount, containerId, email, installments, onSubmit]);

  return (
    <section
      className="relative min-w-0 overflow-hidden rounded-lg border border-primary/20 bg-white p-4 shadow-sm sm:p-6"
      aria-busy={processing}
    >
      {processing && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/90 px-6 text-center backdrop-blur-[1px]">
          <Loader />
          <p className="text-sm font-semibold text-gray-800">
            Processando o pagamento com segurança...
          </p>
        </div>
      )}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/70">
          Checkout transparente
        </p>
        <h2 className="text-lg font-bold text-gray-800">
          Dados do cartão
        </h2>
        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
          <FaLock className="text-primary" />
          Os dados são criptografados diretamente pelo Mercado Pago.
        </p>
        <p className="mt-3 rounded-md bg-primary/5 px-3 py-2 text-sm text-gray-700">
          Você escolheu{' '}
          <strong>
            {installments}x de {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(amount / installments)}
          </strong>
          .
        </p>
      </div>

      {!ready && !error && (
        <div className="flex min-h-40 items-center justify-center">
          <Loader />
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <div id={containerId} className={ready ? 'block' : 'min-h-1'} />
    </section>
  );
}
