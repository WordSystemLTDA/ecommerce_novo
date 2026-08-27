import { useState } from "react";
import {
    ChevronRight,
    CreditCard,
    LoaderCircle,
    Package,
    QrCode,
    Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { OptimizedImage } from "~/components/OptimizedImage";
import config from "~/config/config";
import {
    mercadoPagoService,
    mercadoPagoStatus,
} from "~/features/mercado_pago/mercado_pago_service";
import {
    formatOrderDate,
    formatOrderMoney,
    getOrderDateValue,
    getOrderId,
    getOrderItemImage,
    getOrderItemName,
    getOrderItemQuantity,
    getOrderItemTotal,
    getOrderItems,
    getOrderLookupId,
    getOrderPaymentLabel,
    isPendingMercadoPagoPixOrder,
    normalizeText,
    type OrderItem,
} from "~/features/minhaconta/utils/orderHelpers";
import { getProductImageFallback } from "~/utils/imagePlaceholders";

interface OrderCardProps {
    pedido: any;
    detailsHref: string;
}

export function OrderCard({ pedido, detailsHref }: OrderCardProps) {
    const navigate = useNavigate();
    const [isGeneratingPix, setIsGeneratingPix] = useState(false);
    const items = getOrderItems(pedido);
    const orderId = getOrderId(pedido);
    const payment = getOrderPaymentLabel(pedido);
    const canPayWithPix = isPendingMercadoPagoPixOrder(pedido);
    const totalItems = items.reduce(
        (total, item) => total + getOrderItemQuantity(item),
        0,
    );
    const sellerName = config.FOOTER_CONFIG.nomeExibicao || "Loja";
    const orderTotal =
        pedido.valor ?? pedido.total ?? pedido.valor_total ?? pedido.subtotal ?? 0;
    const shipping =
        pedido.valor_do_frete ??
        pedido.valor_frete ??
        pedido.frete?.valor ??
        pedido.entrega?.valor ??
        0;
    const statusBadge = getStatusBadge(pedido, canPayWithPix);

    async function handlePayWithPix() {
        const saleId = Number(getOrderLookupId(pedido));
        if (!Number.isInteger(saleId) || saleId <= 0) {
            toast.error("Não foi possível identificar esta venda.");
            return;
        }

        try {
            setIsGeneratingPix(true);
            const order = await mercadoPagoService.getOrRenewPix(saleId);
            mercadoPagoService.storeOrder(order);

            if (mercadoPagoStatus.isApproved(order.status)) {
                toast.success("Este pedido já está pago.");
                navigate(`/pedido/sucesso/${saleId}`);
                return;
            }
            if (!order.qrCode) {
                throw new Error("O Mercado Pago não retornou um QR Code PIX válido.");
            }

            toast.success(
                order.renewed
                    ? "Um novo QR Code PIX foi gerado."
                    : "QR Code PIX pronto para pagamento.",
            );
            navigate(`/pedido/pendente/${saleId}`);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Não foi possível preparar o pagamento PIX.",
            );
        } finally {
            setIsGeneratingPix(false);
        }
    }

    return (
        <article className="overflow-hidden rounded-2xl border border-primary/10 bg-product-bg shadow-[0_4px_14px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.11)]">
            <div className="flex flex-col gap-4 border-b border-primary/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-main-bg text-primary">
                        <Package size={20} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-primary">
                            Pedido #{orderId || "-"}
                        </h2>
                        <p className="mt-0.5 text-xs text-primary/60">
                            {formatOrderCardDate(pedido)} · {totalItems}{" "}
                            {totalItems === 1 ? "item" : "itens"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <span
                        className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-xs font-medium ${statusBadge.className}`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dotClassName}`} />
                        {statusBadge.label}
                    </span>
                    <Link
                        to={detailsHref}
                        className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-primary/10 bg-product-bg px-3.5 text-xs font-semibold text-primary shadow-sm transition-colors hover:border-primary/25 hover:bg-main-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terciary/30"
                        aria-label={`Ver detalhes do pedido ${orderId || ""}`}
                    >
                        Ver detalhes
                        <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-primary/10 bg-main-bg/70 px-4 py-3 text-xs text-primary/60 sm:px-6">
                <span className="inline-flex items-center gap-2">
                    <CreditCard size={14} aria-hidden="true" />
                    {payment}
                </span>
                <span className="inline-flex items-center gap-2">
                    <Store size={14} aria-hidden="true" />
                    Vendido e entregue por
                    <strong className="font-semibold text-primary">{sellerName}</strong>
                </span>
            </div>

            {items.length > 0 ? (
                <div className="divide-y divide-primary/10">
                    {items.map((item, index) => (
                        <OrderProduct
                            key={`${getOrderItemName(item)}-${index}`}
                            item={item}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center gap-3 px-4 py-6 text-sm text-primary/60 sm:px-6">
                    <Package size={24} className="shrink-0 text-primary/35" />
                    Itens do pedido indisponíveis.
                </div>
            )}

            <div
                className={`flex flex-col gap-4 border-t border-primary/10 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 ${canPayWithPix ? "bg-amber-50/50" : "bg-product-bg"}`}
            >
                <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-primary/60">
                        Total
                    </p>
                    <p className="mt-0.5 text-xl font-bold text-primary">
                        {formatOrderMoney(orderTotal)}
                    </p>
                </div>

                {canPayWithPix ? (
                    <div className="flex flex-col items-stretch sm:items-end">
                        <button
                            type="button"
                            onClick={handlePayWithPix}
                            disabled={isGeneratingPix}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-extrabold uppercase text-secondary transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
                        >
                            {isGeneratingPix ? (
                                <LoaderCircle
                                    size={18}
                                    className="animate-spin"
                                    aria-hidden="true"
                                />
                            ) : (
                                <QrCode size={18} aria-hidden="true" />
                            )}
                            {isGeneratingPix ? "Preparando PIX..." : "Pagar com PIX"}
                        </button>
                        <p className="mt-2 text-center text-[11px] text-primary/55 sm:text-right">
                            Gere o QR Code e finalize em segundos.
                        </p>
                    </div>
                ) : (
                    <p className="text-xs text-primary/55">
                        Frete {formatOrderMoney(shipping)}
                    </p>
                )}
            </div>
        </article>
    );
}

function OrderProduct({ item }: { item: OrderItem }) {
    const productName = getOrderItemName(item);
    const productImage = getOrderItemImage(item);

    return (
        <div className="flex items-center gap-4 px-4 py-4 sm:px-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/10 bg-main-bg">
                {productImage ? (
                    <OptimizedImage
                        src={productImage}
                        fallbackSrc={getProductImageFallback(productName)}
                        alt={productName}
                        className="h-full w-full object-contain p-1.5 mix-blend-multiply"
                    />
                ) : (
                    <Package size={25} className="text-primary/35" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-primary">
                    {productName}
                </h3>
                <p className="mt-1 text-xs text-primary/60">
                    Quantidade: {getOrderItemQuantity(item)}
                </p>
            </div>

            <p className="shrink-0 text-sm font-semibold text-primary">
                {formatOrderMoney(getOrderItemTotal(item))}
            </p>
        </div>
    );
}

function formatOrderCardDate(pedido: any) {
    const date = formatOrderDate(getOrderDateValue(pedido));
    const timeValue = String(
        pedido.hora_lanc || pedido.hora || pedido.created_time || "",
    ).trim();
    const time = timeValue.match(/^(\d{2}:\d{2})/)?.[1];

    return time ? `${date} às ${time}` : date;
}

function getStatusBadge(pedido: any, canPayWithPix: boolean) {
    const status = normalizeText(pedido.status || pedido.situacao || "pendente");

    if (canPayWithPix || status.includes("pend")) {
        return {
            label: "Aguardando pagamento",
            className: "bg-amber-100 text-amber-700",
            dotClassName: "bg-amber-500",
        };
    }

    if (status.includes("cancel") || status.includes("recus")) {
        return {
            label: "Cancelado",
            className: "bg-red-100 text-red-700",
            dotClassName: "bg-red-500",
        };
    }

    if (status.includes("envi") || status.includes("transporte")) {
        return {
            label: "Enviado",
            className: "bg-orange-100 text-orange-700",
            dotClassName: "bg-orange-500",
        };
    }

    if (
        status.includes("concl") ||
        status.includes("aprov") ||
        status.includes("pago") ||
        status.includes("entreg")
    ) {
        return {
            label: status.includes("entreg") ? "Entregue" : "Concluído",
            className: "bg-emerald-100 text-emerald-700",
            dotClassName: "bg-emerald-500",
        };
    }

    return {
        label: String(pedido.status || pedido.situacao || "Em andamento"),
        className: "bg-main-bg text-primary/70",
        dotClassName: "bg-primary/40",
    };
}
