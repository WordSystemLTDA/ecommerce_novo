export interface FreeShippingCampaign {
  tipo: string;
  nome: string;
  valor_minimo: number | null;
  quantidade_minima_pedidos: number | null;
  dias_considerados: number | null;
  data_inicio: string | null;
  data_fim: string | null;
}

export interface FreeShippingStatus {
  ativo: boolean;
  elegivel: boolean;
  mensagem: string | null;
  regra: {
    id: number;
    tipo: string;
    nome: string;
  } | null;
  campanhas: FreeShippingCampaign[];
}

export interface FreeShippingStatusResponse {
  sucesso: boolean;
  data: FreeShippingStatus;
}
