/* eslint-disable react/no-unescaped-entities */
import Header from '~/components/header';
import Footer from '~/components/footer';

export default function Privacidade() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Política de Privacidade</h1>

                    <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Compromisso com a Privacidade</h2>
                            <p>
                                A Word System valoriza a sua privacidade e está comprometida em proteger seus dados pessoais.
                                Esta política descreve como coletamos, usamos, armazenamos e protegemos as informações que você nos fornece ao utilizar nosso site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Coleta de Informações</h2>
                            <p>
                                Coletamos informações pessoais que você nos fornece voluntariamente ao criar uma conta, fazer um pedido, assinar nossa newsletter ou entrar em contato conosco.
                                Isso pode incluir: nome, endereço, e-mail, número de telefone, CPF/CNPJ e dados de pagamento.
                                Também coletamos dados de navegação automaticamente, como endereço IP, tipo de navegador e páginas visitadas.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Uso das Informações</h2>
                            <p>
                                Usamos suas informações para:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Processar e entregar seus pedidos;</li>
                                <li>Enviar atualizações sobre o status do pedido;</li>
                                <li>Responder a suas dúvidas e solicitações;</li>
                                <li>Melhorar nossa loja e a experiência do usuário;</li>
                                <li>Enviar comunicações de marketing (se você optou por receber);</li>
                                <li>Cumprir obrigações legais e prevenir fraudes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Compartilhamento de Dados</h2>
                            <p>
                                Não vendemos nem alugamos seus dados pessoais. Compartilhamos informações apenas com parceiros essenciais para a operação, como:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Transportadoras (para entrega dos produtos);</li>
                                <li>Processadores de pagamento (para faturamento);</li>
                                <li>Plataformas de tecnologia (para hospedagem e manutenção do site).</li>
                            </ul>
                            <p className="mt-2">
                                Exigimos que todos os parceiros tratem seus dados com o mesmo nível de segurança e confidencialidade.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Cookies e Tecnologias Semelhantes</h2>
                            <p>
                                Utilizamos cookies para melhorar a funcionalidade do site, analisar o tráfego e personalizar conteúdo.
                                Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Segurança dos Dados</h2>
                            <p>
                                Adotamos medidas técnicas e administrativas robustas para proteger seus dados contra acesso não autorizado, perda, alteração ou destruição.
                                Utilizamos criptografia SSL (Secure Socket Layer) para transações financeiras e dados sensíveis.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Seus Direitos (LGPD)</h2>
                            <p>
                                Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Confirmar a existência de tratamento de dados;</li>
                                <li>Acessar seus dados;</li>
                                <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                                <li>Revogar seu consentimento a qualquer momento.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contato</h2>
                            <p>
                                Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato com nosso Encarregado de Dados (DPO) através dos canais de atendimento disponíveis no rodapé do site.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
