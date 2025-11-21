import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Suspense, useEffect } from "react";
import Loader from "./components/loader";
import config from "./config/config";

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
  return (
    <div className="fixed inset-0 z-9999 flex min-h-screen w-full flex-col items-center justify-center bg-white">
      {/* Container do Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Anel externo (fundo) */}
        <div className="h-16 w-16 rounded-full border-4 border-gray-100"></div>
        
        {/* Anel interno (girando) - Usa a cor primary definida no seu tema */}
        <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>

      {/* Texto de carregamento com pulsação */}
      <div className="mt-4 flex flex-col items-center gap-1">
        <h2 className="text-lg font-bold text-gray-800">Carregando</h2>
        <p className="animate-pulse text-xs text-gray-500">Aguarde um momento...</p>
      </div>
    </div>
  );
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
      <Outlet />
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
