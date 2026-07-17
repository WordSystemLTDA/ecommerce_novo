import type { Route } from "./+types/order.pending";
import OrderSuccessPage from "~/features/carrinho/OrderSuccess";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Pagamento pendente" },
    { name: "description", content: "Status do pagamento do pedido" },
  ];
}

export default function OrderPending() {
  return <OrderSuccessPage />;
}
