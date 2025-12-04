import type { Route } from "./+types/produto";
import ProductPage from "~/features/produto/ProdutoPage";
import { produtoService } from "~/features/produto/services/produtoService";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const id = params.id;

  if (!id) {
    throw new Response("ID não fornecido", { status: 400 });
  }

  try {
    const produto = await produtoService.listarProduto(id);

    if (produto == undefined) {
      throw new Response("Produto não encontrado", { status: 404 });
    }

    return { produto };
  } catch (error) {
    throw new Response("Produto não encontrado", { status: 404 });
  }
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Produto" },
    { name: "description", content: "Seja bem-vindo ao nosso e-commerce!" },
  ];
}

export default function Produto({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    return (
      <div>
        <p>Produto não encontrado</p>
      </div>
    );
  }

  const { produto } = loaderData;

  if (!produto) {
    return (
      <div>
        <p>Produto não encontrado</p>
      </div>
    );
  }

  return <ProductPage produto={produto.data} />;
}