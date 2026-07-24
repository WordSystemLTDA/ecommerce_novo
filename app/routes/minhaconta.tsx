import { useEffect, useState, type ReactNode } from "react";
import {
  Heart,
  Inbox,
  LoaderCircle,
  Mail,
  MapPin,
  Package,
  Pencil,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router";
import { OptimizedImage } from "~/components/OptimizedImage";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import { currencyFormatter } from "~/utils/formatters";
import { getProductImageFallback } from "~/utils/imagePlaceholders";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Minha Conta - Word System" },
  ];
}

const shortcuts = [
  {
    label: "Meus pedidos",
    to: "/minha-conta/pedidos",
    icon: ShoppingBag,
  },
  {
    label: "Endereços",
    to: "/minha-conta/enderecos",
    icon: MapPin,
  },
  {
    label: "Favoritos",
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
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <h1 className="mb-3 text-lg font-bold text-primary sm:text-xl">
          Central Minha Conta
        </h1>

        <div className="rounded-lg border border-primary/10 bg-product-bg p-4 shadow-[0_4px_18px_rgba(15,23,42,0.05)] sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-secondary shadow-inner sm:h-20 sm:w-20">
                {cliente.nome?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold leading-snug text-primary sm:text-lg">
                  Bem-vindo, {cliente.nome}
                </h2>
                <p className="mt-1 flex min-w-0 items-center gap-2 text-sm text-primary/65">
                  <Mail size={15} className="shrink-0 text-terciary" />
                  <span className="truncate">{cliente.email}</span>
                </p>
              </div>
            </div>

            <Link
              to="/minha-conta/dados"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-terciary px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary sm:ml-auto sm:min-w-44"
            >
              <Pencil size={17} aria-hidden="true" />
              Editar dados
            </Link>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle icon={<ShortcutDots />} title="Atalhos" />

        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {shortcuts.map((shortcut) => (
            <Link
              key={shortcut.to}
              to={shortcut.to}
              className="group flex min-h-20 items-center gap-3 rounded-lg border border-primary/10 bg-product-bg p-3 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all last:col-span-2 hover:-translate-y-0.5 hover:border-terciary/40 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] sm:p-4 lg:last:col-span-1"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-terciary/10 text-terciary transition-colors group-hover:bg-terciary group-hover:text-white">
                <shortcut.icon size={19} aria-hidden="true" />
              </span>
              <span className="min-w-0 text-xs font-bold uppercase leading-snug tracking-wide text-primary sm:text-sm">
                {shortcut.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          icon={<ShoppingBag size={20} className="text-terciary" />}
          title="Resumo do último pedido"
        />

        <LatestOrderCard
          isLoading={isLoadingOrder}
          order={latestOrder}
        />
      </section>

    </div>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-primary">
      {icon}
      <h2 className="text-sm font-extrabold uppercase tracking-wide">
        {title}
      </h2>
    </div>
  );
}

function ShortcutDots() {
  return (
    <span
      className="grid h-5 w-5 grid-cols-2 gap-1"
      aria-hidden="true"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="rounded-full bg-terciary" />
      ))}
    </span>
  );
}

function LatestOrderCard({
  isLoading,
  order,
}: {
  isLoading: boolean;
  order: any | null;
}) {
  if (isLoading) {
    return (
      <div className="mt-3 flex min-h-36 items-center justify-center rounded-lg border border-primary/10 bg-product-bg">
        <LoaderCircle className="animate-spin text-primary" size={30} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mt-3 flex flex-col items-center justify-center rounded-lg border border-dashed border-primary/20 bg-product-bg p-8 text-center">
        <Inbox className="text-primary/35" size={38} />
        <p className="mt-3 text-sm font-semibold text-primary">
          Nenhum pedido ainda
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-terciary"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  const items = getOrderItems(order);
  const firstItem = items[0];
  const productName = getOrderItemName(firstItem);
  const productImage = getOrderItemImage(firstItem);
  const status = formatStatus(order.status || order.situacao || "Pendente");
  const payment = order.pagamento?.nome ||
    order.pagamento?.tipo ||
    order.forma_pagamento ||
    "Pagamento não informado";
  const orderId = order.id_venda || order.id || order.codigo || "-";
  const total = formatMoney(order.valor ?? order.total ?? order.valor_total);

  return (
    <article className="mt-3 overflow-hidden rounded-lg border border-primary/10 bg-product-bg shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
      <div className="border-b border-primary/10 p-4">
        <div className="min-w-0 text-sm text-primary/75">
          <span className="font-bold text-primary">Pedido:</span>{" "}
          <span className="font-medium">{orderId}</span>
          <span className="mx-2 text-primary/25">|</span>
          <span>{formatDate(order.data_lanc || order.data || order.created_at)}</span>
        </div>
      </div>

      <div className="border-b border-primary/10 px-4 py-3 text-sm font-semibold text-primary">
        {status}
      </div>

      <div className="border-b border-primary/10 px-4 py-3 text-xs text-primary/60">
        {payment}
      </div>

      {firstItem ? (
        <div className="flex gap-3 p-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-primary/10 bg-main-bg">
            {productImage ? (
              <OptimizedImage
                src={productImage}
                fallbackSrc={getProductImageFallback(productName)}
                alt={productName}
                className="h-full w-full object-contain p-1 mix-blend-multiply"
              />
            ) : (
              <Package size={26} className="text-primary/35" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold text-primary">
              {productName}
            </p>
            <p className="mt-1 text-xs text-primary/55">
              Quantidade: {firstItem.quantidade || 1}
            </p>
            <p className="mt-2 text-sm font-bold text-primary">
              {total}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 text-sm text-primary/60">
          Itens do pedido indisponíveis.
        </div>
      )}
    </article>
  );
}

function extractOrders(response: any) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data?.dados)) return response.data.dados;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.dados)) return response.dados;

  return [];
}

function getOrderItems(order: any) {
  if (Array.isArray(order?.itens)) return order.itens;
  if (Array.isArray(order?.produtos)) return order.produtos;

  return [];
}

function getOrderItemName(item: any) {
  return item?.nome_do_produto ||
    item?.nome ||
    item?.produto?.nome ||
    "Produto do pedido";
}

function getOrderItemImage(item: any) {
  return item?.foto ||
    item?.imagem ||
    item?.image ||
    item?.produto?.foto ||
    item?.produto?.imagem ||
    item?.produto?.fotos?.m?.[0] ||
    item?.fotos?.m?.[0] ||
    "";
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || value.trim() === "") {
    return "-";
  }

  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (dateOnly) {
    return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatMoney(value: unknown) {
  const parsedValue = Number(value);

  return currencyFormatter.format(Number.isFinite(parsedValue) ? parsedValue : 0);
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
