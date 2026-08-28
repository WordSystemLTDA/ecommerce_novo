import config from "~/config/config";
import { HomePage } from "~/features/home/HomePage";
import { HomeProvider } from "~/features/home/context/HomeContext";
import type { Route } from "./+types/home";
import rangeSliderStyles from "react-range-slider-input/dist/style.css?url";
import swiperStyles from "swiper/swiper-bundle.css?url";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: swiperStyles },
  { rel: "stylesheet", href: rangeSliderStyles },
];

// A home não deve aguardar a API para começar a renderizar.
export function meta() {
  const storeName = config.FOOTER_CONFIG.nomeExibicao || "E-commerce";
  const canonicalUrl = config.SITE_URL ? `${config.SITE_URL}/` : "";

  return [
    { title: `${storeName} | Loja online` },
    {
      name: "description",
      content: `Encontre novidades, marcas e ofertas na ${storeName}. Compre online com pagamento seguro e entrega para todo o Brasil.`,
    },
    { property: "og:title", content: `${storeName} | Loja online` },
    { property: "og:description", content: `Encontre produtos e ofertas na ${storeName}.` },
    { property: "og:type", content: "website" },
    ...(canonicalUrl ? [
      { property: "og:url", content: canonicalUrl },
      { tagName: "link" as const, rel: "canonical", href: canonicalUrl },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: storeName,
          url: canonicalUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: `${canonicalUrl}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
      },
    ] : []),
  ];
}

export default function Home() {
  return (
    <HomeProvider>
      <HomePage />
    </HomeProvider>
  );
}
