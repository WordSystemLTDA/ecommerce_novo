import { useEffect, useState } from "react";
import { ShoppingBag, Package, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import type { Route } from "./+types/home";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import { Link } from "react-router";

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

            // Handle both array (legacy/error) and object (pagination) responses
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

    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(Number(value));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pendente': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'aprovado': return 'text-green-600 bg-green-50 border-green-200';
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
                    <div key={pedido.id} className="bg-white border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
                        {/* Header do Pedido */}
                        <div
                            className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer bg-gray-50/50"
                            onClick={() => toggleOrder(pedido.id)}
                        >
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <span className="font-bold text-lg text-gray-800 mr-3">Pedido #{pedido.id}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(pedido.status)}`}>
                                        {getStatusIcon(pedido.status)}
                                        {pedido.status || 'Pendente'}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <span>Data: {formatDate(pedido.data_lanc)}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Total: <span className="font-semibold text-gray-800">{formatCurrency(pedido.valor)}</span></span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{pedido.itens?.length || 0} itens</span>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 text-gray-400">
                                {expandedOrder === pedido.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {/* Detalhes do Pedido (Expandido) */}
                        {expandedOrder === pedido.id && (
                            <div className="border-t p-4 sm:p-6 bg-white">
                                <h4 className="font-medium text-gray-700 mb-4">Itens do Pedido</h4>
                                <div className="space-y-4">
                                    {pedido.itens?.map((item: any) => (
                                        <div key={item.id} className="flex items-start py-2 border-b last:border-0">
                                            {/* Imagem do produto (placeholder se não tiver) */}
                                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center shrink-0 mr-4">
                                                <Package size={24} className="text-gray-400" />
                                            </div>

                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-800 line-clamp-2">
                                                    {item.nome_do_produto || `Produto #${item.produto}`}
                                                </h5>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {item.quantidade}x {formatCurrency(item.valor)}
                                                </div>
                                            </div>
                                            <div className="text-right font-medium text-gray-800">
                                                {formatCurrency(item.total)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t flex justify-end">
                                    <div className="w-full sm:w-64 space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(pedido.subtotal || pedido.valor)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Frete</span>
                                            <span>{formatCurrency(pedido.valor_do_frete || 0)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t">
                                            <span>Total</span>
                                            <span>{formatCurrency(pedido.valor)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}
