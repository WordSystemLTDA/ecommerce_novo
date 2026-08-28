import { Link } from "react-router";
import { InstitutionalPage, InformationSection } from "~/components/InstitutionalPage";
import config from "~/config/config";

export function meta() {
    const name = config.FOOTER_CONFIG.nomeExibicao;
    return [
        { title: `Entrega e trocas | ${name}` },
        { name: "description", content: `Consulte como funcionam entrega, prazos, rastreio, trocas e devoluções na ${name}.` },
        ...(config.SITE_URL ? [{ tagName: "link" as const, rel: "canonical", href: `${config.SITE_URL}/entrega-e-trocas` }] : []),
    ];
}

export default function EntregaETrocas() {
    const company = config.FOOTER_CONFIG;
    return (
        <InstitutionalPage
            eyebrow="Ajuda"
            title="Entrega, trocas e devoluções"
            intro="Veja as informações essenciais antes da compra. O prazo e o valor exatos de entrega são calculados para o seu CEP com os produtos escolhidos."
        >
            <InformationSection title="Entrega e prazo">
                <p>Informe seu CEP na página do produto ou no checkout para visualizar as modalidades disponíveis, os valores e a estimativa em dias úteis.</p>
                <p>O prazo passa a contar após a confirmação do pagamento. Quando houver rastreio, ele será disponibilizado após a postagem do pedido.</p>
            </InformationSection>
            <InformationSection title="Trocas e devoluções">
                <p>Para compras online, a solicitação de devolução por arrependimento pode ser feita em até 7 dias corridos após o recebimento, conforme a legislação aplicável.</p>
                <p>O produto deve ser mantido sem sinais de uso indevido, com acessórios e itens recebidos. Fale com a equipe antes de enviar qualquer mercadoria para receber as orientações corretas.</p>
            </InformationSection>
            <InformationSection title="Retirada e dúvidas">
                <p>A disponibilidade de retirada na loja física deve ser confirmada com o atendimento, pois pode variar conforme produto e estoque.</p>
                <p><Link to="/contato" className="font-semibold text-terciary underline underline-offset-4">Fale com a {company.nomeExibicao}</Link> para acompanhar um pedido ou iniciar uma solicitação.</p>
            </InformationSection>
        </InstitutionalPage>
    );
}
