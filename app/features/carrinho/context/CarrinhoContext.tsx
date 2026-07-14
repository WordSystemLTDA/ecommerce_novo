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
    erroTipoDeEntregas: string | null;
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
const GUEST_CART_STORAGE_KEY = 'carrinho_guest';

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

function getCartItemGradeId(produto: Produto) {
    const cartItem = produto as Produto & Record<string, any>;
    const gradeId =
        produto.tamanhoSelecionado?.id ??
        cartItem.id_grade ??
        cartItem.idGrade ??
        cartItem.id_tamanho ??
        cartItem.idTamanho ??
        cartItem.grade?.id ??
        0;

    return Number(gradeId) || 0;
}

function isSameCartItem(first: Produto, second: Produto) {
    return first.id === second.id &&
        getCartItemGradeId(first) === getCartItemGradeId(second);
}

function createCartItem(produto: Produto, internalId = generateUUID()): CartItem {
    return {
        ...produto,
        quantidade: produto.quantidade || 1,
        internalId
    };
}

function removeCartItem(produtos: CartItem[], produto: Produto) {
    const cartItem = produto as Partial<CartItem>;

    if (cartItem.internalId) {
        return produtos.filter((value) => value.internalId !== cartItem.internalId);
    }

    return produtos.filter((value) => !isSameCartItem(value, produto));
}

function getCartStorageKey(clienteId?: number) {
    return clienteId ? `carrinho_cliente_${clienteId}` : GUEST_CART_STORAGE_KEY;
}

function readStoredCart(storageKey: string) {
    const savedCart = localStorage.getItem(storageKey);

    if (!savedCart) {
        return [];
    }

    try {
        const parsed: Produto[] = JSON.parse(savedCart);
        return parsed.map((produto) => {
            const cartItem = produto as Partial<CartItem>;
            return createCartItem(produto, cartItem.internalId);
        });
    } catch (error) {
        console.error("Error parsing stored cart", error);
        localStorage.removeItem(storageKey);
        return [];
    }
}

function parseCartPrice(preco: string | number) {
    if (typeof preco === 'number') {
        return preco;
    }

    const normalizedPrice = preco
        .replace(/[^\d,.]/g, '')
        .replace(/\.(?=\d{3}(?:\D|$))/g, '')
        .replace(',', '.');
    const parsedPrice = Number(normalizedPrice);

    return Number.isFinite(parsedPrice) ? parsedPrice : 0;
}

function getErrorMessage(error: unknown) {
    const payload = error as {
        originalError?: string;
        error?: {
            error?: string;
            message?: string;
            mensagem?: string;
        };
    };

    return payload.originalError ??
        payload.error?.error ??
        payload.error?.message ??
        payload.error?.mensagem ??
        'Não foi possível calcular o frete para este endereço.';
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
    let { cliente } = useAuth();

    const [produtos, setProdutos] = useState<CartItem[]>([]);
    const [tipoDeEntregas, setTipoDeEntregas] = useState<TipoDeEntrega[]>([]);
    const [erroTipoDeEntregas, setErroTipoDeEntregas] = useState<string | null>(null);
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
    const [cartLoaded, setCartLoaded] = useState(false);

    useEffect(() => {
        const storageKey = getCartStorageKey(cliente?.id);
        let storedCart = readStoredCart(storageKey);

        if (cliente?.id && storedCart.length === 0) {
            storedCart = readStoredCart(GUEST_CART_STORAGE_KEY);

            if (storedCart.length > 0) {
                localStorage.setItem(storageKey, JSON.stringify(storedCart));
                localStorage.removeItem(GUEST_CART_STORAGE_KEY);
            }
        }

        setProdutos(storedCart);
        setSelectedItems(storedCart.map((produto) => produto.internalId));
        setCartLoaded(true);
    }, [cliente?.id]);

    useEffect(() => {
        if (!cartLoaded) {
            return;
        }

        localStorage.setItem(
            getCartStorageKey(cliente?.id),
            JSON.stringify(produtos)
        );
    }, [produtos, cliente?.id, cartLoaded]);

    useEffect(() => {
        setSelectedItems((previousSelectedItems) => {
            const cartItemIds = produtos.map((produto) => produto.internalId);

            if (cartItemIds.length === 0) {
                return [];
            }

            const selectedStillInCart = previousSelectedItems.filter((id) =>
                cartItemIds.includes(id)
            );

            return selectedStillInCart.length > 0
                ? selectedStillInCart
                : cartItemIds;
        });
    }, [produtos]);

    const readBackendCartDisabled = async () => {
        if (!cliente?.id) return;
        try {
            const items = await carrinhoService.listar(cliente.id);
            if (items) {
                setProdutos((currentProdutos) => {
                    const claimedIndices = new Set<number>();
                    const mappedItems: CartItem[] = items.map(p => {
                        // Tenta encontrar um item existente correspondente para preservar o internalId
                        // A correspondência deve considerar ID do produto e talvez tamanho/atributos se for o caso
                        // Aqui assumimos que ID do produto + ordem relativa (claimedIndices) é suficiente para estabilidade basica
                        const matchIndex = currentProdutos.findIndex((cp, idx) =>
                            isSameCartItem(cp, p) && !claimedIndices.has(idx)
                            // Adicionar verificação de variação se necessário (ex: tamanho)
                            // && cp.tamanhoSelecionado?.id === p.tamanhoSelecionado?.id
                        );

                        if (matchIndex !== -1) {
                            claimedIndices.add(matchIndex);
                            return createCartItem(p, currentProdutos[matchIndex].internalId);
                        } else {
                            return createCartItem(p);
                        }
                    });

                    // Atualiza selectedItems para incluir APENAS os novos itens (preservando seleção dos antigos)
                    setSelectedItems((previousSelectedItems) => {
                        const validIds = mappedItems.map((produto) => produto.internalId);
                        const selectedStillInCart = previousSelectedItems.filter((id) =>
                            validIds.includes(id)
                        );

                        return selectedStillInCart.length > 0
                            ? selectedStillInCart
                            : validIds;
                    });

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
            return accumulator + (
                parseCartPrice(currentItem.preco) * Number(currentItem.quantidade)
            );
        }, 0).toFixed(2));
    }

    const retornarValorFinal = () => {
        const valorProdutos = retornarValorProdutos();
        return parseFloat((valorProdutos - valorDesconto + valorFrete).toFixed(2));
    }

    const listarTipoDeEntregas = async (cepDestino: string) => {
        try {
            setCarregandoTipoDeEntregas(true);
            setErroTipoDeEntregas(null);

            var produtosParaCalculo = produtos.filter(p => selectedItems.includes(p.internalId));
            if (produtosParaCalculo.length === 0) {
                setTipoDeEntregas([]);
                setErroTipoDeEntregas('Selecione ao menos um produto no carrinho para calcular o frete.');
                setValorFrete(0);
                return;
            }
            var response = await produtoService.calcularFrete(cepDestino, produtosParaCalculo);

            const data = response.data;
            setTipoDeEntregas(Array.isArray(data) ? data : []);

            setTipoDeEntregaSelecionada(undefined);
            setValorFrete(0);

        } catch (error) {
            console.error("Erro ao listar tipoDeEntregas:", error);
            setTipoDeEntregas([]);
            setErroTipoDeEntregas(getErrorMessage(error));
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
            const existingItem = produtos.find((value) => isSameCartItem(value, produto));
            const quantityToAdd = 1;

            if (existingItem) {
                const quantidade = Number(existingItem.quantidade || 1) + quantityToAdd;
                const updatedItem = { ...existingItem, quantidade };

                setProdutos((oldState) => oldState.map((value) =>
                    value.internalId === existingItem.internalId ? updatedItem : value
                ));
                setSelectedItems((previousSelectedItems) =>
                    previousSelectedItems.includes(existingItem.internalId)
                        ? previousSelectedItems
                        : [...previousSelectedItems, existingItem.internalId]
                );

                if (cliente?.id) {
                    void carrinhoService
                        .editarQuantidadeItem(cliente.id, updatedItem, quantidade)
                        .catch((error) => {
                            console.error("Erro ao sincronizar quantidade:", error);
                        });
                }

                return true;
            }

            const newItem = createCartItem({ ...produto, quantidade: quantityToAdd });
            setProdutos((oldState) => [...oldState, newItem]);
            setSelectedItems(prev => [...prev, newItem.internalId]);

            if (cliente?.id) {
                void carrinhoService
                    .adicionarNovoItem(cliente.id, newItem)
                    .catch((error) => {
                        console.error("Erro ao sincronizar produto:", error);
                    });
            }

            return true;
        } catch (error) {
            console.error("Erro ao adicionar/remover produto:", error);
            toast.error("Erro ao adicionar produto ao carrinho.", { position: 'top-center' });
            return false;
        }
    }

    const removerTodosProdutos = async () => {
        try {
            setProdutos([]);
            setSelectedItems([]);
            setTipoDeEntregaSelecionada(undefined);
            setValorFrete(0);

            if (cliente?.id) {
                void carrinhoService
                    .limparCarrinho(cliente.id)
                    .catch((error) => {
                        console.error("Erro ao sincronizar limpeza do carrinho:", error);
                    });
            } else {
                localStorage.removeItem(GUEST_CART_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Erro ao remover todos os produtos:", error);
            toast.error("Erro ao remover todos os produtos.", { position: 'top-center' });
        }
    }

    const removerProduto = async (produto: Produto) => {
        try {
            const cartItem = produto as Partial<CartItem>;
            setProdutos((oldState) => removeCartItem(oldState, produto));
            setSelectedItems((previousSelectedItems) =>
                cartItem.internalId
                    ? previousSelectedItems.filter((id) => id !== cartItem.internalId)
                    : previousSelectedItems
            );
            setTipoDeEntregaSelecionada(undefined);
            setValorFrete(0);

            if (cliente?.id) {
                void carrinhoService
                    .removerItem(cliente.id, produto)
                    .catch((error) => {
                        console.error("Erro ao sincronizar remoção do produto:", error);
                    });
            }
        } catch (error) {
            console.error("Erro ao remover produto:", error);
            toast.error("Erro ao remover produto do carrinho.", { position: 'top-center' });
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
                void Promise
                    .all(itemsToRemove.map(p => carrinhoService.removerItem(cliente!.id, p)))
                    .catch((error) => {
                        console.error("Erro ao sincronizar produtos removidos:", error);
                    });
            } else {
                // Para guest, salvar o estado atualizado (já filtrado acima, mas precisamos pegar o valor correto)
                // O setProdutos é async, então pegamos o filtered array
                const newProducts = produtos.filter(p => !selectedItems.includes(p.internalId));
                localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(newProducts));
            }
        } catch (error) {
            console.error("Erro ao remover produtos selecionados:", error);
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
                    if (isSameCartItem(value, produto) && !cartItem.internalId) {
                        // Fallback if no internalId passed (should not happen in CartPage)
                        return { ...value, quantidade: produto.quantidade };
                    }
                    return value;
                });

                localStorage.setItem(
                    getCartStorageKey(cliente?.id),
                    JSON.stringify(newState)
                );
                return newState;
            });

            if (cliente?.id) {
                void carrinhoService
                    .editarQuantidadeItem(cliente.id, produto, produto.quantidade)
                    .catch((error) => {
                        console.error("Erro ao sincronizar quantidade:", error);
                    });
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
                void carrinhoService
                    .limparCarrinho(cliente.id)
                    .catch((error) => {
                        console.error("Erro ao sincronizar reset do carrinho:", error);
                    });
            } else {
                localStorage.removeItem(GUEST_CART_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Erro ao resetar carrinho:", error);
        }
    }

    const verificarAdicionadoCarrinho = (produto: Produto) => {
        return produtos.some((value) => isSameCartItem(value, produto));
    }

    return (
        <CarrinhoContext.Provider value={{
            produtos,
            tipoDeEntregas,
            erroTipoDeEntregas,
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
