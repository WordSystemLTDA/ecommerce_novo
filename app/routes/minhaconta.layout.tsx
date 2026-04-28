import { Heart, LayoutDashboard, LogOut, MapPin, ShoppingBag, User } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
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
  const navigate = useNavigate();

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
        <div className="flex flex-col lg:flex-row gap-6">

          <aside className="w-full lg:w-64 shrink-0">
            <div className="rounded-2xl border border-primary/10 bg-sidebar-bg backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-4 sticky top-24">
              {cliente && (
                <div className="flex items-center gap-3 px-3 py-3 mb-3 border-b border-primary/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-secondary font-semibold text-sm">
                    {cliente.nome?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">{cliente.nome}</p>
                    <p className="text-xs text-primary/50 truncate">{cliente.email}</p>
                  </div>
                </div>
              )}
              <nav className="space-y-0.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm ${isActive
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
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-1 pt-3 border-t border-primary/10 text-sm"
                >
                  <LogOut size={18} />
                  Sair da conta
                </button>
              </nav>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="rounded-2xl border border-primary/10 bg-product-bg backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 min-h-[500px]">
              <Outlet />
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}
