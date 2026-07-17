import type { TipoDeEntrega } from '~/types/TipoDeEntrega';

export const getDeliveryPrice = (delivery?: TipoDeEntrega) => {
  const rawPrice = delivery?.custom_price ?? delivery?.price ?? '0';
  const price = Number.parseFloat(String(rawPrice));

  return Number.isFinite(price) ? price : 0;
};

export const getDeliveryTime = (delivery?: TipoDeEntrega) => {
  const rawTime = delivery?.custom_delivery_time ?? delivery?.delivery_time ?? 0;
  const deliveryTime = Number.parseInt(String(rawTime), 10);

  return Number.isFinite(deliveryTime) ? deliveryTime : 0;
};
