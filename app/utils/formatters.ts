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

export function calcularDataChegada(dataInicial: Date, diasUteis: number): string {
    let dataAtual = new Date(dataInicial);

    dataAtual.setDate(dataAtual.getDate() + 1);

    let diasRestantes = diasUteis;
    while (diasRestantes > 0) {
        dataAtual.setDate(dataAtual.getDate() + 1);

        const diaSemana = dataAtual.getDay();

        if (diaSemana !== 0 && diaSemana !== 6) {
            diasRestantes--;
        }
    }

    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

export const currencyFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 3,
});
