import { Heart, LayoutDashboard, LogOut, MapPin, ShoppingBag, User } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { useAuth } from "~/features/auth/context/AuthContext";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Minha Conta - Word System" },
    { name: "description", content: "Gerencie sua conta no Word System" },
  ];
}

export default function MinhaContaLayout() {
  const { logout, cliente } = useAuth();
  const location = useLocation();
  const isAccountHome = location.pathname.replace(/\/$/, "") === "/minha-conta";
  const currentPath = location.pathname.replace(/\/$/, "");
  const isOrdersPage =
    currentPath === "/minha-conta/pedidos" ||
    currentPath.startsWith("/minha-conta/meus-pedidos/detalhes");
  const showAccountShell = !isAccountHome && !isOrdersPage;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const navItems = [
    { name: "Visão Geral", path: "/minha-conta", icon: LayoutDashboard, end: true },
    { name: "Meus Pedidos", path: "/minha-conta/pedidos", icon: ShoppingBag, end: false },
    { name: "Meus Favoritos", path: "/minha-conta/favoritos", icon: Heart, end: false },
    { name: "Meus Endereços", path: "/minha-conta/enderecos", icon: MapPin, end: false },
    { name: "Meus Dados", path: "/minha-conta/dados", icon: User, end: false },
  ];

  const isCurrentItem = (item: typeof navItems[number]) => {
    if (item.end) {
      return currentPath === item.path;
    }

    return currentPath === item.path || currentPath.startsWith(`${item.path}/`);
  };
  const visibleNavItems = navItems.filter((item) => !isCurrentItem(item));

  return (
    <div className="min-h-screen bg-main-bg">
      <Header />

      <div className="page-container pb-12 pt-4 sm:pt-6 lg:pb-16 lg:pt-8">
        {showAccountShell && (
          <div className="mb-5 rounded-lg border border-primary/10 bg-product-bg p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:mb-6 sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="overline-label">Minha conta</p>
                <h1 className="mt-1 text-2xl font-bold text-primary">
                  Olá{cliente?.nome ? `, ${cliente.nome.split(" ")[0]}` : ""}.
                </h1>
              </div>

              {cliente && (
                <div className="flex items-center gap-3 rounded-md bg-main-bg px-4 py-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-secondary font-semibold text-sm">
                    {cliente.nome?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">{cliente.nome}</p>
                    <p className="text-xs text-primary/50 truncate">{cliente.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          {showAccountShell && (
          <aside className="w-full shrink-0 lg:w-72">
            <div className="lg:sticky lg:top-24">
              <div className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-primary">
                <ShortcutDots />
                Atalhos
              </div>
              <nav
                aria-label="Atalhos da conta"
                className="grid grid-cols-2 gap-3 lg:grid-cols-1"
              >
                {visibleNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group flex min-h-20 items-center gap-3 rounded-lg border border-primary/10 bg-product-bg p-3 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-terciary/40 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] sm:p-4 lg:min-h-16"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-terciary/10 text-terciary transition-colors group-hover:bg-terciary group-hover:text-white">
                      <item.icon size={19} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 text-xs font-bold uppercase leading-snug tracking-wide text-primary sm:text-sm">
                      {item.name}
                    </span>
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="group col-span-2 flex min-h-16 w-full items-center gap-3 rounded-lg border border-red-100 bg-red-50/80 p-3 text-left text-xs font-bold uppercase tracking-wide text-red-600 transition-all hover:border-red-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 sm:p-4 sm:text-sm lg:col-span-1"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-500 transition-colors group-hover:bg-red-500 group-hover:text-white">
                    <LogOut size={19} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 leading-snug">Sair da conta</span>
                </button>
              </nav>
            </div>
          </aside>
          )}

          <main className="flex-1 min-w-0">
            <div className={showAccountShell ? "min-h-0 rounded-lg border border-primary/10 bg-product-bg p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:p-6 lg:min-h-[500px]" : ""}>
              <Outlet />
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}

function ShortcutDots() {
  return (
    <span
      className="grid h-5 w-5 shrink-0 grid-cols-2 gap-1"
      aria-hidden="true"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="rounded-full bg-terciary" />
      ))}
    </span>
  );
}
