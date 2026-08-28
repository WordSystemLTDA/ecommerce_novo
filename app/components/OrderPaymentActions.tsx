import { useState } from "react";
import {
    ArrowRightLeft,
    CreditCard,
    LoaderCircle,
    LockKeyhole,
    QrCode,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
    getOrderLookupId,
    getOrderPaymentLabel,
    getOrderPaymentMethod,
    getOrderPaymentPath,
    isPendingMercadoPagoOrder,
    type OrderRecord,
} from "~/features/minhaconta/utils/orderHelpers";
import {
    mercadoPagoService,
    mercadoPagoStatus,
} from "~/features/mercado_pago/mercado_pago_service";

interface OrderPaymentActionsProps {
    pedido: OrderRecord;
    variant?: "compact" | "panel";
}

export function OrderPaymentActions({
    pedido,
    variant = "compact",
}: OrderPaymentActionsProps) {
    const navigate = useNavigate();
    const currentMethod = getOrderPaymentMethod(pedido);
    const saleId = Number(getOrderLookupId(pedido));
    const paymentHref = getOrderPaymentPath(getOrderLookupId(pedido));
    const [isProcessing, setIsProcessing] = useState(false);

    async function handleQuickPixPayment() {
        if (!Number.isInteger(saleId) || saleId <= 0) {
            toast.error("Nao foi possivel identificar este pedido.");
            return;
        }

        try {
            setIsProcessing(true);
            const order = await mercadoPagoService.getOrRenewPix(saleId);
            mercadoPagoService.storeOrder(order);

            if (mercadoPagoStatus.isApproved(order.status)) {
                navigate(`/pedido/sucesso/${saleId}`);
                return;
            }

            if (mercadoPagoStatus.isFailure(order.status)) {
                navigate(`/pedido/falha/${saleId}`);
                return;
            }

            navigate(`/pedido/pendente/${saleId}`);
        } catch (error) {
            toast.error(getErrorMessage(
                error,
                "Nao foi possivel preparar o pagamento PIX.",
            ));
        } finally {
            setIsProcessing(false);
        }
    }

    if (!isPendingMercadoPagoOrder(pedido)) return null;

    if (variant === "panel") {
        return (
            <section className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/55 p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
                <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                        <LockKeyhole size={19} aria-hidden="true" />
                    </span>
                    <div>
                        <h2 className="font-bold text-primary">
                            Pagamento ainda nao finalizado
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-primary/60">
                            Forma atual: {getOrderPaymentLabel(pedido)}. Voce pode
                            trocar enquanto o pagamento nao for confirmado.
                        </p>
                    </div>
                </div>
                <PaymentButtons
                    currentMethod={currentMethod}
                    isProcessing={isProcessing}
                    paymentHref={paymentHref}
                    onQuickPix={handleQuickPixPayment}
                    panel
                />
            </section>
        );
    }

    return (
        <PaymentButtons
            currentMethod={currentMethod}
            isProcessing={isProcessing}
            paymentHref={paymentHref}
            onQuickPix={handleQuickPixPayment}
        />
    );
}

function PaymentButtons({
    currentMethod,
    isProcessing,
    onQuickPix,
    panel = false,
    paymentHref,
}: {
    currentMethod: "pix" | "credit_card" | null;
    isProcessing: boolean;
    onQuickPix: () => void;
    panel?: boolean;
    paymentHref: string;
}) {
    return (
        <div className={`flex flex-col gap-2 ${panel ? "mt-4 shrink-0 sm:mt-0" : "sm:items-end"}`}>
            <div className="flex flex-col gap-2 min-[430px]:flex-row">
                {currentMethod === "pix" && (
                    <button
                        type="button"
                        onClick={onQuickPix}
                        disabled={isProcessing}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-extrabold uppercase text-secondary transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isProcessing ? (
                            <LoaderCircle size={17} className="animate-spin" />
                        ) : (
                            <QrCode size={17} />
                        )}
                        Pagar com PIX
                    </button>
                )}
                <Link
                    to={paymentHref}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/15 bg-product-bg px-5 text-xs font-bold text-primary transition-colors hover:bg-main-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terciary/30"
                >
                    {currentMethod === "credit_card" ? (
                        <CreditCard size={16} aria-hidden="true" />
                    ) : (
                        <ArrowRightLeft size={16} aria-hidden="true" />
                    )}
                    {currentMethod === "pix"
                        ? "Alterar forma"
                        : "Ir para Pagamento"}
                </Link>
            </div>
            {!panel && (
                <p className="text-center text-[11px] text-primary/50 sm:text-right">
                    Voce pode trocar enquanto estiver pendente.
                </p>
            )}
        </div>
    );
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
