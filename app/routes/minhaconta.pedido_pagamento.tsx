import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    AlertCircle,
    ArrowLeft,
    Check,
    ChevronRight,
    CreditCard,
    LoaderCircle,
    Package,
    QrCode,
    RefreshCw,
    ShieldCheck,
    Store,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import config from "~/config/config";
import { MercadoPagoCardBrick } from "~/features/mercado_pago/MercadoPagoCardBrick";
import {
    mercadoPagoService,
    mercadoPagoStatus,
} from "~/features/mercado_pago/mercado_pago_service";
import type {
    MercadoPagoCardData,
    MercadoPagoConfigResponse,
    MercadoPagoMethod,
    MercadoPagoOrderResult,
    MercadoPagoPaymentData,
} from "~/features/mercado_pago/types";
import { useAuth } from "~/features/auth/context/AuthContext";
import { carrinhoService } from "~/features/carrinho/services/carrinhoService";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import {
    extractOrder,
    formatOrderDate,
    formatOrderMoney,
    getOrderDateValue,
    getOrderDetailsPath,
    getOrderId,
    getOrderItemName,
    getOrderItemQuantity,
    getOrderItems,
    getOrderLookupId,
    getOrderPaymentLabel,
    getOrderPaymentMethod,
    isPendingMercadoPagoOrder,
    normalizeText,
    type OrderRecord,
} from "~/features/minhaconta/utils/orderHelpers";
import type { Pagamento } from "~/types/Pagamento";

export function meta() {
    return [{ title: "Pagamento do Pedido - Word System" }];
}

const replaceableStatuses = ["canceled", "expired", "rejected"];

export default function PedidoPagamentoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cliente } = useAuth();
    const [pedido, setPedido] = useState<OrderRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isContinuing, setIsContinuing] = useState(false);
    const [forceCardRetry, setForceCardRetry] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [gatewayConfig, setGatewayConfig] =
        useState<MercadoPagoConfigResponse | null>(null);
    const [gatewayPayment, setGatewayPayment] = useState<Pagamento | null>(null);
    const [selectedMethod, setSelectedMethod] =
        useState<MercadoPagoMethod | null>(null);
    const [installments, setInstallments] = useState(1);

    useEffect(() => {
        const orderId = Number(id);

        if (!Number.isFinite(orderId) || orderId <= 0) {
            setLoading(false);
            setIsLoadingOptions(false);
            setErrorMessage("Pedido invalido.");
            return;
        }

        if (!cliente?.id) return;

        let isMounted = true;

        async function carregarDadosPagamento() {
            try {
                setLoading(true);
                setIsLoadingOptions(true);
                setErrorMessage(null);
                setForceCardRetry(false);

                const [orderResponse, paymentsResponse, config] = await Promise.all([
                    minhacontaService.pegarPedido(orderId),
                    carrinhoService.listarPagamentosDisponiveis(),
                    mercadoPagoService.getPublicConfig(),
                ]);

                if (!isMounted) return;

                const order = extractOrder(orderResponse);
                const payments = Array.isArray(paymentsResponse?.data)
                    ? paymentsResponse.data
                    : [];
                const mercadoPago = payments.find(
                    (payment) =>
                        payment.tipo === "MERCADO_PAGO" ||
                        payment.tipo === "CHECKOUT_PRO",
                ) ?? null;
                const methods = mercadoPago?.mercado_pago_methods?.filter(
                    (method) => method === "pix" || method === "credit_card",
                ) ?? [];
                const currentMethod = getOrderPaymentMethod(order);

                setPedido(order);
                setGatewayPayment(mercadoPago);
                setGatewayConfig(config);
                setSelectedMethod(
                    currentMethod && methods.includes(currentMethod)
                        ? currentMethod
                        : methods[0] ?? null,
                );
                setInstallments(normalizeInstallments(
                    order?.pagamento_ecommerce?.parcelas,
                    config.maxInstallments,
                ));

                if (!order) {
                    setErrorMessage("Pedido nao encontrado.");
                    return;
                }

                if (!isPendingMercadoPagoOrder(order)) {
                    setErrorMessage(
                        "Este pedido nao esta aguardando pagamento online ou ja foi finalizado.",
                    );
                    return;
                }

                if (!mercadoPago || !config.enabled || methods.length === 0) {
                    setErrorMessage(
                        "Nenhuma forma de pagamento online esta disponivel agora.",
                    );
                }
            } catch (error) {
                if (isMounted) {
                    setPedido(null);
                    setErrorMessage(getErrorMessage(
                        error,
                        "Nao foi possivel carregar as opcoes de pagamento.",
                    ));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setIsLoadingOptions(false);
                }
            }
        }

        void carregarDadosPagamento();

        return () => {
            isMounted = false;
        };
    }, [cliente?.id, id]);

    const saleId = Number(getOrderLookupId(pedido));
    const orderId = getOrderId(pedido) || id || "";
    const detailsHref = getOrderDetailsPath(getOrderLookupId(pedido) || id || "");
    const currentMethod = getOrderPaymentMethod(pedido);
    const currentPaymentStatus = normalizeText(
        pedido?.pagamento_ecommerce?.status ||
        pedido?.pagamento_ecommerce?.payment_status ||
        "",
    );
    const currentOrderId = String(
        pedido?.pagamento_ecommerce?.order_id || "",
    ).trim();
    const total = parseOrderMoney(
        pedido?.valor ??
        pedido?.total ??
        pedido?.valor_total ??
        pedido?.subtotal ??
        0,
    );
    const email = String(
        cliente?.email || pedido?.cliente?.email || pedido?.email || "",
    ).trim();

    const availableMethods = useMemo(() => {
        const methods = gatewayPayment?.mercado_pago_methods ?? [];
        return methods.filter(
            (method): method is MercadoPagoMethod =>
                method === "pix" || method === "credit_card",
        );
    }, [gatewayPayment]);
    const maxInstallments = useMemo(() => {
        const limits = [
            gatewayPayment?.max_parcelas,
            gatewayConfig?.maxInstallments,
        ].filter(
            (value): value is number =>
                Number.isSafeInteger(value) && Number(value) > 0,
        );

        return Math.min(36, ...(limits.length > 0 ? limits : [12]));
    }, [gatewayConfig?.maxInstallments, gatewayPayment?.max_parcelas]);
    const installmentOptions = useMemo(
        () => Array.from({ length: maxInstallments }, (_, index) => index + 1),
        [maxInstallments],
    );
    const currentCardCanBeRetried = replaceableStatuses.includes(
        currentPaymentStatus,
    );
    const showCardForm =
        selectedMethod === "credit_card" &&
        (currentMethod !== "credit_card" || currentCardCanBeRetried || forceCardRetry);

    const redirectFromOrder = useCallback((order: MercadoPagoOrderResult) => {
        mercadoPagoService.storeOrder(order);

        if (mercadoPagoStatus.isApproved(order.status)) {
            toast.success("Pagamento confirmado com sucesso.");
            navigate(`/pedido/sucesso/${saleId}`);
            return;
        }
        if (mercadoPagoStatus.isFailure(order.status)) {
            navigate(`/pedido/falha/${saleId}`);
            return;
        }

        navigate(`/pedido/pendente/${saleId}`);
    }, [navigate, saleId]);

    const processPayment = useCallback(async (
        payment: MercadoPagoPaymentData,
    ) => {
        if (!Number.isInteger(saleId) || saleId <= 0) {
            throw new Error("Nao foi possivel identificar este pedido.");
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            if (payment.method === "pix") {
                await mercadoPagoService.requireDeviceSessionId();
            }

            if (
                currentMethod &&
                currentMethod !== payment.method &&
                currentOrderId
            ) {
                const currentOrder = await mercadoPagoService.getOrder(
                    currentOrderId,
                );
                if (mercadoPagoStatus.isApproved(currentOrder.status)) {
                    redirectFromOrder(currentOrder);
                    return;
                }
                if (["refunded", "charged_back"].includes(currentOrder.status)) {
                    throw new Error(
                        "Este pedido ja possui um pagamento processado e nao pode ser alterado.",
                    );
                }
                if (currentOrder.status === "unknown") {
                    throw new Error(
                        "Nao foi possivel confirmar a situacao da cobranca anterior.",
                    );
                }

                if (!replaceableStatuses.includes(currentOrder.status)) {
                    const canceledOrder = await mercadoPagoService.cancelOrder(
                        currentOrderId,
                    );
                    if (mercadoPagoStatus.isApproved(canceledOrder.status)) {
                        redirectFromOrder(canceledOrder);
                        return;
                    }
                    if (!replaceableStatuses.includes(canceledOrder.status)) {
                        throw new Error(
                            "A cobranca anterior ainda esta ativa. Aguarde e tente novamente.",
                        );
                    }
                }
            }

            const order = await mercadoPagoService.createOrder({
                saleId,
                payment,
                idempotencyKey: mercadoPagoService.createIdempotencyKey(),
            });

            toast.success(
                payment.method === "pix"
                    ? "Novo PIX preparado para pagamento."
                    : "Forma de pagamento atualizada.",
            );
            redirectFromOrder(order);
        } catch (error) {
            const message = getErrorMessage(
                error,
                "Nao foi possivel alterar a forma de pagamento.",
            );
            setErrorMessage(message);
            toast.error(message);
            throw error instanceof Error ? error : new Error(message);
        } finally {
            setIsProcessing(false);
        }
    }, [
        currentMethod,
        currentOrderId,
        redirectFromOrder,
        saleId,
    ]);

    const handleCardSubmit = useCallback(
        async (payment: MercadoPagoCardData) => processPayment(payment),
        [processPayment],
    );

    async function handlePixPayment() {
        try {
            await processPayment({ method: "pix" });
        } catch {
            // The page alert and toast already explain the problem.
        }
    }

    async function handleContinueCurrentCard() {
        if (!currentOrderId) {
            setForceCardRetry(true);
            return;
        }

        try {
            setIsContinuing(true);
            setErrorMessage(null);
            const order = await mercadoPagoService.getOrder(currentOrderId);

            if (replaceableStatuses.includes(order.status)) {
                setForceCardRetry(true);
                setErrorMessage(
                    "A tentativa anterior nao foi concluida. Informe o Cartão de Crédito novamente.",
                );
                return;
            }

            redirectFromOrder(order);
        } catch (error) {
            setErrorMessage(getErrorMessage(
                error,
                "Nao foi possivel consultar o pagamento atual.",
            ));
        } finally {
            setIsContinuing(false);
        }
    }

    if (loading) {
        return <PaymentLoading />;
    }

    if (!pedido) {
        return (
            <PaymentError
                message={errorMessage || "Pedido nao encontrado."}
                detailsHref="/minha-conta/pedidos"
                onRetry={() => window.location.reload()}
            />
        );
    }

    const canManagePayment = isPendingMercadoPagoOrder(pedido);

    return (
        <div className="mx-auto w-full max-w-5xl">
            <nav
                className="flex flex-wrap items-center gap-1.5 text-xs text-primary/60 sm:text-sm"
                aria-label="Breadcrumb"
            >
                <Link to="/minha-conta" className="underline-offset-2 hover:underline">
                    Central Minha Conta
                </Link>
                <ChevronRight size={14} className="text-primary/35" aria-hidden="true" />
                <Link
                    to="/minha-conta/pedidos"
                    className="underline-offset-2 hover:underline"
                >
                    Meus Pedidos
                </Link>
                <ChevronRight size={14} className="text-primary/35" aria-hidden="true" />
                <span className="font-bold text-primary">Pagamento</span>
            </nav>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-3">
                    <Link
                        to={detailsHref}
                        className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-product-bg text-primary shadow-sm transition-colors hover:bg-main-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terciary/30"
                        aria-label="Voltar para os detalhes do pedido"
                    >
                        <ArrowLeft size={20} aria-hidden="true" />
                    </Link>
                    <div>
                        <p className="text-sm text-primary/60">
                            Pedido #{orderId} - {formatOrderDate(getOrderDateValue(pedido))}
                        </p>
                        <h1 className="mt-0.5 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
                            Pagamento do pedido
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary/60">
                            Escolha como deseja finalizar a compra. A troca fica
                            disponivel apenas enquanto o pedido estiver aguardando pagamento.
                        </p>
                    </div>
                </div>
            </div>

            {!canManagePayment ? (
                <BlockedPaymentMessage detailsHref={detailsHref} message={errorMessage} />
            ) : (
                <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
                    <section className="rounded-2xl border border-primary/10 bg-product-bg p-4 shadow-[0_4px_14px_rgba(15,23,42,0.08)] sm:p-6">
                        <div className="flex items-start gap-3 rounded-2xl bg-main-bg p-4">
                            <ShieldCheck
                                size={21}
                                className="mt-0.5 shrink-0 text-emerald-600"
                                aria-hidden="true"
                            />
                            <div className="text-sm text-primary/65">
                                <p className="font-semibold text-primary">
                                    Total {formatOrderMoney(total)}
                                </p>
                                <p className="mt-1 leading-relaxed">
                                    Ao confirmar uma nova forma, a cobranca anterior so
                                    sera cancelada se ainda nao tiver sido paga.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/50">
                                Forma de pagamento
                            </p>

                            {isLoadingOptions ? (
                                <div className="mt-4 flex min-h-28 items-center justify-center gap-3 rounded-2xl border border-primary/10 bg-main-bg text-sm text-primary/60">
                                    <LoaderCircle className="animate-spin" size={20} />
                                    Consultando opcoes disponiveis...
                                </div>
                            ) : (
                                <>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {availableMethods.includes("pix") && (
                                            <MethodButton
                                                active={selectedMethod === "pix"}
                                                current={currentMethod === "pix"}
                                                description="QR Code e Pix Copia e Cola na hora"
                                                icon={<QrCode size={21} />}
                                                label="PIX"
                                                onClick={() => setSelectedMethod("pix")}
                                                disabled={isProcessing}
                                            />
                                        )}
                                        {availableMethods.includes("credit_card") && (
                                            <MethodButton
                                                active={selectedMethod === "credit_card"}
                                                current={currentMethod === "credit_card"}
                                                description={`Pagamento seguro em ate ${maxInstallments}x`}
                                                icon={<CreditCard size={21} />}
                                                label="Cartão de Crédito"
                                                onClick={() => setSelectedMethod("credit_card")}
                                                disabled={isProcessing}
                                            />
                                        )}
                                    </div>

                                    {errorMessage && (
                                        <p
                                            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                            role="alert"
                                        >
                                            {errorMessage}
                                        </p>
                                    )}

                                    <PaymentMethodContent
                                        email={email}
                                        gatewayEnabled={Boolean(gatewayConfig?.enabled)}
                                        installmentOptions={installmentOptions}
                                        installments={installments}
                                        isContinuing={isContinuing}
                                        isProcessing={isProcessing}
                                        selectedMethod={selectedMethod}
                                        setInstallments={setInstallments}
                                        showCardForm={showCardForm}
                                        total={total}
                                        currentMethod={currentMethod}
                                        onCardSubmit={handleCardSubmit}
                                        onContinueCurrentCard={handleContinueCurrentCard}
                                        onPixPayment={handlePixPayment}
                                    />
                                </>
                            )}
                        </div>
                    </section>

                    <OrderPaymentSummary
                        pedido={pedido}
                        detailsHref={detailsHref}
                        total={total}
                    />
                </div>
            )}
        </div>
    );
}

function PaymentMethodContent({
    currentMethod,
    email,
    gatewayEnabled,
    installmentOptions,
    installments,
    isContinuing,
    isProcessing,
    onCardSubmit,
    onContinueCurrentCard,
    onPixPayment,
    selectedMethod,
    setInstallments,
    showCardForm,
    total,
}: {
    currentMethod: MercadoPagoMethod | null;
    email: string;
    gatewayEnabled: boolean;
    installmentOptions: number[];
    installments: number;
    isContinuing: boolean;
    isProcessing: boolean;
    onCardSubmit: (payment: MercadoPagoCardData) => Promise<void>;
    onContinueCurrentCard: () => void;
    onPixPayment: () => void;
    selectedMethod: MercadoPagoMethod | null;
    setInstallments: (value: number) => void;
    showCardForm: boolean;
    total: number;
}) {
    if (selectedMethod === "pix") {
        return (
            <button
                type="button"
                onClick={onPixPayment}
                disabled={isProcessing || !gatewayEnabled}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-secondary transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-55"
            >
                {isProcessing ? (
                    <LoaderCircle size={18} className="animate-spin" />
                ) : (
                    <QrCode size={18} />
                )}
                {currentMethod === "pix"
                    ? "Continuar pagamento com PIX"
                    : "Trocar e gerar PIX"}
            </button>
        );
    }

    if (selectedMethod === "credit_card" && !showCardForm) {
        return (
            <button
                type="button"
                onClick={onContinueCurrentCard}
                disabled={isContinuing}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-secondary transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-55"
            >
                {isContinuing ? (
                    <LoaderCircle size={18} className="animate-spin" />
                ) : (
                    <CreditCard size={18} />
                )}
                Continuar pagamento com Cartão de Crédito
            </button>
        );
    }

    if (selectedMethod === "credit_card" && showCardForm) {
        return (
            <div className="mt-5 space-y-4">
                <label className="block">
                    <span className="text-sm font-bold text-primary">
                        Parcelamento
                    </span>
                    <select
                        value={installments}
                        onChange={(event) =>
                            setInstallments(Number(event.target.value))
                        }
                        disabled={isProcessing}
                        className="mt-2 min-h-11 w-full rounded-xl border border-primary/15 bg-product-bg px-4 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                        {installmentOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}x de {formatOrderMoney(total / option)} sem juros
                            </option>
                        ))}
                    </select>
                </label>

                {email ? (
                    <MercadoPagoCardBrick
                        amount={total}
                        email={email}
                        installments={installments}
                        onSubmit={onCardSubmit}
                        processing={isProcessing}
                    />
                ) : (
                    <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        Atualize o e-mail da conta para pagar com Cartão de Crédito.
                    </p>
                )}
            </div>
        );
    }

    return (
        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Escolha uma forma de pagamento para continuar.
        </p>
    );
}

function MethodButton({
    active,
    current,
    description,
    disabled,
    icon,
    label,
    onClick,
}: {
    active: boolean;
    current: boolean;
    description: string;
    disabled: boolean;
    icon: ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`flex min-h-24 items-start gap-3 rounded-2xl border p-4 text-left transition-all disabled:cursor-wait disabled:opacity-60 ${
                active
                    ? "border-primary bg-primary/[0.045] ring-1 ring-primary"
                    : "border-primary/10 bg-product-bg hover:border-primary/25 hover:bg-main-bg"
            }`}
        >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${active ? "bg-primary text-secondary" : "bg-main-bg text-primary/65"}`}>
                {icon}
            </span>
            <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-bold text-primary">
                    {label}
                    {active && <Check size={15} aria-hidden="true" />}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-primary/55">
                    {description}
                </span>
                {current && (
                    <span className="mt-2 inline-flex rounded-full bg-primary/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary/60">
                        Forma atual
                    </span>
                )}
            </span>
        </button>
    );
}

function OrderPaymentSummary({
    detailsHref,
    pedido,
    total,
}: {
    detailsHref: string;
    pedido: OrderRecord;
    total: number;
}) {
    const items = getOrderItems(pedido);
    const sellerName = config.FOOTER_CONFIG.nomeExibicao || "Loja";
    const firstItem = items[0];
    const totalItems = items.reduce(
        (sum, item) => sum + getOrderItemQuantity(item),
        0,
    );

    return (
        <aside className="rounded-2xl border border-primary/10 bg-product-bg p-4 shadow-[0_4px_14px_rgba(15,23,42,0.08)] sm:p-5 lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/50">
                Resumo
            </p>
            <div className="mt-4 space-y-4 text-sm">
                <SummaryLine label="Pedido" value={`#${getOrderId(pedido) || "-"}`} />
                <SummaryLine
                    label="Forma atual"
                    value={getOrderPaymentLabel(pedido)}
                />
                <SummaryLine
                    label="Itens"
                    value={`${totalItems || items.length} ${totalItems === 1 ? "item" : "itens"}`}
                />
                <SummaryLine label="Total" value={formatOrderMoney(total)} strong />
            </div>

            {firstItem && (
                <div className="mt-5 rounded-2xl bg-main-bg p-4">
                    <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-product-bg text-primary/60">
                            <Package size={19} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-bold text-primary">
                                {getOrderItemName(firstItem)}
                            </p>
                            <p className="mt-1 text-xs text-primary/55">
                                Quantidade: {getOrderItemQuantity(firstItem)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-5 flex items-center gap-2 text-xs text-primary/55">
                <Store size={15} aria-hidden="true" />
                Vendido e entregue por <strong className="text-primary">{sellerName}</strong>
            </div>

            <Link
                to={detailsHref}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary/15 bg-product-bg px-4 text-xs font-bold text-primary transition-colors hover:bg-main-bg"
            >
                Ver detalhes do pedido
                <ChevronRight size={16} aria-hidden="true" />
            </Link>
        </aside>
    );
}

function SummaryLine({
    label,
    strong = false,
    value,
}: {
    label: string;
    strong?: boolean;
    value: string;
}) {
    return (
        <div
            className={`flex justify-between gap-4 ${strong ? "border-t border-primary/10 pt-4 font-bold text-primary" : "text-primary/65"}`}
        >
            <span>{label}</span>
            <span className="text-right text-primary">{value}</span>
        </div>
    );
}

function BlockedPaymentMessage({
    detailsHref,
    message,
}: {
    detailsHref: string;
    message: string | null;
}) {
    return (
        <div className="mt-7 rounded-2xl border border-primary/10 bg-product-bg p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 shrink-0 text-amber-600" size={22} />
                <div>
                    <h2 className="font-bold text-primary">
                        Pagamento nao pode ser alterado
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-primary/60">
                        {message ||
                            "Este pedido ja foi pago ou nao esta mais aguardando pagamento."}
                    </p>
                    <Link
                        to={detailsHref}
                        className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-primary/15 px-4 text-xs font-bold text-primary transition-colors hover:bg-main-bg"
                    >
                        Voltar ao pedido
                    </Link>
                </div>
            </div>
        </div>
    );
}

function PaymentLoading() {
    return (
        <div className="mx-auto w-full max-w-5xl animate-pulse">
            <div className="h-5 w-72 rounded bg-primary/10" />
            <div className="mt-8 h-24 rounded-xl bg-primary/10" />
            <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
                <div className="h-96 rounded-2xl border border-primary/10 bg-product-bg" />
                <div className="h-72 rounded-2xl border border-primary/10 bg-product-bg" />
            </div>
        </div>
    );
}

function PaymentError({
    detailsHref,
    message,
    onRetry,
}: {
    detailsHref: string;
    message: string;
    onRetry: () => void;
}) {
    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 shrink-0" size={22} />
                    <div>
                        <h1 className="font-bold">Erro ao buscar pagamento</h1>
                        <p className="mt-1 text-sm">{message}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={onRetry}
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-red-300 px-4 text-xs font-bold transition-colors hover:bg-red-100"
                            >
                                <RefreshCw size={15} />
                                Atualizar
                            </button>
                            <Link
                                to={detailsHref}
                                className="inline-flex min-h-10 items-center justify-center rounded-full border border-red-300 px-4 text-xs font-bold transition-colors hover:bg-red-100"
                            >
                                Voltar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function normalizeInstallments(value: unknown, maxInstallments: number) {
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= maxInstallments
        ? parsed
        : 1;
}

function parseOrderMoney(value: unknown) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;

    const sanitized = String(value ?? "")
        .replace(/[^\d,.-]/g, "")
        .trim();

    if (!sanitized) return 0;

    const normalized = normalizeMoneyString(sanitized);
    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeMoneyString(value: string) {
    const hasComma = value.includes(",");
    const hasDot = value.includes(".");

    if (hasComma) {
        return value
            .replace(/\.(?=\d{3}(?:\D|$))/g, "")
            .replace(",", ".");
    }

    if (!hasDot) return value;

    const dotParts = value.split(".");

    if (dotParts.length === 2) {
        return value;
    }

    const lastPart = dotParts.at(-1) ?? "";

    if (lastPart.length <= 3) {
        return `${dotParts.slice(0, -1).join("")}.${lastPart}`;
    }

    return dotParts.join("");
}

function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && error.message.trim()) return error.message;

    if (typeof error === "object" && error !== null) {
        const candidate = error as {
            originalError?: unknown;
            error?: { error?: unknown } | string;
        };
        if (
            typeof candidate.originalError === "string" &&
            candidate.originalError.trim()
        ) {
            return candidate.originalError;
        }
        if (
            typeof candidate.error === "object" &&
            candidate.error !== null &&
            typeof candidate.error.error === "string"
        ) {
            return candidate.error.error;
        }
    }

    return fallback;
}
