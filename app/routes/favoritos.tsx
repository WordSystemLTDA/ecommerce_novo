import Footer from "~/components/footer";
import Header from "~/components/header";
import config from "~/config/config";
import FavoritosContent from "./minhaconta.favoritos";

export function meta() {
    return [
        { title: `Favoritos | ${config.FOOTER_CONFIG.nomeExibicao}` },
        { name: "description", content: "Consulte os produtos que você salvou para ver depois." },
        { name: "robots", content: "noindex, follow" },
    ];
}

export default function FavoritosPage() {
    return (
        <div className="min-h-screen bg-main-bg text-primary">
            <Header />
            <main className="page-container py-8 sm:py-12">
                <FavoritosContent />
            </main>
            <Footer />
        </div>
    );
}
