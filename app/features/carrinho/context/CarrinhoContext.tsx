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

export interface CartItem extends Produto {
    internalId: string;
}

interface CarrinhoContextType {
    produtos: CartItem[];
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
    selectedItems: string[];

    toggleProdutoSelecao: (id: string) => void;
    selecionarTodos: () => void;
    deselecionarTodos: () => void;
    verificarProdutoSelecionado: (id: string) => boolean;

    carregandoEnderecos: boolean,
    carregandoTipoDeEntregas: boolean,
    carregandoPagamentos: boolean,

    adicionarNovoProduto: (produto: Produto) => Promise<boolean>;
    removerTodosProdutos: () => Promise<void>;
    removerProduto: (produto: Produto) => Promise<void>;
    removerProdutosSelecionados: () => Promise<void>;
    editarQuantidadeProduto: (produto: Produto) => Promise<void>;
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

// Helper para gerar UUID (Safari fallback)
function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
    let { cliente } = useAuth();

    const [produtos, setProdutos] = useState<CartItem[]>([]);
    const [tipoDeEntregas, setTipoDeEntregas] = useState<TipoDeEntrega[]>([]);
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

    const [valorDesconto, setValorDesconto] = useState(0);
    const [valorFrete, setValorFrete] = useState(0);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [tipoDeEntregaSelecionada, setTipoDeEntregaSelecionada] = useState<TipoDeEntrega | undefined>(undefined);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco | undefined>(undefined);
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState<Pagamento>();
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState<ProdutoTamanho | null>(null);

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
                    const parsed: Produto[] = JSON.parse(savedCart);
                    const withIds = parsed.map(p => ({ ...p, internalId: (p as any).internalId || generateUUID() }));
                    setProdutos(withIds);
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

    useEffect(() => {
        if (selectedItems.length === 0 && produtos.length > 0) {
            setSelectedItems(produtos.map(p => p.internalId));
        }
    }, [produtos.length]);

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
                setProdutos((currentProdutos) => {
                    const claimedIndices = new Set<number>();
                    const newIds: string[] = [];

                    const mappedItems: CartItem[] = items.map(p => {
                        // Tenta encontrar um item existente correspondente para preservar o internalId
                        // A correspondência deve considerar ID do produto e talvez tamanho/atributos se for o caso
                        // Aqui assumimos que ID do produto + ordem relativa (claimedIndices) é suficiente para estabilidade basica
                        const matchIndex = currentProdutos.findIndex((cp, idx) =>
                            cp.id === p.id && !claimedIndices.has(idx)
                            // Adicionar verificação de variação se necessário (ex: tamanho)
                            // && cp.tamanhoSelecionado?.id === p.tamanhoSelecionado?.id
                        );

                        if (matchIndex !== -1) {
                            claimedIndices.add(matchIndex);
                            return { ...p, internalId: currentProdutos[matchIndex].internalId };
                        } else {
                            const newId = generateUUID();
                            newIds.push(newId);
                            return { ...p, internalId: newId };
                        }
                    });

                    // Atualiza selectedItems para incluir APENAS os novos itens (preservando seleção dos antigos)
                    if (newIds.length > 0) {
                        setSelectedItems(prev => [...prev, ...newIds]);
                    }

                    return mappedItems;
                });
            }
        } catch (error) {
            console.error("Error loading cart from DB", error);
        }
    };

    const toggleProdutoSelecao = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const selecionarTodos = () => {
        setSelectedItems(produtos.map(p => p.internalId));
    };

    const deselecionarTodos = () => {
        setSelectedItems([]);
    };

    const verificarProdutoSelecionado = (id: string) => {
        return selectedItems.includes(id);
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
        const produtosSelecionados = produtos.filter(p => selectedItems.includes(p.internalId));
        return parseFloat(produtosSelecionados.reduce((accumulator: number, currentItem) => {
            return accumulator + (Number(currentItem.preco) * Number(currentItem.quantidade));
        }, 0).toFixed(2));
    }

    const retornarValorFinal = () => {
        const valorProdutos = retornarValorProdutos();
        return parseFloat((valorProdutos - valorDesconto + valorFrete).toFixed(2));
    }

    const listarTipoDeEntregas = async (cepDestino: string) => {
        try {
            setCarregandoTipoDeEntregas(true);

            var produtosParaCalculo = produtos.filter(p => selectedItems.includes(p.internalId));
            if (produtosParaCalculo.length === 0) {
                setTipoDeEntregas([]);
                setValorFrete(0);
                return;
            }
            var response = await produtoService.calcularFrete(cepDestino, produtosParaCalculo);

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
                // toast.info("Produto removido do carrinho.", { position: 'top-center' });
                return true;
            } else {
                if (cliente?.id) {
                    await carrinhoService.adicionarNovoItem(cliente.id, produto);

                    await loadCartFromDb();
                } else {
                    const newItem: CartItem = { ...produto, internalId: generateUUID() };
                    setProdutos((oldState) => [...oldState, newItem]);
                    // Adiciona aos selecionados
                    setSelectedItems(prev => [...prev, newItem.internalId]);
                }

                // toast.success("Produto adicionado ao carrinho!", { position: 'top-center' });
                return true;
            }
        } catch (error) {
            console.error("Erro ao adicionar/remover produto:", error);
            toast.error(`Erro ao adicionar/remover produto: ${error}`, { position: 'top-center' });
            return false;
        }
    }

    const removerTodosProdutos = async () => {
        try {
            setProdutos([]);
            setSelectedItems([]);

            if (cliente?.id) {
                await carrinhoService.limparCarrinho(cliente.id);
            } else {
                localStorage.removeItem('carrinho_guest');
            }
        } catch (error) {
            console.error("Erro ao remover todos os produtos:", error);
        }
    }

    const removerProduto = async (produto: Produto) => {
        try {
            setProdutos((oldState) => oldState.filter((value) => value.id !== produto.id));

            if (cliente?.id) {
                await carrinhoService.removerItem(cliente.id, produto.id);
            } else {
                localStorage.removeItem('carrinho_guest');
            }
        } catch (error) {
            console.error("Erro ao remover produto:", error);
        }
    }

    const removerProdutosSelecionados = async () => {
        try {
            // Identificar produtos a remover
            const itemsToRemove = produtos.filter(p => selectedItems.includes(p.internalId));

            // Atualizar estado local (otimista)
            setProdutos(oldState => oldState.filter(p => !selectedItems.includes(p.internalId)));
            setSelectedItems([]); // Limpar seleção
            setTipoDeEntregaSelecionada(undefined);
            setValorFrete(0);

            // Atualizar backend / local storage
            if (cliente?.id) {
                // Loop para remover do backend (idealmente seria um endpoint de batch delete)
                // Usando Promise.all para paralelizar
                await Promise.all(itemsToRemove.map(p => carrinhoService.removerItem(cliente!.id, p.id)));
            } else {
                // Para guest, salvar o estado atualizado (já filtrado acima, mas precisamos pegar o valor correto)
                // O setProdutos é async, então pegamos o filtered array
                const newProducts = produtos.filter(p => !selectedItems.includes(p.internalId));
                localStorage.setItem('carrinho_guest', JSON.stringify(newProducts));
            }
        } catch (error) {
            console.error("Erro ao remover produtos selecionados:", error);
            // Em caso de erro, recomenda-se recarregar o carrinho
            await loadCartFromDb();
        }
    }

    const editarQuantidadeProduto = async (produto: Produto) => {
        try {
            setProdutos((oldState) => {
                const cartItem = produto as CartItem;
                const newState = oldState.map((value) => {
                    // Use internalId if available and matching, else try ID but careful with duplicates
                    if (cartItem.internalId && value.internalId === cartItem.internalId) {
                        return { ...value, quantidade: produto.quantidade };
                    }
                    if (value.id === produto.id && !cartItem.internalId) {
                        // Fallback if no internalId passed (should not happen in CartPage)
                        return { ...value, quantidade: produto.quantidade };
                    }
                    return value;
                });

                if (!cliente?.id) {
                    localStorage.setItem('carrinho_guest', JSON.stringify(newState));
                }
                return newState;
            });

            if (cliente?.id) {
                await carrinhoService.editarQuantidadeItem(cliente.id, produto.id, produto.quantidade);
            }
        } catch (error) {
            console.error("Erro ao editar produto:", error);
        }
    }

    const resetarCarrinho = async () => {
        try {
            setProdutos([]);
            setSelectedItems([]);
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
            selectedItems,

            toggleProdutoSelecao,
            selecionarTodos,
            deselecionarTodos,
            verificarProdutoSelecionado,
            tipoDeEntregaSelecionada,
            enderecoSelecionado,
            pagamentoSelecionado,
            tamanhoSelecionado,

            carregandoEnderecos,
            carregandoTipoDeEntregas,
            carregandoPagamentos,

            adicionarNovoProduto,
            removerTodosProdutos,
            removerProduto,
            removerProdutosSelecionados,
            editarQuantidadeProduto,
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