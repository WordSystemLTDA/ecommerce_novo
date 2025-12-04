export function gerarSlug(texto: string): string {
    return texto
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
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
