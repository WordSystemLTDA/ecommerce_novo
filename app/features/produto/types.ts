import type { DefaultResponse } from "~/types/DefaultResponse";
import type { Categoria } from "../categoria/types";
import type { TipoDeEntrega } from "~/types/TipoDeEntrega";

export interface Produto extends DefaultResponse {
    tipo: string,
    id: number,
    links: Links,
    atributos: Atributos,
}

export interface ProdutosBanners {
    id: string,
    categorias: Categoria[],
    produtos: Produto[],
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
    descricaolonga1: string,
    descricaolonga2: string,
    descricao: string,
    peso: number,
    preco: number,
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
    listaCores?: ProdutoCor[],
    listaTamanhos?: ProdutoTamanho[],
    tamanhoSelecionado?: ProdutoTamanho,
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

export interface Marca {
    id: string,
    nome: string,
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

