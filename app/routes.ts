import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("entrar", "routes/entrar.tsx"),
    route("registrar", "routes/registrar.tsx"),
    route("produto/:id/:slug?", "routes/produto.tsx"),
    route("categoria/:id/:slug?", "routes/categorias.tsx"),
    route("marca/:id/:slug?", "routes/marca.tsx"),

    route("termos", "routes/termos.tsx"),
    route("privacidade", "routes/privacidade.tsx"),

    route("carrinho", "routes/checkout.layout.tsx", [
        index("routes/checkout.cart.tsx"),

        route("endereco", "routes/checkout.address.tsx"),
        route("entrega", "routes/checkout.delivery.tsx"),
        route("pagamento", "routes/checkout.payment.tsx"),
        route("confirmacao", "routes/checkout.confirmation.tsx"),
    ]),

    route("/minha-conta", "routes/minhaconta.layout.tsx", [
        index("routes/minhaconta.tsx"),

        route("enderecos", "routes/minhaconta.endereco.layout.tsx", [
            index("routes/minhaconta.endereco.tsx"),
            route("novo", "routes/minhaconta.novo_endereco.tsx"),
            route("editar/:id", "routes/minhaconta.editar_endereco.tsx"),
        ]),
        route("favoritos", "routes/minhaconta.favoritos.tsx"),
        route("pedidos", "routes/minhaconta.pedidos.tsx"),
        route("dados", "routes/minhaconta.dados.tsx"),
    ]),

    route("pedido/sucesso/:id", "routes/order.success.tsx"),
] satisfies RouteConfig;
