import { ChevronRight, CreditCard, Package } from "lucide-react";
import { Link } from "react-router";
import { OptimizedImage } from "~/components/OptimizedImage";
import {
    formatOrderDate,
    getOrderDateValue,
    getOrderId,
    getOrderItemImage,
    getOrderItemName,
    getOrderItemQuantity,
    getOrderItems,
    getOrderPaymentLabel,
    getOrderStatusInfo,
    type OrderItem,
} from "~/features/minhaconta/utils/orderHelpers";
import { getProductImageFallback } from "~/utils/imagePlaceholders";

interface OrderCardProps {
    pedido: any;
    detailsHref: string;
}

export function OrderCard({ pedido, detailsHref }: OrderCardProps) {
    const items = getOrderItems(pedido);
    const firstItem = items[0];
    const orderId = getOrderId(pedido);
    const status = getOrderStatusInfo(pedido.status || pedido.situacao);
    const payment = getOrderPaymentLabel(pedido);

    return (
        <article className="overflow-hidden rounded-lg border border-primary/10 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-terciary/40 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            <Link
                to={detailsHref}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terciary/30"
                aria-label={`Ver detalhes do pedido ${orderId || ""}`}
            >
                <div className="flex items-center justify-between gap-3 border-b border-primary/10 p-4">
                    <p className="min-w-0 flex-1 text-[13px] text-primary/75 sm:text-sm">
                        <span className="font-bold text-primary">Pedido:</span>{" "}
                        <span className="font-medium">{orderId || "-"}</span>
                        <span className="mx-1 text-primary/30">-</span>
                        <span>{formatOrderDate(getOrderDateValue(pedido))}</span>
                    </p>

                    <span className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-md border border-terciary px-3 text-[11px] font-extrabold uppercase tracking-wide text-terciary transition-colors group-hover:bg-terciary group-hover:text-white sm:gap-2 sm:text-xs">
                        Ver detalhes
                        <ChevronRight size={16} aria-hidden="true" />
                    </span>
                </div>

                <div className={`border-b border-primary/10 px-4 py-3 text-sm font-semibold ${status.className}`}>
                    {status.label}
                </div>

                <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-3 text-xs text-primary/60">
                    <CreditCard size={14} className="shrink-0" aria-hidden="true" />
                    <span className="min-w-0 truncate">{payment}</span>
                </div>

                {firstItem ? (
                    <OrderProduct item={firstItem} />
                ) : (
                    <div className="flex items-center gap-3 p-4 text-sm text-primary/60">
                        <Package size={24} className="shrink-0 text-primary/35" />
                        Itens do pedido indisponíveis.
                    </div>
                )}
            </Link>
        </article>
    );
}

function OrderProduct({ item }: { item: OrderItem }) {
    const productName = getOrderItemName(item);
    const productImage = getOrderItemImage(item);

    return (
        <div className="flex gap-3 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-primary/10 bg-main-bg sm:h-16 sm:w-16">
                {productImage ? (
                    <OptimizedImage
                        src={productImage}
                        fallbackSrc={getProductImageFallback(productName)}
                        alt={productName}
                        className="h-full w-full object-contain p-1 mix-blend-multiply"
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
        </div>
    );
}
