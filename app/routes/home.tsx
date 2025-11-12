import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "E-commerce" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
