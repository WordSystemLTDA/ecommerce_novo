import React from 'react';
import {
    FaClock,
    FaPhoneAlt,
    FaEnvelope,
    FaHome,
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaArrowRight
} from 'react-icons/fa';
import { SiApple, SiGoogleplay } from 'react-icons/si';

// Componente de Link reutilizável para o rodapé
const FooterLink = ({ href = '#', children }: { href?: string, children: React.ReactNode }) => (
    <li>
        <a href={href} className="text-gray-400 hover:text-white transition-colors text-sm">
            {children}
        </a>
    </li>
);

// Componente de Título de Coluna reutilizável
const FooterTitle = ({ title }: { title: string }) => (
    <>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
        <div className="h-0.5 w-10 bg-primary mt-2 mb-4"></div>
    </>
);

// Componente principal do Rodapé
export function Footer() {
    return (
        <footer className="bg-primary text-white relative">

            {/* SEÇÃO 1: BARRA DE INFORMAÇÕES SUPERIOR */}
            <div className="bg-gray-800">
                <div className="max-w-387 mx-auto px-4 py-3 flex flex-col lg:flex-row justify-between items-center text-xs text-gray-300">
                    <div className="flex flex-col md:flex-row gap-4 lg:gap-8 items-center">
                        <div className="flex items-center gap-2">
                            <FaClock className="text-white text-lg" />
                            <div>
                                <strong className="text-white">Atendimento Loja Virtual</strong>
                                <p>Segunda a sexta 8h às 12h e das 14h às 18h</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaPhoneAlt className="text-white text-lg" />
                            <span>(44) 9118-8369</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="text-white text-lg" />
                            <span>sac@pichau.com.br</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 lg:mt-0">
                        <FaHome className="text-white text-lg" />
                        <div>
                            <strong className="text-white">Loja física em Santa fé - PR</strong>
                            <p>(44) 9118-8369</p>
                            <p>Segunda a sexta 9h às 19h / Sábado das 9h às 13h</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEÇÃO 3: CORPO PRINCIPAL (LINKS) */}
            <div className="max-w-387 mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Coluna 1 e 2: Departamentos */}
                    <div className="lg:col-span-2">
                        <FooterTitle title="Departamentos" />

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            {/* Coluna esquerda dos departamentos */}
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
                            {/* Coluna direita dos departamentos */}
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

                        <div className="flex gap-4">
                            <a href="#" className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded px-4 py-2 hover:bg-gray-700">
                                <SiApple size={24} />
                                <div>
                                    <span className="text-xs block">Baixe na</span>
                                    <span className="text-md font-bold">App Store</span>
                                </div>
                            </a>
                            <a href="#" className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded px-4 py-2 hover:bg-gray-700">
                                <SiGoogleplay size={24} />
                                <div>
                                    <span className="text-xs block">Disponível no</span>
                                    <span className="text-md font-bold">Google Play</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Coluna 3: Institucional / Dúvidas / Ajuda */}
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

                    {/* Coluna 4: Newsletter / Social / Pagamento */}
                    <div>
                        <FooterTitle title="Newsletter" />
                        <p className="text-sm text-gray-400 mb-4">Receba ofertas exclusivas no seu e-mail</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="E-mail"
                                className="bg-white text-gray-900 px-4 py-2 rounded-l-sm w-full focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-primary p-3 rounded-r-sm hover:bg-secondary"
                                aria-label="Inscrever-se na newsletter"
                            >
                                <FaArrowRight />
                            </button>
                        </form>

                        <h5 className="text-sm font-bold text-white uppercase tracking-wider mt-8 mb-4">
                            Siga-nos nas redes sociais
                        </h5>

                        <div className="flex space-x-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary"><FaFacebookF /></a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary"><FaInstagram /></a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary"><FaTwitter /></a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary"><FaYoutube /></a>
                        </div>

                        <h5 className="text-sm font-bold text-white uppercase tracking-wider mt-8 mb-4">
                            Pagamento
                        </h5>

                        <div className="grid grid-cols-3 gap-2">
                            {/* Placeholders para logotipos de pagamento */}
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10"><img src="https://logodownload.org/wp-content/uploads/2016/10/visa-logo-0-2048x2048.png" alt="Visa" className="h-full object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10"><img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-1-1.png" alt="Mastercard" className="h-full object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10"><img src="https://logodownload.org/wp-content/uploads/2014/04/amex-american-express-logo-1-2048x2048.png" alt="American Express" className="h-full object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10"><img src="https://logodownload.org/wp-content/uploads/2019/09/boleto-logo-1.png" alt="Boleto" className="h-full object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10"><img src="https://logodownload.org/wp-content/uploads/2020/02/pix-bc-logo-1-2048x726.png" alt="Pix" className="h-full object-contain" /></div>
                            <div className="bg-white rounded p-2 flex items-center justify-center h-10"><img src="https://logodownload.org/wp-content/uploads/2019/08/nubank-logo-1.png" alt="Nubank" className="h-full object-contain" /></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEÇÃO 4: RODAPÉ INFERIOR (LEGAL E CERTIFICADOS) */}
            <div className="bg-black text-gray-500 py-8">
                <div className="max-w-387 mx-auto px-4 text-xs">

                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        {/* Coluna da Esquerda: Textos Legais */}
                        <div className="flex-1">
                            <p className="mb-2 text-secondary text-xl">
                                WORD SYSTEM É UMA MARCA REGISTRADA DA WORD<br />SYSTEM LTDA | CNPJ: 09.376.495/0001-22
                            </p>
                            <p className="mb-4 font-bold">
                                Rua Luiz Roncalha, Bairro Jardim Italia, 169, Santa Fé - PR, 86770-000
                            </p>
                            <div className="flex gap-8 items-end">
                                <img
                                    src="https://seeklogo.com/images/P/pichau-logo-3626F9B89E-seeklogo.com.png"
                                    alt="Sistema Logo"
                                    className="w-28 h-auto bg-white p-2 rounded"
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

                        {/* Coluna da Direita: Certificados */}
                        <div className="shrink-0">
                            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                                Certificados de Segurança
                            </h5>
                            
                            <div className="flex gap-4">
                                {/* Placeholders para Certificados */}
                                <div className="w-24 h-24 bg-gray-700 rounded flex items-center justify-center text-center text-xs">Site Blindado</div>
                                <div className="w-24 h-24 bg-gray-700 rounded flex items-center justify-center text-center text-xs">NIQ Ebit</div>
                                <div className="w-24 h-24 bg-gray-700 rounded flex items-center justify-center text-center text-xs">Google Avaliações</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;