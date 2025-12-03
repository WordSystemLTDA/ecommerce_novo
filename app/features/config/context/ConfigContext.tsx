import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getConfig, type ConfigData } from '~/services/configService';

interface ConfigContextType {
    config: ConfigData | null;
    loading: boolean;
    error: string | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<ConfigData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await getConfig();
                setConfig(data);

                // Update CSS variables if needed, overriding static config
                if (data) {
                    const root = document.documentElement;
                    // Example: if API returns colors
                    // if (data.cor_primaria) root.style.setProperty('--dynamic-primary', data.cor_primaria);
                }
            } catch (err: any) {
                console.error("Failed to fetch config", err);
                setError(err.message || 'Failed to load configuration');
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading, error }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
