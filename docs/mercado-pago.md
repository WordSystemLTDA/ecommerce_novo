# Checkout transparente Mercado Pago

O React e apenas o cliente da integracao. Ele:

- inicializa o Card Payment Brick com a Public Key devolvida pela API;
- recebe do SDK JS do Mercado Pago o token descartavel do cartao;
- envia token, bandeira e parcelas para a API PHP;
- reutiliza a mesma `X-Idempotency-Key` por venda/metodo enquanto a tentativa
  estiver pendente;
- exibe QR Code Pix, desafio 3DS e status devolvidos pela API.

O frontend nao possui Access Token, segredo do webhook, criacao direta de Order,
consulta direta ao Mercado Pago ou regra para determinar o valor da cobranca.

Para o metodo aparecer na loja, as credenciais continuam em Integracoes >
Pagamentos, mas a ativacao visual fica em Banco Pix pelo campo de E-commerce:

- Mercado Pago - Pix: `tipo_banco_pix = 5`;
- Mercado Pago - Cartao de Credito: `tipo_banco_pix = 6`.

## Endpoints consumidos

Todos os endpoints usam a base definida em `app/config/config.ts` e o header
`X-Empresas-IDs`:

- `GET /pagamentos/mercadopago/config`;
- `POST /pagamentos/mercadopago/orders`;
- `GET /pagamentos/mercadopago/orders/{orderId}`;
- `POST /pagamentos/mercadopago/orders/{orderId}/cancelar`.

Criacao de pagamento:

```json
{
  "saleId": 123,
  "payment": {
    "method": "credit_card",
    "token": "token-descartavel",
    "paymentMethodId": "master",
    "installments": 6
  }
}
```

Para Pix, `payment` contem apenas `{ "method": "pix" }`. E-mail e documento
sao lidos do cliente autenticado; o valor e recalculado com precos, promocoes e
frete validados pela API antes de ser persistido e enviado ao Mercado Pago.

## Status tratados

O front entende `approved`, `pending`, `created`, `in_process`, `processing`,
`action_required`, `rejected`, `canceled`, `expired`, `refunded`,
`partially_refunded`, `charged_back` e `unknown`.

`action_required` com `challengeUrl` renderiza o iframe 3DS e depois consulta a
Order novamente pela API.

## Backend

A implementacao esta em
`C:/xampp/htdocs/sistema/apis_restaurantes/api_e_commerce/api1`. Consulte
`docs/mercado-pago-checkout-transparente.md` dentro da API para configurar as
credenciais, o webhook e executar os testes.

## Verificacao do frontend

```bash
npm run typecheck
npm run build
```
