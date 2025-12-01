// app/context/AuthContext.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useAuth } from '~/features/auth/context/AuthContext';
import { minhacontaService } from '~/features/minhaconta/services/minhacontaService';
import type { Endereco } from '~/features/minhaconta/types';
import { produtoService } from '~/features/produto/services/produtoService';
import type { Produto } from '~/features/produto/types';
import type { Pagamento } from '~/types/Pagamento';
import type { Transportadora } from '~/types/Transportadora';
import { carrinhoService } from '../services/carrinhoService';

// --------------------------------------------------------------------------
// 1. ATUALIZAÇÃO DA INTERFACE DO CONTEXTO (CarrinhoContextType)
// --------------------------------------------------------------------------
interface CarrinhoContextType {
    produtos: Produto[];
    transportadoras: Transportadora[];
    enderecos: Endereco[],
    pagamentos: Pagamento[],

    // Novos estados de valores
    valorTotal: number;
    valorDesconto: number;
    valorFrete: number;
    transportadoraSelecionada: Transportadora | undefined;
    enderecoSelecionado: Endereco | undefined;
    pagamentoSelecionado: Pagamento | undefined;

    carregandoEnderecos: boolean,
    carregandoTransportadoras: boolean,
    carregandoPagamentos: boolean,

    // Métodos existentes
    adicionarNovoProduto: (produto: Produto) => Promise<void>;
    removerTodosProdutos: () => Promise<void>;
    listarTransportadoras: (cepDestino: string) => Promise<void>;
    listarEnderecos: () => Promise<void>;
    listarPagamentos: () => Promise<void>;
    verificarAdicionadoCarrinho: (produto: Produto) => boolean;

    // Métodos para setar e calcular valores
    setTransportadoraSelecionada: (transportadora: Transportadora) => void;
    setEnderecoSelecionado: (endereco: Endereco) => void;
    setPagamentoSelecionado: (pagamento: Pagamento) => void;
    setValorDesconto: (desconto: number) => void;
    retornarValorProdutos: () => number;
    retornarValorFinal: () => number;






}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
    let { cliente } = useAuth();

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [transportadoras, setTransportadoras] = useState<Transportadora[]>([]);
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

    // Estados de valores e seleção
    const [valorDesconto, setValorDesconto] = useState(0);
    const [valorFrete, setValorFrete] = useState(0); // Valor do frete selecionado
    const [transportadoraSelecionada, setTransportadoraSelecionada] = useState<Transportadora | undefined>(undefined);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco | undefined>(undefined);
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState<Pagamento>();
    // const [cupom, setCupom] = useState('');
    const [aceitouTermos, setAceitouTermos] = useState(false);

    const [carregandoEnderecos, setCarregandoEnderecos] = useState(false);
    const [carregandoTransportadoras, setCarregandoTransportadoras] = useState(false);
    const [carregandoPagamentos, setCarregandoPagamentos] = useState(false);


    // --------------------------------------------------------------------------
    // 2. NOVAS FUNÇÕES SETTERS (Para Transportadora e Desconto)
    // --------------------------------------------------------------------------

    const handleSetTransportadoraSelecionada = (transportadora: Transportadora) => {
        setTransportadoraSelecionada(transportadora);
        setValorFrete(parseFloat(transportadora.price));
    };

    const handleSetEnderecoSelecionado = (endereco: Endereco) => {
        setEnderecoSelecionado(endereco);
    };

    const handleSetPagamentoSelecionado = (pagamento: Pagamento) => {
        setPagamentoSelecionado(pagamento);
    };

    const handleSetValorDesconto = (desconto: number) => {
        setValorDesconto(desconto);
    };

    // --------------------------------------------------------------------------
    // 3. FUNÇÕES EXISTENTES E DE CÁLCULO
    // --------------------------------------------------------------------------

    // Calculadora: Retorna a soma do preço de todos os produtos
    const retornarValorProdutos = () => {
        return produtos.reduce((accumulator: number, currentItem) => {
            // Garante que o atributo 'preco' é tratado como número
            return accumulator + Number(currentItem.atributos.preco);
        }, 0);
    }

    // Calculadora: Retorna o valor final (Produtos - Desconto + Frete)
    const retornarValorFinal = () => {
        const valorProdutos = retornarValorProdutos();
        return valorProdutos - valorDesconto + valorFrete;
    }

    const listarTransportadoras = async (cepDestino: string) => {
        try {
            setCarregandoTransportadoras(true);

            var response = await produtoService.calcularFrete(cepDestino, produtos);

            setTransportadoras(response.data);

            setTransportadoraSelecionada(undefined);
            setValorFrete(0);

        } catch (error) {
            console.error("Erro ao listar transportadoras:", error);
            setTransportadoras([]);
        } finally {
            setCarregandoTransportadoras(false);
        }
    }

    const listarEnderecos = async () => {
        try {
            setCarregandoEnderecos(true);

            var response = await minhacontaService.listarEnderecos(cliente!.id);

            setEnderecos(response.data);

            setEnderecoSelecionado(undefined);
            setValorFrete(0);

        } catch (error) {
            console.error("Erro ao listar endereços:", error);
            setTransportadoras([]);
        } finally {
            setCarregandoEnderecos(false);
        }
    }

    const listarPagamentos = async () => {
        try {
            setCarregandoPagamentos(true);

            var response = await carrinhoService.listarPagamentosDisponiveis();

            setPagamentos(response.data);

            setPagamentoSelecionado(undefined);
        } catch (error) {
            console.error("Erro ao listar pagamentos:", error);
            setTransportadoras([]);
        } finally {
            setCarregandoPagamentos(false);
        }
    }

    // ADICIONAR/REMOVER PRODUTO
    const adicionarNovoProduto = async (produto: Produto) => {
        try {
            if (verificarAdicionadoCarrinho(produto)) {
                setProdutos((oldState) => oldState.filter((value) => value.id !== produto.id));
            } else {
                setProdutos((oldState) => [...oldState, produto]);
            }
        } catch (error) {
            console.error("Erro ao adicionar/remover produto:", error);
        }
    }

    const removerTodosProdutos = async () => {
        try {
            setProdutos([]);
        } catch (error) {
            console.error("Erro ao remover todos os produtos:", error);
        }
    }

    const verificarAdicionadoCarrinho = (produto: Produto) => {
        return produtos.filter((value) => value.id === produto.id).length > 0;
    }


    // --------------------------------------------------------------------------
    // 4. RETORNO DO CONTEXTO
    // --------------------------------------------------------------------------
    return (
        <CarrinhoContext.Provider value={{
            // Dados (Estados)
            produtos,
            transportadoras,
            enderecos,
            pagamentos,

            valorTotal: retornarValorProdutos(), // Retorna o valor calculado dos produtos
            valorDesconto,
            valorFrete,
            transportadoraSelecionada,
            enderecoSelecionado,
            pagamentoSelecionado,

            carregandoEnderecos,
            carregandoTransportadoras,
            carregandoPagamentos,

            // Funções
            adicionarNovoProduto,
            removerTodosProdutos,
            listarTransportadoras,
            listarEnderecos,
            listarPagamentos,
            verificarAdicionadoCarrinho,

            // Novas funções para setar valores
            setTransportadoraSelecionada: handleSetTransportadoraSelecionada,
            setValorDesconto: handleSetValorDesconto,
            setEnderecoSelecionado: handleSetEnderecoSelecionado,
            setPagamentoSelecionado: handleSetPagamentoSelecionado,

            // Funções de Cálculo
            retornarValorProdutos, // Retorna apenas o valor dos produtos
            retornarValorFinal, // Retorna o valor final (Produtos - Desconto + Frete)
        }}>
            {children}
        </CarrinhoContext.Provider>
    );
}

export function useCarrinho() {
    const context = useContext(CarrinhoContext);
    if (context === undefined) {
        throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
    }
    return context;
}