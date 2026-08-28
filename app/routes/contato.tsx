import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { InstitutionalPage, InformationSection } from "~/components/InstitutionalPage";
import config from "~/config/config";

export function meta() {
    const name = config.FOOTER_CONFIG.nomeExibicao;
    return [
        { title: `Contato | ${name}` },
        { name: "description", content: `Fale com a equipe da ${name} por WhatsApp, telefone ou e-mail.` },
        ...(config.SITE_URL ? [{ tagName: "link" as const, rel: "canonical", href: `${config.SITE_URL}/contato` }] : []),
    ];
}

export default function Contato() {
    const company = config.FOOTER_CONFIG;
    const message = encodeURIComponent(`Olá! Vim pelo site da ${company.nomeExibicao} e preciso de atendimento.`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.enderecoCompleto)}`;
    const actions = [
        { label: "Chamar no WhatsApp", href: `${config.WHATSAPP_URL}?text=${message}`, icon: FaWhatsapp, external: true },
        { label: company.telefone, href: `tel:+${company.whatsapp}`, icon: FaPhoneAlt },
        { label: company.email, href: `mailto:${company.email}`, icon: FaEnvelope },
        { label: "Ver localização", href: mapsUrl, icon: FaMapMarkerAlt, external: true },
    ];

    return (
        <InstitutionalPage
            eyebrow="Atendimento"
            title="Fale com a nossa equipe"
            intro={`Atendimento habitual: ${company.atendimento}. Em mensagens enviadas fora desse período, responderemos no próximo horário de atendimento.`}
        >
            <InformationSection title="Canais oficiais">
                <div className="grid gap-3 sm:grid-cols-2">
                    {actions.map(({ label, href, icon: Icon, external }) => (
                        <a key={href} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="flex min-h-14 items-center gap-3 border border-primary/12 px-4 font-medium text-primary transition-colors hover:border-terciary hover:text-terciary">
                            <Icon className="shrink-0" aria-hidden />
                            <span className="overflow-wrap-anywhere">{label}</span>
                        </a>
                    ))}
                </div>
            </InformationSection>
            <InformationSection title="Loja física">
                <p>{company.enderecoCompleto}</p>
                <p>{company.lojaFisica}</p>
            </InformationSection>
        </InstitutionalPage>
    );
}
