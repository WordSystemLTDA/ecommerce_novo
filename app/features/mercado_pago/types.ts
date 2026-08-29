export type MercadoPagoMethod = 'pix' | 'credit_card';

export interface MercadoPagoConfigResponse {
  enabled: boolean;
  productionReady?: boolean;
  missing?: string[];
  publicKey: string | null;
  paymentMethodId: number | null;
  maxInstallments: number;
  interestFreeBaseAmount: number;
  interestFreeInstallmentsBelowBase: number;
  firstInterestFreeRangeMaxAmount: number;
  firstInterestFreeRangeInstallments: number;
  intermediateInterestFreeInstallments: number;
  pixExpirationMinutes: number;
  sandbox: boolean;
}

export interface MercadoPagoCardData {
  method: 'credit_card';
  token: string;
  paymentMethodId: string;
  installments: number;
  issuerId?: string;
  linkedCardId?: number;
  saveCard?: boolean;
}

export interface MercadoPagoLinkedCard {
  id: number;
  mercadoPagoCardId: string;
  paymentMethodId: string;
  brand: string;
  lastFourDigits: string;
  expirationMonth: number | null;
  expirationYear: number | null;
  securityCodeLength: number | null;
  isDefault: boolean;
}

export interface MercadoPagoSavedCardsResponse {
  customerId: string | null;
  cards: MercadoPagoLinkedCard[];
}

export interface MercadoPagoPixData {
  method: 'pix';
}

export type MercadoPagoPaymentData =
  | MercadoPagoCardData
  | MercadoPagoPixData;

export interface MercadoPagoOrderRequest {
  saleId: number;
  idempotencyKey: string;
  payment: MercadoPagoPaymentData;
}

export type MercadoPagoPaymentStatus =
  | 'approved'
  | 'pending'
  | 'created'
  | 'in_process'
  | 'processing'
  | 'action_required'
  | 'rejected'
  | 'canceled'
  | 'expired'
  | 'refunded'
  | 'partially_refunded'
  | 'charged_back'
  | 'unknown';

export interface MercadoPagoOrderResult {
  saleId: number;
  orderId: string;
  paymentId: string | null;
  method: MercadoPagoMethod;
  status: MercadoPagoPaymentStatus;
  statusDetail: string | null;
  statusRaw?: string | null;
  statusDetailRaw?: string | null;
  orderStatus?: string | null;
  orderStatusDetail?: string | null;
  transactionStatus?: string | null;
  transactionStatusDetail?: string | null;
  paymentStatus?: string | null;
  paymentStatusDetail?: string | null;
  amount: number;
  installments: number | null;
  pixExpirationMinutes?: number | null;
  expiresAt?: string | null;
  integrationFlow?: 'payments_pix_v1' | 'orders_card_v1';
  deviceSessionSent?: boolean;
  reused?: boolean;
  renewed?: boolean;
  qrCode: string | null;
  qrCodeBase64: string | null;
  ticketUrl: string | null;
  challengeUrl: string | null;
}

export interface MercadoPagoApiError {
  error: string;
  details?: unknown;
}
