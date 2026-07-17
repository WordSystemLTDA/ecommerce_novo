import type { DefaultResponse } from "./DefaultResponse";



export interface Pagamento {
	id: number,
	tipo: "PIX" | "DINHEIRO" | "CREDITO" | "DEBITO" | "MERCADO_PAGO" | "CHECKOUT_PRO",
	nome: string,
	pix_dinamico: string,
	nome_banco: string,
	checkout_pro?: boolean,
	max_parcelas?: number,
	sandbox?: boolean,
}

export interface PagamentoResponse extends DefaultResponse {
	data: Pagamento[],
}
