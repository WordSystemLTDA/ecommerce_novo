import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("entrar", "routes/login.tsx"),
    route("registrar", "routes/register.tsx"),
    route("produto/:codigo", "routes/product.tsx"),
    route("/:categoria", "routes/categories.tsx"),

    route("carrinho", "routes/checkout.layout.tsx", [
        // A página /carrinho (Etapa 1)
        index("routes/checkout.cart.tsx"),

        // As outras etapas
        route("endereco", "routes/checkout.address.tsx"),
        route("entrega", "routes/checkout.delivery.tsx"),
        route("pagamento", "routes/checkout.payment.tsx"),
        route("confirmacao", "routes/checkout.confirmation.tsx"),
    ]),

    route("pedido/sucesso", "routes/order.success.tsx"),
] satisfies RouteConfig;
