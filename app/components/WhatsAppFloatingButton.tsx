import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router";
import config from "~/config/config";

export function WhatsAppFloatingButton() {
    const location = useLocation();
    if (location.pathname.startsWith("/carrinho") || location.pathname.startsWith("/pedido/")) return null;

    const company = config.FOOTER_CONFIG;
    const message = encodeURIComponent(`Olá! Vim pelo site da ${company.nomeExibicao} e preciso de atendimento.`);
    const isProductPage = location.pathname.startsWith("/produto/");

    return (
        <a
            href={`${config.WHATSAPP_URL}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Falar com a ${company.nomeExibicao} pelo WhatsApp`}
            title="Atendimento pelo WhatsApp"
            className={`fixed right-4 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(0,0,0,0.24)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30 sm:right-6 sm:h-14 sm:w-14 ${isProductPage ? "bottom-20 sm:bottom-6" : "bottom-5 sm:bottom-6"}`}
        >
            <FaWhatsapp size={25} aria-hidden />
        </a>
    );
}
