import { Navigate } from "react-router";
import config from "~/config/config";

export function meta() {
    return [
        { title: `Favoritos | ${config.FOOTER_CONFIG.nomeExibicao}` },
        { name: "description", content: "Consulte os produtos que você salvou para ver depois." },
        { name: "robots", content: "noindex, follow" },
    ];
}

export default function FavoritosPage() {
    return <Navigate to="/minha-conta/favoritos" replace />;
}
