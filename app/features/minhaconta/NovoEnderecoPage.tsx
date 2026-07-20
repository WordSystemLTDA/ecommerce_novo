import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { AddressForm } from './components/AddressForm';

export default function NovoEnderecoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const parsedAddressId = id == null ? undefined : Number(id);
  const addressId = Number.isFinite(parsedAddressId)
    ? parsedAddressId
    : undefined;
  const isEditing = addressId != null;

  const goToAddresses = () => {
    navigate('/minha-conta/enderecos');
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-b border-primary/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="overline-label flex items-center gap-2">
            <MapPin size={15} />
            Endereços
          </p>
          <h1 className="mt-1 text-xl font-semibold text-primary md:text-2xl">
            {isEditing ? 'Editar endereço' : 'Novo endereço'}
          </h1>
          <p className="mt-1 text-sm text-primary/55">
            Informe o CEP para preencher cidade, estado, bairro e logradouro
            automaticamente quando disponível.
          </p>
        </div>

        <button
          type="button"
          onClick={goToAddresses}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
        >
          <ArrowLeft size={17} />
          Voltar
        </button>
      </div>

      <AddressForm
        addressId={addressId}
        onCancel={goToAddresses}
        onSaved={goToAddresses}
      />
    </div>
  );
}
