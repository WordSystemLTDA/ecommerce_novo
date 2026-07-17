import {
    CalendarDays,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    CreditCard,
    ExternalLink,
    Hash,
    Package,
    Truck,
    XCircle,
} from "lucide-react";
import { currencyFormatter } from "~/utils/formatters";

interface OrderCardProps {
    pedido: any;
    isExpanded: boolean;
    onToggle: () => void;
}

export function OrderCard({ pedido, isExpanded, onToggle }: OrderCardProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";

        const date = new Date(dateString);

        if (!Number.isNaN(date.getTime())) {
            return new Intl.DateTimeFormat("pt-BR").format(date);
        }

        const [year, month, day] = dateString.split('-');
        return day && month && year ? `${day}/${month}/${year}` : dateString;
    };

    const formatMoney = (value: unknown) => {
        const parsedValue = Number(value);

        return currencyFormatter.format(Number.isFinite(parsedValue) ? parsedValue : 0);
    };

    const formatStatus = (status: string) => {
        if (!status) return "Pendente";

        return status
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pendente': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'aprovado': return 'text-(--dynamic-success) bg-(--dynamic-success-bg) border-(--dynamic-success)';
            case 'cancelado': return 'text-red-600 bg-red-50 border-red-200';
            case 'entregue': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pendente': return <Clock size={16} className="mr-1" />;
            case 'aprovado': return <CheckCircle size={16} className="mr-1" />;
            case 'cancelado': return <XCircle size={16} className="mr-1" />;
            case 'entregue': return <Truck size={16} className="mr-1" />;
            default: return <Package size={16} className="mr-1" />;
        }
    };

    const entrega = pedido.entrega;
    const trackingCode = entrega?.codigo_rastreio || entrega?.melhor_envio_order_id;
    const trackingStatus = entrega?.status || "";

    return (
        <article className="bg-white border border-primary/10 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
            <button
                type="button"
                className="w-full p-4 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between cursor-pointer bg-gray-50/50 text-left"
                onClick={onToggle}
                aria-expanded={isExpanded}
            >
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-bold text-lg text-gray-800">Pedido #{pedido.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(pedido.status)}`}>
                            {getStatusIcon(pedido.status)}
                            {formatStatus(pedido.status)}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm text-gray-500 sm:grid-cols-2 xl:grid-cols-4">
                        <OrderMeta icon={CalendarDays} label="Data" value={formatDate(pedido.data_lanc)} />
                        <OrderMeta
                            icon={Package}
                            label="Itens"
                            value={`${pedido.itens?.length || 0} item${pedido.itens?.length === 1 ? "" : "s"}`}
                        />
                        <OrderMeta
                            icon={CreditCard}
                            label="Pagamento"
                            value={pedido.pagamento?.nome || pedido.pagamento?.tipo || pedido.forma_pagamento || "-"}
                        />
                        <OrderMeta
                            icon={Hash}
                            label="Total"
                            value={formatMoney(pedido.valor)}
                            strong
                        />
                        {entrega && (
                            <OrderMeta
                                icon={Truck}
                                label="Entrega"
                                value={[entrega.transportadora, trackingStatus].filter(Boolean).join(" - ") || "-"}
                            />
                        )}
                    </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600">
                    {isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </button>

            {isExpanded && (
                <div className="border-t border-primary/10 p-4 sm:p-6 bg-white">
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h4 className="font-semibold text-gray-800">Itens do pedido</h4>
                            <p className="text-sm text-gray-500">
                                Conferência de produtos e valores deste pedido.
                            </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                            {formatMoney(pedido.valor)}
                        </span>
                    </div>

                    {entrega && (
                        <div className="mb-5 rounded-lg border border-primary/10 bg-primary/5 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                                        <Truck size={18} className="text-primary" />
                                        Entrega
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {entrega.servico_nome || pedido.nome_transportadora || "Envio"} {entrega.transportadora ? `por ${entrega.transportadora}` : ""}
                                    </p>
                                    {trackingStatus && (
                                        <p className="mt-2 text-sm font-semibold text-primary">
                                            Status: {formatStatus(trackingStatus)}
                                        </p>
                                    )}
                                </div>
                                <div className="rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
                                    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                                        Rastreio
                                    </span>
                                    <span className="font-semibold">{trackingCode || "Aguardando codigo"}</span>
                                    {entrega.tracking_url && (
                                        <a
                                            href={entrega.tracking_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-terciary"
                                        >
                                            Abrir rastreio <ExternalLink size={13} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden rounded-lg border border-gray-100">
                        {pedido.itens?.map((item: any, index: number) => (
                            <div
                                key={`${item.id ?? item.produto ?? item.nome_do_produto}-${index}`}
                                className="flex items-start gap-4 border-b border-gray-100 p-4 last:border-0"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center shrink-0 mr-4">
                                    <Package size={24} className="text-gray-400" />
                                </div>

                                <div className="flex-1">
                                    <h5 className="font-medium text-gray-800 line-clamp-2">
                                        {item.nome_do_produto || `${item.nome} #${item.produto}`}
                                    </h5>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {item.quantidade || 1}x {formatMoney(item.valor)}
                                    </div>
                                </div>
                                <div className="shrink-0 text-right font-semibold text-gray-800">
                                    {formatMoney(item.total)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                        <div className="w-full sm:w-64 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatMoney(pedido.subtotal || pedido.valor)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Frete</span>
                                <span>{formatMoney(pedido.valor_do_frete || 0)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t">
                                <span>Total</span>
                                <span>{formatMoney(pedido.valor)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}

interface OrderMetaProps {
    icon: typeof CalendarDays;
    label: string;
    value: string;
    strong?: boolean;
}

function OrderMeta({ icon: Icon, label, value, strong = false }: OrderMetaProps) {
    return (
        <span className="flex items-start gap-2">
            <Icon className="mt-0.5 shrink-0 text-primary/55" size={16} />
            <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-[0.12em] text-gray-400">
                    {label}
                </span>
                <span className={`block truncate ${strong ? "font-bold text-gray-900" : "text-gray-600"}`}>
                    {value}
                </span>
            </span>
        </span>
    );
}
