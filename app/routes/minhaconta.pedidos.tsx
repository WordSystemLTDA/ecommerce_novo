import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    ChevronDown,
    Filter,
    PackageSearch,
    RefreshCw,
    Search,
    ShoppingBag,
} from "lucide-react";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { OrderCard } from "~/components/OrderCard";
import { Pagination } from "~/components/Pagination";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import {
    getOrderDateValue,
    getOrderDetailsPath,
    getOrderId,
    getOrderItemName,
    getOrderItems,
    getOrderLookupId,
    isPendingMercadoPagoPixOrder,
    normalizeText,
} from "~/features/minhaconta/utils/orderHelpers";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Meus Pedidos - Word System" },
    ];
}

const periodOptions = [
    { value: "all", label: "Todo o período" },
    { value: "30", label: "Últimos 30 dias" },
    { value: "90", label: "Últimos 90 dias" },
    { value: "365", label: "Últimos 12 meses" },
];

const statusOptions = [
    { value: "all", label: "Todos os status" },
    { value: "pending", label: "Aguardando pagamento" },
    { value: "completed", label: "Concluído" },
    { value: "sent", label: "Enviado" },
    { value: "cancel", label: "Cancelado" },
];

export default function PedidosPage() {
    const { cliente } = useAuth();
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [periodFilter, setPeriodFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const itemsPerPage = 10;

    useEffect(() => {
        if (cliente?.id) {
            carregarPedidos(currentPage);
        }
    }, [cliente?.id, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [periodFilter, searchTerm, statusFilter]);

    const carregarPedidos = async (page: number) => {
        if (!cliente?.id) return;

        try {
            setLoading(true);
            setErrorMessage(null);
            const response = await minhacontaService.listarPedidos(
                cliente.id,
                page,
                itemsPerPage,
            );

            if (Array.isArray(response)) {
                setPedidos(response);
                setTotalItems(response.length);
                setTotalPages(Math.max(1, Math.ceil(response.length / itemsPerPage)));
            } else if (Array.isArray(response?.data?.dados)) {
                const pagination = response.data.paginacao;
                const total =
                    Number(pagination?.total) ||
                    Number(pagination?.total_registros) ||
                    Number(pagination?.total_itens) ||
                    Number(response.data.total) ||
                    response.data.dados.length;

                setPedidos(response.data.dados);
                setTotalItems(total);
                setTotalPages(
                    Number(pagination?.total_paginas) ||
                    Math.max(1, Math.ceil(total / itemsPerPage)),
                );
            } else {
                setPedidos([]);
                setTotalItems(0);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
            setPedidos([]);
            setTotalItems(0);
            setTotalPages(1);
            setErrorMessage("Não foi possível carregar seus pedidos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const filteredPedidos = useMemo(() => {
        return pedidos.filter((pedido) => {
            const search = normalizeText(searchTerm);
            const orderText = normalizeText([
                getOrderId(pedido),
                getOrderLookupId(pedido),
                getOrderItems(pedido).map(getOrderItemName).join(" "),
            ].join(" "));
            const matchesSearch = search === "" || orderText.includes(search);
            const matchesStatus =
                statusFilter === "all" || matchesStatusFilter(pedido, statusFilter);
            const matchesPeriod = isInsidePeriod(
                getOrderDateValue(pedido),
                periodFilter,
            );

            return matchesSearch && matchesStatus && matchesPeriod;
        });
    }, [pedidos, periodFilter, searchTerm, statusFilter]);

    const hasActiveFilters =
        periodFilter !== "all" || statusFilter !== "all" || searchTerm.trim() !== "";
    const pendingItems = useMemo(
        () =>
            pedidos.filter(
                (pedido) =>
                    isPendingMercadoPagoPixOrder(pedido) ||
                    normalizeText(pedido.status || pedido.situacao).includes("pend"),
            ).length,
        [pedidos],
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl">
            <PedidosHeader
                totalItems={totalItems}
                pendingItems={pendingItems}
                loading={loading}
            />

            <FiltersBar
                periodFilter={periodFilter}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onPeriodChange={setPeriodFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
            />

            {loading ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/10 bg-product-bg py-16 shadow-sm">
                    <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
                    <p className="mt-4 text-sm text-primary/55">Carregando pedidos...</p>
                </div>
            ) : errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 shrink-0" size={22} />
                        <div>
                            <h3 className="font-bold">Erro ao buscar pedidos</h3>
                            <p className="mt-1 text-sm">{errorMessage}</p>
                            <button
                                type="button"
                                onClick={() => carregarPedidos(currentPage)}
                                className="mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-red-300 px-4 py-2 text-xs font-bold transition-colors hover:bg-red-100"
                            >
                                <RefreshCw size={15} />
                                Atualizar
                            </button>
                        </div>
                    </div>
                </div>
            ) : filteredPedidos.length === 0 ? (
                <EmptyOrders
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={() => {
                        setPeriodFilter("all");
                        setStatusFilter("all");
                        setSearchTerm("");
                    }}
                />
            ) : (
                <>
                    <div className="space-y-5">
                        {filteredPedidos.map((pedido, index) => {
                            const orderLookupId =
                                getOrderLookupId(pedido) ||
                                getOrderId(pedido) ||
                                String(index);

                            return (
                                <OrderCard
                                    key={`${orderLookupId}-${index}`}
                                    pedido={pedido}
                                    detailsHref={getOrderDetailsPath(orderLookupId)}
                                />
                            );
                        })}
                    </div>

                    {!hasActiveFilters && totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            pageSize={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}

function PedidosHeader({
    totalItems,
    pendingItems,
    loading,
}: {
    totalItems: number;
    pendingItems: number;
    loading: boolean;
}) {
    return (
        <div className="mb-7">
            <div className="mb-4 text-xs text-primary/60 sm:text-sm">
                <Link to="/minha-conta" className="underline-offset-2 hover:underline">
                    Central Minha Conta
                </Link>
                <span className="mx-1 text-primary/40">/</span>
                <span className="font-bold text-primary">Meus Pedidos</span>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    to="/minha-conta"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-product-bg text-primary shadow-sm transition-colors hover:bg-main-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terciary/30"
                    aria-label="Voltar para a Central Minha Conta"
                >
                    <ArrowLeft size={20} aria-hidden="true" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                        Meus pedidos
                    </h1>
                    {!loading && (
                        <p className="mt-1 text-sm text-primary/65">
                            {totalItems} {totalItems === 1 ? "pedido" : "pedidos"} no total
                            {pendingItems > 0 && (
                                <>
                                    <span className="mx-1 text-primary/35">·</span>
                                    <span className="font-medium text-amber-600">
                                        {pendingItems} aguardando pagamento
                                    </span>
                                </>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function FiltersBar({
    periodFilter,
    searchTerm,
    statusFilter,
    onPeriodChange,
    onSearchChange,
    onStatusChange,
}: {
    periodFilter: string;
    searchTerm: string;
    statusFilter: string;
    onPeriodChange: (value: string) => void;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}) {
    return (
        <div className="mb-7 grid gap-3 rounded-2xl border border-primary/10 bg-product-bg p-4 shadow-[0_4px_14px_rgba(15,23,42,0.08)] sm:grid-cols-[1fr_1fr_1.4fr] sm:p-5">
            <SelectField
                icon={<CalendarDays size={17} />}
                label="Período"
                value={periodFilter}
                onChange={onPeriodChange}
                options={periodOptions}
            />
            <SelectField
                icon={<Filter size={17} />}
                label="Status"
                value={statusFilter}
                onChange={onStatusChange}
                options={statusOptions}
            />

            <label className="relative block">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/55"
                />
                <input
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Digite o nome ou o código do produto"
                    className="min-h-11 w-full rounded-xl border border-primary/10 bg-product-bg px-11 text-sm text-primary shadow-sm outline-none transition-colors placeholder:text-primary/45 focus:border-terciary focus:ring-2 focus:ring-terciary/15 sm:min-h-12"
                    type="search"
                />
            </label>
        </div>
    );
}

function SelectField({
    icon,
    label,
    value,
    onChange,
    options,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <label className="relative block">
            <span className="sr-only">{label}</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/65">
                {icon}
            </span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="min-h-11 w-full appearance-none rounded-xl border border-primary/10 bg-product-bg px-11 text-sm font-medium text-primary shadow-sm outline-none transition-colors focus:border-terciary focus:ring-2 focus:ring-terciary/15 sm:min-h-12"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary/65"
            />
        </label>
    );
}

function EmptyOrders({
    hasActiveFilters,
    onClearFilters,
}: {
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}) {
    if (hasActiveFilters) {
        return (
            <div className="rounded-2xl border border-dashed border-primary/20 bg-product-bg p-8 text-center shadow-sm">
                <PackageSearch className="mx-auto text-primary/35" size={42} />
                <h3 className="mt-4 text-lg font-semibold text-primary">
                    Nenhum pedido encontrado
                </h3>
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-5 rounded-md bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-terciary"
                >
                    Limpar filtros
                </button>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-product-bg p-8 text-center shadow-sm">
            <ShoppingBag className="mx-auto text-primary/35" size={44} />
            <h3 className="mt-4 text-lg font-semibold text-primary">
                Nenhum pedido ainda
            </h3>
            <Link
                to="/"
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-terciary"
            >
                Comprar agora
            </Link>
        </div>
    );
}

function isInsidePeriod(value: unknown, period: string) {
    if (period === "all") return true;
    if (typeof value !== "string" || value.trim() === "") return true;

    const date = new Date(value);
    const days = Number(period);

    if (Number.isNaN(date.getTime()) || !Number.isFinite(days)) {
        return true;
    }

    const start = new Date();
    start.setDate(start.getDate() - days);

    return date >= start;
}

function matchesStatusFilter(pedido: any, filter: string) {
    const status = normalizeText(pedido.status || pedido.situacao || "pendente");

    if (filter === "pending") {
        return isPendingMercadoPagoPixOrder(pedido) || status.includes("pend");
    }

    if (filter === "completed") {
        return ["concl", "aprov", "pago", "entreg"].some((value) =>
            status.includes(value),
        );
    }

    if (filter === "sent") {
        return status.includes("envi") || status.includes("transporte");
    }

    if (filter === "cancel") {
        return status.includes("cancel") || status.includes("recus");
    }

    return true;
}
