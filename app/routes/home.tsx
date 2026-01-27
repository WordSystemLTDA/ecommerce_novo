import { HomePage } from "~/features/home/HomePage";
import type { Route } from "./+types/home";
// NÃO importe o hook useConfig aqui.
// Importe a função que faz a chamada à API (exemplo hipotético abaixo):
import {getConfig  } from "~/services/configService"; 

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // ERRO ERA AQUI: const config = useConfig(); 
  
  // SOLUÇÃO: Chame a função de busca diretamente
  // Se você não tem uma função separada, faça o fetch aqui mesmo
  
  // Exemplo A: Usando uma função de serviço (recomendado)
  const configData = await getConfig();

  // OU Exemplo B: Fazendo fetch direto se não tiver serviço
  // const response = await fetch('/api/config');
  // const configData = await response.json();

  const dadosDoSite = {
    nomeLoja: configData?.nome || "Minha Loja", // fallback caso venha null
    promocaoAtiva: ""
  };

  return dadosDoSite;
}

// O meta recebe o retorno do clientLoader
export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "E-commerce" }];
  }

  return [
    { title: `${data.nomeLoja}` },
    { name: "description", content: `Aproveite as ${data.promocaoAtiva}!` },
  ];
}

export default function Home() {
  // Aqui DENTRO do componente você PODE usar o hook se precisar
  // const config = useConfig(); 
  return <HomePage />;
}