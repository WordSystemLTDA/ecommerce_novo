import type { DefaultResponse } from "~/types/DefaultResponse";

export interface Categoria {
  id: string,
  nome: string,
  imagem: string,
  subCategorias: Categoria[],
  ativo_loja?: string,
  ativo_menu_loja?: string,
  ativo_menu_principal_loja?: string,
  ativoMenuLoja?: string,
  ativoMenuPrincipalLoja?: string,
  sequencia_menu_loja?: number | string | null,
}

export interface CategoriaResponse extends DefaultResponse {
  data: Categoria[],
}
