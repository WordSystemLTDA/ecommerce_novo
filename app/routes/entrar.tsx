import type { Route } from "./+types/home";
import LoginPage from "~/features/auth/EntrarPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Entre ou Cadastre-se" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function Entrar() {
  return <LoginPage />;
}
