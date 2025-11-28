

import type { Route } from "./+types/home";
import NovoEnderecoPage from "~/features/minhaconta/NovoEnderecoPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastrar Novo Endereço - Word System" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function EditarEndereco() {
  return <NovoEnderecoPage />;
}
