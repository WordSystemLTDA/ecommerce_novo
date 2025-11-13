import type { Route } from "./+types/home";
import ProductPage from "~/features/product/ProductPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Produto" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function Product() {
  return <ProductPage />;
}
