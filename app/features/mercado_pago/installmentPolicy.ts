interface InstallmentPolicySource {
  maxInstallments?: unknown;
  max_parcelas?: unknown;
  interestFreeBaseAmount?: unknown;
  valor_base_sem_juros?: unknown;
  firstInterestFreeRangeMaxAmount?: unknown;
  valor_limite_primeira_faixa_sem_juros?: unknown;
  interestFreeInstallmentsBelowBase?: unknown;
  firstInterestFreeRangeInstallments?: unknown;
  parcelas_sem_juros_abaixo_valor_base?: unknown;
  intermediateInterestFreeInstallments?: unknown;
  parcelas_sem_juros_faixa_intermediaria?: unknown;
}

const DEFAULT_MAX_INSTALLMENTS = 12;
const DEFAULT_INTEREST_FREE_BASE_AMOUNT = 1000;
const DEFAULT_FIRST_INTEREST_FREE_RANGE_MAX_AMOUNT = 500;
const DEFAULT_INTEREST_FREE_INSTALLMENTS_BELOW_BASE = 3;
const DEFAULT_INTERMEDIATE_INTEREST_FREE_INSTALLMENTS = 10;

function positiveInteger(value: unknown) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function positiveAmount(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function resolveInstallmentPolicy(
  total: number,
  ...sources: Array<InstallmentPolicySource | null | undefined>
) {
  const maxInstallmentLimits = sources.flatMap((source) => {
    if (!source) return [];

    return [source.max_parcelas, source.maxInstallments]
      .map(positiveInteger)
      .filter((value): value is number => value != null);
  });
  const maxInstallments = Math.min(
    36,
    ...(maxInstallmentLimits.length > 0
      ? maxInstallmentLimits
      : [DEFAULT_MAX_INSTALLMENTS]),
  );

  const interestFreeBaseAmount = sources
    .flatMap((source) => source
      ? [source.valor_base_sem_juros, source.interestFreeBaseAmount]
      : [])
    .map(positiveAmount)
    .find((value): value is number => value != null)
    ?? DEFAULT_INTEREST_FREE_BASE_AMOUNT;

  const configuredFirstRangeMaxAmount = sources
    .flatMap((source) => source
      ? [
          source.valor_limite_primeira_faixa_sem_juros,
          source.firstInterestFreeRangeMaxAmount,
        ]
      : [])
    .map(positiveAmount)
    .find((value): value is number => value != null)
    ?? DEFAULT_FIRST_INTEREST_FREE_RANGE_MAX_AMOUNT;
  const firstInterestFreeRangeMaxAmount = configuredFirstRangeMaxAmount <
    interestFreeBaseAmount
    ? configuredFirstRangeMaxAmount
    : Math.max(0.01, interestFreeBaseAmount / 2);

  const installmentsBelowBase = sources
    .flatMap((source) => source
      ? [
          source.parcelas_sem_juros_abaixo_valor_base,
          source.firstInterestFreeRangeInstallments,
          source.interestFreeInstallmentsBelowBase,
        ]
      : [])
    .map(positiveInteger)
    .find((value): value is number => value != null)
    ?? DEFAULT_INTEREST_FREE_INSTALLMENTS_BELOW_BASE;
  const interestFreeInstallmentsBelowBase = Math.min(
    maxInstallments,
    installmentsBelowBase,
  );

  const configuredIntermediateInstallments = sources
    .flatMap((source) => source
      ? [
          source.parcelas_sem_juros_faixa_intermediaria,
          source.intermediateInterestFreeInstallments,
        ]
      : [])
    .map(positiveInteger)
    .find((value): value is number => value != null)
    ?? DEFAULT_INTERMEDIATE_INTEREST_FREE_INSTALLMENTS;
  const intermediateInterestFreeInstallments = Math.min(
    maxInstallments,
    Math.max(
      interestFreeInstallmentsBelowBase,
      configuredIntermediateInstallments,
    ),
  );

  let interestFreeInstallments = maxInstallments;
  if (total <= firstInterestFreeRangeMaxAmount) {
    interestFreeInstallments = interestFreeInstallmentsBelowBase;
  } else if (total < interestFreeBaseAmount) {
    interestFreeInstallments = intermediateInterestFreeInstallments;
  }

  return {
    maxInstallments,
    interestFreeBaseAmount,
    firstInterestFreeRangeMaxAmount,
    interestFreeInstallments,
    interestFreeInstallmentsBelowBase,
    intermediateInterestFreeInstallments,
  };
}
