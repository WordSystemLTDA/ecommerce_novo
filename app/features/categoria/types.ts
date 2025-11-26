import type { DefaultResponse } from "~/types/DefaultResponse";

export interface Categoria {
  id: string,
  nome: string,
  link: string,
  subCategorias: Categoria[],
}

export interface CategoriaResponse extends DefaultResponse {
  data: Categoria[],
}
