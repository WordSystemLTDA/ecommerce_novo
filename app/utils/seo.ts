import config from "~/config/config";
import type { Produto } from "~/features/produto/types";
import { gerarSlug } from "./formatters";

const cleanText = (value: unknown) => String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function getProductDescription(produto: Produto, maxLength = 160) {
    const informedDescription = [
        produto.descricao,
        produto.descricaolonga1,
        produto.descricaolonga2,
    ].map(cleanText).find(Boolean);

    const fallback = [
        produto.nome,
        produto.nomeMarca ? `da marca ${produto.nomeMarca}` : "",
        produto.nomeCategoria ? `na categoria ${produto.nomeCategoria}` : "",
        `disponível na ${config.FOOTER_CONFIG.nomeExibicao}`,
    ].filter(Boolean).join(" ");

    const description = informedDescription || fallback;
    if (description.length <= maxLength) return description;
    return `${description.slice(0, maxLength - 1).trimEnd()}…`;
}

export function getCanonicalUrl(pathname = "/") {
    const baseUrl = config.SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    if (!baseUrl) return "";
    return new URL(pathname, `${baseUrl}/`).toString();
}

export function getProductPath(produto: Pick<Produto, "id" | "nome">) {
    return `/produto/${produto.id}/${gerarSlug(produto.nome)}`;
}

export function getPrimaryProductImage(produto: Produto) {
    return [
        ...(produto.imagens ?? []),
        ...(produto.fotos?.g ?? []),
        ...(produto.fotos?.m ?? []),
        produto.imagemUrl,
    ].find((image): image is string => typeof image === "string" && image.trim().length > 0) || "";
}
