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
import { AuthProvider } from "./features/auth/context/AuthContext";
import { ProdutoProvider } from "./features/produto/context/ProdutoContext";

import rangeSliderStyles from 'react-range-slider-input/dist/style.css?url';
import toastStyles from "react-toastify/dist/ReactToastify.css?url";
import swiperStyles from 'swiper/swiper-bundle.css?url';
import appStyles from "./app.css?url";
import { CarrinhoProvider } from "./features/carrinho/context/CarrinhoContext";
import { ConfigProvider } from "./features/config/context/ConfigContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
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
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

  // Este efeito roda assim que o app abre
  useEffect(() => {
    // 1. Pegamos o elemento raiz do HTML (:root)
    const root = document.documentElement;

    // 2. Injetamos as cores do config nas variáveis que criamos no CSS
    root.style.setProperty('--dynamic-primary', config.CORES.PRIMARIA);
    root.style.setProperty('--dynamic-secondary', config.CORES.SECUNDARIA);
    root.style.setProperty('--dynamic-terciary', config.CORES.TERCIARIA);
  }, []); // O array vazio garante que roda apenas uma vez

  return (
    <Suspense fallback={<Loader />}>
      <AuthProvider>
        <ConfigProvider>
          <ProdutoProvider>
            <CarrinhoProvider>
              <Outlet />
              <ToastContainer />
            </CarrinhoProvider>
          </ProdutoProvider>
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
