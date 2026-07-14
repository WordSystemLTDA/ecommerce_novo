import { useEffect, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import Loading from '~/components/loading';
import { authService } from '~/features/auth/services/authService';
import type { Cliente } from '~/features/auth/types';
import { AuthContext } from './AuthContext';

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
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        }

        checkUser();
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await authService.entrar(credentials);

            if (!response.sucesso) {
                throw {
                    response: {
                        data: {
                            mensagem:
                                response.mensagem ?? 'Email ou senha invalidos.'
                        }
                    }
                };
            }

            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            setCliente(response.data.cliente);
        } catch (error) {
            const mensagem =
                (error as any)?.response?.data?.mensagem ||
                (error as any)?.response?.data?.message ||
                'Erro ao fazer login';

            toast.error(mensagem, { position: 'top-center' });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.sair();
            localStorage.removeItem('token');
            setCliente(null);
        } catch (error) {
            console.error('Erro ao sair', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            cliente,
            isAuthenticated: !!cliente,
            isLoading,
            login,
            logout
        }}>
            {isLoading
                ? <Loading titulo='Carregando' subtitulo='Carregando sessao...' />
                : children}
        </AuthContext.Provider>
    );
}
