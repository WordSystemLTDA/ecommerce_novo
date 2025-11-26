import type { DefaultResponse } from "~/types/DefaultResponse";

export interface Cliente {
    id: number;
    nome: string;
    email: string;
}

export interface EntrarRequest {
    email: string;
    senha: string;
}

export interface EntrarResponse extends DefaultResponse {
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