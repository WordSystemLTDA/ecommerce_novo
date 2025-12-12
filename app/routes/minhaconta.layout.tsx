import { Heart, LayoutDashboard, LogOut, MapPin, ShoppingBag, User } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
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
  const { logout } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">

          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive
                        ? "bg-primary text-white font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <item.icon size={20} />
                    {item.name}
                  </NavLink>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-600 hover:bg-red-50 transition-colors mt-4 border-t border-gray-100"
                >
                  <LogOut size={20} />
                  Sair
                </button>
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 min-h-[500px]">
              <Outlet />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
