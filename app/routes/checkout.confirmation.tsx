
import type { Route } from "./+types/home";
import ConfirmationPage from "~/features/carrinho/ConfirmationPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Carrinho de Compras - Word System" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function CheckoutConfirmation() {
  return <ConfirmationPage />;
}
