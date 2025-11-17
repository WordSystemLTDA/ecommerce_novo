
import OrderSuccessPage from "~/features/cart/OrderSuccess";
import type { Route } from "./+types/home";
import CheckoutLayout from "~/features/cart/CheckoutLayout";
import ConfirmationPage from "~/features/cart/ConfirmationPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Carrinho de Compras - Word System" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function CheckoutConfirmation() {
  return <ConfirmationPage />;
}
