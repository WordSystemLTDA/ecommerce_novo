import { ChevronDown, ChevronUp, Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { currencyFormatter } from "~/utils/formatters";

interface OrderCardProps {
    pedido: any;
    isExpanded: boolean;
    onToggle: () => void;
}

export function OrderCard({ pedido, isExpanded, onToggle }: OrderCardProps) {
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

    return (
        <div className="bg-white border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
            <div
                className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer bg-gray-50/50"
                onClick={onToggle}
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
                        <span>Total: <span className="font-semibold text-gray-800">{currencyFormatter.format(Number(pedido.valor))}</span></span>
                        <span className="hidden sm:inline">•</span>
                        <span>{pedido.itens?.length || 0} itens</span>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0 text-gray-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t p-4 sm:p-6 bg-white">
                    <h4 className="font-medium text-gray-700 mb-4">Itens do Pedido</h4>
                    <div className="space-y-4">
                        {pedido.itens?.map((item: any) => (
                            <div key={item.id} className="flex items-start py-2 border-b last:border-0">
                                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center shrink-0 mr-4">
                                    <Package size={24} className="text-gray-400" />
                                </div>

                                <div className="flex-1">
                                    <h5 className="font-medium text-gray-800 line-clamp-2">
                                        {item.nome_do_produto || `Produto #${item.produto}`}
                                    </h5>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {item.quantidade}x {currencyFormatter.format(Number(item.valor))}
                                    </div>
                                </div>
                                <div className="text-right font-medium text-gray-800">
                                    {currencyFormatter.format(Number(item.total))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-end">
                        <div className="w-full sm:w-64 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{currencyFormatter.format(Number(pedido.subtotal || pedido.valor))}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Frete</span>
                                <span>{currencyFormatter.format(Number(pedido.valor_do_frete || 0))}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t">
                                <span>Total</span>
                                <span>{currencyFormatter.format(Number(pedido.valor))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
