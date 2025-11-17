
import PaymentPage from "~/features/cart/PaymentPage";
import type { Route } from "./+types/home";
import CheckoutLayout from "~/features/cart/CheckoutLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Carrinho de Compras - Word System" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function CheckoutPayment() {
  return <PaymentPage />;
}
