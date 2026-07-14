import { useAuth } from "~/features/auth/context/AuthContext";
import { CreditCard, Mail, Phone, ShieldCheck, User } from "lucide-react";
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
            <div className="mb-6 flex flex-col gap-3 border-b border-primary/10 pb-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="overline-label">Perfil</p>
                    <h1 className="mt-1 text-xl font-semibold text-primary md:text-2xl">
                        Meus dados
                    </h1>
                    <p className="mt-1 text-sm text-primary/55">
                        Confira as informações usadas em pedidos e notas fiscais.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-lg border border-primary/10 bg-main-bg p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-secondary">
                            {cliente.nome?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-primary">{cliente.nome}</h2>
                        <p className="mt-1 max-w-xs text-sm text-primary/55">
                            Seus dados ficam disponíveis para preencher pedidos com mais agilidade.
                        </p>
                    </div>

                    <div className="mt-6 rounded-md border border-primary/10 bg-product-bg p-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 text-primary" size={20} />
                            <div>
                                <p className="text-sm font-bold text-primary">Conta identificada</p>
                                <p className="mt-1 text-xs text-primary/55">
                                    Para alterar informações sensíveis, entre em contato com o atendimento.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-primary/10 bg-white p-5">
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

                    <div className="mt-5 rounded-md bg-amber-50 p-4 text-sm text-amber-800">
                        Caso algum dado esteja incorreto, solicite a alteração pelo atendimento da loja.
                    </div>
                </div >
            </div>
        </div>
    );
}
