import type { Route } from "./+types/produto";
import ProductPage from "~/features/produto/ProdutoPage";
import { produtoService } from "~/features/produto/services/produtoService";
import config from "~/config/config";
import { currencyFormatter } from "~/utils/formatters";
import { getCanonicalUrl, getPrimaryProductImage, getProductDescription, getProductPath } from "~/utils/seo";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const id = params.id;

  if (!id) {
    throw new Response("ID não fornecido", { status: 400 });
  }

  try {
    const produto = await produtoService.listarProduto(id);

    if (produto == undefined) {
      throw new Response("Produto não encontrado", { status: 404 });
    }

    return { produto };
  } catch (error) {
    throw new Response("Produto não encontrado", { status: 404 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  const produto = data?.produto?.data;

  if (!produto) {
    return [
      { title: `Produto | ${config.FOOTER_CONFIG.nomeExibicao}` },
      { name: "robots", content: "noindex, follow" },
    ];
  }

  const description = getProductDescription(produto);
  const canonicalUrl = getCanonicalUrl(getProductPath(produto));
  const image = getPrimaryProductImage(produto);
  const price = Math.max(0, Number(produto.preco) - Number(produto.valorDescontoPix || 0));
  const available = Number(produto.estoque) > 0;
  const title = `${produto.nome} | ${config.FOOTER_CONFIG.nomeExibicao}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    description,
    ...(image ? { image: [image] } : {}),
    ...(produto.codigo ? { sku: produto.codigo } : {}),
    ...(produto.nomeMarca ? { brand: { "@type": "Brand", name: produto.nomeMarca } } : {}),
    ...(produto.nomeCategoria ? { category: produto.nomeCategoria } : {}),
    ...(produto.nomeCor ? { color: produto.nomeCor } : {}),
    ...((produto.tamanhos?.length ?? 0) > 0
      ? { size: produto.tamanhos?.map((size) => size.tamanho) }
      : {}),
    offers: {
      "@type": "Offer",
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      priceCurrency: "BRL",
      price: price.toFixed(2),
      availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: config.FOOTER_CONFIG.nomeExibicao },
    },
  };

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "product" },
    ...(canonicalUrl ? [
      { property: "og:url", content: canonicalUrl },
      { tagName: "link" as const, rel: "canonical", href: canonicalUrl },
    ] : []),
    ...(image ? [
      { property: "og:image", content: image },
      { name: "twitter:image", content: image },
    ] : []),
    { property: "product:price:amount", content: price.toFixed(2) },
    { property: "product:price:currency", content: "BRL" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: `${description} ${currencyFormatter.format(price)}` },
    { "script:ld+json": productSchema },
  ];
}

export default function Produto({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    return (
      <div>
        <p>Produto não encontrado</p>
      </div>
    );
  }

  const { produto } = loaderData;

  if (!produto) {
    return (
      <div>
        <p>Produto não encontrado</p>
      </div>
    );
  }

  return <ProductPage produto={produto.data} />;
}
