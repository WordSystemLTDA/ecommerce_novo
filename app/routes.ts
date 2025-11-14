import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("entrar", "routes/login.tsx"),
    route("registrar", "routes/register.tsx"),
    route("produto/:codigo", "routes/product.tsx")
] satisfies RouteConfig;
