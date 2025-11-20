import { useLoaderData } from "react-router"; // ou @remix-run/react
import type { Route } from "./+types/produto";
import ProductPage from "~/features/produto/ProdutoPage";
import { produtoService } from "~/features/produto/services/produtoService";

// 1. O Loader roda no servidor (ou antes da rota carregar)
// Ele prepara os dados antes do componente existir
export async function loader({ params }: Route.LoaderArgs) {
  const id = params.id;

  if (!id) {
    throw new Response("ID não fornecido", { status: 400 });
  }

  try {
    const produto = await produtoService.listarProduto(id);

    if (produto == undefined) {
      throw new Response("Produto não encontrado", { status: 404 });
    }

    // Retornamos o produto para ser usado no componente
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

// 2. O Componente NÃO é async e apenas RECEBE os dados
export default function Produto({ loaderData }: Route.ComponentProps) {
  // O loaderData já vem tipado graças ao Route.ComponentProps
  if (!loaderData) {
    return (
      <div>
        <p>Produto não encontrado</p>
      </div>
    );
  }

  const { produto } = loaderData;

  // Validações simples caso o loader retorne null (se a sua lógica permitir)
  if (!produto) {
    return (
      <div>
        <p>Produto não encontrado</p>
      </div>
    );
  }

  // console.log(produto);

  return <ProductPage produto={produto} />;
  // return <div>{produto.atributos.nome}</div>;
}