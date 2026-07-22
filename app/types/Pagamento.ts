import type { DefaultResponse } from "./DefaultResponse";



export interface Pagamento {
	id: number,
	tipo: "PIX" | "DINHEIRO" | "CREDITO" | "DEBITO" | "MERCADO_PAGO" | "CHECKOUT_PRO",
	nome: string,
	pix_dinamico: string,
	nome_banco: string,
	checkout_pro?: boolean,
	checkout_transparente?: boolean,
	mercado_pago_method?: "pix" | "credit_card",
	mercado_pago_methods?: Array<"pix" | "credit_card">,
	max_parcelas?: number,
	sandbox?: boolean,
}

export interface PagamentoResponse extends DefaultResponse {
	data: Pagamento[],
}
