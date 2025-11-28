// app/context/AuthContext.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Produto } from '~/features/produto/types';

interface CarrinhoContextType {
    produtos: Produto[];
    adicionarNovoProduto: (produto: Produto) => Promise<void>;
    removerTodosProdutos: () => Promise<void>;
    verificarAdicionadoCarrinho: (produto: Produto) => boolean;
    retornarValorTotal: () => number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
    const [produtos, setProdutos] = useState<Produto[]>([]);

    const adicionarNovoProduto = async (produto: Produto) => {
        try {
            if (verificarAdicionadoCarrinho(produto)) {
                setProdutos((oldState) => oldState.filter((value) => value.id != produto.id));
            } else {
                setProdutos((oldState) => [...oldState, produto]);
            }
        } catch (error) {

        }
    }
    
    const removerTodosProdutos = async () => {
        try {
            setProdutos([]);
        } catch (error) {

        }
    }

    const retornarValorTotal = () => {
        return produtos.reduce((accumulator: number, currentItem) => {
            return accumulator + Number(currentItem.atributos.preco);
        }, 0);
    }

    const verificarAdicionadoCarrinho = (produto: Produto) => {
        return produtos.filter((value) => value.id === produto.id).length > 0;
    }

    return (
        <CarrinhoContext.Provider value={{
            produtos,
            adicionarNovoProduto,
            removerTodosProdutos,
            verificarAdicionadoCarrinho,
            retornarValorTotal,
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