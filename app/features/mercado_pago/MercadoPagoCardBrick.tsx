import { loadMercadoPago } from '@mercadopago/sdk-js';
import { useEffect, useId, useRef, useState } from 'react';
import { FaLock } from 'react-icons/fa';
import Loader from '~/components/loader';
import { currencyFormatter } from '~/utils/formatters';
import { mercadoPagoService } from './mercado_pago_service';
import type {
  MercadoPagoCardData,
  MercadoPagoLinkedCard,
  MercadoPagoSavedCardsResponse,
} from './types';

interface BrickFormData {
  token?: string;
  issuer_id?: string;
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

interface MercadoPagoCardBrickProps {
  amount: number;
  email: string;
  installments?: number;
  maxInstallments?: number;
  onSubmit: (payment: MercadoPagoCardData) => Promise<void>;
  processing?: boolean;
}

interface MercadoPagoInstallmentCost {
  installments?: number;
  installment_amount?: number;
  total_amount?: number;
}

interface MercadoPagoInstallmentResponse {
  payer_costs?: MercadoPagoInstallmentCost[];
}

interface InstallmentDetail {
  installments: number;
  installmentAmount: number;
  totalAmount: number;
}

interface MercadoPagoInstance {
  getInstallments: (settings: {
    amount: string;
    bin: string;
    locale?: string;
    paymentTypeId?: 'credit_card';
  }) => Promise<MercadoPagoInstallmentResponse[]>;
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

const newCardOption = 'new';

export function MercadoPagoCardBrick(props: MercadoPagoCardBrickProps) {
  const linkedCardSelectId = useId();
  const [savedCards, setSavedCards] =
    useState<MercadoPagoSavedCardsResponse | null>(null);
  const [savedCardsLoading, setSavedCardsLoading] = useState(true);
  const [savedCardsError, setSavedCardsError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState(newCardOption);
  const [saveNewCard, setSaveNewCard] = useState(false);

  useEffect(() => {
    let disposed = false;

    async function loadSavedCards() {
      try {
        const response = await mercadoPagoService.getSavedCards();
        if (disposed) {
          return;
        }

        setSavedCards(response);
        const defaultCard = response.cards.find((card) => card.isDefault)
          ?? response.cards[0];
        setSelectedCard(
          defaultCard ? String(defaultCard.id) : newCardOption,
        );
        setSavedCardsError(null);
      } catch (loadError) {
        console.error('Falha ao carregar cartões vinculados.', loadError);
        if (!disposed) {
          setSavedCards({ customerId: null, cards: [] });
          setSelectedCard(newCardOption);
          setSavedCardsError(
            'Não foi possível carregar os cartões salvos. Use um novo cartão.',
          );
        }
      } finally {
        if (!disposed) {
          setSavedCardsLoading(false);
        }
      }
    }

    void loadSavedCards();

    return () => {
      disposed = true;
    };
  }, []);

  if (savedCardsLoading) {
    return (
      <section className="flex min-h-48 items-center justify-center rounded-lg border border-primary/20 bg-white">
        <Loader />
      </section>
    );
  }

  const linkedCard = savedCards?.cards.find(
    (card) => String(card.id) === selectedCard,
  );
  const usesLinkedCard = Boolean(linkedCard && savedCards?.customerId);

  return (
    <div className="space-y-4">
      {savedCardsError && (
        <p className="border-y border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {savedCardsError}
        </p>
      )}

      {savedCards && savedCards.cards.length > 0 && (
        <section className="border-y border-gray-200 bg-gray-50 px-4 py-4">
          <label
            htmlFor={linkedCardSelectId}
            className="mb-2 block text-sm font-bold text-gray-900"
          >
            Cartão para esta compra
          </label>
          <select
            id={linkedCardSelectId}
            value={selectedCard}
            onChange={(event) => {
              setSelectedCard(event.target.value);
              setSaveNewCard(false);
            }}
            className="h-11 w-full border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-primary"
          >
            {savedCards.cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.brand} final {card.lastFourDigits}
                {card.isDefault ? ' (padrão)' : ''}
              </option>
            ))}
            <option value={newCardOption}>Usar outro cartão</option>
          </select>
        </section>
      )}

      {!usesLinkedCard && (
        <label className="flex cursor-pointer items-start gap-3 border-y border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-800">
          <input
            type="checkbox"
            checked={saveNewCard}
            onChange={(event) => setSaveNewCard(event.target.checked)}
            className="mt-0.5 size-4 accent-primary"
          />
          <span>
            <strong className="block text-gray-900">
              Salvar este cartão para próximas compras
            </strong>
            O cartão ficará protegido pelo Mercado Pago. O código de segurança
            não será armazenado e será solicitado novamente.
          </span>
        </label>
      )}

      <MercadoPagoCardForm
        key={linkedCard ? `linked-${linkedCard.id}` : newCardOption}
        {...props}
        linkedCard={usesLinkedCard ? linkedCard : undefined}
        mercadoPagoCustomerId={
          usesLinkedCard ? savedCards?.customerId ?? undefined : undefined
        }
        saveNewCard={saveNewCard}
      />
    </div>
  );
}

function MercadoPagoCardForm({
  amount,
  email,
  installments,
  maxInstallments,
  onSubmit,
  processing = false,
  linkedCard,
  mercadoPagoCustomerId,
  saveNewCard,
}: MercadoPagoCardBrickProps & {
  linkedCard?: MercadoPagoLinkedCard;
  mercadoPagoCustomerId?: string;
  saveNewCard: boolean;
}) {
  const reactId = useId();
  const containerId = `mercado-pago-card-${reactId.replace(/:/g, '')}`;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [installmentDetails, setInstallmentDetails] = useState<
    InstallmentDetail[]
  >([]);
  const [installmentDetailsLoading, setInstallmentDetailsLoading] =
    useState(false);
  const [installmentDetailsError, setInstallmentDetailsError] = useState<
    string | null
  >(null);
  const saveNewCardRef = useRef(saveNewCard);

  useEffect(() => {
    saveNewCardRef.current = saveNewCard;
  }, [saveNewCard]);

  useEffect(() => {
    let disposed = false;
    let controller: BrickController | null = null;
    let detailsRequestId = 0;
    let currentBin = '';

    async function renderBrick() {
      try {
        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error('O valor do pedido é inválido.');
        }
        if (
          installments != null &&
          (!Number.isSafeInteger(installments) || installments < 1)
        ) {
          throw new Error('O parcelamento escolhido é inválido.');
        }
        if (
          maxInstallments != null &&
          (!Number.isSafeInteger(maxInstallments) || maxInstallments < 1)
        ) {
          throw new Error('O limite de parcelas é inválido.');
        }

        const configuration = await mercadoPagoService.getPublicConfig();
        if (!configuration.enabled || !configuration.publicKey) {
          throw new Error('O Mercado Pago ainda nao foi configurado.');
        }
        const installmentLimit = Math.min(
          configuration.maxInstallments,
          maxInstallments ?? configuration.maxInstallments,
        );
        if (installments != null && installments > installmentLimit) {
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

        async function updateInstallmentDetails(bin: string) {
          const normalizedBin = bin.trim();
          const requestId = ++detailsRequestId;

          if (normalizedBin.length < 8) {
            currentBin = '';
            setInstallmentDetails([]);
            setInstallmentDetailsLoading(false);
            setInstallmentDetailsError(null);
            return;
          }

          if (normalizedBin === currentBin) {
            return;
          }

          currentBin = normalizedBin;
          setInstallmentDetails([]);
          setInstallmentDetailsLoading(true);
          setInstallmentDetailsError(null);

          try {
            const response = await mercadoPago.getInstallments({
              amount: amount.toFixed(2),
              bin: normalizedBin,
              locale: 'pt-BR',
              paymentTypeId: 'credit_card',
            });
            const payerCosts = response[0]?.payer_costs ?? [];
            const details = payerCosts
              .filter((cost) => {
                const installmentCount = Number(cost.installments);
                return (
                  Number.isSafeInteger(installmentCount) &&
                  installmentCount >= 1 &&
                  installmentCount <= installmentLimit &&
                  (installments == null || installmentCount === installments) &&
                  Number.isFinite(Number(cost.installment_amount)) &&
                  Number(cost.installment_amount) > 0 &&
                  Number.isFinite(Number(cost.total_amount)) &&
                  Number(cost.total_amount) > 0
                );
              })
              .map((cost) => ({
                installments: Number(cost.installments),
                installmentAmount: Number(cost.installment_amount),
                totalAmount: Number(cost.total_amount),
              }))
              .sort((first, second) =>
                first.installments - second.installments,
              );

            if (disposed || requestId !== detailsRequestId) {
              return;
            }

            setInstallmentDetails(details);
            setInstallmentDetailsError(
              details.length === 0
                ? 'O Mercado Pago não retornou o detalhamento para este cartão.'
                : null,
            );
          } catch (detailsError) {
            console.error(
              'Falha ao consultar os valores do parcelamento.',
              detailsError,
            );
            if (!disposed && requestId === detailsRequestId) {
              setInstallmentDetails([]);
              setInstallmentDetailsError(
                'Não foi possível detalhar os juros deste cartão agora.',
              );
            }
          } finally {
            if (!disposed && requestId === detailsRequestId) {
              setInstallmentDetailsLoading(false);
            }
          }
        }

        const bricksBuilder = mercadoPago.bricks();
        controller = await bricksBuilder.create(
          'cardPayment',
          containerId,
          {
            initialization: {
              amount,
              payer: {
                email,
                ...(linkedCard && mercadoPagoCustomerId
                  ? {
                      customer_id: mercadoPagoCustomerId,
                      card_ids: [linkedCard.mercadoPagoCardId],
                    }
                  : {}),
              },
            },
            customization: {
              paymentMethods: {
                ...(installments != null
                  ? {
                      minInstallments: installments,
                      maxInstallments: installments,
                    }
                  : { maxInstallments: installmentLimit }),
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
              onBinChange: (bin?: string) => {
                void updateInstallmentDetails(bin ?? '');
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
                  brickInstallments < 1 ||
                  brickInstallments > installmentLimit ||
                  (installments != null && brickInstallments !== installments)
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
                    installments: brickInstallments,
                    ...(formData.issuer_id
                      ? { issuerId: formData.issuer_id }
                      : {}),
                    ...(linkedCard
                      ? { linkedCardId: linkedCard.id }
                      : { saveCard: saveNewCardRef.current }),
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
  }, [
    amount,
    containerId,
    email,
    installments,
    linkedCard?.id,
    linkedCard?.mercadoPagoCardId,
    maxInstallments,
    mercadoPagoCustomerId,
    onSubmit,
  ]);

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
          {linkedCard ? 'Confirme o cartão' : 'Dados do cartão'}
        </h2>
        <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
          <FaLock className="text-primary" />
          Os dados são criptografados diretamente pelo Mercado Pago.
        </p>
        <p className="mt-3 rounded-md bg-primary/5 px-3 py-2 text-sm text-gray-700">
          {linkedCard ? (
            <>
              {linkedCard.brand} final {linkedCard.lastFourDigits} selecionado.
              Informe o código de segurança para confirmar a compra.
            </>
          ) : (
            <>
              {installments != null
                ? `Parcelamento selecionado: ${installments}x.`
                : 'As parcelas disponíveis serão exibidas após a identificação do cartão.'}
              {' '}O Mercado Pago informará o valor final, incluindo juros quando
              houver.
            </>
          )}
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
      {(installmentDetailsLoading ||
        installmentDetails.length > 0 ||
        installmentDetailsError) && (
        <div className="mt-5 border-y border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Detalhamento do parcelamento
              </h3>
              <p className="text-xs text-gray-600">
                Valores calculados pelo Mercado Pago para o cartão informado.
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Valor original:{' '}
              <strong className="text-gray-900">
                {currencyFormatter.format(amount)}
              </strong>
            </p>
          </div>

          {installmentDetailsLoading && (
            <p className="border-t border-gray-200 px-3 py-3 text-sm text-gray-600">
              Calculando valores e juros...
            </p>
          )}

          {!installmentDetailsLoading && installmentDetailsError && (
            <p className="border-t border-gray-200 px-3 py-3 text-sm text-amber-700">
              {installmentDetailsError}
            </p>
          )}

          {!installmentDetailsLoading && installmentDetails.length > 0 && (
            <div className="divide-y divide-gray-200 border-t border-gray-200">
              {installmentDetails.map((detail) => {
                const totalInterest = Math.max(
                  0,
                  Math.round((detail.totalAmount - amount) * 100) / 100,
                );
                const interestPerInstallment =
                  Math.round(
                    (totalInterest / detail.installments) * 100,
                  ) / 100;

                return (
                  <div
                    key={detail.installments}
                    className="grid gap-2 px-3 py-3 text-sm sm:grid-cols-[minmax(9rem,1.25fr)_repeat(3,minmax(7rem,1fr))] sm:items-center"
                  >
                    <p className="font-bold text-gray-900">
                      {detail.installments}x de{' '}
                      {currencyFormatter.format(detail.installmentAmount)}
                    </p>
                    <p className="text-gray-700">
                      <span className="mr-1 text-xs text-gray-500 sm:block">
                        Total
                      </span>
                      {currencyFormatter.format(detail.totalAmount)}
                    </p>
                    <p className="text-gray-700">
                      <span className="mr-1 text-xs text-gray-500 sm:block">
                        Juros totais
                      </span>
                      {totalInterest > 0
                        ? currencyFormatter.format(totalInterest)
                        : 'Sem juros'}
                    </p>
                    <p className="text-gray-700">
                      <span className="mr-1 text-xs text-gray-500 sm:block">
                        Juros por parcela
                      </span>
                      {totalInterest > 0
                        ? currencyFormatter.format(interestPerInstallment)
                        : 'R$ 0,00'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
