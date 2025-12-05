/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
    FaCheck,
    FaCheckCircle,
    FaCreditCard,
    FaMapMarkerAlt,
    FaRegFileAlt,
    FaShoppingCart,
    FaTruck,
} from 'react-icons/fa';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import Footer from '~/components/footer';
import Header from '~/components/header';
import { useCarrinho } from '~/features/carrinho/context/CarrinhoContext';
import { currencyFormatter } from '~/utils/formatters';
import { carrinhoService } from './services/carrinhoService';
import { useAuth } from '../auth/context/AuthContext';
import { toast } from 'react-toastify';

const CheckoutStepper = ({ activeStep }: { activeStep: number }) => {
    const steps = [
        { name: 'Carrinho', icon: FaShoppingCart },
        { name: 'Endereço', icon: FaMapMarkerAlt },
        { name: 'Entrega', icon: FaTruck },
        { name: 'Pagamento', icon: FaCreditCard },
        { name: 'Confirmação', icon: FaCheckCircle },
        { name: 'Concluído', icon: FaCheckCircle },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center py-4 px-2 overflow-x-auto whitespace-nowrap">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === activeStep;
                    const isCompleted = stepNumber < activeStep;

                    if (step.name === 'Concluído') return null;

                    return (
                        <React.Fragment key={step.name}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center border-2  
                                        ${isActive ? 'border-primary bg-primary text-white' : ''}
                                        ${isCompleted ? 'border-primary bg-white text-primary' : ''}
                                        ${!isActive && !isCompleted ? 'border-gray-300 text-gray-400' : ''}
                                    `}
                                >
                                    {isCompleted ? <FaCheck size={20} /> : <step.icon size={20} />}
                                </div>
                                <span
                                    className={`
                                        mt-2 text-xs font-medium 
                                        ${(isActive || isCompleted) ? 'text-primary' : 'text-gray-400'}
                                    `}
                                >
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 2 && (
                                <div className={`flex-auto h-0.5 mx-2 ${(isCompleted || isActive) ? 'bg-primary' : 'bg-gray-300'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const CartSummary = ({
    step,
    onContinue,
    onBack,
}: {
    step: number;
    onContinue: () => void;
    onBack: () => void;
}) => {
    let { retornarValorProdutos, valorFrete, valorDesconto, retornarValorFinal, enderecoSelecionado, tipoDeEntregaSelecionada, pagamentoSelecionado } = useCarrinho();

    const isConfirmationStep = step === 5;
    const isDisabled = () => {
        switch (step) {
            case 2:
                return enderecoSelecionado == undefined;
            case 3:
                return tipoDeEntregaSelecionada == undefined;
            case 4:
                return pagamentoSelecionado == undefined;
            default:
                return false;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-38">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                <FaRegFileAlt /> RESUMO
            </h2>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Valor dos Produtos:</span>
                    <span className="font-medium text-gray-800">{currencyFormatter.format(retornarValorProdutos())}</span>
                </div>
                {isConfirmationStep && (
                    <div className="flex justify-between text-red-600">
                        <span>Descontos:</span>
                        <span className="font-medium">− {currencyFormatter.format(valorDesconto)}</span>
                    </div>
                )}
                {(step > 2) && (
                    <div className="flex justify-between text-gray-600">
                        <span>Frete:</span>
                        <span className="font-medium text-gray-800">{currencyFormatter.format(valorFrete)}</span>
                    </div>
                )}

                <div className="border-t border-gray-200 my-2 pt-2"></div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total a prazo:</span>
                    <div className="text-right">
                        <span className="text-xl font-bold text-gray-800">{currencyFormatter.format(retornarValorFinal())}</span>
                    </div>
                </div>
            </div>

            {step < 5 ? (
                <></>
            ) : (
                <></>
            )}

            {(step >= 2 && step <= 4) && (
                <div className="mt-4">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Cupom de desconto"
                            className="w-full border border-gray-300 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button className="bg-terciary text-white font-bold px-4 rounded-r-md text-sm">OK</button>
                    </div>
                </div>
            )}

            {isConfirmationStep && (
                <div className="mt-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                        <FaTruck /> ENTREGA
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>{enderecoSelecionado?.endereco}</p>
                        <p>Número {enderecoSelecionado?.numero}, {enderecoSelecionado?.complemento}, CEP {enderecoSelecionado?.cep} - {enderecoSelecionado?.nome_cidade}, {enderecoSelecionado?.sigla_estado}</p>
                        <div className="flex justify-between items-center border border-gray-300 rounded p-2">
                            <span>{tipoDeEntregaSelecionada?.name}</span>
                            <span className="font-bold">{currencyFormatter.format(parseFloat(tipoDeEntregaSelecionada?.price ?? '0'))}</span>
                        </div>
                        <p className="text-xs text-gray-500">*Mediante a confirmação de pagamento até às 13 horas.</p>
                    </div>
                </div>
            )}

            <div className="mt-6 space-y-3">
                <button
                    onClick={onContinue}
                    disabled={isDisabled()}
                    className={`w-full ${isDisabled() ? 'bg-gray-500' : 'bg-primary hover:bg-secondary'} text-white font-bold py-3 rounded-md transition-colors`}
                >
                    {isConfirmationStep ? 'FINALIZAR' : 'CONTINUAR'}
                </button>
                {step > 1 && (
                    <button
                        onClick={onBack}
                        className="w-full bg-white text-primary border border-primary font-bold py-3 rounded-md hover:bg-secondary transition-colors"
                    >
                        VOLTAR
                    </button>
                )}
            </div>

            {isConfirmationStep && (
                <div className="mt-4 text-xs text-gray-500">
                    <label className="flex items-start gap-2">
                        <input type="checkbox" className="w-4 h-4 accent-primary mt-0.5" />
                        <span>
                            Ao efetuar o seu pedido, você concorda com os
                            <a href="#" className="font-bold text-primary"> Termos e condições de Venda do KaBuM! </a>
                            e com nossa
                            <a href="#" className="font-bold text-primary"> Política de Privacidade</a>.
                        </span>
                    </label>
                </div>
            )}
        </div>
    );
};

export default function CheckoutLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const { cliente } = useAuth();
    const { produtos, pagamentoSelecionado, enderecoSelecionado, tipoDeEntregaSelecionada, valorFrete, retornarValorFinal, resetarCarrinho } = useCarrinho();

    const getActiveStep = (pathname: string): number => {
        if (pathname.endsWith('/carrinho')) return 1;
        if (pathname.endsWith('/endereco')) return 2;
        if (pathname.endsWith('/entrega')) return 3;
        if (pathname.endsWith('/pagamento')) return 4;
        if (pathname.endsWith('/confirmacao')) return 5;
        return 1;
    };

    const activeStep = getActiveStep(location.pathname);
    const stepsRoutes = ['', 'endereco', 'entrega', 'pagamento', 'confirmacao'];

    const handleContinue = async () => {
        const nextStepIndex = activeStep;

        if (activeStep === 1 && !cliente?.id) {
            toast.info("Faça login para continuar.", { position: 'top-center' });
            navigate("/entrar");
            return;
        }

        if (tipoDeEntregaSelecionada == undefined) {
            toast.error("Selecione um tipo de entrega", { position: 'top-center' });
            navigate("/carrinho/entrega");
            return;
        }

        if (enderecoSelecionado == undefined) {
            toast.error("Selecione um endereço", { position: 'top-center' });
            navigate("/carrinho/endereco");
            return;
        }

        if (pagamentoSelecionado == undefined) {
            toast.error("Selecione um pagamento", { position: 'top-center' });
            navigate("/carrinho/pagamento");
            return;
        }

        if (nextStepIndex < stepsRoutes.length) {
            navigate(`/carrinho/${stepsRoutes[nextStepIndex]}`);
        } else {
            var response = await carrinhoService.gerarVenda(
                cliente!,
                produtos.map(p => ({
                    id: p.id,
                    quantidade: p.quantidade,
                    habilTipo: (p.tipo ?? 0).toString(),
                    idTamanho: (p.tamanhoSelecionado?.id ?? 0).toString(),
                })),
                pagamentoSelecionado!,
                enderecoSelecionado!.id,
                '',
                '',
                '',
                valorFrete,
                '',
                tipoDeEntregaSelecionada!.name,
                retornarValorFinal(),
            );

            if (response.sucesso) {
                resetarCarrinho();

                navigate(`/pedido/sucesso/${response.data.id_venda}`);
            } else {
                toast.error(response.mensagem, { position: 'top-center' });
            }
        }
    };

    const handleBack = () => {
        const prevStepIndex = activeStep - 2;
        if (prevStepIndex >= 0) {
            navigate(`/carrinho/${stepsRoutes[prevStepIndex]}`);
        }
    };

    if (produtos.length <= 0 && activeStep != 1 && activeStep != 5) {
        return <Navigate to="/" replace />;
    }

    if (activeStep > 1 && !cliente?.id) {
        return <Navigate to="/entrar" replace />;
    }

    return (
        <div>
            <Header />

            <div className="bg-gray-100 min-h-screen py-8">
                <div className="max-w-387 mx-auto px-4">

                    <CheckoutStepper activeStep={activeStep} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2">

                            <Outlet />

                        </div>

                        <div className="lg:col-span-1">
                            <CartSummary
                                step={activeStep}
                                onContinue={handleContinue}
                                onBack={handleBack}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}