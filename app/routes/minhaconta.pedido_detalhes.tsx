import { useEffect, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    CircleX,
    Copy,
    CreditCard,
    MapPin,
    Package,
    PackageCheck,
    RefreshCw,
    ShoppingCart,
    Store,
    Truck,
    Wallet,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import { OptimizedImage } from "~/components/OptimizedImage";
import { OrderPaymentActions } from "~/components/OrderPaymentActions";
import config from "~/config/config";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import {
    extractOrder,
    formatOrderDate,
    formatOrderMoney,
    getOrderAddressLines,
    getOrderDateValue,
    getOrderDeliveryEstimate,
    getOrderId,
    getOrderItemImage,
    getOrderItemName,
    getOrderItemQuantity,
    getOrderItemTotal,
    getOrderItems,
    getOrderPaymentLabel,
    getOrderStatusDateValue,
    getOrderTrackingCode,
    normalizeText,
    type OrderItem,
    type OrderRecord,
} from "~/features/minhaconta/utils/orderHelpers";
import { getProductImageFallback } from "~/utils/imagePlaceholders";

export function meta() {
    return [{ title: "Detalhes do Pedido - Word System" }];
}

export default function PedidoDetalhesPage() {
    const { id } = useParams();
    const { cliente } = useAuth();
    const [pedido, setPedido] = useState<OrderRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const orderId = Number(id);

        if (!Number.isFinite(orderId) || orderId <= 0) {
            setLoading(false);
            setErrorMessage("Pedido inválido.");
            return;
        }

        if (!cliente?.id) return;

        let isMounted = true;

        async function carregarPedido() {
            try {
                setLoading(true);
                setErrorMessage(null);

                const response = await minhacontaService.pegarPedido(orderId);
                const order = extractOrder(response);

                if (isMounted) {
                    setPedido(order);
                }
            } catch (error) {
                console.error("Erro ao carregar detalhes do pedido:", error);

                if (isMounted) {
                    setPedido(null);
                    setErrorMessage(
                        "Não foi possível carregar os detalhes do pedido.",
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void carregarPedido();

        return () => {
            isMounted = false;
        };
    }, [cliente?.id, id]);

    if (loading) {
        return <PedidoLoading />;
    }

    if (errorMessage || !pedido) {
        return (
            <PedidoError
                message={errorMessage || "Pedido não encontrado."}
                onRetry={() => window.location.reload()}
            />
        );
    }

    const orderId = getOrderId(pedido) || id || "";

    return (
        <div className="mx-auto w-full max-w-3xl">
            <PedidoBreadcrumb orderId={orderId} />
            <PedidoHeader pedido={pedido} orderId={orderId} />
            <OrderStatusTimeline pedido={pedido} />
            <OrderPaymentActions pedido={pedido} variant="panel" />
            <OrderProductsCard pedido={pedido} />
            <OrderDetailsGrid pedido={pedido} />
        </div>
    );
}

function PedidoBreadcrumb({ orderId }: { orderId: string }) {
    return (
        <nav
            className="flex flex-wrap items-center gap-1.5 text-xs text-primary/60 sm:text-sm"
            aria-label="Breadcrumb"
        >
            <Link to="/minha-conta" className="underline-offset-2 hover:underline">
                Minha Conta
            </Link>
            <ChevronRight size={14} className="text-primary/35" aria-hidden="true" />
            <Link
                to="/minha-conta/pedidos"
                className="underline-offset-2 hover:underline"
            >
                Meus Pedidos
            </Link>
            <ChevronRight size={14} className="text-primary/35" aria-hidden="true" />
            <span className="font-bold text-primary">Pedido {orderId}</span>
        </nav>
    );
}

function PedidoHeader({
    pedido,
    orderId,
}: {
    pedido: OrderRecord;
    orderId: string;
}) {
    const [copied, setCopied] = useState(false);
    const date = formatOrderDate(getOrderDateValue(pedido));
    const visualStatus = getOrderVisualStatus(pedido);

    async function copyOrderId() {
        if (!orderId || typeof navigator === "undefined") return;

        try {
            await navigator.clipboard.writeText(orderId);
            setCopied(true);
            toast.success("Número do pedido copiado.");
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            toast.error("Não foi possível copiar o número do pedido.");
        }
    }

    return (
        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-sm text-primary/60">{date}</p>
                <h1 className="mt-0.5 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
                    Pedido #{orderId}
                </h1>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
                <span
                    className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-bold ${visualStatus.badgeClassName}`}
                >
                    {visualStatus.headerLabel}
                </span>
                <button
                    type="button"
                    onClick={copyOrderId}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-product-bg text-primary/65 shadow-sm transition-colors hover:bg-main-bg hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terciary/30"
                    aria-label={copied ? "Número copiado" : "Copiar número do pedido"}
                >
                    <Copy size={17} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

function OrderStatusTimeline({ pedido }: { pedido: OrderRecord }) {
    const visualStatus = getOrderVisualStatus(pedido);
    const statusDate = formatOrderDate(getOrderStatusDateValue(pedido));
    const steps = getTimelineSteps(pedido);

    return (
        <section
            aria-label="Status do pedido"
            className="mt-8 rounded-2xl border border-primary/10 bg-product-bg px-4 py-6 shadow-[0_4px_14px_rgba(15,23,42,0.08)] sm:px-6"
        >
            <ol className="flex items-start">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === steps.length - 1;

                    return (
                        <li
                            key={step.label}
                            className="flex min-w-0 flex-1 items-start last:flex-none"
                        >
                            <div className="flex w-12 shrink-0 flex-col items-center gap-2 sm:w-20">
                                <span
                                    className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm sm:h-11 sm:w-11 ${getTimelineStepClass(step.state)}`}
                                >
                                    <Icon size={18} aria-hidden="true" />
                                </span>
                                <span
                                    className={`max-w-20 text-center text-[10px] leading-tight sm:text-xs ${step.state === "inactive" ? "text-primary/55" : "font-semibold text-primary"}`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {!isLast && (
                                <span
                                    className={`mx-1 mt-[1.1rem] h-0.5 min-w-2 flex-1 rounded-full sm:mx-2 sm:mt-[1.3rem] ${step.connectorActive ? "bg-primary" : "bg-primary/15"}`}
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>

            <p className="mt-6 text-center text-sm text-primary/65">
                Status:{" "}
                <strong className={visualStatus.statusClassName}>
                    {visualStatus.timelineLabel}
                </strong>
                {statusDate !== "-" && (
                    <>
                        <span className="mx-1 text-primary/35">—</span>
                        {statusDate}
                    </>
                )}
            </p>
        </section>
    );
}

function OrderProductsCard({ pedido }: { pedido: OrderRecord }) {
    const items = getOrderItems(pedido);
    const sellerName = config.FOOTER_CONFIG.nomeExibicao || "Word System";
    const deliveryEstimate = getOrderDeliveryEstimate(pedido);
    const trackingCode = getOrderTrackingCode(pedido) || "Não informado";
    const total = pedido.valor ?? pedido.total ?? pedido.valor_total ?? 0;

    return (
        <section
            aria-label="Produtos do pedido"
            className="mt-6 overflow-hidden rounded-2xl border border-primary/10 bg-product-bg shadow-[0_4px_14px_rgba(15,23,42,0.08)]"
        >
            <div className="flex flex-col gap-2 border-b border-primary/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/60">
                    Produtos
                </h2>
                <span className="flex flex-wrap items-center gap-1.5 text-sm text-primary/60">
                    <Store size={16} aria-hidden="true" />
                    Vendido e entregue por
                    <strong className="font-semibold text-primary">{sellerName}</strong>
                </span>
            </div>

            {items.length > 0 ? (
                <ul className="divide-y divide-primary/10">
                    {items.map((item, index) => (
                        <OrderProductDetail
                            key={`${getOrderItemName(item)}-${index}`}
                            item={item}
                            deliveryEstimate={deliveryEstimate}
                        />
                    ))}
                </ul>
            ) : (
                <div className="flex items-center gap-3 px-5 py-8 text-sm text-primary/60 sm:px-6">
                    <Package size={24} className="text-primary/35" />
                    Itens do pedido indisponíveis.
                </div>
            )}

            <div className="flex flex-col gap-2 bg-main-bg/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <span className="text-sm font-medium text-primary/65">
                    Rastreio: {trackingCode}
                </span>
                <span className="text-lg font-bold text-primary">
                    Total: {formatOrderMoney(total)}
                </span>
            </div>
        </section>
    );
}

function OrderProductDetail({
    deliveryEstimate,
    item,
}: {
    deliveryEstimate: string;
    item: OrderItem;
}) {
    const productName = getOrderItemName(item);
    const productImage = getOrderItemImage(item);

    return (
        <li className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-main-bg/50 sm:px-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-main-bg">
                {productImage ? (
                    <OptimizedImage
                        src={productImage}
                        fallbackSrc={getProductImageFallback(productName)}
                        alt={productName}
                        className="h-16 w-16 object-contain mix-blend-multiply"
                    />
                ) : (
                    <Package size={28} className="text-primary/35" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-primary sm:text-base">
                    {productName}
                </h3>
                <p className="mt-1 text-xs text-primary/60 sm:text-sm">
                    Quantidade: {getOrderItemQuantity(item)}
                </p>
            </div>

            <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-primary sm:text-base">
                    {formatOrderMoney(getOrderItemTotal(item))}
                </p>
                <p className="mt-1 hidden text-xs text-primary/55 sm:block">
                    Entrega até: {deliveryEstimate}
                </p>
            </div>
        </li>
    );
}

type DetailSection = "address" | "payment" | "value";

function OrderDetailsGrid({ pedido }: { pedido: OrderRecord }) {
    const [activeSection, setActiveSection] = useState<DetailSection | null>(null);
    const details: Array<{
        id: DetailSection;
        icon: typeof MapPin;
        title: string;
        description: string;
    }> = [
        {
            id: "address",
            icon: MapPin,
            title: "Endereço",
            description: "Endereço de entrega do pedido",
        },
        {
            id: "payment",
            icon: CreditCard,
            title: "Forma de pagamento",
            description: "Como o pedido foi pago",
        },
        {
            id: "value",
            icon: Wallet,
            title: "Valor",
            description: "Resumo de valores e frete",
        },
    ];

    return (
        <div className="mt-6">
            <div className="grid gap-4 sm:grid-cols-3">
                {details.map((detail) => {
                    const Icon = detail.icon;
                    const isActive = activeSection === detail.id;

                    return (
                        <button
                            key={detail.id}
                            type="button"
                            onClick={() =>
                                setActiveSection((current) =>
                                    current === detail.id ? null : detail.id,
                                )
                            }
                            className={`group flex min-h-36 flex-col gap-3 rounded-2xl border bg-product-bg p-5 text-left shadow-[0_3px_10px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${isActive ? "border-orange-400" : "border-primary/10"}`}
                            aria-expanded={isActive}
                            aria-controls={`order-detail-${detail.id}`}
                        >
                            <span
                                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isActive ? "bg-orange-500 text-white" : "bg-main-bg text-primary group-hover:bg-orange-500 group-hover:text-white"}`}
                            >
                                <Icon size={20} aria-hidden="true" />
                            </span>
                            <span>
                                <span className="block font-bold text-primary">
                                    {detail.title}
                                </span>
                                <span className="mt-1 block text-xs text-primary/55">
                                    {detail.description}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {activeSection && (
                <section
                    id={`order-detail-${activeSection}`}
                    className="mt-4 rounded-2xl border border-primary/10 bg-product-bg p-5 shadow-sm sm:p-6"
                >
                    <OrderDetailContent pedido={pedido} section={activeSection} />
                </section>
            )}
        </div>
    );
}

function OrderDetailContent({
    pedido,
    section,
}: {
    pedido: OrderRecord;
    section: DetailSection;
}) {
    if (section === "address") {
        const addressLines = getOrderAddressLines(pedido);

        return (
            <div>
                <h2 className="font-bold text-primary">Endereço de entrega</h2>
                <div className="mt-3 space-y-1 text-sm text-primary/65">
                    {addressLines.map((line) => (
                        <p key={line}>{line}</p>
                    ))}
                </div>
            </div>
        );
    }

    if (section === "payment") {
        return (
            <div>
                <h2 className="font-bold text-primary">Forma de pagamento</h2>
                <p className="mt-3 text-sm text-primary/65">
                    {getOrderPaymentLabel(pedido)}
                </p>
            </div>
        );
    }

    const total = pedido.valor ?? pedido.total ?? pedido.valor_total ?? 0;
    const subtotal = pedido.subtotal ?? pedido.valor_produtos ?? total;
    const shipping =
        pedido.valor_do_frete ??
        pedido.valor_frete ??
        pedido.frete?.valor ??
        pedido.entrega?.valor ??
        0;

    return (
        <div>
            <h2 className="font-bold text-primary">Resumo de valores</h2>
            <div className="mt-3 space-y-2 text-sm">
                <SummaryLine label="Subtotal" value={formatOrderMoney(subtotal)} />
                <SummaryLine label="Frete" value={formatOrderMoney(shipping)} />
                <SummaryLine label="Total" value={formatOrderMoney(total)} strong />
            </div>
        </div>
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
            className={`flex justify-between gap-4 ${strong ? "border-t border-primary/10 pt-2 font-bold text-primary" : "text-primary/65"}`}
        >
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}

type TimelineState = "active" | "inactive" | "danger" | "success";

function getTimelineSteps(pedido: OrderRecord) {
    const status = normalizeText(pedido.status || pedido.situacao || "pendente");
    const isCancelled = status.includes("cancel") || status.includes("recus");
    const isDelivered = status.includes("entreg");
    const isSent = status.includes("envi") || status.includes("transporte");
    const isPreparing = status.includes("separ") || status.includes("prepar");
    const isApproved =
        status.includes("aprov") ||
        status.includes("pago") ||
        status.includes("concl");
    const activeThrough = isDelivered
        ? 4
        : isSent
          ? 3
          : isPreparing
            ? 2
            : isApproved
              ? 1
              : 0;
    const baseSteps = [
        { icon: ShoppingCart, label: "Pedido feito" },
        { icon: PackageCheck, label: "Aprovado" },
        { icon: Package, label: "Em separação" },
        { icon: Truck, label: "Enviado" },
        {
            icon: isCancelled ? CircleX : CheckCircle2,
            label: isCancelled ? "Cancelado" : "Concluído",
        },
    ];

    return baseSteps.map((step, index) => {
        let state: TimelineState = "inactive";

        if (isCancelled && index === 4) {
            state = "danger";
        } else if (index <= activeThrough) {
            state = isDelivered && index === 4 ? "success" : "active";
        }

        return {
            ...step,
            state,
            connectorActive: !isCancelled && index < activeThrough,
        };
    });
}

function getTimelineStepClass(state: TimelineState) {
    if (state === "danger") return "bg-red-600 text-white";
    if (state === "success") return "bg-emerald-600 text-white";
    if (state === "active") return "bg-primary text-secondary";
    return "bg-main-bg text-primary/45";
}

function getOrderVisualStatus(pedido: OrderRecord) {
    const rawStatus = String(pedido.status || pedido.situacao || "Pendente");
    const status = normalizeText(rawStatus);

    if (status.includes("cancel") || status.includes("recus")) {
        return {
            headerLabel: "Compra cancelada",
            timelineLabel: "Pedido cancelado",
            badgeClassName: "bg-red-600 text-white",
            statusClassName: "text-red-600",
        };
    }

    if (status.includes("pend") || status.includes("aguard")) {
        return {
            headerLabel: "Aguardando pagamento",
            timelineLabel: "Aguardando pagamento",
            badgeClassName: "bg-amber-100 text-amber-700",
            statusClassName: "text-amber-600",
        };
    }

    if (status.includes("entreg")) {
        return {
            headerLabel: "Pedido entregue",
            timelineLabel: "Pedido entregue",
            badgeClassName: "bg-emerald-100 text-emerald-700",
            statusClassName: "text-emerald-600",
        };
    }

    if (status.includes("envi") || status.includes("transporte")) {
        return {
            headerLabel: "Pedido enviado",
            timelineLabel: "Pedido enviado",
            badgeClassName: "bg-orange-100 text-orange-700",
            statusClassName: "text-orange-600",
        };
    }

    if (status.includes("separ") || status.includes("prepar")) {
        return {
            headerLabel: "Em separação",
            timelineLabel: "Pedido em separação",
            badgeClassName: "bg-sky-100 text-sky-700",
            statusClassName: "text-sky-600",
        };
    }

    if (
        status.includes("aprov") ||
        status.includes("pago") ||
        status.includes("concl")
    ) {
        return {
            headerLabel: "Concluído",
            timelineLabel: "Pagamento aprovado",
            badgeClassName: "bg-emerald-100 text-emerald-700",
            statusClassName: "text-emerald-600",
        };
    }

    return {
        headerLabel: rawStatus,
        timelineLabel: rawStatus,
        badgeClassName: "bg-main-bg text-primary/70",
        statusClassName: "text-primary",
    };
}

function PedidoLoading() {
    return (
        <div className="mx-auto w-full max-w-3xl animate-pulse">
            <div className="h-5 w-72 rounded bg-primary/10" />
            <div className="mt-8 h-20 rounded-xl bg-primary/10" />
            <div className="mt-8 h-40 rounded-2xl border border-primary/10 bg-product-bg" />
            <div className="mt-6 h-72 rounded-2xl border border-primary/10 bg-product-bg" />
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-36 rounded-2xl border border-primary/10 bg-product-bg"
                    />
                ))}
            </div>
        </div>
    );
}

function PedidoError({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    return (
        <div className="mx-auto w-full max-w-3xl">
            <PedidoBreadcrumb orderId="-" />
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 shrink-0" size={22} />
                    <div>
                        <h1 className="font-bold">Erro ao buscar pedido</h1>
                        <p className="mt-1 text-sm">{message}</p>
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-red-300 px-4 text-xs font-bold transition-colors hover:bg-red-100"
                        >
                            <RefreshCw size={15} />
                            Atualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
