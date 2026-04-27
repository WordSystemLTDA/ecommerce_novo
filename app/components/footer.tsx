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

const FooterLink = ({ href = '#', children }: { href?: string, children: React.ReactNode }) => (
    <li>
        <a href={href} className="text-gray-400 hover:text-white transition-colors text-sm">
            {children}
        </a>
    </li>
);

const FooterTitle = ({ title }: { title: string }) => (
    <>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
        <div className="h-0.5 w-10 bg-primary mt-2 mb-4"></div>
    </>
);

export function Footer() {
    return (
        <footer className="bg-primary text-white relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.10),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_42%)]" />

            <div className="bg-black/10 border-b border-white/10 relative">
                <div className="max-w-387 mx-auto px-4 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center text-xs text-slate-300 gap-4">
                    <div className="flex flex-col md:flex-row gap-4 lg:gap-8 items-start md:items-center">
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                            <FaClock className="text-white text-lg" />
                            <div>
                                <strong className="text-white">Atendimento Loja Virtual</strong>
                                <p>Segunda a sexta 8h às 12h e das 14h às 18h</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                            <FaPhoneAlt className="text-white text-lg" />
                            <span>(44) 9118-8369</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                            <FaEnvelope className="text-white text-lg" />
                            <span>sac@pichau.com.br</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 xl:justify-end rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                        <FaHome className="text-white text-lg" />
                        <div>
                            <strong className="text-white">Loja física em Santa fé - PR</strong>
                            <p>(44) 9118-8369</p>
                            <p>Segunda a sexta 9h às 19h / Sábado das 9h às 13h</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-387 mx-auto px-4 py-12 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    <div className="lg:col-span-2">
                        <FooterTitle title="Departamentos" />

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            <ul className="space-y-2">
                                <FooterLink>Hardware</FooterLink>
                                <FooterLink>Computadores</FooterLink>
                                <FooterLink>Monitores</FooterLink>
                                <FooterLink>Eletrônicos</FooterLink>
                                <FooterLink>Mochilas</FooterLink>
                                <FooterLink>Redes e Wireless</FooterLink>
                                <FooterLink>Casa Inteligente</FooterLink>
                                <FooterLink>Openbox</FooterLink>
                                <FooterLink>Vestuário</FooterLink>
                            </ul>
                            <ul className="space-y-2">
                                <FooterLink>Periféricos</FooterLink>
                                <FooterLink>Kit Upgrade</FooterLink>
                                <FooterLink>Cadeiras e Mesas Gamer e Escritório</FooterLink>
                                <FooterLink>Notebooks e Portáteis</FooterLink>
                                <FooterLink>Video Games</FooterLink>
                                <FooterLink>Realidade Virtual</FooterLink>
                                <FooterLink>Casa e Lazer</FooterLink>
                                <FooterLink>Pets</FooterLink>
                                <FooterLink>Energético</FooterLink>
                            </ul>
                        </div>

                        <h5 className="text-sm font-bold text-white uppercase tracking-wider mt-8 mb-4">
                            Baixe os Aplicativos
                        </h5>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10">
                                <SiApple size={24} />
                                <div>
                                    <span className="text-xs block">Baixe na</span>
                                    <span className="text-md font-bold">App Store</span>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10">
                                <SiGoogleplay size={24} />
                                <div>
                                    <span className="text-xs block">Disponível no</span>
                                    <span className="text-md font-bold">Google Play</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div>
                        <FooterTitle title="Institucional" />
                        <ul className="space-y-2 mb-6">
                            <FooterLink>Quem somos</FooterLink>
                            <FooterLink>Localização</FooterLink>
                            <FooterLink>Nossas Lojas</FooterLink>
                            <FooterLink>Blog</FooterLink>
                        </ul>

                        <FooterTitle title="Dúvidas" />
                        <ul className="space-y-2 mb-6">
                            <FooterLink>Entrega</FooterLink>
                            <FooterLink>Garantia</FooterLink>
                            <FooterLink>Como comprar</FooterLink>
                            <FooterLink>Formas de Pagamento</FooterLink>
                            <FooterLink>Sobre Boletos</FooterLink>
                        </ul>

                        <FooterTitle title="Ajuda" />
                        <ul className="space-y-2">
                            <FooterLink>SAC</FooterLink>
                            <FooterLink>Fale conosco</FooterLink>
                            <FooterLink>Termos de aceite</FooterLink>
                            <FooterLink>Políticas de Privacidade</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <FooterTitle title="Newsletter" />
                        <p className="text-sm text-slate-300 mb-4">Receba ofertas exclusivas no seu e-mail</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="E-mail"
                                className="bg-white text-slate-900 px-4 py-2 rounded-l-xl w-full focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-primary p-3 rounded-r-xl hover:opacity-90"
                                aria-label="Inscrever-se na newsletter"
                            >
                                <FaArrowRight />
                            </button>
                        </form>

                        <h5 className="text-sm font-bold text-white uppercase tracking-wider mt-8 mb-4">
                            Siga-nos nas redes sociais
                        </h5>

                        <div className="flex space-x-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-primary"><FaFacebookF /></a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-primary"><FaInstagram /></a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-primary"><FaTwitter /></a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-primary"><FaYoutube /></a>
                        </div>

                        <h5 className="text-sm font-bold text-white uppercase tracking-wider mt-8 mb-4">
                            Pagamento
                        </h5>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10 overflow-hidden"><img src="https://logodownload.org/wp-content/uploads/2016/10/visa-logo-0-2048x2048.png" alt="Visa" className="max-h-full max-w-full w-auto h-auto object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10 overflow-hidden"><img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-1-1.png" alt="Mastercard" className="max-h-full max-w-full w-auto h-auto object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10 overflow-hidden"><img src="https://logodownload.org/wp-content/uploads/2014/04/amex-american-express-logo-1-2048x2048.png" alt="American Express" className="max-h-full max-w-full w-auto h-auto object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10 overflow-hidden"><img src="https://logodownload.org/wp-content/uploads/2019/09/boleto-logo-1.png" alt="Boleto" className="max-h-full max-w-full w-auto h-auto object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10 overflow-hidden"><img src="https://logodownload.org/wp-content/uploads/2020/02/pix-bc-logo-1-2048x726.png" alt="Pix" className="max-h-full max-w-full w-auto h-auto object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10 overflow-hidden"><img src="https://logodownload.org/wp-content/uploads/2019/08/nubank-logo-1.png" alt="Nubank" className="max-h-full max-w-full w-auto h-auto object-contain" /></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-black/10 border-t border-white/10 text-white/75 py-8 relative">
                <div className="max-w-387 mx-auto px-4 text-xs">

                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="flex-1">
                            <p className="mb-2 text-secondary text-lg md:text-xl leading-tight">
                                WORD SYSTEM É UMA MARCA REGISTRADA DA WORD<br />SYSTEM LTDA | CNPJ: 09.376.495/0001-22
                            </p>
                            <p className="mb-4 font-bold">
                                Rua Luiz Roncalha, Bairro Jardim Italia, 169, Santa Fé - PR, 86770-000
                            </p>
                            <div className="flex gap-8 items-end">
                                <img
                                    src="https://seeklogo.com/images/P/pichau-logo-3626F9B89E-seeklogo.com.png"
                                    alt="Sistema Logo"
                                    className="w-28 h-auto bg-white p-2 rounded-lg"
                                />

                                <div>
                                    <p className="mb-2">
                                        Preços e condições de pagamento exclusivos para compras via internet e podem variar nas lojas
                                        físicas. Os preços anunciados neste site ou via e-mail promocional podem ser alterados sem prévio
                                        aviso. A word System, não é responsável por erros descritivos. As fotos contidas nesta página
                                        são meramente ilustrativas do produto e podem variar de acordo com o fornecedor/lote do fabricante.
                                        Ofertas válidas até o término de nossos estoques. Vendas sujeitas à análise e confirmação de dados.
                                    </p>
                                    <p>Feito por Word System</p>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                                Certificados de Segurança
                            </h5>

                            <div className="flex gap-3 flex-wrap">
                                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-center text-xs">Site Blindado</div>
                                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-center text-xs">NIQ Ebit</div>
                                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-center text-xs">Google Avaliações</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;