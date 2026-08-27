import apiClient from '~/services/api';
import type {
  MercadoPagoConfigResponse,
  MercadoPagoMethod,
  MercadoPagoOrderRequest,
  MercadoPagoOrderResult,
  MercadoPagoPaymentStatus,
} from './types';

const paymentStoragePrefix = 'mercado_pago_order_';
const idempotencyStoragePrefix = 'mercado_pago_idempotency_';
const pixRenewalIdempotencyStoragePrefix =
  'mercado_pago_pix_renewal_idempotency_';
const securityScriptId = 'mercado-pago-security';
let publicConfigPromise: Promise<MercadoPagoConfigResponse> | null = null;
let deviceSessionPromise: Promise<string | null> | null = null;

declare global {
  interface Window {
    MP_DEVICE_SESSION_ID?: string;
  }
}

function readDeviceSessionId() {
  if (typeof window === 'undefined') {
    return null;
  }

  const deviceId = window.MP_DEVICE_SESSION_ID?.trim();
  return deviceId || null;
}

async function getDeviceSessionId(): Promise<string | null> {
  if (typeof document === 'undefined') {
    return null;
  }

  const availableDeviceId = readDeviceSessionId();
  if (availableDeviceId) {
    return availableDeviceId;
  }

  deviceSessionPromise ??= (async () => {
    if (!document.getElementById(securityScriptId)) {
      const script = document.createElement('script');
      script.id = securityScriptId;
      script.src = 'https://www.mercadopago.com/v2/security.js';
      script.async = true;
      script.setAttribute('view', 'checkout');
      script.setAttribute('output', 'MP_DEVICE_SESSION_ID');
      document.head.appendChild(script);
    }

    for (let attempt = 0; attempt < 100; attempt += 1) {
      const deviceId = readDeviceSessionId();
      if (deviceId) {
        return deviceId;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 100));
    }

    return null;
  })();

  const deviceId = await deviceSessionPromise;
  if (!deviceId) {
    deviceSessionPromise = null;
  }

  return deviceId;
}

async function getDeviceSessionIdWithTimeout(timeoutMs = 3000) {
  if (typeof window === 'undefined') {
    return getDeviceSessionId();
  }

  let timeoutId: number | undefined;

  try {
    return await Promise.race([
      getDeviceSessionId(),
      new Promise<null>((resolve) => {
        timeoutId = window.setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
}

function unwrapApiResponse<T>(payload: unknown): T {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}

function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const payload = error as {
      error?: unknown;
      originalError?: unknown;
    };
    if (typeof payload.originalError === 'string') {
      return payload.originalError;
    }
    if (typeof payload.error === 'object' && payload.error !== null) {
      const apiError = payload.error as { error?: unknown };
      if (typeof apiError.error === 'string') {
        return apiError.error;
      }
    }
  }

  return 'Nao foi possivel processar o pagamento.';
}

async function apiRequest<T>(request: Promise<{ data: unknown }>): Promise<T> {
  try {
    const response = await request;
    return unwrapApiResponse<T>(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

function createUuid() {
  const cryptoSource = typeof globalThis !== 'undefined'
    ? globalThis.crypto
    : undefined;
  if (cryptoSource?.randomUUID) {
    return cryptoSource.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (value) => {
    const randomValue = Math.floor(Math.random() * 16);
    const digit = value === 'x'
      ? randomValue
      : (randomValue & 0x3) | 0x8;
    return digit.toString(16);
  });
}

function canUseSessionStorage() {
  return typeof sessionStorage !== 'undefined';
}

function getIdempotencyStorageKey(
  saleId: number,
  method: MercadoPagoMethod,
) {
  return `${idempotencyStoragePrefix}${saleId}_${method}`;
}

function getPixRenewalIdempotencyStorageKey(saleId: number) {
  return `${pixRenewalIdempotencyStoragePrefix}${saleId}`;
}

function getOrCreatePixRenewalIdempotencyKey(saleId: number) {
  if (!canUseSessionStorage()) {
    return createUuid();
  }

  const storageKey = getPixRenewalIdempotencyStorageKey(saleId);
  const storedKey = sessionStorage.getItem(storageKey);
  if (storedKey) {
    return storedKey;
  }

  const newKey = createUuid();
  sessionStorage.setItem(storageKey, newKey);
  return newKey;
}

const failureStatuses: MercadoPagoPaymentStatus[] = [
  'rejected',
  'canceled',
  'expired',
  'refunded',
  'charged_back',
];

const finalStatuses: MercadoPagoPaymentStatus[] = [
  'approved',
  'partially_refunded',
  ...failureStatuses,
];

export const mercadoPagoStatus = {
  isApproved: (status: MercadoPagoPaymentStatus) =>
    status === 'approved' || status === 'partially_refunded',

  isFailure: (status: MercadoPagoPaymentStatus) =>
    failureStatuses.includes(status),

  isFinal: (status: MercadoPagoPaymentStatus) =>
    finalStatuses.includes(status),

  toVisualStatus: (status: MercadoPagoPaymentStatus) => {
    if (mercadoPagoStatus.isApproved(status)) {
      return 'aprovado' as const;
    }
    if (mercadoPagoStatus.isFailure(status)) {
      return 'recusado' as const;
    }

    return 'pendente' as const;
  },
};

export const mercadoPagoService = {
  getDeviceSessionId: (timeoutMs = 3000) =>
    getDeviceSessionIdWithTimeout(timeoutMs),

  requireDeviceSessionId: async () => {
    const deviceId = await getDeviceSessionIdWithTimeout(5000);
    if (!deviceId) {
      throw new Error(
        'Nao foi possivel validar este dispositivo para gerar o PIX. ' +
          'Recarregue a pagina e desative bloqueadores de conteudo.',
      );
    }

    return deviceId;
  },

  createIdempotencyKey: () => createUuid(),

  getPublicConfig: async () => {
    void getDeviceSessionId();
    publicConfigPromise ??= apiRequest<MercadoPagoConfigResponse>(
      apiClient.get('/pagamentos/mercadopago/config'),
    );

    try {
      return await publicConfigPromise;
    } catch (error) {
      publicConfigPromise = null;
      throw error;
    }
  },

  createOrder: async (request: MercadoPagoOrderRequest) => {
    const deviceId = await getDeviceSessionIdWithTimeout();

    return apiRequest<MercadoPagoOrderResult>(
      apiClient.post(
        '/pagamentos/mercadopago/orders',
        {
          saleId: request.saleId,
          payment: request.payment,
          ...(deviceId ? { deviceId } : {}),
        },
        {
          headers: {
            'X-Idempotency-Key': request.idempotencyKey,
          },
        },
      ),
    );
  },

  getOrRenewPix: async (saleId: number) => {
    const deviceId = await getDeviceSessionIdWithTimeout();
    const idempotencyKey = getOrCreatePixRenewalIdempotencyKey(saleId);

    const order = await apiRequest<MercadoPagoOrderResult>(
      apiClient.post(
        `/pagamentos/mercadopago/vendas/${encodeURIComponent(saleId)}/pix`,
        deviceId ? { deviceId } : {},
        {
          headers: {
            'X-Idempotency-Key': idempotencyKey,
          },
        },
      ),
    );

    if (canUseSessionStorage()) {
      sessionStorage.removeItem(
        getPixRenewalIdempotencyStorageKey(saleId),
      );
    }

    return order;
  },

  getOrder: async (orderId: string) =>
    apiRequest<MercadoPagoOrderResult>(
      apiClient.get(
        `/pagamentos/mercadopago/orders/${encodeURIComponent(orderId)}`,
      ),
    ),

  getOrCreateIdempotencyKey: (
    saleId: number,
    method: MercadoPagoMethod,
  ) => {
    if (!canUseSessionStorage()) {
      return createUuid();
    }

    const storageKey = getIdempotencyStorageKey(saleId, method);
    const storedKey = sessionStorage.getItem(storageKey);
    if (storedKey) {
      return storedKey;
    }

    const newKey = createUuid();
    sessionStorage.setItem(storageKey, newKey);
    return newKey;
  },

  clearIdempotencyKey: (
    saleId: number,
    method: MercadoPagoMethod,
  ) => {
    if (!canUseSessionStorage()) {
      return;
    }

    sessionStorage.removeItem(getIdempotencyStorageKey(saleId, method));
  },

  storeOrder: (order: MercadoPagoOrderResult) => {
    if (!canUseSessionStorage()) {
      return;
    }

    sessionStorage.setItem(
      `${paymentStoragePrefix}${order.saleId}`,
      JSON.stringify(order),
    );
  },

  getStoredOrder: (saleId: number): MercadoPagoOrderResult | null => {
    if (!canUseSessionStorage()) {
      return null;
    }

    const storedOrder = sessionStorage.getItem(
      `${paymentStoragePrefix}${saleId}`,
    );
    if (!storedOrder) {
      return null;
    }

    try {
      return JSON.parse(storedOrder) as MercadoPagoOrderResult;
    } catch {
      sessionStorage.removeItem(`${paymentStoragePrefix}${saleId}`);
      return null;
    }
  },
};
