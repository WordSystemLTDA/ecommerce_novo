import { HomePage } from "~/features/home/HomePage";
import type { Route } from "./+types/home";
import RegisterPage from "~/features/auth/RegisterPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Registrar Conta" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function Registrar() {
  return <RegisterPage />;
}
