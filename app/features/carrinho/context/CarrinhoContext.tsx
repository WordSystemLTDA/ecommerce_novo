import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '~/features/auth/context/AuthContext';
import { minhacontaService } from '~/features/minhaconta/services/minhacontaService';
import type { Endereco } from '~/features/minhaconta/types';
import { produtoService } from '~/features/produto/services/produtoService';
import type { Produto, ProdutoTamanho } from '~/features/produto/types';
import type { Pagamento } from '~/types/Pagamento';
import type { TipoDeEntrega } from '~/types/TipoDeEntrega';
import { carrinhoService } from '../services/carrinhoService';

interface CarrinhoContextType {
    produtos: Produto[];
    tipoDeEntregas: TipoDeEntrega[];
    enderecos: Endereco[],
    pagamentos: Pagamento[],

    valorTotal: number;
    valorDesconto: number;
    valorFrete: number;
    tipoDeEntregaSelecionada: TipoDeEntrega | undefined;
    enderecoSelecionado: Endereco | undefined;
    pagamentoSelecionado: Pagamento | undefined;
    tamanhoSelecionado: ProdutoTamanho | null;

    carregandoEnderecos: boolean,
    carregandoTipoDeEntregas: boolean,
    carregandoPagamentos: boolean,

    adicionarNovoProduto: (produto: Produto) => Promise<boolean>;
    removerTodosProdutos: () => Promise<void>;
    resetarCarrinho: () => Promise<void>;
    listarTipoDeEntregas: (cepDestino: string) => Promise<void>;
    listarEnderecos: () => Promise<void>;
    listarPagamentos: () => Promise<void>;
    verificarAdicionadoCarrinho: (produto: Produto) => boolean;

    setTipoDeEntregaSelecionada: (tipoDeEntrega: TipoDeEntrega) => void;
    setEnderecoSelecionado: (endereco: Endereco) => void;
    setPagamentoSelecionado: (pagamento: Pagamento) => void;
    setValorDesconto: (desconto: number) => void;
    setTamanhoSelecionado: (tamanho: ProdutoTamanho | null) => void;
    retornarValorProdutos: () => number;
    retornarValorFinal: () => number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
    let { cliente } = useAuth();

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [tipoDeEntregas, setTipoDeEntregas] = useState<TipoDeEntrega[]>([]);
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

    const [valorDesconto, setValorDesconto] = useState(0);
    const [valorFrete, setValorFrete] = useState(0);
    const [tipoDeEntregaSelecionada, setTipoDeEntregaSelecionada] = useState<TipoDeEntrega | undefined>(undefined);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco | undefined>(undefined);
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState<Pagamento>();
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState<ProdutoTamanho | null>(null);
    const [aceitouTermos, setAceitouTermos] = useState(false);

    const [carregandoEnderecos, setCarregandoEnderecos] = useState(false);
    const [carregandoTipoDeEntregas, setCarregandoTipoDeEntregas] = useState(false);
    const [carregandoPagamentos, setCarregandoPagamentos] = useState(false);

    useEffect(() => {
        if (cliente?.id) {
            syncCart();
        } else {
            const savedCart = localStorage.getItem('carrinho_guest');
            if (savedCart) {
                try {
                    setProdutos(JSON.parse(savedCart));
                } catch (e) {
                    console.error("Error parsing local cart", e);
                }
            }
        }
    }, [cliente]);

    useEffect(() => {
        if (!cliente?.id) {
            localStorage.setItem('carrinho_guest', JSON.stringify(produtos));
        }
    }, [produtos, cliente]);

    const syncCart = async () => {
        if (!cliente?.id) return;

        const savedCart = localStorage.getItem('carrinho_guest');
        if (savedCart) {
            try {
                const localProducts: Produto[] = JSON.parse(savedCart);
                for (const prod of localProducts) {
                    try {
                        await carrinhoService.adicionarNovoItem(cliente.id, prod);
                    } catch (err) {
                        console.error("Error syncing product", prod.id, err);
                    }
                }
                localStorage.removeItem('carrinho_guest');
            } catch (e) {
                console.error("Error parsing local cart for sync", e);
            }
        }

        loadCartFromDb();
    };

    const loadCartFromDb = async () => {
        if (!cliente?.id) return;
        try {
            const items = await carrinhoService.listar(cliente.id);
            if (items) {
                setProdutos(items);
            }
        } catch (error) {
            console.error("Error loading cart from DB", error);
        }
    };


    const handleSetTipoDeEntregaSelecionada = (tipoDeEntrega: TipoDeEntrega) => {
        setTipoDeEntregaSelecionada(tipoDeEntrega);
        setValorFrete(parseFloat(tipoDeEntrega.price));
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

    const retornarValorProdutos = () => {
        return produtos.reduce((accumulator: number, currentItem) => {
            return accumulator + Number(currentItem.preco);
        }, 0);
    }

    const retornarValorFinal = () => {
        const valorProdutos = retornarValorProdutos();
        return valorProdutos - valorDesconto + valorFrete;
    }

    const listarTipoDeEntregas = async (cepDestino: string) => {
        try {
            setCarregandoTipoDeEntregas(true);

            var response = await produtoService.calcularFrete(cepDestino, produtos);

            setTipoDeEntregas(response.data);

            setTipoDeEntregaSelecionada(undefined);
            setValorFrete(0);

        } catch (error) {
            console.error("Erro ao listar tipoDeEntregas:", error);
            setTipoDeEntregas([]);
        } finally {
            setCarregandoTipoDeEntregas(false);
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
            setTipoDeEntregas([]);
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
            setTipoDeEntregas([]);
        } finally {
            setCarregandoPagamentos(false);
        }
    }

    const adicionarNovoProduto = async (produto: Produto) => {
        try {
            const isAdded = verificarAdicionadoCarrinho(produto);

            if (isAdded) {
                if (cliente?.id) {
                    await carrinhoService.removerItem(cliente.id, produto.id);

                    await loadCartFromDb();
                } else {
                    setProdutos((oldState) => oldState.filter((value) => value.id !== produto.id));
                }
                toast.info("Produto removido do carrinho.", { position: 'top-center' });
                return true;
            } else {
                if (cliente?.id) {
                    await carrinhoService.adicionarNovoItem(cliente.id, produto);

                    await loadCartFromDb();
                } else {
                    setProdutos((oldState) => [...oldState, produto]);
                }
                toast.success("Produto adicionado ao carrinho!", { position: 'top-center' });
                return true;
            }
        } catch (error) {
            console.error("Erro ao adicionar/remover produto:", error);
            toast.error("Erro ao atualizar carrinho.", { position: 'top-center' });
            return false;
        }
    }

    const removerTodosProdutos = async () => {
        try {
            setProdutos([]);

            if (cliente?.id) {
                await carrinhoService.limparCarrinho(cliente.id);
            } else {
                localStorage.removeItem('carrinho_guest');
            }
        } catch (error) {
            console.error("Erro ao remover todos os produtos:", error);
        }
    }

    const resetarCarrinho = async () => {
        try {
            setProdutos([]);
            setTipoDeEntregaSelecionada(undefined);
            setEnderecoSelecionado(undefined);
            setPagamentoSelecionado(undefined);
            setValorFrete(0);
            setValorDesconto(0);

            if (cliente?.id) {
                await carrinhoService.limparCarrinho(cliente.id);
            } else {
                localStorage.removeItem('carrinho_guest');
            }
        } catch (error) {
            console.error("Erro ao resetar carrinho:", error);
        }
    }

    const verificarAdicionadoCarrinho = (produto: Produto) => {
        return produtos.filter((value) => value.id == produto.id).length > 0;
    }

    return (
        <CarrinhoContext.Provider value={{
            produtos,
            tipoDeEntregas,
            enderecos,
            pagamentos,

            valorTotal: retornarValorProdutos(),
            valorDesconto,
            valorFrete,
            tipoDeEntregaSelecionada,
            enderecoSelecionado,
            pagamentoSelecionado,
            tamanhoSelecionado,

            carregandoEnderecos,
            carregandoTipoDeEntregas,
            carregandoPagamentos,

            adicionarNovoProduto,
            removerTodosProdutos,
            listarTipoDeEntregas,
            listarEnderecos,
            listarPagamentos,
            verificarAdicionadoCarrinho,
            resetarCarrinho,

            setTipoDeEntregaSelecionada: handleSetTipoDeEntregaSelecionada,
            setValorDesconto: handleSetValorDesconto,
            setEnderecoSelecionado: handleSetEnderecoSelecionado,
            setPagamentoSelecionado: handleSetPagamentoSelecionado,
            setTamanhoSelecionado,

            retornarValorProdutos,
            retornarValorFinal,
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