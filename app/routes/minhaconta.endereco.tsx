import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LoaderCircle, Plus, MapPin } from "lucide-react";
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
      // toast.success("Endereço excluído com sucesso!", { position: 'top-center' });

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
    return (
      <div>
        <PageHeader
          count={0}
          loading
        />
        <div className="flex flex-col items-center justify-center rounded-lg border border-primary/10 bg-main-bg py-16">
          <LoaderCircle className="animate-spin text-primary" size={34} />
          <p className="mt-3 text-sm text-primary/55">Carregando endereços...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader count={enderecos.length} />

      {enderecos.length === 0 ? (
        <div className="text-center py-12 bg-main-bg rounded-lg border border-dashed border-primary/20">
          <MapPin className="mx-auto text-primary/35 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-primary">Nenhum endereço cadastrado</h3>
          <p className="text-primary/55 mb-5">Cadastre um endereço para agilizar suas compras.</p>
          <Link
            to="/minha-conta/enderecos/novo"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-terciary"
          >
            <Plus size={16} />
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

interface PageHeaderProps {
  count: number;
  loading?: boolean;
}

function PageHeader({ count, loading = false }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-primary/10 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="overline-label flex items-center gap-2">
          <MapPin size={15} />
          Entrega
        </p>
        <h1 className="mt-1 text-xl font-semibold text-primary md:text-2xl">
          Meus endereços
        </h1>
        <p className="mt-1 text-sm text-primary/55">
          {loading
            ? "Buscando seus endereços cadastrados."
            : count > 0
              ? `${count} endereço${count === 1 ? "" : "s"} cadastrado${count === 1 ? "" : "s"}.`
              : "Cadastre endereços para escolher a entrega no checkout."}
        </p>
      </div>
      <Link
        to="/minha-conta/enderecos/novo"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-terciary"
      >
        <Plus size={18} />
        Novo Endereço
      </Link>
    </div>
  );
}

