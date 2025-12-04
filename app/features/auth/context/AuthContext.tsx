import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import Loading from '~/components/loading';
import { authService } from '~/features/auth/services/authService';
import type { Cliente } from '~/features/auth/types';

interface AuthContextType {
    cliente: Cliente | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (dados: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkUser() {
            try {
                const response = await authService.eu();

                if (response.sucesso) {
                    setCliente(response.data.cliente);
                }
            } catch (error) {
                setCliente(null);
            } finally {
                setIsLoading(false);
            }
        }

        checkUser();
    }, []);

    const login = async (credentials: any) => {
        setIsLoading(true);
        try {
            const response = await authService.entrar(credentials);

            if (response.sucesso) {
                setCliente(response.data.cliente);
                toast.success('Bem-vindo de volta!', { position: 'top-center' });
            }
        } catch (error) {
            toast.error('Erro ao fazer login', { position: 'top-center' });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.sair();
            setCliente(null);
        } catch (error) {
            console.error('Erro ao sair', error);
        }
    };

    if (isLoading) {
        return <Loading titulo='Carregando' subtitulo='Carregando sessão...' />
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

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}