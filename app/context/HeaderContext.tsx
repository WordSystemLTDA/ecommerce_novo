import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { categoriaService } from "~/features/categoria/services/categoriaService";
import type { Categoria } from "~/features/categoria/types";
import { useAuth } from "~/features/auth/context/AuthContext";
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

            const { minhacontaService } = await import("~/features/minhaconta/services/minhacontaService");
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
        let cancelled = false;

        const loadMenuCategories = async () => {
            try {
                const categoriasMenuResponse = await categoriaService.listarCategoriasMenu();
                if (cancelled) return;

                const menuCategories = categoriasMenuResponse.data ?? [];
                setCategoriasMenu(menuCategories);
                // O menu de departamentos já fica utilizável enquanto as
                // subcategorias completas são carregadas depois.
                setCategorias(menuCategories);
            } catch (error) {
                console.error("Erro ao buscar categorias do menu", error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        const loadCategoriesWithChildren = async () => {
            try {
                const response = await categoriaService.listarCategoriasComSubCategorias();
                if (!cancelled) setCategorias(response.data ?? []);
            } catch (error) {
                console.error("Erro ao buscar subcategorias do menu", error);
            }
        };

        void loadMenuCategories();
        const fullCategoriesTimer = window.setTimeout(() => void loadCategoriesWithChildren(), 1200);

        return () => {
            cancelled = true;
            window.clearTimeout(fullCategoriesTimer);
        };
    }, []);

    useEffect(() => {
        const loadAddressData = async () => {
            try {
                if (isAuthenticated && cliente?.id) {
                    const { minhacontaService } = await import("~/features/minhaconta/services/minhacontaService");
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
