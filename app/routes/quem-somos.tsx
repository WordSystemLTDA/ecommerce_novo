import { InstitutionalPage, InformationSection } from "~/components/InstitutionalPage";
import config from "~/config/config";

export function meta() {
    const name = config.FOOTER_CONFIG.nomeExibicao;
    return [
        { title: `Quem somos | ${name}` },
        { name: "description", content: `Conheça a ${name}, nossos canais de atendimento e nossa loja física.` },
        ...(config.SITE_URL ? [{ tagName: "link" as const, rel: "canonical", href: `${config.SITE_URL}/quem-somos` }] : []),
    ];
}

export default function QuemSomos() {
    const company = config.FOOTER_CONFIG;
    return (
        <InstitutionalPage
            eyebrow="Institucional"
            title={`Sobre a ${company.nomeExibicao}`}
            intro="Uma apresentação objetiva da empresa, dos canais oficiais e do atendimento disponível para quem compra pelo site."
        >
            <InformationSection title="Nossa loja">
                <p>
                    A {company.nomeExibicao} atende clientes pela loja online e em sua unidade física. Nosso catálogo reúne produtos disponíveis para compra conforme o estoque informado no site.
                </p>
                <p>{company.enderecoResumo}</p>
            </InformationSection>
            <InformationSection title="Atendimento de verdade">
                <p>
                    Antes ou depois da compra, você pode falar com nossa equipe por telefone, WhatsApp ou e-mail. O horário habitual é {company.atendimento.toLowerCase()}.
                </p>
                <p>{company.nome} · CNPJ {company.cnpj}</p>
            </InformationSection>
        </InstitutionalPage>
    );
}
