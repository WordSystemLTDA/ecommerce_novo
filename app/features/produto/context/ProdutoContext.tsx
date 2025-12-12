import { createContext, useContext, useState, type ReactNode } from 'react';
import { categoriaService } from '~/features/categoria/services/categoriaService';
import { produtoService } from '~/features/produto/services/produtoService';
import type { Produto, ProdutosBanners } from '~/features/produto/types';

interface ProdutoContextType {
    produtos: ProdutosBanners[];
    listarProdutos: (id: string, filtros: string) => Promise<void>;
}

const ProdutoContext = createContext<ProdutoContextType | undefined>(undefined);

function decodeJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function ProdutoProvider({ children }: { children: ReactNode }) {
    const [produtos, setProdutos] = useState<ProdutosBanners[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const listarProdutos = async (id: string, filtros: string) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('@ecommerce/token');
            let idClienteFilter = '';

            if (token) {
                try {
                    const decoded: any = decodeJwt(token);
                    if (decoded && decoded.id) {
                        idClienteFilter = `&id_cliente=${decoded.id}`;
                    }
                } catch (e) {
                    console.error("Invalid token", e);
                }
            }

            const responseProdutos = await produtoService.listarProdutos(`${filtros}&por_pagina=6${idClienteFilter}`);
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
                            produtos: produtos,
                            filtros: filtros
                        };
                        return newState;
                    }
                    return [...oldState, {
                        id: id,
                        categorias: responseCategorias.data,
                        produtos: produtos,
                        filtros: filtros
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