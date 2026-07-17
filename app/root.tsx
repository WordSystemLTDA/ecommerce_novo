import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import type { Route } from "./+types/root";
import Loader from "./components/loader";
import Loading from "./components/loading";
import config from "./config/config";
import { AuthProvider } from "~/features/auth/context/AuthProvider";
import { ProdutoProvider } from "./features/produto/context/ProdutoContext";

import rangeSliderStyles from 'react-range-slider-input/dist/style.css?url';
import toastStyles from "react-toastify/dist/ReactToastify.css?url";
import swiperStyles from 'swiper/swiper-bundle.css?url';
import appStyles from "./app.css?url";
import { HeaderProvider } from "./context/HeaderContext";
import { CarrinhoProvider } from "./features/carrinho/context/CarrinhoContext";
import { ConfigProvider } from "./features/config/context/ConfigContext";
import { FavoritoProvider } from "./features/favoritos/context/FavoritoContext";
import { HomeProvider } from "./features/home/context/HomeContext";

const apiOrigin = new URL(config.API).origin;

export const links: Route.LinksFunction = () => [
  { rel: "dns-prefetch", href: apiOrigin },
  { rel: "preconnect", href: apiOrigin },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap",
  },
  { rel: "stylesheet", href: swiperStyles },
  { rel: "stylesheet", href: rangeSliderStyles },
  {
    rel: "stylesheet",
    href: toastStyles,
  },
  { rel: "stylesheet", href: appStyles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" translate="no" className="notranslate" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="google" content="notranslate" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <Loading titulo='Carregando' subtitulo='Aguarde um momento...' />
}

export default function App() {

  useEffect(() => {
    const coresAtivas = config.CORES;
    const root = document.documentElement;
    root.style.setProperty('--dynamic-primary', coresAtivas.PRIMARIA);
    root.style.setProperty('--dynamic-secondary', coresAtivas.SECUNDARIA);
    root.style.setProperty('--dynamic-terciary', coresAtivas.TERCIARIA);
    root.style.setProperty('--dynamic-success', coresAtivas.SUCESSO);
    root.style.setProperty('--dynamic-success-strong', coresAtivas.SUCESSO_FORTE);
    root.style.setProperty('--dynamic-success-bg', coresAtivas.SUCESSO_FUNDO);
    root.style.setProperty('--dynamic-bg-header', coresAtivas.FUNDO_HEADER);
    root.style.setProperty('--dynamic-bg-footer', coresAtivas.FUNDO_FOOTER);
    root.style.setProperty('--dynamic-bg-main', coresAtivas.FUNDO_MAIN);
    root.style.setProperty('--dynamic-bg-sidebar', coresAtivas.FUNDO_SIDEBAR);
    root.style.setProperty('--dynamic-bg-product', coresAtivas.FUNDO_PRODUTO);
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <AuthProvider>
        <ConfigProvider>
          <HomeProvider>
            <ProdutoProvider>
              <FavoritoProvider>
                <CarrinhoProvider>
                  <HeaderProvider>
                    <Outlet />
                    <ToastContainer limit={3} newestOnTop />
                  </HeaderProvider>
                </CarrinhoProvider>
              </FavoritoProvider>
            </ProdutoProvider>
          </HomeProvider>
        </ConfigProvider>
      </AuthProvider>
    </Suspense>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Ocorreu um erro inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? error.data || "A página solicitada não foi encontrada."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
