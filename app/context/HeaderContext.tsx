import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { categoriaService } from "~/features/categoria/services/categoriaService";
import type { Categoria } from "~/features/categoria/types";
import { useAuth } from "~/features/auth/context/AuthContext";
import { minhacontaService } from "~/features/minhaconta/services/minhacontaService";
import type { Endereco } from "~/features/minhaconta/types";

interface HeaderContextType {
    categorias: Categoria[];
    categoriasMenu: Categoria[];
    isLoading: boolean;
    selectedAddress: Endereco | null;
    handleAddressSelect: (address: Endereco) => Promise<void>;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
    const { cliente, isAuthenticated } = useAuth();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriasMenu, setCategoriasMenu] = useState<Categoria[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState<Endereco | null>(null);

    const handleAddressSelect = async (address: Endereco) => {
        if (!cliente?.id) return;

        try {
            setSelectedAddress(address);

            await minhacontaService.editarEndereco(address.id, {
                cep: address.cep,
                logradouro: address.endereco,
                numero: address.numero,
                bairro: address.nome_bairro,
                cidade: address.nome_cidade,
                uf: address.sigla_estado,
                id_cliente: cliente.id,
                padrao: 'Sim',
                complemento: address.complemento
            });
        } catch (error) {
            console.error("Erro ao atualizar endereço padrão:", error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [categoriasResponse, categoriasMenuResponse] = await Promise.all([
                    categoriaService.listarCategoriasComSubCategorias(),
                    categoriaService.listarCategoriasMenu()
                ]);

                setCategorias(categoriasResponse.data ?? []);
                setCategoriasMenu(categoriasMenuResponse.data ?? []);
            } catch (error) {
                console.error("Erro ao buscar categorias no HeaderContext", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        const loadAddressData = async () => {
            try {
                if (isAuthenticated && cliente?.id) {
                    const response = await minhacontaService.listarEnderecos(cliente.id);
                    if (response && Array.isArray(response.data)) {
                        const defaultAddress = response.data.find(addr => addr.padrao === 'Sim');
                        if (defaultAddress) {
                            setSelectedAddress(defaultAddress);
                        } else if (response.data.length > 0) {
                            setSelectedAddress(response.data[0]);
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar endereços no HeaderContext", error);
            }
        };

        loadAddressData();
    }, [isAuthenticated, cliente]);

    return (
        <HeaderContext.Provider value={{ categorias, categoriasMenu, isLoading, selectedAddress, handleAddressSelect }}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeader() {
    const context = useContext(HeaderContext);
    if (context === undefined) {
        throw new Error("useHeader must be used within a HeaderProvider");
    }
    return context;
}
