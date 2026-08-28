import { InstitutionalPage, InformationSection } from "~/components/InstitutionalPage";
import config from "~/config/config";

export function meta() {
    const name = config.FOOTER_CONFIG.nomeExibicao;
    return [
        { title: `Formas de pagamento | ${name}` },
        { name: "description", content: `Conheça as opções de pagamento online disponíveis na ${name}.` },
        ...(config.SITE_URL ? [{ tagName: "link" as const, rel: "canonical", href: `${config.SITE_URL}/formas-de-pagamento` }] : []),
    ];
}

export default function FormasDePagamento() {
    return (
        <InstitutionalPage
            eyebrow="Compra segura"
            title="Formas de pagamento"
            intro="As opções realmente habilitadas para o pedido são apresentadas no checkout antes da confirmação."
        >
            <InformationSection title="PIX">
                <p>Quando disponível, o checkout gera o QR Code e o código Pix Copia e Cola. O pedido é atualizado após a confirmação do pagamento.</p>
                <p>Se houver desconto no PIX, o preço e a economia aparecem no produto e no resumo da compra.</p>
            </InformationSection>
            <InformationSection title="Cartão de Crédito">
                <p>O pagamento por cartão é processado em ambiente protegido pelo Mercado Pago. As parcelas e condições disponíveis são exibidas antes da finalização.</p>
                <p>Os dados completos do cartão não são armazenados pela loja.</p>
            </InformationSection>
            <InformationSection title="Conferência do pedido">
                <p>Revise produtos, endereço, entrega, descontos e valor total antes de confirmar. Nenhuma forma não habilitada será anunciada como disponível.</p>
            </InformationSection>
        </InstitutionalPage>
    );
}
