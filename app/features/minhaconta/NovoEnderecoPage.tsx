import { ArrowLeft, LoaderCircle, Lock, MapPin, Save } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/context/AuthContext';
import { minhacontaService } from './services/minhacontaService';

interface AddressFormData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  padrao: boolean;
}

interface FormErrors {
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  [key: string]: string | null | undefined;
}

interface ViaCepResponse {
  erro?: boolean;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export default function NovoEnderecoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { cliente } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState<AddressFormData>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    padrao: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoadingCep, setIsLoadingCep] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  useEffect(() => {
    if (isEditing && cliente?.id) {
      const loadAddress = async () => {
        setIsLoadingData(true);
        try {
          const { data: address } = await minhacontaService.pegarEndereco(Number(id), cliente.id);
          if (address) {
            setFormData({
              cep: address.cep,
              logradouro: address.endereco,
              numero: address.numero,
              complemento: address.complemento || '',
              bairro: address.nome_bairro,
              cidade: address.nome_cidade,
              uf: address.sigla_estado,
              padrao: ['sim', '1', 'true'].includes(String(address.padrao).toLowerCase()),
            });
          }
        } catch (error) {
          console.error("Erro ao carregar endereço:", error);
          toast.error("Erro ao carregar dados do endereço.", { position: 'top-center' });
          navigate('/minha-conta/enderecos');
        } finally {
          setIsLoadingData(false);
        }
      };
      loadAddress();
    }
  }, [isEditing, id, cliente, navigate]);

  useEffect(() => {
    const isValid =
      (formData.cep ?? '').length >= 8 &&
      formData.logradouro.trim() !== '' &&
      formData.numero.trim() !== '' &&
      formData.bairro.trim() !== '' &&
      formData.cidade.trim() !== '' &&
      formData.uf.trim() !== '';

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === 'cep') {
      const numericValue = value.replace(/\D/g, '');
      let formattedValue = numericValue;
      if (numericValue.length > 5) {
        formattedValue = `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
      }

      setFormData(prev => ({ ...prev, [name]: formattedValue }));

      if (errors.cep) {
        setErrors(prev => ({ ...prev, cep: null }));
      }

      if (numericValue.length === 8) {
        fetchAddressByCep(numericValue);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const fetchAddressByCep = async (cepNumbers: string) => {
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setErrors(prev => ({ ...prev, cep: 'CEP não encontrado.' }));
      } else {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf
        }));

        const numeroInput = document.getElementById('numero');
        if (numeroInput) numeroInput.focus();
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP.' }));
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cliente?.id) {
      toast.error("Você precisa estar logado.", { position: 'top-center' });
      return;
    }

    const newErrors: FormErrors = {};
    if (!formData.cep || formData.cep.replace(/\D/g, '').length < 8) newErrors.cep = 'Preencha o CEP corretamente.';
    if (!formData.logradouro) newErrors.logradouro = 'Campo obrigatório.';
    if (!formData.numero) newErrors.numero = 'Campo obrigatório.';
    if (!formData.bairro) newErrors.bairro = 'Campo obrigatório.';
    if (!formData.cidade) newErrors.cidade = 'Campo obrigatório.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const payload = {
          ...formData,
          id_cliente: cliente.id,
          padrao: formData.padrao ? 1 : 0
        };

        if (isEditing) {
          await minhacontaService.editarEndereco(Number(id), payload);
          // toast.success('Endereço atualizado com sucesso!', { position: 'top-center' });
        } else {
          await minhacontaService.cadastrarEndereco(payload);
          // toast.success('Endereço cadastrado com sucesso!', { position: 'top-center' });
        }

        navigate('/minha-conta/enderecos');
      } catch (error: any) {
        console.error("Erro ao salvar endereço:", error);
        toast.error(error.response?.data?.message || 'Erro ao salvar endereço.', { position: 'top-center' });
      }
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-primary/10 bg-main-bg py-16">
        <LoaderCircle className="animate-spin text-primary" size={34} />
        <p className="mt-3 text-sm text-primary/55">Carregando endereço...</p>
      </div>
    );
  }

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
            Informe o CEP para preencher cidade, estado, bairro e logradouro automaticamente quando disponível.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/minha-conta/enderecos')}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
        >
          <ArrowLeft size={17} />
          Voltar
        </button>
      </div>

      <div className="rounded-lg border border-primary/10 bg-white p-5">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-5 rounded-md bg-main-bg p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary">Dados de entrega</p>
                <p className="mt-1 text-xs text-primary/55">
                  Campos com * são obrigatórios para calcular frete e enviar pedidos.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">

            <div>
              <label className={`block text-sm font-medium mb-1 ${errors.cep ? 'text-red-600' : 'text-gray-600'}`}>
                CEP*
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cep"
                  maxLength={9}
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary transition-colors
                    ${errors.cep ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    ${isLoadingCep ? 'opacity-70' : ''}
                  `}
                />
                {isLoadingCep && (
                  <LoaderCircle className="absolute right-3 top-3.5 animate-spin text-primary" size={18} />
                )}
              </div>
              {isLoadingCep && <p className="text-xs text-primary mt-1">Buscando endereço...</p>}
              {errors.cep && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <span className="border border-red-500 rounded-full w-4 h-4 flex items-center justify-center text-tiny font-bold">!</span>
                  <span>{errors.cep}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-500 text-sm mb-1">Logradouro*</label>
              <input
                type="text"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                className={`w-full p-3 border rounded text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.logradouro ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.logradouro && (
                <p className="mt-1 text-sm text-red-500">{errors.logradouro}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-sm mb-1">Número*</label>
                <input
                  id="numero"
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.numero ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.numero && (
                  <p className="mt-1 text-sm text-red-500">{errors.numero}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 text-sm mb-1">Bairro*</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className={`w-full p-3 border rounded text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.bairro ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.bairro && (
                <p className="mt-1 text-sm text-red-500">{errors.bairro}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 relative">
                <label className="block text-gray-300 text-sm mb-1 font-medium">Cidade*</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    readOnly
                    className="w-full p-3 border border-gray-200 rounded text-gray-400 bg-gray-50 focus:outline-none pr-10 cursor-not-allowed"
                  />
                  <Lock className="absolute right-3 top-3.5 text-gray-300" size={18} />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-300 text-sm mb-1 font-medium">UF*</label>
                <div className="relative">
                  <input
                    type="text"
                    name="uf"
                    value={formData.uf}
                    readOnly
                    className="w-full p-3 border border-gray-200 rounded text-gray-400 bg-gray-50 focus:outline-none pr-10 cursor-not-allowed"
                  />
                  <Lock className="absolute right-3 top-3.5 text-gray-300" size={18} />
                </div>
              </div>
            </div>

            <div className="rounded-md border border-primary/10 bg-main-bg p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="padrao"
                  id="padrao"
                  checked={formData.padrao}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span>
                  <span className="block text-sm font-semibold text-primary">
                    Definir como endereço padrão
                  </span>
                  <span className="mt-1 block text-xs text-primary/55">
                    Esse endereço aparecerá em destaque nas próximas compras.
                  </span>
                </span>
              </label>
            </div>

          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/minha-conta/enderecos')}
              className="rounded border border-primary px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`
                inline-flex items-center justify-center gap-2 px-8 py-3 rounded font-bold transition-all duration-300
                ${isFormValid
                  ? 'bg-primary hover:bg-terciary text-white shadow-md'
                  : 'bg-gray-300 text-white cursor-not-allowed'}
              `}
            >
              <Save size={17} />
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Endereço'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
