import type { ComponentType, ReactNode } from "react";
import { FaClock, FaEnvelope, FaHome, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router";
import config from "~/config/config";

const institutionalLinks = [
    { label: "Quem somos", to: "/quem-somos" },
    { label: "Entrega e trocas", to: "/entrega-e-trocas" },
    { label: "Formas de pagamento", to: "/formas-de-pagamento" },
    { label: "Fale conosco", to: "/contato" },
];

const legalLinks = [
    { label: "Termos e condições", to: "/termos" },
    { label: "Política de privacidade", to: "/privacidade" },
];

const FooterLink = ({ to, children }: { to: string; children: ReactNode }) => (
    <li>
        <Link to={to} className="inline-flex text-[13px] leading-relaxed tracking-[0.02em] text-secondary/84 transition-colors duration-300 hover:text-white">
            {children}
        </Link>
    </li>
);

const FooterTitle = ({ title }: { title: string }) => (
    <div className="mb-5">
        <p className="text-tiny mb-3 font-medium uppercase tracking-[0.28em] text-terciary">{title}</p>
        <div className="h-px w-12 bg-secondary/15" />
    </div>
);

const FooterInfoCard = ({ icon: Icon, label, value }: {
    icon: ComponentType<{ size?: number; className?: string }>;
    label: string;
    value: ReactNode;
}) => (
    <div className="min-h-[88px] min-w-0 border border-secondary/16 bg-white/10 px-4 py-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-secondary/16 bg-white/10 text-terciary">
                <Icon size={14} className="shrink-0" />
            </div>
            <div className="min-w-0">
                <p className="text-tiny mb-1 uppercase tracking-[0.2em] text-secondary/70">{label}</p>
                <div className="overflow-wrap-anywhere text-sm font-medium leading-relaxed text-secondary/96">{value}</div>
            </div>
        </div>
    </div>
);

export function Footer() {
    const company = config.FOOTER_CONFIG;
    const phoneHref = `tel:+${company.whatsapp}`;
    const emailHref = `mailto:${company.email}`;
    const whatsappUrl = `${config.WHATSAPP_URL}?text=${encodeURIComponent(`Olá! Vim pelo site da ${company.nomeExibicao} e preciso de atendimento.`)}`;

    return (
        <footer className="relative overflow-hidden border-t border-secondary/5 bg-footer-bg text-secondary">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-0 top-0 h-64 w-64 bg-terciary/10 blur-3xl" />
                <div className="absolute right-0 top-24 h-72 w-72 bg-white/12 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-secondary/15 to-transparent" />
            </div>

            <div className="relative mx-auto max-w-[1600px] px-4 pt-8 sm:px-8 sm:pt-10 lg:px-16 lg:pt-14">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <FooterInfoCard icon={FaClock} label="Atendimento" value={company.atendimento} />
                    <FooterInfoCard icon={FaWhatsapp} label="WhatsApp" value={<a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-white">{company.telefone}</a>} />
                    <FooterInfoCard icon={FaEnvelope} label="E-mail" value={<a href={emailHref} className="hover:text-white">{company.email}</a>} />
                    <FooterInfoCard icon={FaHome} label="Loja física" value={company.lojaFisica} />
                </div>

                <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12 lg:py-16">
                    <div className="lg:col-span-5">
                        <p className="text-tiny mb-4 uppercase tracking-[0.3em] text-terciary">{company.nomeExibicao}</p>
                        <h2 className="mb-4 font-serif text-2xl leading-tight text-white sm:text-3xl">Moda, atendimento e compra segura</h2>
                        <p className="max-w-xl text-sm leading-7 text-secondary/72">
                            Compre pelo site ou fale diretamente com nossa equipe. Preços, estoque, prazo de entrega e opções de pagamento são confirmados durante a compra.
                        </p>

                        <address className="mt-7 border border-secondary/16 bg-white/10 px-4 py-4 text-sm not-italic leading-6 text-secondary/82">
                            <span className="text-tiny mb-1 block uppercase tracking-[0.2em] text-secondary/55">Endereço</span>
                            {company.enderecoResumo}
                        </address>
                    </div>

                    <div className="lg:col-span-3">
                        <FooterTitle title="Informações" />
                        <ul className="space-y-3">
                            {institutionalLinks.map((item) => <FooterLink key={item.to} to={item.to}>{item.label}</FooterLink>)}
                        </ul>

                        <div className="mt-9">
                            <FooterTitle title="Legal" />
                            <ul className="space-y-3">
                                {legalLinks.map((item) => <FooterLink key={item.to} to={item.to}>{item.label}</FooterLink>)}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <FooterTitle title="Pagamento e segurança" />
                        <p className="text-sm leading-7 text-secondary/76">As formas habilitadas aparecem no checkout antes da confirmação do pedido.</p>
                        <div className="mt-5 grid grid-cols-2 gap-2.5">
                            {['PIX', 'Cartão de crédito', 'Ambiente protegido', 'Mercado Pago'].map((label) => (
                                <div key={label} className="flex min-h-12 items-center justify-center border border-secondary/16 bg-white/10 px-3 text-center text-xs font-medium text-secondary/90">
                                    {label}
                                </div>
                            ))}
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 bg-terciary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90">
                                <FaWhatsapp /> WhatsApp
                            </a>
                            <a href={phoneHref} className="inline-flex min-h-11 items-center justify-center gap-2 border border-secondary/25 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-secondary transition-colors hover:border-white hover:text-white">
                                <FaPhoneAlt /> Ligar
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative border-t border-secondary/10">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-7 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-16">
                    <div>
                        <p className="text-xs leading-relaxed text-secondary/72">{company.nome} · CNPJ {company.cnpj}</p>
                        <p className="mt-1 text-xs leading-relaxed text-secondary/58">{company.enderecoCompleto}</p>
                    </div>
                    <p className="max-w-xl text-xs leading-relaxed text-secondary/58 md:text-right">
                        Preços e condições exclusivos para compras online. Ofertas sujeitas à disponibilidade de estoque.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
