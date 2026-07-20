import type { DefaultResponse } from "~/types/DefaultResponse";

export interface Cliente {
    id: number;
    nome: string;
    razao_social: string;
    email: string;
    celular: string,
    doc: string,
}

export interface EntrarRequest {
    email: string;
    senha: string;
}

export interface EntrarResponse extends DefaultResponse {
    data: DataResponseEntrar,
}

export interface DataResponseEntrar {
    token: string;
    cliente: Cliente;
}

export interface RegistrarRequest {
    email: string,
    senha: string,
    tipo_pessoa: string,
    nome: string,
    razao_social: string,
    doc: string,
    telefone: string,
    celular: string,
    ie?: string,
    status_representante: string,
    tipo_de_conta: string,
    tipo_chave_pix: string,
    civil: string,
    sexo: string,
    tipo_de_contribuinte: number,
    consumidor_final: number,
    id_tipo_de_cliente?: number,
}

export interface RegistrarResponse extends DefaultResponse {

}
