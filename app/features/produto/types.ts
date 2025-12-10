import type { DefaultResponse } from "~/types/DefaultResponse";
import type { Categoria } from "../categoria/types";
import type { TipoDeEntrega } from "~/types/TipoDeEntrega";
import type { Marca } from "../marca/types";

export interface Produto extends DefaultResponse {
    id: number,
    links: Links,
    menu: string,
    categoriaId: number,
    nome: string,
    descricaolonga1: string,
    descricaolonga2: string,
    descricao: string,
    peso: number,
    preco: string,
    quantidade: number,
    precoAntigo: number,
    descontoPorcentagem: number,
    precoComDesconto: number,
    oferta?: Oferta,
    temFreteGratis: boolean,
    ehPreEncomenda: boolean,
    dataPreEncomenda: number,
    disponivel: boolean,
    tipo_de_estoque: string,
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
    cores?: ProdutoCor[],
    tamanhos?: ProdutoTamanho[],
    tamanhoSelecionado?: ProdutoTamanho,
    dataLimitePromocao: string,
    horaLimitePromocao: string,
    tipoDeDesconto: string,
    tipoDaPromocao: number,
    quantidadeDesconto: string,
    idPromocoesEcommerce: string,
    tipodeestoque: string,
}

export interface ProdutosBanners {
    id: string,
    categorias: Categoria[],
    produtos: Produto[],
    filtros: string,
}

export interface Links {
    redirect?: string,
    first?: string,
    self: string,
    last?: string,
    next?: string,
}

export interface ProdutoCor {
    id: number;
    nome: string;
    imagem: string;
}

export interface ProdutoTamanho {
    id: number;
    estoque: number;
    tipodeestoque: string;
    tamanho: string;
    valorGrade: string;
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

export interface Produtos {
    produtos: Produto[],
    paginacao: Paginacao,
    filtros: Filtros,
}

export interface Paginacao {
    pagina: number,
    por_pagina: number,
    total: number,
    total_paginas: number
}

export interface Filtros {
    categoria?: string,
    sub_categoria?: string,
    marca_do_produto?: string,
    min_valor_venda?: string,
    max_valor_venda?: string,
    pesquisa?: string,
    order_by?: string,
    pagina: number,
    por_pagina: number,
}

export interface Banner {
    id: number | string;
    imagemUrl: string;
    corHex: string;
    tipo_de_banner?: number;
}

export interface ProdutoResponse extends DefaultResponse {
    data: Produto,
}

export interface ProdutosResponse extends DefaultResponse {
    data: Produtos,
}

export interface CalculcarFreteResponse extends DefaultResponse {
    data: TipoDeEntrega[],
}

