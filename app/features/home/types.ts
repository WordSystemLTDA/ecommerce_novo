import type { Produto } from "../produto/types";

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

