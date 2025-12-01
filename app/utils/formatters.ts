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

/**
* Adiciona dias úteis a uma data, pulando fins de semana (sábados e domingos).
* @param dataInicial A data de início (normalmente, o dia da postagem).
* @param diasUteis O número de dias úteis a somar (campo 'time' da API).
* @returns A data final da entrega como string formatada.
*/
export function calcularDataChegada(dataInicial: Date, diasUteis: number): string {
    // Clona a data inicial para não modificar o objeto original
    let dataAtual = new Date(dataInicial);

    // O prazo começa a contar a partir do próximo dia útil após a postagem.
    // O Melhor Envio informa que o prazo NÃO considera o dia da postagem.
    dataAtual.setDate(dataAtual.getDate() + 1);

    // Loop para somar os dias úteis
    let diasRestantes = diasUteis;
    while (diasRestantes > 0) {
        // Incrementa um dia
        dataAtual.setDate(dataAtual.getDate() + 1);

        // Obtém o dia da semana: 0=Domingo, 1=Segunda, ..., 6=Sábado
        const diaSemana = dataAtual.getDay();

        // Se o dia não for Sábado (6) nem Domingo (0), é um dia útil
        if (diaSemana !== 0 && diaSemana !== 6) {
            diasRestantes--;
        }
        // Nota: Para precisão total, aqui você precisaria verificar feriados
    }

    // Formata a data final para o formato 'DD/MM/AAAA'
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexed
    const ano = dataAtual.getFullYear();

    return `${dia}/${mes}/${ano}`;
}