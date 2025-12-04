import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
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
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        if (cliente?.id) {
            carregarPedidos(currentPage);
        }
    }, [cliente, currentPage]);

    const carregarPedidos = async (page: number) => {
        try {
            setLoading(true);
            const response = await minhacontaService.listarPedidos(cliente!.id, page, itemsPerPage);

            if (Array.isArray(response)) {
                setPedidos(response);
                setTotalPages(1);
            } else if (response && response.data.dados) {
                setPedidos(response.data.dados);
                setTotalPages(response.data.paginacao?.total_paginas || 1);
            } else {
                setPedidos([]);
            }

        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
            setPedidos([]);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (pedidos.length === 0 && currentPage === 1) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Pedidos</h1>
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-700">Você ainda não fez nenhum pedido</h3>
                    <p className="text-gray-500 mt-2">Explore nossa loja e encontre os melhores produtos para você.</p>
                    <Link to="/" className="inline-block mt-6 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        Ir para a Loja
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Pedidos</h1>

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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

