import { createContext, useContext } from 'react';
import type { Cliente } from '~/features/auth/types';

export interface AuthContextType {
    cliente: Cliente | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (dados: any) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
