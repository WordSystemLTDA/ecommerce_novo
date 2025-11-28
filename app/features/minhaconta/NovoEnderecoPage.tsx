import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { MapPin, X, Lock } from 'lucide-react';
import Header from '~/components/header';

// Definição dos tipos para o estado do formulário
interface AddressFormData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

// Definição dos tipos para os erros (chaves opcionais ou nulas)
interface FormErrors {
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  [key: string]: string | null | undefined; // Index signature para acesso dinâmico
}

// Resposta da API ViaCEP
interface ViaCepResponse {
  erro?: boolean;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

/**
 * Página de Cadastro de Endereço
 * Esta é a implementação principal baseada na imagem fornecida.
 */
export default function NovoEnderecoPage() {
  // Estado do formulário
  const [formData, setFormData] = useState<AddressFormData>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  });

  // Estados de controle da UI
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoadingCep, setIsLoadingCep] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Efeito para validar o formulário sempre que os dados mudam
  useEffect(() => {
    const isValid =
      formData.cep.length === 9 &&
      formData.logradouro.trim() !== '' &&
      formData.numero.trim() !== '' &&
      formData.bairro.trim() !== '' &&
      formData.cidade.trim() !== '' &&
      formData.uf.trim() !== '';

    setIsFormValid(isValid);
  }, [formData]);

  // Função para lidar com mudanças nos inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Tratamento especial para CEP (Máscara 00000-000)
    if (name === 'cep') {
      const numericValue = value.replace(/\D/g, '');
      let formattedValue = numericValue;
      if (numericValue.length > 5) {
        formattedValue = `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
      }

      setFormData(prev => ({ ...prev, [name]: formattedValue }));

      // Limpa erro se o usuário começar a digitar
      if (errors.cep) {
        setErrors(prev => ({ ...prev, cep: null }));
      }

      // Se o CEP estiver completo, busca o endereço
      if (numericValue.length === 8) {
        fetchAddressByCep(numericValue);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Limpa erro do campo específico
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  // Função para buscar endereço via API (ViaCEP)
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

        // Foca no campo de número após preencher
        const numeroInput = document.getElementById('numero');
        if (numeroInput) numeroInput.focus();
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP.' }));
    } finally {
      setIsLoadingCep(false);
    }
  };

  // Manipulador de envio do formulário
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validação simples
    const newErrors: FormErrors = {};
    if (!formData.cep || formData.cep.length < 9) newErrors.cep = 'Preencha o CEP corretamente.';
    if (!formData.logradouro) newErrors.logradouro = 'Campo obrigatório.';
    if (!formData.numero) newErrors.numero = 'Campo obrigatório.';
    if (!formData.bairro) newErrors.bairro = 'Campo obrigatório.';
    if (!formData.cidade) newErrors.cidade = 'Campo obrigatório.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Endereço cadastrado com sucesso!');
      // Resetar form ou navegar de volta
      console.log('Dados enviados:', formData);
    }
  };

  return (
    <div className="flex items-center justify-center py-5 px-4">

      {/* Card Principal / Modal */}
      <div className="max-w-387 relative flex flex-col justify-center items-center">

        {/* Botão Fechar (Topo Direito) */}
        {/* <button
          onClick={() => { }}
          className="absolute top-4 right-4 text-primary hover:text-secondary transition-colors"
          aria-label="Fechar"
        >
          <X size={28} strokeWidth={3} />
        </button> */}

        {/* Cabeçalho */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-700 uppercase tracking-wide">
              Novo Endereço
            </h2>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">

          <div className="space-y-5">

            {/* Linha 1: CEP (Com destaque de erro igual à imagem) */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${errors.cep ? 'text-red-600' : 'text-gray-600'}`}>
                CEP*
              </label>
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
              {/* Mensagem de Erro / Loading */}
              {isLoadingCep && <p className="text-xs text-primary mt-1">Buscando endereço...</p>}
              {errors.cep && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <span className="border border-red-500 rounded-full w-4 h-4 flex items-center justify-center text-tiny font-bold">!</span>
                  <span>{errors.cep}</span>
                </div>
              )}
            </div>

            {/* Linha 3: Logradouro */}
            <div>
              <label className="block text-gray-500 text-sm mb-1">Logradouro*</label>
              <input
                type="text"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Linha 4: Número e Complemento (Grid de 2 colunas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-sm mb-1">Número*</label>
                <input
                  id="numero"
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
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

            {/* Linha 6: Bairro */}
            <div>
              <label className="block text-gray-500 text-sm mb-1">Bairro*</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Linha 7: Cidade e UF (Campos bloqueados com ícone de cadeado) */}
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

          </div>

          {/* Botão de Ação (Footer) */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`
                px-8 py-3 rounded font-bold uppercase tracking-wide transition-all duration-300 w-full
                ${isFormValid
                  ? 'bg-gray-400 hover:bg-primary text-white shadow-md'
                  : 'bg-gray-300 text-white cursor-not-allowed'}
              `}
            >
              Cadastrar Endereço
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}