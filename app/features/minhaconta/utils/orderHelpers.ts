import { currencyFormatter } from "~/utils/formatters";

export type OrderRecord = Record<string, any>;
export type OrderItem = Record<string, any>;

export function extractOrders(response: unknown): OrderRecord[] {
    const payload = response as any;

    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data?.dados)) return payload.data.dados;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.dados)) return payload.dados;

    return [];
}

export function extractOrder(response: unknown): OrderRecord | null {
    const payload = response as any;

    if (!payload) return null;
    if ("sucesso" in payload && payload.data == null && !payload.pedido) {
        return null;
    }
    if (Array.isArray(payload)) return payload[0] ?? null;
    if (payload?.data?.pedido) return payload.data.pedido;
    if (payload?.data?.venda) return payload.data.venda;
    if (payload?.data?.dados) return payload.data.dados;
    if (payload?.data && !Array.isArray(payload.data)) return payload.data;
    if (payload?.pedido) return payload.pedido;
    if (payload?.venda) return payload.venda;
    if (payload?.dados && !Array.isArray(payload.dados)) return payload.dados;

    return payload;
}

export function getOrderDetailsPath(orderId: string | number) {
    return `/minha-conta/meus-pedidos/detalhes/${encodeURIComponent(orderId)}`;
}

export function getOrderLookupId(order: OrderRecord | null | undefined) {
    const value =
        order?.id_venda ??
        order?.idVenda ??
        order?.id ??
        "";

    return String(value).trim();
}

export function getOrderId(order: OrderRecord | null | undefined) {
    const value =
        order?.numero_pedido ??
        order?.numeroPedido ??
        order?.codigo ??
        order?.numero ??
        getOrderLookupId(order);

    return String(value).trim();
}

export function getOrderDateValue(order: OrderRecord | null | undefined) {
    return order?.data_lanc || order?.data || order?.created_at || order?.createdAt;
}

export function getOrderStatusDateValue(order: OrderRecord | null | undefined) {
    return (
        order?.data_status ||
        order?.status_data ||
        order?.updated_at ||
        order?.data_lanc ||
        order?.data ||
        order?.created_at
    );
}

export function getOrderItems(order: OrderRecord | null | undefined): OrderItem[] {
    if (Array.isArray(order?.itens)) return order.itens;
    if (Array.isArray(order?.produtos)) return order.produtos;
    if (Array.isArray(order?.items)) return order.items;

    return [];
}

export function getOrderItemName(item: OrderItem | null | undefined) {
    return (
        item?.nome_do_produto ||
        item?.nome ||
        item?.produto?.nome ||
        item?.descricao ||
        "Produto"
    );
}

export function getOrderItemImage(item: OrderItem | null | undefined) {
    return (
        item?.foto_principal ||
        item?.foto ||
        item?.imagem ||
        item?.image ||
        item?.produto?.foto ||
        item?.produto?.imagem ||
        item?.produto?.fotos?.m?.[0] ||
        item?.produto?.fotos?.g?.[0] ||
        item?.fotos?.m?.[0] ||
        item?.fotos?.g?.[0] ||
        ""
    );
}

export function getOrderItemQuantity(item: OrderItem | null | undefined) {
    const quantity = Number(item?.quantidade ?? item?.qtd ?? 1);

    return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

export function getOrderItemTotal(item: OrderItem | null | undefined) {
    const total =
        parseMoney(item?.total) ??
        parseMoney(item?.valor_total) ??
        parseMoney(item?.subtotal);

    if (total != null) return total;

    const unitValue =
        parseMoney(item?.valor) ??
        parseMoney(item?.preco) ??
        parseMoney(item?.produto?.preco) ??
        0;

    return unitValue * getOrderItemQuantity(item);
}

export function getOrderPaymentLabel(order: OrderRecord | null | undefined) {
    return (
        (typeof order?.pagamento === "string" ? order.pagamento : "") ||
        order?.pagamento?.nome ||
        order?.pagamento?.tipo ||
        order?.forma_pagamento ||
        order?.pagamento_ecommerce?.payment_method ||
        "Pagamento não informado."
    );
}

export function getOrderDeliveryEstimate(order: OrderRecord | null | undefined) {
    return (
        order?.prazo_de_entrega ||
        order?.entrega?.prazo ||
        order?.entrega?.previsao ||
        order?.data_entrega ||
        "-"
    );
}

export function getOrderTrackingCode(order: OrderRecord | null | undefined) {
    return (
        order?.entrega?.codigo_rastreio ||
        order?.entrega?.melhor_envio_order_id ||
        order?.codigo_rastreio ||
        order?.rastreio ||
        order?.nome_transportadora ||
        ""
    );
}

export function getOrderAddressLines(order: OrderRecord | null | undefined) {
    const address =
        order?.endereco ||
        order?.endereco_entrega ||
        order?.enderecoEntrega ||
        order?.cliente?.endereco ||
        null;

    if (!address) return ["Endereço não informado."];
    if (typeof address === "string") return [address];

    const street = joinParts([
        address.logradouro || address.rua || address.endereco,
        address.numero,
        address.complemento,
    ]);
    const district = address.bairro || address.distrito;
    const city = joinParts(
        [address.cidade || address.nome_cidade, address.uf || address.estado],
        " - ",
    );
    const zipCode = address.cep ? `CEP ${address.cep}` : "";
    const lines = [street, district, city, zipCode].filter(Boolean);

    return lines.length > 0 ? lines : ["Endereço não informado."];
}

export function getOrderStatusInfo(status: unknown) {
    const rawStatus = String(status || "Pendente");
    const normalized = normalizeText(rawStatus);

    if (normalized.includes("cancel") || normalized.includes("recus")) {
        return {
            label: "Compra cancelada.",
            timelineLabel: "Pedido cancelado",
            className: "text-red-600",
            tone: "cancelled" as const,
        };
    }

    if (normalized.includes("entreg")) {
        return {
            label: formatOrderStatus(rawStatus),
            timelineLabel: "Pedido entregue",
            className: "text-(--dynamic-success)",
            tone: "delivered" as const,
        };
    }

    if (normalized.includes("aprov") || normalized.includes("pago")) {
        return {
            label: formatOrderStatus(rawStatus),
            timelineLabel: "Pagamento aprovado",
            className: "text-(--dynamic-success)",
            tone: "approved" as const,
        };
    }

    if (normalized.includes("pend")) {
        return {
            label: "Pedido pendente.",
            timelineLabel: "Pedido pendente",
            className: "text-amber-600",
            tone: "pending" as const,
        };
    }

    return {
        label: formatOrderStatus(rawStatus),
        timelineLabel: formatOrderStatus(rawStatus),
        className: "text-primary",
        tone: "default" as const,
    };
}

export function formatOrderDate(value: unknown) {
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

export function formatOrderDateTime(value: unknown) {
    if (typeof value !== "string" || value.trim() === "") {
        return "-";
    }

    const trimmedValue = value.trim();
    const dateTime = trimmedValue.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/,
    );

    if (dateTime) {
        return `${dateTime[3]}/${dateTime[2]}/${dateTime[1]} ${dateTime[4]}:${dateTime[5]}`;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
        return formatOrderDate(trimmedValue);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return formatOrderDate(value);
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(date);
}

export function formatOrderMoney(value: unknown) {
    return currencyFormatter.format(parseMoney(value) ?? 0);
}

export function formatOrderStatus(status: string) {
    return status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function normalizeText(value: unknown) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function parseMoney(value: unknown) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== "string") return null;

    const sanitized = value
        .replace(/[^\d,.-]/g, "")
        .trim();

    if (!sanitized) return null;

    const normalized = normalizeMoneyString(sanitized);
    const parsedValue = Number(normalized);

    return Number.isFinite(parsedValue) ? parsedValue : null;
}

function normalizeMoneyString(value: string) {
    const hasComma = value.includes(",");
    const hasDot = value.includes(".");

    if (hasComma) {
        return value
            .replace(/\.(?=\d{3}(?:\D|$))/g, "")
            .replace(",", ".");
    }

    if (!hasDot) return value;

    const dotParts = value.split(".");

    if (dotParts.length === 2) {
        return value;
    }

    const lastPart = dotParts.at(-1) ?? "";

    if (lastPart.length <= 3) {
        return `${dotParts.slice(0, -1).join("")}.${lastPart}`;
    }

    return dotParts.join("");
}

function joinParts(parts: Array<string | number | null | undefined>, glue = ", ") {
    return parts
        .map((part) => String(part || "").trim())
        .filter(Boolean)
        .join(glue);
}
