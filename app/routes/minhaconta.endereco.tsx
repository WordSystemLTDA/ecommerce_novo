import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import type { Endereco } from "~/features/minhaconta/types";
import { AddressCard } from "~/components/AddressCard";
import { ConfirmationModal } from "~/components/ConfirmationModal";

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
            <AddressCard
              key={endereco.id}
              endereco={endereco}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Excluir Endereço"
        message="Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita."
        confirmText={isDeleting ? "Excluindo..." : "Sim, Excluir"}
        isLoading={isDeleting}
      />
    </div>
  );
}

