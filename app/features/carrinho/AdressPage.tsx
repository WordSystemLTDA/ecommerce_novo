import { useEffect, useMemo, useState } from 'react';
import {
  FaCheck,
  FaEdit,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
} from 'react-icons/fa';
import Loader from '~/components/loader';
import {
  AddressForm,
  type AddressFormSavedPayload,
} from '~/features/minhaconta/components/AddressForm';
import type { Endereco } from '~/features/minhaconta/types';
import { useCarrinho } from './context/CarrinhoContext';

type AddressModalState =
  | { mode: 'create' }
  | { endereco: Endereco; mode: 'edit' };

function isDefaultAddress(endereco: Endereco) {
  return ['sim', 's', '1', 'true'].includes(
    String(endereco.padrao).toLowerCase()
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value != null
    ? value as Record<string, unknown>
    : null;
}

function parseAddressId(value: unknown): number | undefined {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

function findAddressId(source: unknown): number | undefined {
  const record = asRecord(source);
  if (!record) {
    return undefined;
  }

  const directId = parseAddressId(record.id) ??
    parseAddressId(record.id_endereco) ??
    parseAddressId(record.idEndereco);

  if (directId != null) {
    return directId;
  }

  return findAddressId(record.data) ??
    findAddressId(record.endereco) ??
    findAddressId(record.address);
}

function getSavedAddressId(
  payload: AddressFormSavedPayload
): number | undefined {
  return payload.addressId ?? findAddressId(payload.response);
}

export default function AddressPage() {
  const {
    carregandoEnderecos,
    enderecoSelecionado,
    enderecos,
    listarEnderecos,
    setEnderecoSelecionado,
  } = useCarrinho();
  const [addressModal, setAddressModal] = useState<AddressModalState | null>(
    null
  );

  const modalTitle = addressModal?.mode === 'edit'
    ? 'Editar endereço'
    : 'Novo endereço';
  const modalAddressId = addressModal?.mode === 'edit'
    ? addressModal.endereco.id
    : undefined;

  useEffect(() => {
    void listarEnderecos();
  }, []);

  useEffect(() => {
    if (!addressModal) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAddressModal(null);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [addressModal]);

  const existingAddressIds = useMemo(
    () => new Set(enderecos.map((endereco) => endereco.id)),
    [enderecos]
  );

  const handleAddressSaved = async (payload: AddressFormSavedPayload) => {
    const savedAddressId = getSavedAddressId(payload);
    const refreshedAddresses = await listarEnderecos(savedAddressId);
    const savedAddress = savedAddressId == null
      ? undefined
      : refreshedAddresses.find((endereco) => endereco.id === savedAddressId);
    const createdAddress = payload.mode === 'create'
      ? refreshedAddresses.find((endereco) => !existingAddressIds.has(endereco.id))
      : undefined;
    const addressToSelect = savedAddress ?? createdAddress;

    if (addressToSelect) {
      setEnderecoSelecionado(addressToSelect);
    }

    setAddressModal(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {carregandoEnderecos ? (
        <div className="flex items-center justify-center w-full">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/70">
                Entrega
              </p>
              <h2 className="text-lg font-bold text-gray-800">
                Selecione seu endereço
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/5"
              onClick={() => setAddressModal({ mode: 'create' })}
            >
              <FaPlus /> Novo endereço
            </button>
          </div>

          {enderecos.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-300 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/8 text-primary">
                <FaMapMarkerAlt />
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-800">
                Nenhum endereço cadastrado
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Cadastre um endereço para calcular o frete e continuar a
                compra.
              </p>
              <button
                type="button"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-terciary"
                onClick={() => setAddressModal({ mode: 'create' })}
              >
                <FaPlus /> Cadastrar endereço
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {enderecos.map((endereco) => {
                const isSelected = enderecoSelecionado?.id === endereco.id;

                return (
                  <div
                    key={endereco.id}
                    className={`
                      rounded-md border p-4 transition-all
                      ${isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'border-gray-300 hover:border-primary/60 hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <label className="flex min-w-0 grow cursor-pointer items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          value={endereco.id}
                          checked={isSelected}
                          onChange={() => setEnderecoSelecionado(endereco)}
                          className="mt-1 w-4 h-4 accent-primary"
                        />
                        <div className="min-w-0 grow text-sm">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-gray-900">
                              {endereco.endereco && (
                                <span>{endereco.endereco}</span>
                              )}
                              {endereco.endereco && endereco.numero && (
                                <span>, </span>
                              )}
                              {endereco.numero && <span>{endereco.numero}</span>}
                            </span>
                            {isDefaultAddress(endereco) && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                Principal
                              </span>
                            )}
                            {isSelected && (
                              <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                                <FaCheck size={9} /> Selecionado
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-gray-600">
                            {endereco.nome_bairro && (
                              <span>{endereco.nome_bairro}</span>
                            )}
                            {endereco.nome_bairro &&
                              (endereco.nome_cidade || endereco.sigla_estado) && (
                                <span> - </span>
                              )}
                            {endereco.nome_cidade && (
                              <span>{endereco.nome_cidade}</span>
                            )}
                            {endereco.nome_cidade && endereco.sigla_estado && (
                              <span>, </span>
                            )}
                            {endereco.sigla_estado && (
                              <span>{endereco.sigla_estado}</span>
                            )}
                            {(endereco.nome_cidade || endereco.sigla_estado) &&
                              endereco.cep && <span>, </span>}
                            {endereco.cep && <span>CEP {endereco.cep}</span>}
                          </p>
                          {endereco.complemento && (
                            <p className="mt-1 text-xs text-gray-500">
                              Complemento: {endereco.complemento}
                            </p>
                          )}
                        </div>
                      </label>

                      <button
                        type="button"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-primary hover:text-primary"
                        onClick={() => setAddressModal({ endereco, mode: 'edit' })}
                      >
                        <FaEdit /> Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 rounded-md bg-gray-50 p-3 text-xs text-gray-600">
            O frete será recalculado automaticamente depois que você escolher
            o endereço.
          </div>
        </div>
      )}

      {addressModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-address-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAddressModal(null);
            }
          }}
        >
          <div className="flex max-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/70">
                  Entrega
                </p>
                <h3
                  id="checkout-address-modal-title"
                  className="text-lg font-bold text-gray-900"
                >
                  {modalTitle}
                </h3>
              </div>

              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary"
                onClick={() => setAddressModal(null)}
                aria-label="Fechar modal de endereço"
              >
                <FaTimes />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <AddressForm
                addressId={modalAddressId}
                cancelLabel="Cancelar"
                onCancel={() => setAddressModal(null)}
                onSaved={handleAddressSaved}
                submitLabel={addressModal.mode === 'edit'
                  ? 'Salvar endereço'
                  : 'Cadastrar endereço'}
                surface="plain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
