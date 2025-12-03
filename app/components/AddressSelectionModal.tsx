import { useEffect, useState } from "react";
import { X, MapPin, Plus } from "lucide-react";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import type { Endereco } from "~/features/minhaconta/types";
import { useNavigate } from "react-router";

interface AddressSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAddress: (address: Endereco) => void;
    selectedAddressId?: number;
}

export function AddressSelectionModal({ isOpen, onClose, onSelectAddress, selectedAddressId }: AddressSelectionModalProps) {
    const { cliente, isAuthenticated } = useAuth();
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && isAuthenticated && cliente?.id) {
            loadAddresses();
        }
    }, [isOpen, isAuthenticated, cliente]);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const response = await minhacontaService.listarEnderecos(cliente!.id);
            if (response && Array.isArray(response.data)) {
                setEnderecos(response.data);
            }
        } catch (error) {
            console.error("Erro ao carregar endereços:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2 text-primary">
                        <MapPin size={20} />
                        <h2 className="font-bold text-lg">CEP</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <p className="text-sm text-gray-600 mb-4">Escolha um endereço cadastrado.</p>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : !isAuthenticated ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Faça login para ver seus endereços.</p>
                            <button
                                onClick={() => { onClose(); navigate('/entrar'); }}
                                className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-primary/90"
                            >
                                Fazer Login
                            </button>
                        </div>
                    ) : enderecos.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Você não tem endereços cadastrados.</p>
                            <button
                                onClick={() => { onClose(); navigate('/minhaconta/enderecos'); }}
                                className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-primary/90"
                            >
                                Cadastrar Endereço
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {enderecos.map((endereco) => (
                                <div
                                    key={endereco.id}
                                    onClick={() => onSelectAddress(endereco)}
                                    className={`
                                        border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md
                                        ${selectedAddressId === endereco.id
                                            ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-300'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`font-bold text-sm ${selectedAddressId === endereco.id ? 'text-orange-600' : 'text-gray-800'}`}>
                                                {endereco.padrao === 'S' ? 'Padrão' : 'Endereço'}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {endereco.endereco}, {endereco.numero}
                                                {endereco.complemento && ` - ${endereco.complemento}`}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                CEP {endereco.cep} - {endereco.nome_cidade}, {endereco.sigla_estado}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {isAuthenticated && (
                    <div className="p-4 border-t bg-gray-50">
                        <button
                            onClick={() => { onClose(); navigate('/minhaconta/enderecos'); }}
                            className="w-full flex items-center justify-center gap-2 text-primary font-bold text-sm hover:underline"
                        >
                            <Plus size={16} />
                            Cadastrar novo endereço
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
