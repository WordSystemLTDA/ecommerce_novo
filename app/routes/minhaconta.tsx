

import { useAuth } from "~/features/auth/context/AuthContext";
import type { Route } from "./+types/home";
import Header from "~/components/header";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Minha Conta - Word System" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function MinhaConta() {
  let { cliente } = useAuth();

  if (cliente == null) {
    return (
      <div>
        <p>Você precisa logar</p>
      </div>
    );
  }

  return (
    <div>
      <p>MINHA CONTA {cliente.nome} {cliente.email}</p>
    </div>
  );
}
