import { Link } from "react-router";
import { Edit, MapPin, Star, Trash2 } from "lucide-react";
import type { Endereco } from "~/features/minhaconta/types";

interface AddressCardProps {
    endereco: Endereco;
    onDelete: (id: number) => void;
}

export function AddressCard({ endereco, onDelete }: AddressCardProps) {
    const isDefault = ['sim', 's', '1', 'true'].includes(
        String(endereco.padrao).toLowerCase()
    );

    return (
        <div
            className={`border rounded-lg p-5 relative transition-all hover:shadow-md ${isDefault ? "border-primary bg-primary/5" : "border-gray-200 bg-white"
                }`}
        >
            {isDefault && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                    <Star size={12} />
                    Padrão
                </span>
            )}

            <div className="flex items-start gap-3 pr-20">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                    <MapPin size={18} />
                </div>
                <div className="min-w-0">
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
                    {endereco.complemento && (
                        <p className="mt-1 text-xs text-gray-500">
                            Complemento: {endereco.complemento}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-3">
                <Link
                    to={`/minha-conta/enderecos/editar/${endereco.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                    <Edit size={16} />
                    Editar
                </Link>

                <button
                    type="button"
                    onClick={() => onDelete(endereco.id)}
                    className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                >
                    <Trash2 size={16} />
                    Excluir
                </button>

            </div>
        </div>
    );
}
