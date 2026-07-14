import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
    AlertCircle,
    ClipboardList,
    PackageSearch,
    RefreshCw,
    ShoppingBag,
} from "lucide-react";
import type { Route } from "./+types/home";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import { Link } from "react-router";
import { OrderCard } from "~/components/OrderCard";
import { Pagination } from "~/components/Pagination";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Meus Pedidos - Word System" },
    ];
}

export default function PedidosPage() {
    const { cliente } = useAuth();
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        if (cliente?.id) {
            carregarPedidos(currentPage);
        }
    }, [cliente?.id, currentPage, itemsPerPage]);

    const carregarPedidos = async (page: number) => {
        try {
            setLoading(true);
            setErrorMessage(null);
            const response = await minhacontaService.listarPedidos(cliente!.id, page, itemsPerPage);

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
                    Math.max(1, Math.ceil(total / itemsPerPage))
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

    const toggleOrder = (orderId: number) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
        setExpandedOrder(null);
    };

    const statusCounts = useMemo(() => {
        return pedidos.reduce<Record<string, number>>((counts, pedido) => {
            const status = String(pedido.status || "Pendente");
            counts[status] = (counts[status] || 0) + 1;
            return counts;
        }, {});
    }, [pedidos]);

    if (loading) {
        return (
            <div>
                <PageHeader
                    title="Meus pedidos"
                    description="Acompanhe compras realizadas e consulte os itens de cada pedido."
                />
                <div className="flex flex-col items-center justify-center rounded-lg border border-primary/10 bg-main-bg py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-sm text-primary/55">Carregando pedidos...</p>
                </div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div>
                <PageHeader
                    title="Meus pedidos"
                    description="Não conseguimos carregar a lista agora."
                    action={
                        <RefreshButton onClick={() => carregarPedidos(currentPage)} />
                    }
                />
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 shrink-0" size={22} />
                        <div>
                            <h3 className="font-bold">Erro ao buscar pedidos</h3>
                            <p className="mt-1 text-sm">{errorMessage}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (pedidos.length === 0 && currentPage === 1) {
        return (
            <div>
                <PageHeader
                    title="Meus pedidos"
                    description="Assim que você finalizar uma compra, ela aparecerá aqui."
                />
                <div className="text-center py-16 bg-main-bg rounded-lg border border-dashed border-primary/20">
                    <ShoppingBag className="mx-auto text-primary/35 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-primary">Você ainda não fez nenhum pedido</h3>
                    <p className="text-primary/55 mt-2">Explore nossa loja e encontre os melhores produtos para você.</p>
                    <Link to="/" className="inline-block mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-terciary transition-colors">
                        Ir para a Loja
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Meus pedidos"
                description={
                    totalItems > 0
                        ? `${totalItems} pedido${totalItems === 1 ? "" : "s"} encontrado${totalItems === 1 ? "" : "s"}.`
                        : `${pedidos.length} pedido${pedidos.length === 1 ? "" : "s"} nesta página.`
                }
                action={
                    <RefreshButton onClick={() => carregarPedidos(currentPage)} />
                }
            />

            <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                <SummaryCard
                    label="Pedidos nesta página"
                    value={String(pedidos.length)}
                    helper={`Página ${currentPage} de ${totalPages}`}
                />
                <SummaryCard
                    label="Status"
                    value={Object.keys(statusCounts).length.toString()}
                    helper={Object.entries(statusCounts)
                        .map(([status, count]) => `${count} ${status}`)
                        .join(" · ") || "Sem status"}
                />
            </div>

            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-primary/10 bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-primary">
                        <ClipboardList size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Histórico de compras</p>
                        <p className="text-xs text-gray-500">
                            Clique em um pedido para ver produtos, frete e total.
                        </p>
                    </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Pedidos por página</span>
                    <select
                        value={itemsPerPage}
                        onChange={(event) => handleItemsPerPageChange(Number(event.target.value))}
                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        {[10, 20, 50].map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {pedidos.length === 0 ? (
                <div className="rounded-lg border border-dashed border-primary/20 bg-main-bg p-10 text-center">
                    <PackageSearch className="mx-auto text-primary/35" size={42} />
                    <h3 className="mt-4 text-lg font-semibold text-primary">
                        Nenhum pedido nesta página
                    </h3>
                    <p className="mt-2 text-sm text-primary/55">
                        Volte para a primeira página ou atualize a listagem.
                    </p>
                    <button
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        className="mt-5 rounded-md bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-terciary"
                    >
                        Ir para primeira página
                    </button>
                </div>
            ) : (
            <div className="space-y-4">
                {pedidos.map((pedido) => (
                    <OrderCard
                        key={pedido.id}
                        pedido={pedido}
                        isExpanded={expandedOrder === pedido.id}
                        onToggle={() => toggleOrder(pedido.id)}
                    />
                ))}
            </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

function RefreshButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/5"
        >
            <RefreshCw size={15} />
            Atualizar
        </button>
    );
}

interface SummaryCardProps {
    label: string;
    value: string;
    helper: string;
}

function SummaryCard({ label, value, helper }: SummaryCardProps) {
    return (
        <div className="rounded-lg border border-primary/10 bg-main-bg p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/50">
                {label}
            </p>
            <p className="mt-2 text-xl font-bold text-primary">{value}</p>
            <p className="mt-1 line-clamp-2 text-xs text-primary/55">{helper}</p>
        </div>
    );
}

interface PageHeaderProps {
    title: string;
    description: string;
    action?: ReactNode;
}

function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-3 border-b border-primary/10 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
                <p className="overline-label flex items-center gap-2">
                    <PackageSearch size={15} />
                    Pedidos
                </p>
                <h1 className="mt-1 text-xl font-semibold text-primary md:text-2xl">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-primary/55">{description}</p>
            </div>
            {action}
        </div>
    );
}

