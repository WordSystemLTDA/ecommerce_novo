/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
    FaCheck,
    FaCheckCircle,
    FaCreditCard,
    FaExclamationCircle,
    FaLock,
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

const steps = [
    { name: 'Carrinho', route: '', icon: FaShoppingCart },
    { name: 'Endereço', route: 'endereco', icon: FaMapMarkerAlt },
    { name: 'Entrega', route: 'entrega', icon: FaTruck },
    { name: 'Pagamento', route: 'pagamento', icon: FaCreditCard },
    { name: 'Confirmação', route: 'confirmacao', icon: FaCheckCircle },
];

const formatAddress = (endereco: ReturnType<typeof useCarrinho>['enderecoSelecionado']) => {
    if (!endereco) {
        return 'Nenhum endereço selecionado';
    }

    const street = [endereco.endereco, endereco.numero].filter(Boolean).join(', ');
    const city = [endereco.nome_cidade, endereco.sigla_estado].filter(Boolean).join(', ');
    const details = [street, endereco.nome_bairro, city].filter(Boolean).join(' - ');

    return [details, endereco.cep ? `CEP ${endereco.cep}` : '']
        .filter(Boolean)
        .join(', ');
};

const getActionLabel = (step: number) => {
    switch (step) {
        case 1:
            return 'Ir para endereço';
        case 2:
            return 'Escolher entrega';
        case 3:
            return 'Ir para pagamento';
        case 4:
            return 'Revisar pedido';
        case 5:
            return 'Finalizar pedido';
        default:
            return 'Continuar';
    }
};

const getOrderIdFromResponse = (response: any) => {
    const candidates = [
        response?.data?.id_venda ??
        response?.data?.idVenda,
        response?.data?.id,
        response?.data?.venda?.id_venda,
        response?.data?.venda?.idVenda,
        response?.data?.venda?.id,
        response?.id_venda,
        response?.idVenda,
        response?.venda?.id_venda,
        response?.venda?.idVenda,
        response?.venda?.id,
        response?.id,
        typeof response?.data === 'number' || typeof response?.data === 'string'
            ? response.data
            : undefined,
    ];

    const parsedOrderId = candidates
        .map((candidate) => Number(candidate))
        .find((candidate) => Number.isFinite(candidate) && candidate > 0);

    return parsedOrderId ?? null;
};

const CheckoutStepper = ({
    activeStep,
    canVisitStep,
    onStepSelect,
}: {
    activeStep: number;
    canVisitStep: (step: number) => boolean;
    onStepSelect: (step: number) => void;
}) => {
    const progress = ((activeStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
                        Compra segura
                    </p>
                    <h1 className="text-xl font-bold text-gray-900">
                        Finalize seu pedido
                    </h1>
                </div>

                <span className="hidden rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary sm:inline">
                    Etapa {activeStep} de {steps.length}
                </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-4 flex items-start gap-3 overflow-x-auto pb-1 whitespace-nowrap">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === activeStep;
                    const isCompleted = stepNumber < activeStep;
                    const isAvailable = canVisitStep(stepNumber);
                    const Icon = step.icon;

                    return (
                        <React.Fragment key={step.name}>
                            <button
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => onStepSelect(stepNumber)}
                                className={`
                                    min-w-24 flex flex-col items-center rounded-md p-2
                                    transition-colors
                                    ${isAvailable ? 'cursor-pointer hover:bg-primary/5' : 'cursor-not-allowed opacity-55'}
                                `}
                                aria-current={isActive ? 'step' : undefined}
                            >
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center border-2  
                                        ${isActive ? 'border-primary bg-primary text-white' : ''}
                                        ${isCompleted ? 'border-primary bg-white text-primary' : ''}
                                        ${!isActive && !isCompleted ? 'border-gray-300 text-gray-400' : ''}
                                    `}
                                >
                                    {isCompleted ? <FaCheck size={18} /> : <Icon size={18} />}
                                </div>
                                <span
                                    className={`
                                        mt-2 text-xs font-medium 
                                        ${(isActive || isCompleted) ? 'text-primary' : 'text-gray-400'}
                                    `}
                                >
                                    {step.name}
                                </span>
                                {!isAvailable && !isActive && (
                                    <span className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                                        <FaLock size={9} /> Bloqueada
                                    </span>
                                )}
                            </button>
                            {index < steps.length - 1 && (
                                <div className={`mt-7 h-0.5 min-w-8 flex-1 ${(isCompleted || isActive) ? 'bg-primary' : 'bg-gray-300'}`}></div>
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
    loading = false
}: {
    step: number;
    onContinue: () => void;
    onBack: () => void;
    loading?: boolean;
}) => {
    let { retornarValorProdutos, valorFrete, valorDesconto, retornarValorFinal, enderecoSelecionado, tipoDeEntregaSelecionada, pagamentoSelecionado, selectedItems, produtos } = useCarrinho();
    const [termsAccepted, setTermsAccepted] = React.useState(false);

    const isConfirmationStep = step === 5;
    const selectedProducts = produtos.filter((produto) =>
        selectedItems.includes(produto.internalId)
    );

    React.useEffect(() => {
        if (!isConfirmationStep) {
            setTermsAccepted(false);
        }
    }, [isConfirmationStep]);

    const getBlockedMessage = () => {
        if (loading) return '';
        switch (step) {
            case 1:
                return selectedProducts.length === 0
                    ? 'Selecione ao menos um produto para continuar.'
                    : '';
            case 2:
                return enderecoSelecionado == undefined
                    ? 'Escolha o endereço de entrega.'
                    : '';
            case 3:
                return tipoDeEntregaSelecionada == undefined
                    ? 'Escolha uma forma de entrega.'
                    : '';
            case 4:
                return pagamentoSelecionado == undefined
                    ? 'Escolha uma forma de pagamento.'
                    : '';
            case 5:
                return !termsAccepted
                    ? 'Aceite os termos para finalizar.'
                    : '';
            default:
                return '';
        }
    };
    const blockedMessage = getBlockedMessage();
    const isDisabled = loading || blockedMessage !== '';

    const summaryItems = [
        {
            label: 'Produtos',
            value: `${selectedProducts.length} item${selectedProducts.length === 1 ? '' : 's'} selecionado${selectedProducts.length === 1 ? '' : 's'}`,
            done: selectedProducts.length > 0,
        },
        {
            label: 'Endereço',
            value: enderecoSelecionado
                ? formatAddress(enderecoSelecionado)
                : 'Pendente',
            done: enderecoSelecionado != undefined,
        },
        {
            label: 'Entrega',
            value: tipoDeEntregaSelecionada
                ? tipoDeEntregaSelecionada.name
                : 'Pendente',
            done: tipoDeEntregaSelecionada != undefined,
        },
        {
            label: 'Pagamento',
            value: pagamentoSelecionado?.nome || pagamentoSelecionado?.tipo || 'Pendente',
            done: pagamentoSelecionado != undefined,
        },
    ];

    return (
        <aside className="bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-6">
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

            <div className="mt-5 space-y-3 border-t border-gray-200 pt-4">
                {summaryItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                        <span
                            className={`
                                mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full
                                ${item.done ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}
                            `}
                        >
                            {item.done ? <FaCheck size={11} /> : <FaLock size={9} />}
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                                {item.label}
                            </p>
                            <p className="line-clamp-2 text-sm text-gray-800">
                                {item.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

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
                        <p>{formatAddress(enderecoSelecionado)}</p>
                        <div className="flex justify-between items-center border border-gray-300 rounded p-2">
                            <span>{tipoDeEntregaSelecionada?.name}</span>
                            <span className="font-bold">{currencyFormatter.format(parseFloat(tipoDeEntregaSelecionada?.price ?? '0'))}</span>
                        </div>
                        <p className="text-xs text-gray-500">*Mediante a confirmação de pagamento até às 13 horas.</p>
                    </div>
                </div>
            )}

            <div className="mt-6 space-y-3">
                {blockedMessage && (
                    <p className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                        <FaExclamationCircle /> {blockedMessage}
                    </p>
                )}
                <button
                    onClick={onContinue}
                    disabled={isDisabled}
                    className={`w-full ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-terciary'} text-white font-bold py-3 rounded-md transition-colors flex justify-center items-center gap-2`}
                >
                    {loading ? (
                        <>Processando...</>
                    ) : (
                        getActionLabel(step)
                    )}
                </button>
                {step > 1 && (
                    <button
                        onClick={onBack}
                        disabled={loading}
                        className={`w-full bg-white text-primary border border-primary font-bold py-3 rounded-md hover:bg-primary/5 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        VOLTAR
                    </button>
                )}
            </div>

            {isConfirmationStep && (
                <div className="mt-4 text-xs text-gray-500">
                    <label className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-primary mt-0.5"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <span>
                            Ao efetuar o seu pedido, você concorda com os
                            <a href="/termos" target="_blank" className="font-bold text-primary"> Termos e condições de Venda do Word System! </a>
                            e com nossa
                            <a href="/privacidade" target="_blank" className="font-bold text-primary"> Política de Privacidade</a>.
                        </span>
                    </label>
                </div>
            )}
        </aside>
    );
};

export default function CheckoutLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    const [orderCompleted, setOrderCompleted] = React.useState(false);

    const { cliente } = useAuth();
    const { produtos, selectedItems, pagamentoSelecionado, enderecoSelecionado, tipoDeEntregaSelecionada, valorFrete, retornarValorFinal, removerProdutosSelecionados } = useCarrinho();

    const getActiveStep = (pathname: string): number => {
        if (pathname.endsWith('/carrinho')) return 1;
        if (pathname.endsWith('/endereco')) return 2;
        if (pathname.endsWith('/entrega')) return 3;
        if (pathname.endsWith('/pagamento')) return 4;
        if (pathname.endsWith('/confirmacao')) return 5;
        return 1;
    };

    const activeStep = getActiveStep(location.pathname);
    const selectedProducts = produtos.filter((produto) =>
        selectedItems.includes(produto.internalId)
    );

    const canVisitStep = (step: number) => {
        if (step === 1) return true;
        if (!cliente?.id || selectedProducts.length === 0) return false;
        if (step === 2) return true;
        if (step === 3) return enderecoSelecionado != undefined;
        if (step === 4) return tipoDeEntregaSelecionada != undefined;
        if (step === 5) return pagamentoSelecionado != undefined;
        return false;
    };

    const navigateToStep = (step: number) => {
        if (!canVisitStep(step)) {
            return;
        }

        navigate(`/carrinho/${steps[step - 1].route}`);
    };

    const handleContinue = async () => {
        if (selectedProducts.length === 0) {
            toast.info('Selecione ao menos um produto para continuar.', { position: 'top-center' });
            return;
        }

        if (activeStep === 1 && !cliente?.id) {
            navigate("/entrar");
            return;
        }

        if (activeStep === 1) {
            navigate("/carrinho/endereco");
            return;
        }

        if (activeStep === 2) {
            if (enderecoSelecionado == undefined) {
                toast.error("Selecione um endereço.", { position: 'top-center' });
                return;
            }

            navigate("/carrinho/entrega");
            return;
        }

        if (activeStep === 3) {
            if (tipoDeEntregaSelecionada == undefined) {
                toast.error("Selecione uma forma de entrega.", { position: 'top-center' });
                return;
            }

            navigate("/carrinho/pagamento");
            return;
        }

        if (activeStep === 4) {
            if (pagamentoSelecionado == undefined) {
                toast.error("Selecione uma forma de pagamento.", { position: 'top-center' });
                return;
            }

            navigate("/carrinho/confirmacao");
            return;
        }

        if (activeStep === 5) {
            const produtosSelecionados = produtos.filter(p => selectedItems.includes(p.internalId));

            setLoading(true);
            try {
                const response = await carrinhoService.gerarVenda(
                    cliente!,
                    produtosSelecionados.map(p => ({
                        id: p.id,
                        quantidade: p.quantidade,
                        idPromocoesEcommerce: p.idPromocoesEcommerce,
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
                    const orderId = getOrderIdFromResponse(response);
                    setOrderCompleted(true);

                    toast.success("Pedido realizado com sucesso!", { position: 'top-center' });

                    if (orderId != null) {
                        navigate(`/pedido/sucesso/${orderId}`, { replace: true });
                    } else {
                        toast.info(
                            "Seu pedido foi gerado, mas não recebemos o número para abrir o comprovante.",
                            { position: 'top-center' }
                        );
                        navigate("/minha-conta/pedidos", { replace: true });
                    }

                    window.setTimeout(() => {
                        void removerProdutosSelecionados();
                    }, 500);
                } else {
                    toast.error(response.mensagem || "Não foi possível finalizar o pedido.", { position: 'top-center' });
                }
            } catch (error) {
                console.error(error);
                toast.error("Erro ao gerar venda. Tente novamente.", { position: 'top-center' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBack = () => {
        const previousStep = activeStep - 1;
        if (previousStep >= 1) {
            navigateToStep(previousStep);
        }
    };

    if (produtos.length <= 0 && activeStep != 1 && activeStep != 5) {
        return <Navigate to="/" replace />;
    }

    if (activeStep > 1 && !cliente?.id) {
        return <Navigate to="/entrar" replace />;
    }

    if (!orderCompleted && activeStep > 1 && selectedProducts.length === 0) {
        return <Navigate to="/carrinho" replace />;
    }

    if (!orderCompleted && activeStep >= 3 && enderecoSelecionado == undefined) {
        return <Navigate to="/carrinho/endereco" replace />;
    }

    if (!orderCompleted && activeStep >= 4 && tipoDeEntregaSelecionada == undefined) {
        return <Navigate to="/carrinho/entrega" replace />;
    }

    if (!orderCompleted && activeStep >= 5 && pagamentoSelecionado == undefined) {
        return <Navigate to="/carrinho/pagamento" replace />;
    }

    return (
        <div>
            <Header />

            <div className="bg-gray-100 min-h-screen py-8">
                <div className="max-w-387 mx-auto px-4">
                    <CheckoutStepper
                        activeStep={activeStep}
                        canVisitStep={canVisitStep}
                        onStepSelect={navigateToStep}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Outlet />
                        </div>

                        <div className="lg:col-span-1">
                            <CartSummary
                                step={activeStep}
                                onContinue={handleContinue}
                                onBack={handleBack}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
