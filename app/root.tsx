import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { Suspense, type CSSProperties } from "react";
import { ToastContainer } from "react-toastify";
import type { Route } from "./+types/root";
import Loader from "./components/loader";
import config from "./config/config";
import { AuthProvider } from "~/features/auth/context/AuthProvider";

import toastStyles from "react-toastify/dist/ReactToastify.css?url";
import appStyles from "./app.css?url";
import { HeaderProvider } from "./context/HeaderContext";
import { CarrinhoProvider } from "./features/carrinho/context/CarrinhoContext";
import { FavoritoProvider } from "./features/favoritos/context/FavoritoContext";

const apiOrigin = new URL(config.API).origin;
const themeStyles = {
  '--dynamic-primary': config.CORES.PRIMARIA,
  '--dynamic-secondary': config.CORES.SECUNDARIA,
  '--dynamic-terciary': config.CORES.TERCIARIA,
  '--dynamic-success': config.CORES.SUCESSO,
  '--dynamic-success-strong': config.CORES.SUCESSO_FORTE,
  '--dynamic-success-bg': config.CORES.SUCESSO_FUNDO,
  '--dynamic-bg-header': config.CORES.FUNDO_HEADER,
  '--dynamic-bg-footer': config.CORES.FUNDO_FOOTER,
  '--dynamic-bg-main': config.CORES.FUNDO_MAIN,
  '--dynamic-bg-sidebar': config.CORES.FUNDO_SIDEBAR,
  '--dynamic-bg-product': config.CORES.FUNDO_PRODUTO,
} as CSSProperties;

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
    href: "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&family=Playfair+Display:wght@400;500;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: toastStyles,
  },
  { rel: "stylesheet", href: appStyles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" translate="no" className="notranslate" style={themeStyles} suppressHydrationWarning>
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
  return (
    <div className="min-h-dvh bg-[#f7f7f7] text-[#111]">
      <div className="h-20 border-b border-black/10 bg-[#e5e5e5] px-4 sm:h-28">
        <div className="mx-auto flex h-full max-w-[1520px] items-center gap-4">
          <div className="h-12 w-12 animate-pulse bg-black/10 sm:h-16 sm:w-16" />
          <div className="h-11 flex-1 animate-pulse border border-black/10 bg-white/65" />
        </div>
      </div>
      <div className="mx-auto max-w-[1520px] px-4 py-5 sm:px-6">
        <div className="h-[36vh] min-h-56 animate-pulse bg-black/5 sm:min-h-80" />
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse border border-black/5 bg-white" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthProvider>
        <FavoritoProvider>
          <CarrinhoProvider>
            <HeaderProvider>
              <Outlet />
              <ToastContainer limit={3} newestOnTop />
            </HeaderProvider>
          </CarrinhoProvider>
        </FavoritoProvider>
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
    <main className="page-container py-12 sm:py-16">
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
