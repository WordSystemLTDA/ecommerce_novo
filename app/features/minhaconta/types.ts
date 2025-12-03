import type { DefaultResponse } from "~/types/DefaultResponse";

export interface Endereco {
	id: number,
	cep: string,
	endereco: string,
	numero: string,
	nome_cidade: string,
	nome_estado: string,
	sigla_estado: string,
	nome_bairro: string,
	padrao: string,
	complemento: string,
}

export interface EnderecoResponse extends DefaultResponse {
	data: Endereco[],
}

export interface EnderecoPegarResponse extends DefaultResponse {
	data: Endereco,
}