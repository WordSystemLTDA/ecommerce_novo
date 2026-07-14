import type { Cliente } from "~/features/auth/types";
import type { Produto } from "~/features/produto/types";
import apiClient from "~/services/api";
import type { Pagamento, PagamentoResponse } from "~/types/Pagamento";

function getProdutoGradeId(produto: Produto) {
    const item = produto as Produto & Record<string, any>;
    const gradeId =
        produto.tamanhoSelecionado?.id ??
        item.id_grade ??
        item.idGrade ??
        item.id_tamanho ??
        item.idTamanho ??
        item.grade?.id ??
        0;

    return Number(gradeId) || 0;
}

function parseProdutoPrice(preco: string) {
    const normalizedPrice = preco
        .replace(/[^\d,.]/g, '')
        .replace(/\.(?=\d{3}(?:\D|$))/g, '')
        .replace(',', '.');
    const parsedPrice = Number(normalizedPrice);

    return Number.isFinite(parsedPrice) ? parsedPrice : null;
}

export const carrinhoService = {
    listar: async (id_cliente: number) => {
        const response = await apiClient.get<any>(`/carrinho/${id_cliente}`);

        const itens = response.data?.data?.produtos || [];
        return itens as Produto[];
    },

    listarPagamentosDisponiveis: async () => {
        const { data } = await apiClient.get<PagamentoResponse>(`/pagamentos`);
        return data;
    },

    adicionarNovoItem: async (id_cliente: number, produto: Produto) => {
        const quantidade = produto.quantidade || 1;
        const preco = parseProdutoPrice(produto.preco);
        const response = await apiClient.post(`/carrinho/${produto.id}`, {
            id_cliente,
            nome_do_produto: produto.nome,
            valor: produto.preco,
            quantidade,
            total: preco == null ? produto.preco : preco * quantidade,
            idPromocoesEcommerce: produto.idPromocoesEcommerce,
            id_grade: getProdutoGradeId(produto)
        });
        return response.data;
    },

    removerItem: async (id_cliente: number, produto: Produto) => {
        const response = await apiClient.delete(`/carrinho/${produto.id}`, {
            data: {
                id_cliente,
                quantidade: produto.quantidade || 1,
                id_grade: getProdutoGradeId(produto)
            }
        });
        return response.data;
    },

    editarQuantidadeItem: async (id_cliente: number, produto: Produto, quantidade: number) => {
        const response = await apiClient.put(`/carrinho/${produto.id}`, {
            id_cliente,
            quantidade,
            id_grade: getProdutoGradeId(produto)
        });
        return response.data;
    },

    limparCarrinho: async (id_cliente: number) => {
        const response = await apiClient.delete(`/carrinho/limpar/${id_cliente}`);
        return response.data;
    },

    gerarVenda: async (
        cliente: Cliente,
        produtos: {
            id: number,
            quantidade: number,
            habilTipo: string,
            idTamanho: string,
        }[],
        pagamento: Pagamento,
        id_endereco: number,
        txid: string,
        codigopix: string,
        prazo_de_entrega: string,
        valor_do_frete: number,
        tipo_de_envio: string,
        nome_transportadora: string,
        valor_venda: number,
    ) => {
        const { data } = await apiClient.post(`/vendas/gerar`, {
            cliente,
            produtos,
            pagamento,
            id_endereco,
            txid,
            codigopix,
            prazo_de_entrega,
            valor_do_frete,
            tipo_de_envio,
            nome_transportadora,
            valor_venda
        });
        return data;
    },

    pegarVenda: async (id_venda: number) => {
        const response = await apiClient.get<any>(`/vendas/${id_venda}`);
        return response.data['data'];
    },

    gerarPix: async (id_banco: number, valor: number, id_compra: string, usuario: any) => {
        const response = await apiClient.post(`/pagamentos/pix/gerar`, {
            id_banco,
            valor,
            id_compra,
            usuario
        });
        return response.data;
    },

    verificarPix: async (id_banco: number, txid: string) => {
        const response = await apiClient.post(`/pagamentos/pix/verificar`, {
            id_banco,
            txid
        });
        return response.data;
    }
};
