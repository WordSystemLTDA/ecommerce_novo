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

  return [
    { title: storeName },
    {
      name: "description",
      content: `Encontre produtos e ofertas na ${storeName}.`,
    },
  ];
}

export default function Home() {
  return (
    <HomeProvider>
      <HomePage />
    </HomeProvider>
  );
}
