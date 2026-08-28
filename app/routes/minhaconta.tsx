import { useEffect, useState } from "react";
import {
  ArrowRight,
  Heart,
  Inbox,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router";
import { OrderCard } from "~/components/OrderCard";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import {
  extractOrders,
  getOrderDetailsPath,
  getOrderId,
  getOrderLookupId,
} from "~/features/minhaconta/utils/orderHelpers";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Minha Conta - Word System" },
  ];
}

const shortcuts = [
  {
    label: "Meus pedidos",
    description: "Acompanhe suas compras",
    to: "/minha-conta/pedidos",
    icon: ShoppingBag,
  },
  {
    label: "Meus endereços",
    description: "Gerencie suas entregas",
    to: "/minha-conta/enderecos",
    icon: MapPin,
  },
  {
    label: "Meus favoritos",
    description: "Veja os produtos salvos",
    to: "/minha-conta/favoritos",
    icon: Heart,
  },
];

export default function MinhaConta() {
  const { cliente } = useAuth();
  const [latestOrder, setLatestOrder] = useState<any | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  useEffect(() => {
    const clienteId = cliente?.id ?? 0;

    if (clienteId <= 0) {
      setIsLoadingOrder(false);
      return;
    }

    let isMounted = true;

    async function loadLatestOrder() {
      try {
        setIsLoadingOrder(true);
        const response = await minhacontaService.listarPedidos(clienteId, 1, 1);
        const [order] = extractOrders(response);

        if (isMounted) {
          setLatestOrder(order ?? null);
        }
      } catch (error) {
        console.error("Erro ao carregar último pedido:", error);

        if (isMounted) {
          setLatestOrder(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingOrder(false);
        }
      }
    }

    void loadLatestOrder();

    return () => {
      isMounted = false;
    };
  }, [cliente?.id]);

  if (!cliente) return null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-7">
        <p className="overline-label">Minha conta</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          Central Minha Conta
        </h1>
        <p className="mt-2 text-sm text-primary/60 sm:text-base">
          Acompanhe seus pedidos e gerencie seus dados em um só lugar.
        </p>
      </header>

      <section
        className="rounded-2xl border border-primary/10 bg-product-bg p-5 shadow-[0_4px_14px_rgba(15,23,42,0.08)] sm:p-6"
        aria-label="Dados da conta"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-secondary shadow-inner sm:h-20 sm:w-20">
              {cliente.nome?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary/50">
                Bem-vindo de volta
              </p>
              <h2 className="mt-1 truncate text-lg font-bold leading-snug text-primary sm:text-xl">
                {cliente.nome}
              </h2>
              <p className="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-primary/60">
                <Mail size={15} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{cliente.email}</span>
              </p>
            </div>
          </div>

          <Link
            to="/minha-conta/dados"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/10 bg-primary px-5 text-sm font-bold text-secondary shadow-sm transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terciary/30 sm:ml-auto"
          >
            <Pencil size={16} aria-hidden="true" />
            Editar dados
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            Acesso rápido
          </h2>
          <p className="mt-1 text-sm text-primary/55">
            Encontre o que precisa com facilidade.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {shortcuts.map((shortcut) => (
            <Link
              key={shortcut.to}
              to={shortcut.to}
              className="group flex min-h-24 items-center gap-4 rounded-2xl border border-primary/10 bg-product-bg p-4 shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terciary/30"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-main-bg text-primary transition-colors group-hover:bg-primary group-hover:text-secondary">
                <shortcut.icon size={20} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-primary">
                  {shortcut.label}
                </span>
                <span className="mt-1 block text-xs text-primary/55">
                  {shortcut.description}
                </span>
              </span>
              <ArrowRight
                size={17}
                className="shrink-0 text-primary/35 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
              Seu último pedido
            </h2>
            <p className="mt-1 text-sm text-primary/55">
              Consulte rapidamente o andamento da sua compra.
            </p>
          </div>

          <Link
            to="/minha-conta/pedidos"
            className="inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-primary/10 bg-product-bg px-4 text-xs font-semibold text-primary shadow-sm transition-colors hover:border-primary/25 hover:bg-main-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terciary/30"
          >
            Ver todos os pedidos
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <LatestOrderContent
          isLoading={isLoadingOrder}
          order={latestOrder}
        />
      </section>
    </div>
  );
}

function LatestOrderContent({
  isLoading,
  order,
}: {
  isLoading: boolean;
  order: any | null;
}) {
  if (isLoading) {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-primary/10 bg-product-bg shadow-sm">
        <LoaderCircle className="animate-spin text-primary" size={30} />
        <p className="mt-3 text-sm text-primary/55">Carregando seu pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-product-bg p-8 text-center shadow-sm">
        <Inbox className="text-primary/35" size={42} />
        <h3 className="mt-4 text-lg font-semibold text-primary">
          Nenhum pedido ainda
        </h3>
        <p className="mt-1 text-sm text-primary/55">
          Quando você fizer uma compra, ela aparecerá aqui.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-secondary transition-opacity hover:opacity-85"
        >
          Comprar agora
        </Link>
      </div>
    );
  }

  const orderLookupId = getOrderLookupId(order) || getOrderId(order);
  const detailsHref = orderLookupId
    ? getOrderDetailsPath(orderLookupId)
    : "/minha-conta/pedidos";

  return (
    <OrderCard
      pedido={order}
      detailsHref={detailsHref}
    />
  );
}
