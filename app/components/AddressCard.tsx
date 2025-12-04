import { Link } from "react-router";
import { MapPin, Edit, Trash2 } from "lucide-react";
import type { Endereco } from "~/features/minhaconta/types";

interface AddressCardProps {
    endereco: Endereco;
    onDelete: (id: number) => void;
}

export function AddressCard({ endereco, onDelete }: AddressCardProps) {
    return (
        <div
            className={`border rounded-lg p-5 relative transition-all hover:shadow-md ${endereco.padrao === 'Sim' ? "border-primary bg-blue-50/30" : "border-gray-200"
                }`}
        >
            {endereco.padrao === 'Sim' && (
                <span className="absolute top-3 right-3 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                    Padrão
                </span>
            )}

            <div className="flex items-start gap-3 mb-3">
                <MapPin className="text-gray-400 mt-1" size={20} />
                <div>
                    <p className="font-medium text-gray-800">
                        {endereco.endereco}, {endereco.numero}
                    </p>
                    <p className="text-gray-600 text-sm">
                        {endereco.nome_bairro}
                    </p>
                    <p className="text-gray-600 text-sm">
                        {endereco.nome_cidade} - {endereco.sigla_estado}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                        CEP: {endereco.cep}
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 border-t pt-3">
                <Link
                    to={`/minha-conta/enderecos/editar/${endereco.id}`}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                    <Edit size={16} />
                    Editar
                </Link>

                <button
                    onClick={() => onDelete(endereco.id)}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors ml-2"
                >
                    <Trash2 size={16} />
                    Excluir
                </button>

            </div>
        </div>
    );
}
