import { useAuth } from "~/features/auth/context/AuthContext";
import { CreditCard, Mail, Phone, User } from "lucide-react";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Meus Dados - Word System" },
    ];
}

export default function MeusDadosPage() {
    const { cliente } = useAuth();

    if (!cliente) return null;

    const fields = [
        {
            label: "Nome completo",
            value: cliente.nome,
            icon: User,
        },
        {
            label: "E-mail",
            value: cliente.email,
            icon: Mail,
        },
        {
            label: "CPF/CNPJ",
            value: cliente.doc || "Não informado",
            icon: CreditCard,
        },
        {
            label: "Telefone/Celular",
            value: cliente.celular || "Não informado",
            icon: Phone,
        },
    ];

    return (
        <div>
            <div className="mb-5 border-b border-primary/10 pb-5">
                <h1 className="text-xl font-semibold text-primary md:text-2xl">
                    Meus dados
                </h1>
            </div>

            <div className="rounded-lg border border-primary/10 bg-white p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {fields.map((field) => (
                        <div key={field.label}>
                            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
                                {field.label}
                            </p>
                            <div className="flex min-h-12 items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                                <field.icon size={18} className="shrink-0 text-primary" />
                                <span className="min-w-0 truncate text-sm font-medium text-gray-800">
                                    {field.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-5 rounded-md bg-amber-50 p-4 text-sm text-amber-800">
                    Alterações pelo atendimento da loja.
                </p>
            </div >
        </div>
    );
}
