import type { Route } from "./+types/order.failure";
import OrderSuccessPage from "~/features/carrinho/OrderSuccess";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Pagamento nao aprovado" },
    { name: "description", content: "Status do pagamento do pedido" },
  ];
}

export default function OrderFailure() {
  return <OrderSuccessPage />;
}
