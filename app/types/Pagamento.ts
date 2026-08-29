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
	valor_base_sem_juros?: number,
	valor_limite_primeira_faixa_sem_juros?: number,
	parcelas_sem_juros_abaixo_valor_base?: number,
	parcelas_sem_juros_faixa_intermediaria?: number,
	mercado_pago_installments?: number,
	sandbox?: boolean,
}

export interface PagamentoResponse extends DefaultResponse {
	data: Pagamento[],
}
