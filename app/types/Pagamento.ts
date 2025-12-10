import type { DefaultResponse } from "./DefaultResponse";



export interface Pagamento {
	id: number,
	tipo: "PIX" | "DINHEIRO" | "CREDITO" | "DEBITO",
	nome: string,
	pix_dinamico: string,
	nome_banco: string,
}

export interface PagamentoResponse extends DefaultResponse {
	data: Pagamento[],
}