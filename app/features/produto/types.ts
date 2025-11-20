export interface Produto {
    tipo: string,
    id: number,
    links: Links,
    atributos: Atributos,
}

export interface Links {
    redirect?: string,
    first?: string,
    self: string,
    last?: string,
    next?: string,
}

export interface Atributos {
    menu: string,
    nome: string,
    descricao: string,
    peso: number,
    preco: number,
    precoAntigo: number,
    descontoPorcentagem: number,
    precoComDesconto: number,
    oferta?: Oferta,
    temFreteGratis: boolean,
    ehPreEncomenda: boolean,
    dataPreEncomenda: number,
    disponivel: boolean,
    estoque: number,
    limiteCompra: number,
    tipo: number,
    garantia: string,
    avaliacao: number,
    quantidadeAvaliacoes: number,
    ehMarketplace: boolean,
    marca?: Marca,
    fotos: Fotos,
    imagens?: string[],
    tagDescricao: string,
    produtoEmDestaque: boolean,
    selo?: Selo,
    parcelaMaxima: string,
    linkProduto: string,
    vendidoPor: string,
}

export interface Oferta {
    id: string,
    nome: string,
    // reference_banner: string,
    comecaEm: number,
    terminaEm: number,
    quantidadeDisponivel: number,
    preco: number,
    precoComDesconto: number,
    porcetagemDesconto: number,
    usuarioPrecisaEstarLogado: boolean,
}

export interface Marca {
    id: string,
    name: string,
    img: string,
}

export interface Fotos {
    p: string[],
    m: string[],
    g: string[],
    gg: string[],
}

export interface Selo {
    id: number,
    titulo: string,
    nome: string,
    descricao: string,
    background_color: string,
    font_color: string,
    tipo: string,
}