/* eslint-disable react/no-unescaped-entities */
import Header from '~/components/header';
import Footer from '~/components/footer';

export default function Termos() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Termos e Condições de Venda</h1>

                    <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introdução</h2>
                            <p>
                                Bem-vindo à Word System! Ao realizar compras em nossa loja virtual, você concorda com os termos e condições descritos abaixo.
                                Recomendamos a leitura atenta deste documento antes de finalizar seu pedido.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Produtos e Disponibilidade</h2>
                            <p>
                                Todos os produtos apresentados em nossa loja estão sujeitos à disponibilidade de estoque.
                                A Word System se reserva o direito de limitar a quantidade de produtos por cliente ou cancelar pedidos em caso de erro sistêmico de estoque.
                                As imagens dos produtos são meramente ilustrativas e podem sofrer pequenas variações de cor dependendo do monitor.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Preços e Pagamento</h2>
                            <p>
                                Os preços exibidos estão em Reais (BRL) e são válidos apenas para compras realizadas no site.
                                Reservamo-nos o direito de alterar os preços a qualquer momento, sem aviso prévio.
                                O pagamento pode ser realizado através das modalidades disponíveis no checkout (Cartão de Crédito, PIX, Boleto, etc.).
                                O pedido será processado apenas após a confirmação do pagamento.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Entrega e Prazos</h2>
                            <p>
                                O prazo de entrega varia de acordo com o endereço de destino e a modalidade de frete escolhida.
                                O prazo começa a contar a partir da confirmação do pagamento.
                                A Word System não se responsabiliza por atrasos decorrentes de greves, fenômenos naturais ou falhas nas transportadoras parceiras,
                                embora nos comprometamos a prestar todo o suporte necessário.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Trocas e Devoluções</h2>
                            <p>
                                Conforme o Código de Defesa do Consumidor, você tem até 7 (sete) dias corridos após o recebimento do produto para solicitar a devolução por arrependimento.
                                Para defeitos de fabricação, o prazo é de 30 (trinta) dias para produtos não duráveis e 90 (noventa) dias para duráveis.
                                O produto deve ser devolvido em sua embalagem original, sem indícios de uso e acompanhado da Nota Fiscal.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Garantia</h2>
                            <p>
                                A garantia legal é assegurada conforme descrito acima. Garantias adicionais oferecidas pelos fabricantes devem ser consultadas diretamente com eles
                                ou nos manuais dos produtos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Privacidade e Segurança</h2>
                            <p>
                                Seus dados pessoais são tratados com total confidencialidade e segurança, conforme nossa Política de Privacidade.
                                Não compartilhamos suas informações com terceiros para fins publicitários sem o seu consentimento.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Atendimento ao Cliente</h2>
                            <p>
                                Em caso de dúvidas, sugestões ou reclamações, entre em contato com nosso SAC através dos canais de atendimento disponibilizados no site
                                (e-mail, telefone ou chat).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Alterações nos Termos</h2>
                            <p>
                                A Word System reserva-se o direito de atualizar estes Termos e Condições a qualquer momento.
                                As alterações entrarão em vigor imediatamente após a publicação no site.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
