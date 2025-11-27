export function gerarSlug(texto: string): string {
    return texto
        .toString()
        .toLowerCase()
        .normalize('NFD') // Separa acentos das letras
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .trim()
        .replace(/\s+/g, '-') // Substitui espaços por hífen
        .replace(/[^\w\-]+/g, '') // Remove tudo que não for letra, número ou hífen
        .replace(/\-\-+/g, '-'); // Remove hífens duplicados
}