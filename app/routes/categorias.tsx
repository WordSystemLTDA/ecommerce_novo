import CategoryPage from "~/features/categoria/CategoriaPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Categorias" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function Categorias() {
  return <CategoryPage />;
}
