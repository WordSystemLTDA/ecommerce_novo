import type { DefaultResponse } from "~/types/DefaultResponse";

export interface Marca {
  id: string,
  nome: string,
  imagem: string,
}

export interface MarcaResponse extends DefaultResponse {
  data: Marca[],
}
