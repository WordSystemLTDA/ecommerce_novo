const DEFAULT_CORES = {
    PRIMARIA: '#333b57',
    SECUNDARIA: '#f9f6f6',
    TERCIARIA: '#19bef7'
};

const PRIETO_KOUROS_CORES = {
    PRIMARIA: '#B87443',
    SECUNDARIA: '#EFEAE2',
    TERCIARIA: '#9C6239'
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
    CORES: DEFAULT_CORES,
    getCoresAtivas() {
        // Aplica o tema da Prieto Kouros apenas quando a empresa 3 estiver ativa.
        if (this.EMPRESAS.includes('3')) {
            return PRIETO_KOUROS_CORES;
        }
        return DEFAULT_CORES;
    }
};

export default config;