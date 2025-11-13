import { HomePage } from "~/features/home/HomePage";
import type { Route } from "./+types/home";
import LoginPage from "~/features/auth/LoginPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Entre ou Cadastre-se" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function Login() {
  return <LoginPage />;
}
