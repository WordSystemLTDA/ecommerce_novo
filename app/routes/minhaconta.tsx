import { useAuth } from "~/features/auth/context/AuthContext";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { MapPin, ShoppingBag, User, ArrowRight } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Minha Conta - Word System" },
  ];
}

export default function MinhaConta() {
  const { cliente } = useAuth();

  if (!cliente) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Olá, {cliente.nome}!</h1>
      <p className="text-gray-500 mb-8">Bem-vindo ao seu painel de controle.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link to="/minha-conta/pedidos" className="block group">
          <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow h-full">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Meus Pedidos</h3>
            <p className="text-gray-500 text-sm mb-4">Acompanhe o status e histórico de suas compras.</p>
            <div className="flex items-center text-blue-600 font-medium text-sm">
              Ver pedidos <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        </Link>

        <Link to="/minha-conta/enderecos" className="block group">
          <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow h-full">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Meus Endereços</h3>
            <p className="text-gray-500 text-sm mb-4">Gerencie seus endereços de entrega.</p>
            <div className="flex items-center text-green-600 font-medium text-sm">
              Gerenciar endereços <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        </Link>

        <Link to="/minha-conta/dados" className="block group">
          <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow h-full">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <User size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Meus Dados</h3>
            <p className="text-gray-500 text-sm mb-4">Atualize suas informações pessoais e de contato.</p>
            <div className="flex items-center text-purple-600 font-medium text-sm">
              Editar dados <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
