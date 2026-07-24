import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
    AlertCircle,
    CheckCircle2,
    ChevronDown,
    CircleX,
    Copy,
    CreditCard,
    MapPin,
    Package,
    PackageCheck,
    RefreshCw,
    ShoppingCart,
    Truck,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { OptimizedImage } from "~/components/OptimizedImage";
import config from "~/config/config";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import {
    extractOrder,
    formatOrderDate,
    formatOrderDateTime,
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
    getOrderStatusInfo,
    getOrderTrackingCode,
    type OrderItem,
    type OrderRecord,
} from "~/features/minhaconta/utils/orderHelpers";
import { getProductImageFallback } from "~/utils/imagePlaceholders";

export function meta() {
    return [
        { title: "Detalhes do Pedido - Word System" },
    ];
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
    const status = getOrderStatusInfo(pedido.status || pedido.situacao);

    return (
        <div className="mx-auto max-w-3xl">
            <PedidoBreadcrumb orderId={orderId} />

            <p className={`mb-4 text-sm font-extrabold ${status.className}`}>
                {status.label}
            </p>

            <OrderInfoCard pedido={pedido} orderId={orderId} />
            <OrderProductsCard pedido={pedido} />
        </div>
    );
}

function PedidoBreadcrumb({ orderId }: { orderId: string }) {
    return (
        <nav className="mb-5 text-sm text-primary/65" aria-label="Breadcrumb">
            <Link to="/minha-conta" className="underline-offset-2 hover:underline">
                Central Minha Conta
            </Link>
            <span className="mx-1 text-primary/40">/</span>
            <Link
                to="/minha-conta/pedidos"
                className="underline-offset-2 hover:underline"
            >
                Meus Pedidos
            </Link>
            <span className="mx-1 text-primary/40">/</span>
            <span className="font-bold text-primary">Pedido {orderId}</span>
        </nav>
    );
}

function OrderInfoCard({
    pedido,
    orderId,
}: {
    pedido: OrderRecord;
    orderId: string;
}) {
    const [copied, setCopied] = useState(false);
    const date = formatOrderDate(getOrderDateValue(pedido));
    const addressLines = getOrderAddressLines(pedido);
    const payment = getOrderPaymentLabel(pedido);

    const total = pedido.valor ?? pedido.total ?? pedido.valor_total;
    const subtotal = pedido.subtotal ?? pedido.valor_produtos ?? total;
    const shipping = pedido.valor_do_frete ?? pedido.frete ?? 0;

    async function copyOrderId() {
        if (!orderId || typeof navigator === "undefined") return;

        try {
            await navigator.clipboard.writeText(orderId);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            setCopied(false);
        }
    }

    return (
        <section className="overflow-hidden rounded-md border border-primary/10 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3 border-b border-primary/10 p-3">
                <p className="min-w-0 text-sm font-extrabold text-primary">
                    {date} - Pedido {orderId}
                </p>
                <button
                    type="button"
                    onClick={copyOrderId}
                    className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md px-2 text-primary transition-colors hover:bg-main-bg"
                    aria-label="Copiar número do pedido"
                >
                    <Copy size={18} aria-hidden="true" />
                    <span className="sr-only">{copied ? "Copiado" : "Copiar"}</span>
                </button>
            </div>

            <DetailAccordion icon={<MapPin size={17} />} title="Endereço">
                <div className="space-y-1 text-sm text-primary/70">
                    {addressLines.map((line) => (
                        <p key={line}>{line}</p>
                    ))}
                </div>
            </DetailAccordion>

            <DetailAccordion
                icon={<CreditCard size={17} />}
                title="Forma de pagamento"
            >
                <p className="text-sm text-primary/70">{payment}</p>
            </DetailAccordion>

            <DetailAccordion icon={<ShoppingCart size={17} />} title="Valor">
                <div className="space-y-2 text-sm">
                    <SummaryLine label="Subtotal" value={formatOrderMoney(subtotal)} />
                    <SummaryLine label="Frete" value={formatOrderMoney(shipping)} />
                    <SummaryLine
                        label="Total"
                        value={formatOrderMoney(total)}
                        strong
                    />
                </div>
            </DetailAccordion>
        </section>
    );
}

function DetailAccordion({
    children,
    icon,
    title,
}: {
    children: ReactNode;
    icon: ReactNode;
    title: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-primary/10 last:border-0">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="flex min-h-10 w-full items-center justify-between gap-3 px-3 text-left text-sm font-extrabold uppercase tracking-wide text-primary transition-colors hover:bg-main-bg"
                aria-expanded={isOpen}
            >
                <span className="flex min-w-0 items-center gap-2">
                    <span className="text-primary/55">{icon}</span>
                    {title}
                </span>
                <ChevronDown
                    size={18}
                    className={`shrink-0 text-primary/60 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div className="border-t border-primary/10 bg-main-bg/40 px-3 py-3">
                    {children}
                </div>
            )}
        </div>
    );
}

function OrderProductsCard({ pedido }: { pedido: OrderRecord }) {
    const items = getOrderItems(pedido);
    const sellerName = config.FOOTER_CONFIG.nomeExibicao || "Word System";
    const deliveryEstimate = getOrderDeliveryEstimate(pedido);

    return (
        <section className="mt-4 overflow-hidden rounded-md border border-primary/10 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
            {items.length > 0 ? (
                items.map((item, index) => (
                    <OrderProductDetail
                        key={`${getOrderItemName(item)}-${index}`}
                        item={item}
                        sellerName={sellerName}
                        deliveryEstimate={deliveryEstimate}
                        fallbackTotal={pedido.valor ?? pedido.total}
                    />
                ))
            ) : (
                <div className="flex items-center gap-3 p-4 text-sm text-primary/60">
                    <Package size={24} className="text-primary/35" />
                    Itens do pedido indisponíveis.
                </div>
            )}

            <TrackingPanel pedido={pedido} />
        </section>
    );
}

function OrderProductDetail({
    deliveryEstimate,
    fallbackTotal,
    item,
    sellerName,
}: {
    deliveryEstimate: string;
    fallbackTotal: unknown;
    item: OrderItem;
    sellerName: string;
}) {
    const productName = getOrderItemName(item);
    const productImage = getOrderItemImage(item);
    const itemTotal = getOrderItemTotal(item);

    return (
        <div className="border-b border-primary/10 p-3">
            <div className="mb-4 flex items-center justify-between gap-3 text-[11px] text-primary">
                <span className="min-w-0 truncate">
                    Vendido e entregue por:{" "}
                    <strong className="font-extrabold">{sellerName}</strong>
                </span>
                <span className="shrink-0 font-bold">
                    Entrega até: {deliveryEstimate}
                </span>
            </div>

            <div className="flex gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-primary/10 bg-main-bg">
                    {productImage ? (
                        <OptimizedImage
                            src={productImage}
                            fallbackSrc={getProductImageFallback(productName)}
                            alt={productName}
                            className="h-full w-full object-contain p-1 mix-blend-multiply"
                        />
                    ) : (
                        <Package size={26} className="text-primary/35" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-3 text-sm font-extrabold leading-snug text-primary">
                        {productName}
                    </h2>
                    <div className="mt-2 flex items-end justify-between gap-3">
                        <p className="text-xs text-primary/60">
                            Quantidade: {getOrderItemQuantity(item)}
                        </p>
                        <p className="shrink-0 text-sm font-medium text-primary/75">
                            {formatOrderMoney(itemTotal || fallbackTotal)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TrackingPanel({ pedido }: { pedido: OrderRecord }) {
    const trackingCode = getOrderTrackingCode(pedido) || "Não informado";
    const status = getOrderStatusInfo(pedido.status || pedido.situacao);
    const statusDate = formatOrderDateTime(getOrderStatusDateValue(pedido));

    return (
        <div className="p-4 sm:p-5">
            <div>
                <p className="text-sm font-extrabold uppercase text-primary">
                    Rastreio:
                </p>
                <p className="mt-1 text-sm text-primary/70">{trackingCode}</p>
            </div>

            <TrackingSteps tone={status.tone} />

            <p className="mt-5 text-center text-sm text-primary/75">
                <strong>Status:</strong> {status.timelineLabel}
                {statusDate !== "-" ? ` - ${statusDate}` : ""}
            </p>
        </div>
    );
}

function TrackingSteps({
    tone,
}: {
    tone: ReturnType<typeof getOrderStatusInfo>["tone"];
}) {
    const isCancelled = tone === "cancelled";
    const activeCount = tone === "delivered" ? 4 : tone === "approved" ? 2 : 1;
    const steps = [
        ShoppingCart,
        CreditCard,
        PackageCheck,
        Truck,
        isCancelled ? CircleX : CheckCircle2,
    ];

    return (
        <div className="mt-10 flex items-center">
            {steps.map((Icon, index) => {
                const isLast = index === steps.length - 1;
                const isActive = index < activeCount;
                const isDanger = isCancelled && isLast;

                return (
                    <div key={index} className="flex flex-1 items-center last:flex-none">
                        <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                                isDanger
                                    ? "bg-red-600 text-white"
                                    : isActive
                                      ? "bg-terciary text-white"
                                      : "bg-primary/10 text-primary/25"
                            }`}
                        >
                            <Icon size={16} aria-hidden="true" />
                        </span>
                        {!isLast && (
                            <span
                                className={`mx-2 h-0.5 flex-1 ${
                                    isActive && !isCancelled
                                        ? "bg-terciary"
                                        : "bg-primary/15"
                                }`}
                                aria-hidden="true"
                            />
                        )}
                    </div>
                );
            })}
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
            className={`flex justify-between gap-4 ${
                strong
                    ? "border-t border-primary/10 pt-2 font-extrabold text-primary"
                    : "text-primary/70"
            }`}
        >
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}

function PedidoLoading() {
    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-5 h-5 w-64 animate-pulse rounded bg-primary/10" />
            <div className="mb-4 h-5 w-36 animate-pulse rounded bg-red-100" />
            <div className="h-36 animate-pulse rounded-md border border-primary/10 bg-white" />
            <div className="mt-4 h-72 animate-pulse rounded-md border border-primary/10 bg-white" />
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
        <div className="mx-auto max-w-3xl">
            <PedidoBreadcrumb orderId="-" />
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 shrink-0" size={22} />
                    <div>
                        <h1 className="font-bold">Erro ao buscar pedido</h1>
                        <p className="mt-1 text-sm">{message}</p>
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-300 px-4 text-xs font-bold transition-colors hover:bg-red-100"
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
