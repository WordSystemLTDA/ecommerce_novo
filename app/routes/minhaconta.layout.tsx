import { Heart, LayoutDashboard, LogOut, MapPin, Menu, ShoppingBag, User } from "lucide-react";
import { NavLink, Outlet } from "react-router";
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

  return (
    <div className="min-h-screen bg-main-bg">
      <Header />

      <div className="max-w-387 mx-auto px-4 py-6 lg:py-8 pb-16">
        <div className="mb-6 rounded-lg border border-primary/10 bg-product-bg p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="overline-label">Minha conta</p>
              <h1 className="mt-1 text-2xl font-bold text-primary">
                Olá{cliente?.nome ? `, ${cliente.nome.split(" ")[0]}` : ""}.
              </h1>
              <p className="mt-1 text-sm text-primary/60">
                Acompanhe pedidos, favoritos, dados e endereços em um só lugar.
              </p>
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

        <div className="flex flex-col lg:flex-row gap-6">

          <aside className="w-full lg:w-64 shrink-0">
            <div className="rounded-lg border border-primary/10 bg-sidebar-bg backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-3 lg:sticky lg:top-24">
              {cliente && (
                <div className="flex items-center gap-2 px-2 py-2 mb-2 border-b border-primary/10 text-xs font-bold uppercase tracking-[0.16em] text-primary/60">
                  <Menu size={15} />
                  Menu da conta
                </div>
              )}
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex shrink-0 items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm ${isActive
                        ? "bg-primary text-secondary font-medium"
                        : "text-primary/70 hover:bg-primary/8"
                      }`
                    }
                  >
                    <item.icon size={18} />
                    {item.name}
                  </NavLink>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex shrink-0 items-center gap-3 px-3 py-2.5 rounded-md text-red-500 hover:bg-red-50 transition-colors lg:mt-2 lg:w-full lg:border-t lg:border-primary/10 lg:pt-3 text-sm"
                >
                  <LogOut size={18} />
                  Sair da conta
                </button>
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="rounded-lg border border-primary/10 bg-product-bg backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-4 sm:p-6 min-h-[500px]">
              <Outlet />
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}
