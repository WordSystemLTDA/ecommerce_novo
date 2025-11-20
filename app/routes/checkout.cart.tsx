import type { Route } from "./+types/home";
import CartPage from "~/features/carrinho/CartPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Carrinho de Compras - Word System" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function CheckoutCart() {
  return <CartPage />;
}
