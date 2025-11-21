export interface Categoria {
  id: string,
  nome: string,
  link: string,
  subCategorias: Categoria[],
}
