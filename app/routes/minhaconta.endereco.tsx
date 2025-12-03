import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, MapPin, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import type { Endereco } from "~/features/minhaconta/types";

export default function EnderecosPage() {
  const { cliente } = useAuth();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (cliente?.id) {
      loadEnderecos();
    }
  }, [cliente]);

  const loadEnderecos = async () => {
    try {
      setLoading(true);
      const { data } = await minhacontaService.listarEnderecos(cliente!.id);
      // Ensure data is an array, handle potential API inconsistencies
      setEnderecos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      toast.error("Não foi possível carregar seus endereços.", { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete || !cliente?.id) return;

    try {
      setIsDeleting(true);
      await minhacontaService.excluirEndereco(addressToDelete, cliente.id);
      toast.success("Endereço excluído com sucesso!", { position: 'top-center' });

      // Remove from local state to avoid full reload
      setEnderecos(enderecos.filter(e => e.id !== addressToDelete));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
      toast.error("Erro ao excluir o endereço. Tente novamente.", { position: 'top-center' });
    } finally {
      setIsDeleting(false);
      setAddressToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  if (loading) {
    return <div className="flex justify-center py-10">Carregando endereços...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meus Endereços</h1>
        <Link
          to="/minha-conta/enderecos/novo"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Novo Endereço
        </Link>
      </div>

      {enderecos.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <MapPin className="mx-auto text-gray-400 mb-3" size={48} />
          <h3 className="text-lg font-medium text-gray-700">Nenhum endereço cadastrado</h3>
          <p className="text-gray-500 mb-4">Cadastre um endereço para agilizar suas compras.</p>
          <Link
            to="/minha-conta/enderecos/novo"
            className="text-primary font-medium hover:underline"
          >
            Cadastrar agora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enderecos.map((endereco) => (
            <div
              key={endereco.id}
              className={`border rounded-lg p-5 relative transition-all hover:shadow-md ${endereco.padrao === 'Sim' ? "border-primary bg-blue-50/30" : "border-gray-200"
                }`}
            >
              {endereco.padrao === 'Sim' && (
                <span className="absolute top-3 right-3 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                  Padrão
                </span>
              )}

              <div className="flex items-start gap-3 mb-3">
                <MapPin className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-800">
                    {endereco.endereco}, {endereco.numero}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {endereco.nome_bairro}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {endereco.nome_cidade} - {endereco.sigla_estado}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    CEP: {endereco.cep}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 border-t pt-3">
                <Link
                  to={`/minha-conta/enderecos/editar/${endereco.id}`}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <Edit size={16} />
                  Editar
                </Link>

                <button
                  onClick={() => handleDeleteClick(endereco.id)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors ml-2"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle size={24} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir Endereço</h3>
              <p className="text-gray-500 mb-6">
                Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors flex justify-center items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                  ) : null}
                  {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
