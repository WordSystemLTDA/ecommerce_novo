const DEFAULT_CORES = {
    PRIMARIA: '#333b57',
    SECUNDARIA: '#f9f6f6',
    TERCIARIA: '#19bef7',
    SUCESSO: '#19bef7',
    SUCESSO_FORTE: '#148fbb',
    SUCESSO_FUNDO: '#e8f7fc',
    FUNDO_HEADER: '#f9f6f6',
    FUNDO_FOOTER: '#333b57',
    FUNDO_MAIN: '#ffffff',
    FUNDO_SIDEBAR: '#ffffff',
    FUNDO_PRODUTO: '#ffffff'
};

const PRIETO_KOUROS_CORES = {
    PRIMARIA: '#B87443',
    SECUNDARIA: '#EFEAE2',
    TERCIARIA: '#9C6239',
    SUCESSO: '#9C6239',
    SUCESSO_FORTE: '#7f4f2f',
    SUCESSO_FUNDO: '#f6ece3',
    FUNDO_HEADER: '#EFEAE2',
    FUNDO_FOOTER: '#D29A6A',
    FUNDO_MAIN: '#ffffff',
    FUNDO_SIDEBAR: '#ffffff',
    FUNDO_PRODUTO: '#ffffff'
};

const URBAN_BOY_CORES = {
    PRIMARIA: '#111111',
    SECUNDARIA: '#E5E5E5',
    TERCIARIA: '#6B7280',
    SUCESSO: '#6B7280',
    SUCESSO_FORTE: '#4B5563',
    SUCESSO_FUNDO: '#EEF0F3',
    FUNDO_HEADER: '#E5E5E5',
    FUNDO_FOOTER: '#1A1A1A',
    FUNDO_MAIN: '#F7F7F7',
    FUNDO_SIDEBAR: '#FFFFFF',
    FUNDO_PRODUTO: '#FFFFFF'
};

const DEFAULT_IDENTIDADE = {
    CORES: DEFAULT_CORES,
    LOGO_HEADER: '/logo.png',
    LOGO_HEADER_TIPO: 'image',
    LOGO_ALT: 'Logo',
    LOGO_MASK: null as null | { aspect: string; classe: string }
};

const PRIETO_KOUROS_IDENTIDADE = {
    CORES: PRIETO_KOUROS_CORES,
    LOGO_HEADER: '/logo_prieto_kouros_preto.png',
    LOGO_HEADER_TIPO: 'mask',
    LOGO_ALT: 'Prieto Kouros',
    LOGO_MASK: {
        aspect: 'aspect-2048/431',
        classe: 'w-20 lg:w-36 xl:w-40'
    }
};

const URBAN_BOY_IDENTIDADE = {
    CORES: URBAN_BOY_CORES,
    LOGO_HEADER: '/logo1.png',
    LOGO_HEADER_TIPO: 'mask',
    LOGO_ALT: 'Urban Boy',
    LOGO_MASK: {
        aspect: 'aspect-2048/431',
        classe: 'w-20 lg:w-36 xl:w-90'
    }
};

const EMPRESAS_IDENTIDADE = {
    '3': PRIETO_KOUROS_IDENTIDADE,
    '135': URBAN_BOY_IDENTIDADE,
};

const config = {
    // API: 'http://127.0.0.1/sistema/apis_restaurantes/api_e_commerce/api1',
    API: 'https://eadsagestart.com.br/sistema/apis_restaurantes/api_e_commerce/api1',
    EMPRESAS: [
        // '32', // TESTE
        // '166', // TESTE
        // '135', // URBAN BOY
        '3', // PRIETO KOUROS
    ],
    get IDENTIDADE_VISUAL() {
        return this.getIdentidadeVisualAtiva();
    },
    get CORES() {
        return this.IDENTIDADE_VISUAL.CORES;
    },
    get LOGO_HEADER() {
        return this.IDENTIDADE_VISUAL.LOGO_HEADER;
    },
    get LOGO_HEADER_TIPO() {
        return this.IDENTIDADE_VISUAL.LOGO_HEADER_TIPO;
    },
    get LOGO_ALT() {
        return this.IDENTIDADE_VISUAL.LOGO_ALT;
    },
    get LOGO_MASK() {
        return this.IDENTIDADE_VISUAL.LOGO_MASK;
    },
    getIdentidadeVisualAtiva() {
        const empresaAtiva = this.EMPRESAS.find((empresaId) => EMPRESAS_IDENTIDADE[empresaId as keyof typeof EMPRESAS_IDENTIDADE]);
        if (!empresaAtiva) {
            return DEFAULT_IDENTIDADE;
        }

        return EMPRESAS_IDENTIDADE[empresaAtiva as keyof typeof EMPRESAS_IDENTIDADE];
    },
    getCoresAtivas() {
        return this.getIdentidadeVisualAtiva().CORES;
    }
};

export default config;