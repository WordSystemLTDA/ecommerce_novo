// app/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import { authService } from '~/features/auth/services/authService';
import type { Cliente } from '~/features/auth/types';

// Definição do tipo do Usuário (ajuste conforme seu banco)


// Definição do que o Contexto vai oferecer para os componentes
interface AuthContextType {
    cliente: Cliente | null;         // Se null, não está logado
    isAuthenticated: boolean;  // Atalho booleano
    isLoading: boolean;        // Para mostrar "Carregando..." enquanto verifica
    login: (dados: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Função que roda ao iniciar o app para verificar se o cookie ainda vale
    useEffect(() => {
        async function checkUser() {
            try {
                const response = await authService.eu(); // Chama o /auth/eu
                if (response.sucesso) {
                    setCliente(response.cliente);
                }
            } catch (error) {
                // Se der erro, apenas garante que user é null (não logado)
                setCliente(null);
            } finally {
                setIsLoading(false);
            }
        }

        checkUser();
    }, []);

    // Função de Login (envolve o service e atualiza o estado local)
    const login = async (credentials: any) => {
        setIsLoading(true);
        try {
            const response = await authService.entrar(credentials);

            if (response.sucesso) {
                // Após login com sucesso, buscamos os dados do usuário

                setCliente(response.cliente);
                toast.success('Bem-vindo de volta!');
            }
        } catch (error) {
            toast.error('Erro ao fazer login');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Função de Logout
    const logout = async () => {
        try {
            await authService.sair();
            setCliente(null);
            // Redirecionar se necessário, ex: window.location.href = '/';
        } catch (error) {
            console.error('Erro ao sair', error);
        }
    };

    // --- CORREÇÃO AQUI ---
    // Se ainda estiver checando o cookie, mostra uma tela branca ou spinner
    // e NÃO renderiza os filhos (children) ainda.
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <h2>Carregando sessão...</h2>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            cliente,
            isAuthenticated: !!cliente,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para facilitar o uso
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}