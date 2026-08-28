import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "~/features/auth/context/AuthContext";
import { favoritoService, localFavoritesEvent } from "~/features/favoritos/services/favoritoService";

interface FavoritoContextType {
    quantidade: number;
    atualizarQuantidade: () => Promise<void>;
}

const FavoritoContext = createContext<FavoritoContextType | undefined>(undefined);

export function FavoritoProvider({ children }: { children: ReactNode }) {
    const { cliente } = useAuth();
    const [quantidade, setQuantidade] = useState(0);

    const atualizarQuantidade = async () => {
        if (cliente?.id) {
            try {
                console.log("Atualizando favoritos para cliente:", cliente.id);
                const total = await favoritoService.contar(cliente.id);
                console.log("Total de favoritos recebido:", total);
                setQuantidade(Number(total));
            } catch (error) {
                console.error("Erro ao atualizar quantidade de favoritos:", error);
            }
        } else {
            setQuantidade(favoritoService.contarLocais());
        }
    };

    useEffect(() => {
        atualizarQuantidade();
    }, [cliente]);

    useEffect(() => {
        if (cliente?.id) return;
        const updateLocalCount = () => setQuantidade(favoritoService.contarLocais());
        window.addEventListener(localFavoritesEvent, updateLocalCount);
        window.addEventListener('storage', updateLocalCount);
        return () => {
            window.removeEventListener(localFavoritesEvent, updateLocalCount);
            window.removeEventListener('storage', updateLocalCount);
        };
    }, [cliente?.id]);

    return (
        <FavoritoContext.Provider value={{ quantidade, atualizarQuantidade }}>
            {children}
        </FavoritoContext.Provider>
    );
}

export function useFavorito() {
    const context = useContext(FavoritoContext);
    if (context === undefined) {
        throw new Error("useFavorito must be used within a FavoritoProvider");
    }
    return context;
}
