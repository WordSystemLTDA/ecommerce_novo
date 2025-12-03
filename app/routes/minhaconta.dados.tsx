import { useAuth } from "~/features/auth/context/AuthContext";
import { User, Mail, Phone, CreditCard } from "lucide-react";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Meus Dados - Word System" },
    ];
}

export default function MeusDadosPage() {
    const { cliente } = useAuth();

    if (!cliente) return null;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Dados</h1>

            <div className="bg-white border rounded-lg p-6 max-w-2xl">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{cliente.nome}</h2>
                        <p className="text-gray-500">Cliente desde 2024</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <User size={18} className="text-gray-400" />
                                <span className="text-gray-800">{cliente.nome}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">E-mail</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <Mail size={18} className="text-gray-400" />
                                <span className="text-gray-800">{cliente.email}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">CPF/CNPJ</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <CreditCard size={18} className="text-gray-400" />
                                <span className="text-gray-800">{cliente.doc || "Não informado"}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Telefone/Celular</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                <Phone size={18} className="text-gray-400" />
                                <span className="text-gray-800">{cliente.celular || "Não informado"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors">
                            Editar Dados
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
