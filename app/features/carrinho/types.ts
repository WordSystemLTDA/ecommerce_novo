import type { DefaultResponse } from "~/types/DefaultResponse";

export interface VendaResponse extends DefaultResponse {
    data: {
        id_venda: string;
    }
}