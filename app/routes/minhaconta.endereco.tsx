

import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Meus Endereços - Word System" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function Endereco() {
  return (
    <div>
      <p>Endereço</p>
    </div>
  )
}
