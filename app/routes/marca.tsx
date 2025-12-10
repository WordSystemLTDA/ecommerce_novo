import MarcaPage from "~/features/marca/MarcaPage";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Marcas" },
        { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
    ];
}

export default function Marcas() {
    return <MarcaPage />;
}
