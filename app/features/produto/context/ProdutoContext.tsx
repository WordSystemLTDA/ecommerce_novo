// app/context/AuthContext.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';
import { categoriaService } from '~/features/categoria/services/categoriaService';
import { produtoService } from '~/features/produto/services/produtoService';
import type { Produto, ProdutosBanners } from '~/features/produto/types';

interface ProdutoContextType {
    produtos: ProdutosBanners[];
    listarProdutos: (id: string, filtros: string) => Promise<void>;
}

const ProdutoContext = createContext<ProdutoContextType | undefined>(undefined);

export function ProdutoProvider({ children }: { children: ReactNode }) {
    const [produtos, setProdutos] = useState<ProdutosBanners[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Função de Login (envolve o service e atualiza o estado local)
    const listarProdutos = async (id: string, filtros: string) => {
        setIsLoading(true);
        try {
            const responseProdutos = await produtoService.listarProdutos(filtros);
            const responseCategorias = await categoriaService.listarCategorias();

            if (responseProdutos.sucesso) {
                setProdutos((oldState) => {
                    const index = oldState.findIndex((item) => item.id === id);
                    const produtos = responseProdutos.data.produtos as Produto[];

                    if (index !== -1) {
                        const newState = [...oldState];
                        newState[index] = {
                            id: id,
                            categorias: responseCategorias.data,
                            produtos: produtos
                        };
                        return newState;
                    }
                    return [...oldState, {
                        id: id,
                        categorias: responseCategorias.data,
                        produtos: produtos
                    }];
                });
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProdutoContext.Provider value={{
            produtos,
            listarProdutos
        }}>
            {children}
        </ProdutoContext.Provider>
    );
}

export function useProduto() {
    const context = useContext(ProdutoContext);
    if (context === undefined) {
        throw new Error('useProduto deve ser usado dentro de um ProdutoProvider');
    }
    return context;
}