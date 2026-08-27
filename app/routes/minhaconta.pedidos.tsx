import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
    AlertCircle,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
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
    normalizeText,
} from "~/features/minhaconta/utils/orderHelpers";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Meus Pedidos - Word System" },
    ];
}

const periodOptions = [
    { value: "all", label: "Todos" },
    { value: "30", label: "30 dias" },
    { value: "90", label: "90 dias" },
    { value: "365", label: "12 meses" },
];

const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "pend", label: "Pendente" },
    { value: "aprov", label: "Aprovado" },
    { value: "cancel", label: "Cancelado" },
    { value: "entreg", label: "Entregue" },
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
            const status = normalizeText(pedido.status || pedido.situacao || "pendente");
            const matchesSearch = search === "" || orderText.includes(search);
            const matchesStatus =
                statusFilter === "all" || status.includes(statusFilter);
            const matchesPeriod = isInsidePeriod(
                getOrderDateValue(pedido),
                periodFilter,
            );

            return matchesSearch && matchesStatus && matchesPeriod;
        });
    }, [pedidos, periodFilter, searchTerm, statusFilter]);

    const hasActiveFilters =
        periodFilter !== "all" || statusFilter !== "all" || searchTerm.trim() !== "";

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div>
            <PedidosHeader />

            <FiltersBar
                periodFilter={periodFilter}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onPeriodChange={setPeriodFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
            />

            {loading ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-primary/10 bg-main-bg py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
                    <p className="mt-4 text-sm text-primary/55">Carregando pedidos...</p>
                </div>
            ) : errorMessage ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
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
                    <div className="space-y-4">
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

function PedidosHeader() {
    return (
        <div className="mb-5">
            <div className="mb-5 text-sm text-primary/65">
                <Link to="/minha-conta" className="underline-offset-2 hover:underline">
                    Central Minha Conta
                </Link>
                <span className="mx-1 text-primary/40">/</span>
                <span className="font-bold text-primary">Meus Pedidos</span>
            </div>

            <Link
                to="/minha-conta"
                className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-primary"
            >
                <ChevronLeft size={20} className="text-terciary" />
                Meus pedidos
            </Link>
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
        <div className="mb-7 space-y-4">
            <div className="grid grid-cols-1 gap-2 min-[430px]:grid-cols-2">
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
            </div>

            <label className="relative block">
                <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/55"
                />
                <input
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Digite o nome ou o código do produto"
                    className="min-h-12 w-full rounded-md border border-primary/10 bg-white px-11 text-sm text-primary outline-none transition-colors placeholder:text-primary/45 focus:border-terciary focus:ring-2 focus:ring-terciary/15"
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
                className="min-h-12 w-full appearance-none rounded-md border border-primary/10 bg-white px-11 text-sm font-medium text-primary outline-none transition-colors focus:border-terciary focus:ring-2 focus:ring-terciary/15"
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
            <div className="rounded-lg border border-dashed border-primary/20 bg-main-bg p-8 text-center">
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
        <div className="rounded-lg border border-dashed border-primary/20 bg-main-bg p-8 text-center">
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
