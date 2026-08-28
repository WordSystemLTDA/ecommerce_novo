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

function isActiveMenuFlag(value: unknown) {
    if (value === undefined || value === null || value === "") return true;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;

    const normalized = String(value)
        .trim()
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    return normalized === "sim" || normalized === "s" || normalized === "true" || normalized === "1";
}

function isLateralMenuCategory(category: Categoria) {
    return isActiveMenuFlag(category.ativo_menu_loja ?? category.ativoMenuLoja);
}

function isPrincipalMenuCategory(category: Categoria) {
    return isActiveMenuFlag(category.ativo_menu_principal_loja ?? category.ativoMenuPrincipalLoja);
}

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
                setCategoriasMenu(menuCategories.filter(isPrincipalMenuCategory));
                // O menu de departamentos já fica utilizável enquanto as
                // subcategorias completas são carregadas depois.
                setCategorias(menuCategories.filter(isLateralMenuCategory));
            } catch (error) {
                console.error("Erro ao buscar categorias do menu", error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        const loadCategoriesWithChildren = async () => {
            try {
                const response = await categoriaService.listarCategoriasComSubCategorias();
                if (!cancelled) setCategorias((response.data ?? []).filter(isLateralMenuCategory));
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
