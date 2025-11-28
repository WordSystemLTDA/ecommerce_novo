

import { Outlet } from "react-router";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Minha Conta - Word System" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function EnderecoLayout() {
  return (
    <div>
       <Outlet />
    </div>
  );
}
