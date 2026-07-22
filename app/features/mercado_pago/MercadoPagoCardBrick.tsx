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
  onSubmit,
}: {
  amount: number;
  email: string;
  onSubmit: (payment: MercadoPagoCardData) => Promise<void>;
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
        const configuration = await mercadoPagoService.getPublicConfig();
        if (!configuration.enabled || !configuration.publicKey) {
          throw new Error('O Mercado Pago ainda nao foi configurado.');
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
                minInstallments: 1,
                maxInstallments: configuration.maxInstallments,
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
                  setReady(true);
                }
              },
              onSubmit: async (
                formData: BrickFormData,
                additionalData: { paymentTypeId?: string },
              ) => {
                const installments = Number(formData.installments);

                if (
                  !formData.token ||
                  !formData.payment_method_id ||
                  additionalData.paymentTypeId !== 'credit_card' ||
                  !Number.isSafeInteger(installments)
                ) {
                  throw new Error('Confira os dados informados no cartao.');
                }

                await onSubmit({
                  method: 'credit_card',
                  token: formData.token,
                  paymentMethodId: formData.payment_method_id,
                  installments,
                });
              },
              onError: (brickError: unknown) => {
                console.error('Erro no Card Payment Brick.', brickError);
                if (!disposed) {
                  setError(
                    'Nao foi possivel carregar o formulario do cartao.',
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
              : 'Nao foi possivel carregar o Mercado Pago.',
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
  }, [amount, containerId, email, onSubmit]);

  return (
    <section className="rounded-lg border border-primary/20 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/70">
          Checkout transparente
        </p>
        <h2 className="text-lg font-bold text-gray-800">
          Dados do cartao
        </h2>
        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
          <FaLock className="text-primary" />
          Os dados sao criptografados diretamente pelo Mercado Pago.
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
