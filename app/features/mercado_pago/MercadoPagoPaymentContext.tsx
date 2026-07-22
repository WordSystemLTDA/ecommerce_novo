import { createContext, useContext, type ReactNode } from 'react';
import type { MercadoPagoCardData } from './types';

interface MercadoPagoPaymentContextValue {
  processing: boolean;
  processCardPayment: (payment: MercadoPagoCardData) => Promise<void>;
}

const MercadoPagoPaymentContext =
  createContext<MercadoPagoPaymentContextValue | null>(null);

export function MercadoPagoPaymentProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: MercadoPagoPaymentContextValue;
}) {
  return (
    <MercadoPagoPaymentContext.Provider value={value}>
      {children}
    </MercadoPagoPaymentContext.Provider>
  );
}

export function useMercadoPagoPayment() {
  const context = useContext(MercadoPagoPaymentContext);
  if (!context) {
    throw new Error(
      'useMercadoPagoPayment deve ser usado no checkout do Mercado Pago.',
    );
  }

  return context;
}
