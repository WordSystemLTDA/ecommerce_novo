import React from 'react';
import {
    FaArrowRight,
    FaClock,
    FaEnvelope,
    FaFacebookF,
    FaHome,
    FaInstagram,
    FaPhoneAlt,
    FaTwitter,
    FaYoutube
} from 'react-icons/fa';
import { SiApple, SiGoogleplay } from 'react-icons/si';

const departamentosColuna1 = [
    'Hardware',
    'Computadores',
    'Monitores',
    'Eletrônicos',
    'Mochilas',
    'Redes e Wireless',
    'Casa Inteligente',
    'Vestuário'
];

const departamentosColuna2 = [
    'Periféricos',
    'Kit Upgrade',
    'Notebooks',
    'Video Games',
    'Realidade Virtual',
    'Casa e Lazer',
    'Pets',
    'Energético'
];

const institucionalLinks = ['Quem somos', 'Localização', 'Nossas Lojas', 'Blog'];
const ajudaLinks = ['Entrega', 'Garantia', 'Como comprar', 'Formas de Pagamento'];
const sacLinks = ['Fale conosco', 'Termos de aceite', 'Políticas de Privacidade'];

const redesSociais = [
    { label: 'Facebook', icon: FaFacebookF },
    { label: 'Instagram', icon: FaInstagram },
    { label: 'Twitter', icon: FaTwitter },
    { label: 'YouTube', icon: FaYoutube },
];

const pagamentos = [
    { alt: 'Visa', src: 'https://logodownload.org/wp-content/uploads/2016/10/visa-logo-0-2048x2048.png' },
    { alt: 'Mastercard', src: 'https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-1-1.png' },
    { alt: 'Amex', src: 'https://logodownload.org/wp-content/uploads/2014/04/amex-american-express-logo-1-2048x2048.png' },
    { alt: 'Boleto', src: 'https://logodownload.org/wp-content/uploads/2019/09/boleto-logo-1.png' },
    { alt: 'Pix', src: 'https://logodownload.org/wp-content/uploads/2020/02/pix-bc-logo-1-2048x726.png' },
    { alt: 'Nubank', src: 'https://logodownload.org/wp-content/uploads/2019/08/nubank-logo-1.png' },
];

const FooterLink = ({ href = '#', children }: { href?: string, children: React.ReactNode }) => (
    <li>
        <a href={href} className="inline-flex text-secondary/84 hover:text-white transition-colors duration-500 text-[13px] leading-relaxed tracking-[0.02em]">
            {children}
        </a>
    </li>
);

const FooterTitle = ({ title }: { title: string }) => (
    <div className="mb-5">
        <p className="text-tiny uppercase tracking-[0.28em] font-medium text-terciary mb-3">{title}</p>
        <div className="h-px w-12 bg-secondary/10" />
    </div>
);

const FooterInfoCard = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: React.ReactNode }) => (
    <div className="border border-secondary/16 bg-white/10 px-4 py-4 backdrop-blur-sm min-h-[88px]">
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-secondary/16 text-terciary bg-white/10">
                <Icon size={14} className="shrink-0" />
            </div>
            <div>
                <p className="text-tiny uppercase tracking-[0.2em] text-secondary/70 mb-1">{label}</p>
                <div className="text-sm text-secondary/96 leading-relaxed font-medium">{value}</div>
            </div>
        </div>
    </div>
);

export function Footer() {
    return (
        <footer className="bg-footer-bg text-secondary relative overflow-hidden border-t border-secondary/5">
            <div className="absolute inset-0 pointer-events-none opacity-100">
                <div className="absolute left-0 top-0 h-64 w-64 bg-terciary/10 blur-3xl" />
                <div className="absolute right-0 top-24 h-72 w-72 bg-white/16 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-secondary/15 to-transparent" />
            </div>

            <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 pt-10 lg:pt-14 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
                    <FooterInfoCard
                        icon={FaClock}
                        label="Atendimento"
                        value={<span>Seg-Sex 8h-12h / 14h-18h</span>}
                    />
                    <FooterInfoCard
                        icon={FaPhoneAlt}
                        label="Telefone"
                        value={<span>(44) 9118-8369</span>}
                    />
                    <FooterInfoCard
                        icon={FaEnvelope}
                        label="E-mail"
                        value={<span>sac@pichau.com.br</span>}
                    />
                    <FooterInfoCard
                        icon={FaHome}
                        label="Loja física"
                        value={<span>Santa Fé - PR · Seg-Sex 9h-19h / Sáb 9h-13h</span>}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 py-14 lg:py-18">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <p className="text-tiny uppercase tracking-[0.3em] text-terciary mb-4">Word System</p>
                        <h2 className="font-serif text-3xl leading-none text-white mb-4">Informações e atendimento</h2>
                        <p className="text-sm text-secondary/62 leading-7 max-w-md">
                            Consulte contato, endereço, links institucionais, departamentos e canais oficiais da loja em um único lugar.
                        </p>

                        <div className="mt-8 space-y-3">
                            <div className="border border-secondary/16 bg-white/10 px-4 py-4">
                                <p className="text-tiny uppercase tracking-[0.2em] text-secondary/50 mb-1">Endereço</p>
                                <p className="text-sm text-secondary/82 leading-relaxed">Rua Luiz Roncalha, 169 · Jardim Itália · Santa Fé - PR</p>
                            </div>
                            <div className="border border-secondary/16 bg-white/10 px-4 py-4">
                                <p className="text-tiny uppercase tracking-[0.2em] text-secondary/50 mb-1">Empresa</p>
                                <p className="text-sm text-secondary/82 leading-relaxed">WORD SYSTEM LTDA · CNPJ 09.376.495/0001-22</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 xl:col-span-4">
                        <FooterTitle title="Departamentos" />
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                            <ul className="space-y-2.5">
                                {departamentosColuna1.map((item) => (
                                    <FooterLink key={item}>{item}</FooterLink>
                                ))}
                            </ul>
                            <ul className="space-y-2.5">
                                {departamentosColuna2.map((item) => (
                                    <FooterLink key={item}>{item}</FooterLink>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-10">
                            <FooterTitle title="Aplicativos" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a href="#" className="flex items-center gap-3 border border-secondary/16 bg-white/10 px-4 py-3 hover:border-terciary/50 hover:bg-white/14 transition-colors duration-500">
                                    <SiApple size={20} className="text-secondary/70" />
                                    <div>
                                        <span className="text-tiny uppercase tracking-widest text-secondary/60 block">Baixe na</span>
                                        <span className="text-sm font-medium text-secondary/96">App Store</span>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center gap-3 border border-secondary/16 bg-white/10 px-4 py-3 hover:border-terciary/50 hover:bg-white/14 transition-colors duration-500">
                                    <SiGoogleplay size={20} className="text-secondary/70" />
                                    <div>
                                        <span className="text-tiny uppercase tracking-widest text-secondary/60 block">Disponível no</span>
                                        <span className="text-sm font-medium text-secondary/96">Google Play</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 xl:col-span-2 grid gap-10 content-start">
                        <div>
                            <FooterTitle title="Institucional" />
                            <ul className="space-y-2.5">
                                {institucionalLinks.map((item) => (
                                    <FooterLink key={item}>{item}</FooterLink>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <FooterTitle title="Ajuda" />
                            <ul className="space-y-2.5">
                                {ajudaLinks.map((item) => (
                                    <FooterLink key={item}>{item}</FooterLink>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <FooterTitle title="SAC" />
                            <ul className="space-y-2.5">
                                {sacLinks.map((item) => (
                                    <FooterLink key={item}>{item}</FooterLink>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-2 xl:col-span-3">
                        <FooterTitle title="Newsletter" />
                        <p className="text-sm text-secondary/76 mb-5 leading-7 max-w-sm">Receba ofertas exclusivas, novidades e avisos importantes direto no seu e-mail.</p>
                        <form className="border border-secondary/16 bg-white/10 p-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="email"
                                    placeholder="Seu e-mail"
                                    className="bg-transparent border-b border-secondary/28 focus:border-terciary text-secondary/96 placeholder:text-secondary/52 text-sm px-0 py-2 flex-1 outline-none transition-colors duration-500"
                                />
                                <button
                                    type="submit"
                                    className="h-10 w-10 shrink-0 border border-terciary/40 text-terciary hover:bg-terciary hover:text-secondary transition-colors duration-500 flex items-center justify-center bg-white/10"
                                    aria-label="Inscrever-se na newsletter"
                                >
                                    <FaArrowRight size={13} />
                                </button>
                            </div>
                        </form>

                        <div className="mt-10">
                            <FooterTitle title="Redes sociais" />
                            <div className="flex flex-wrap gap-3">
                                {redesSociais.map(({ label, icon: Icon }) => (
                                    <a key={label} href="#" aria-label={label} className="w-10 h-10 border border-secondary/16 bg-white/10 flex items-center justify-center text-secondary/76 hover:border-terciary hover:text-terciary hover:bg-white/14 transition-all duration-500">
                                        <Icon size={13} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10">
                            <FooterTitle title="Pagamento" />
                            <div className="grid grid-cols-3 gap-2.5">
                                {pagamentos.map((item) => (
                                    <div key={item.alt} className="bg-white/96 p-2 flex items-center justify-center h-10 border border-secondary/16">
                                        <img src={item.src} alt={item.alt} className="max-h-full max-w-full object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-secondary/8 relative">
                <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 py-7 lg:py-8">
                    <div className="flex flex-col md:flex-row justify-between gap-8 md:items-end">
                        <div className="flex-1">
                            <p className="text-tiny uppercase tracking-[0.25em] text-terciary mb-2">Word System</p>
                            <p className="text-xs text-secondary/72 leading-relaxed max-w-md">
                                WORD SYSTEM LTDA · CNPJ 09.376.495/0001-22<br />
                                Rua Luiz Roncalha, 169 · Jardim Italia · Santa Fé - PR · 86770-000
                            </p>
                            <p className="text-xs text-secondary/58 mt-3 leading-relaxed max-w-xl">
                                Preços e condições exclusivos para compras via internet. Fotos meramente ilustrativas. Ofertas válidas até o término de estoques.
                            </p>
                        </div>
                        <div className="shrink-0 flex flex-col md:items-end gap-3">
                            <p className="text-tiny uppercase tracking-[0.2em] text-secondary/60">Certificados</p>
                            <div className="flex flex-wrap gap-2">
                                <div className="w-24 h-16 border border-secondary/16 bg-white/10 flex items-center justify-center text-tiny text-secondary/64 tracking-wider">BLINDADO</div>
                                <div className="w-24 h-16 border border-secondary/16 bg-white/10 flex items-center justify-center text-tiny text-secondary/64 tracking-wider">NIQ EBIT</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
