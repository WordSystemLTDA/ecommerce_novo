import { ArrowRight, Heart, MapPin, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "~/features/auth/context/AuthContext";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Minha Conta - Word System" },
  ];
}

const cards = [
  {
    to: "/minha-conta/pedidos",
    icon: ShoppingBag,
    title: "Meus Pedidos",
    description: "Acompanhe o status e histórico de suas compras.",
    linkLabel: "Ver pedidos",
    iconBg: "bg-primary/10 group-hover:bg-primary",
    iconColor: "text-primary group-hover:text-secondary",
    linkColor: "text-primary",
  },
  {
    to: "/minha-conta/favoritos",
    icon: Heart,
    title: "Meus Favoritos",
    description: "Produtos que você salvou para comprar depois.",
    linkLabel: "Ver favoritos",
    iconBg: "bg-terciary/10 group-hover:bg-terciary",
    iconColor: "text-terciary group-hover:text-secondary",
    linkColor: "text-terciary",
  },
  {
    to: "/minha-conta/enderecos",
    icon: MapPin,
    title: "Meus Endereços",
    description: "Gerencie seus endereços de entrega.",
    linkLabel: "Gerenciar endereços",
    iconBg: "bg-(--dynamic-success-bg) group-hover:bg-(--dynamic-success)",
    iconColor: "text-(--dynamic-success) group-hover:text-white",
    linkColor: "text-(--dynamic-success)",
  },
  {
    to: "/minha-conta/dados",
    icon: User,
    title: "Meus Dados",
    description: "Atualize suas informações pessoais e de contato.",
    linkLabel: "Editar dados",
    iconBg: "bg-primary/5 group-hover:bg-primary/80",
    iconColor: "text-primary/70 group-hover:text-secondary",
    linkColor: "text-primary/70",
  },
];

export default function MinhaConta() {
  const { cliente } = useAuth();

  if (!cliente) return null;

  return (
    <div>
      <div className="mb-6 pb-5 border-b border-primary/10">
        <p className="overline-label">Painel</p>
        <h1 className="text-xl md:text-2xl font-semibold text-primary mt-1">Olá, {cliente.nome}!</h1>
        <p className="text-sm text-primary/55 mt-1">Bem-vindo ao seu painel. O que deseja fazer hoje?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="block group">
            <div className="rounded-xl border border-primary/10 bg-main-bg hover:bg-product-bg p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 h-full flex flex-col gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${card.iconBg}`}>
                <card.icon size={22} className={`transition-colors duration-300 ${card.iconColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-primary mb-1">{card.title}</h3>
                <p className="text-primary/55 text-sm">{card.description}</p>
              </div>
              <div className={`flex items-center font-medium text-sm gap-1 ${card.linkColor}`}>
                {card.linkLabel} <ArrowRight size={15} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
