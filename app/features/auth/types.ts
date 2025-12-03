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
    rg: string,
    doc: string,
    razao_social: string,
    ie: string,
}

export interface RegistrarResponse extends DefaultResponse {

}