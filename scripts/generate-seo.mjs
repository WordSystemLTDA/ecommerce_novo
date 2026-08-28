import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const clientBuildPath = path.join(projectRoot, "build", "client");
const apiUrl = process.env.VITE_API_URL || "https://eadsagestart.com.br/sistema/apis_restaurantes/api_e_commerce/api1";

function parseDotEnv(source) {
  return Object.fromEntries(source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "")];
    }));
}

async function getBuildEnvironment() {
  try {
    return { ...parseDotEnv(await readFile(path.join(projectRoot, ".env"), "utf8")), ...process.env };
  } catch {
    return { ...process.env };
  }
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeXml(value) {
  return escapeHtml(value);
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

async function fetchJson(url, companyIds) {
  const response = await fetch(url, {
    headers: { "X-Empresas-IDs": companyIds },
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`API respondeu ${response.status} em ${url}`);
  return JSON.parse((await response.text()).replace(/^\uFEFF/, ""));
}

async function fetchProducts(companyIds) {
  const first = await fetchJson(`${apiUrl}/produtos?pagina=1&por_pagina=100&order_by=nome_asc`, companyIds);
  const firstProducts = first?.data?.produtos ?? [];
  const totalPages = Math.max(1, Number(first?.data?.paginacao?.total_paginas ?? 1));
  const products = [...firstProducts];

  for (let start = 2; start <= totalPages; start += 4) {
    const pages = Array.from({ length: Math.min(4, totalPages - start + 1) }, (_, index) => start + index);
    const responses = await Promise.all(pages.map((page) =>
      fetchJson(`${apiUrl}/produtos?pagina=${page}&por_pagina=100&order_by=nome_asc`, companyIds)
    ));
    for (const response of responses) products.push(...(response?.data?.produtos ?? []));
  }

  return Array.from(new Map(products.map((product) => [Number(product.id), product])).values())
    .filter((product) => Number(product.id) > 0 && String(product.nome ?? "").trim());
}

function productHead(product, { storeName, siteUrl }) {
  const productPath = `/produto/${Number(product.id)}/${slugify(product.nome)}`;
  const canonicalUrl = siteUrl ? new URL(productPath, `${siteUrl}/`).toString() : "";
  const image = product.imagens?.[0] || product.fotos?.m?.[0] || product.imagemUrl || "";
  const price = Math.max(0, Number(product.preco || product.valor_loja || 0) - Number(product.valorDescontoPix || 0));
  const description = [
    product.nome,
    product.nomeMarca ? `da marca ${product.nomeMarca}` : "",
    product.nomeCategoria ? `na categoria ${product.nomeCategoria}` : "",
    `disponível na ${storeName}`,
  ].filter(Boolean).join(" ").slice(0, 160);
  const title = `${product.nome} | ${storeName}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nome,
    description,
    ...(image ? { image: [image] } : {}),
    ...(product.codigo ? { sku: product.codigo } : {}),
    ...(product.nomeMarca ? { brand: { "@type": "Brand", name: product.nomeMarca } } : {}),
    ...(product.nomeCategoria ? { category: product.nomeCategoria } : {}),
    ...(product.nomeCor ? { color: product.nomeCor } : {}),
    offers: {
      "@type": "Offer",
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      priceCurrency: "BRL",
      price: price.toFixed(2),
      availability: Number(product.estoque) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: storeName },
    },
  };

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large">',
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    '<meta property="og:type" content="product">',
    ...(canonicalUrl ? [
      `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
      `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
    ] : []),
    ...(image ? [
      `<meta property="og:image" content="${escapeHtml(image)}">`,
      `<meta name="twitter:image" content="${escapeHtml(image)}">`,
    ] : []),
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta property="product:price:amount" content="${price.toFixed(2)}">`,
    '<meta property="product:price:currency" content="BRL">',
    `<script type="application/ld+json">${safeJson(schema)}</script>`,
  ].join("");
}

function removeGenericPageMeta(html) {
  return html
    .replace(/<title>.*?<\/title>/gis, "")
    .replace(/<meta\s+(?:name|property)="(?:description|robots|og:title|og:description|og:type|og:url|og:image|twitter:card|twitter:image|product:price:amount|product:price:currency)"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "");
}

async function generate() {
  const environment = await getBuildEnvironment();
  const companyIds = String(environment.VITE_EMPRESAS || "135");
  const primaryCompany = companyIds.split(",")[0].trim();
  const companySettings = {
    "3": { name: "Prieto Kouros", siteUrl: "https://prietokouros.com.br" },
    "135": { name: "Urban Boy", siteUrl: "" },
  }[primaryCompany] || { name: "Loja online", siteUrl: "" };
  const storeName = environment.VITE_STORE_NAME || companySettings.name;
  const siteUrl = String(environment.VITE_SITE_URL || companySettings.siteUrl).replace(/\/$/, "");
  const baseHtml = removeGenericPageMeta(await readFile(path.join(clientBuildPath, "index.html"), "utf8"));

  let products = [];
  try {
    products = await fetchProducts(companyIds);
  } catch (error) {
    console.warn(`[seo] Catálogo indisponível durante o build: ${error instanceof Error ? error.message : error}`);
  }

  for (const product of products) {
    const slug = slugify(product.nome);
    const outputDirectory = path.join(clientBuildPath, "produto", String(Number(product.id)), slug);
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(
      path.join(outputDirectory, "index.html"),
      baseHtml.replace("</head>", `${productHead(product, { storeName, siteUrl })}</head>`),
      "utf8",
    );
  }

  const robots = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /carrinho",
    "Disallow: /minha-conta",
    "Disallow: /entrar",
    "Disallow: /registrar",
    "Disallow: /pedido/",
    ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : []),
    "",
  ].join("\n");
  await writeFile(path.join(clientBuildPath, "robots.txt"), robots, "utf8");

  if (siteUrl) {
    const staticPaths = ["/", "/quem-somos", "/entrega-e-trocas", "/formas-de-pagamento", "/contato", "/termos", "/privacidade"];
    const productPaths = products.map((product) => `/produto/${Number(product.id)}/${slugify(product.nome)}`);
    const lastModified = new Date().toISOString().slice(0, 10);
    const urls = [...staticPaths, ...productPaths].map((urlPath) =>
      `<url><loc>${escapeXml(new URL(urlPath, `${siteUrl}/`).toString())}</loc><lastmod>${lastModified}</lastmod></url>`
    ).join("");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
    await writeFile(path.join(clientBuildPath, "sitemap.xml"), sitemap, "utf8");
  }

  console.log(`[seo] ${products.length} páginas de produto geradas${siteUrl ? " com sitemap" : ""}.`);
}

await generate();
