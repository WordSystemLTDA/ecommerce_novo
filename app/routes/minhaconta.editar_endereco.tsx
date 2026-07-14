

import type { Route } from "./+types/home";
import NovoEnderecoPage from "~/features/minhaconta/NovoEnderecoPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Editar Endereço - Word System" },
    { name: "description", content: "Atualize seu endereço de entrega." },
  ];
}

export default function EditarEndereco() {
  return <NovoEnderecoPage />;
}
