import React, { useState } from 'react';
// Importando os ícones que vamos usar
import { FaBars, FaChevronRight } from 'react-icons/fa';
import type { Categoria } from '~/features/categoria/types';

// --- 1. Definição de Tipos (Interfaces) ---

// interface SubCategoria {
//     id: string;
//     nome: string;
//     link: string;
// }

// interface Categoria {
//     id: string;
//     nome: string;
//     link: string;
//     subCategorias: SubCategoria[];
// }

// --- 2. Dados (Mock Data) ---
// Agora a estrutura é apenas Categoria -> Subcategorias

// const dadosCategorias: Categoria[] = [
//     {
//         id: '1',
//         nome: 'Hardware',
//         link: '/hardware',
//         subCategorias: [
//             { id: 'sub-1-1', nome: 'Coolers e Refrigeração', link: '/hardware/coolers' },
//             { id: 'sub-1-2', nome: 'Discos Rígidos (HD)', link: '/hardware/hd' },
//             { id: 'sub-1-3', nome: 'SSDs', link: '/hardware/ssd' },
//             { id: 'sub-1-4', nome: 'Fontes de Alimentação', link: '/hardware/fontes' },
//             { id: 'sub-1-5', nome: 'Memória RAM', link: '/hardware/ram' },
//             { id: 'sub-1-6', nome: 'Placas de Vídeo (VGA)', link: '/hardware/vga' },
//             { id: 'sub-1-7', nome: 'Placas-mãe', link: '/hardware/placa-mae' },
//             { id: 'sub-1-8', nome: 'Processadores', link: '/hardware/processadores' },
//             { id: 'sub-1-9', nome: 'Gabinetes', link: '/hardware/gabinetes' },
//         ],
//     },
//     {
//         id: '2',
//         nome: 'Periféricos',
//         link: '/perifericos',
//         subCategorias: [
//             { id: 'sub-2-1', nome: 'Mouses', link: '/perifericos/mouses' },
//             { id: 'sub-2-2', nome: 'Teclados', link: '/perifericos/teclados' },
//             { id: 'sub-2-3', nome: 'Headsets e Fones', link: '/perifericos/headsets' },
//             { id: 'sub-2-4', nome: 'Microfones', link: '/perifericos/microfones' },
//             { id: 'sub-2-5', nome: 'Mousepads', link: '/perifericos/mousepads' },
//             { id: 'sub-2-6', nome: 'Webcams', link: '/perifericos/webcams' },
//         ],
//     },
//     {
//         id: '3',
//         nome: 'Computadores',
//         link: '/computadores',
//         subCategorias: [
//             { id: 'sub-3-1', nome: 'PC Gamer', link: '/computadores/pc-gamer' },
//             { id: 'sub-3-2', nome: 'PC Home/Office', link: '/computadores/home-office' },
//             { id: 'sub-3-3', nome: 'Notebooks', link: '/computadores/notebooks' },
//             { id: 'sub-3-4', nome: 'Servidores', link: '/computadores/servidores' },
//         ],
//     },
//     {
//         id: '4',
//         nome: 'Games',
//         link: '/games',
//         subCategorias: [
//             { id: 'sub-4-1', nome: 'PlayStation 5', link: '/games/ps5' },
//             { id: 'sub-4-2', nome: 'Xbox Series', link: '/games/xbox' },
//             { id: 'sub-4-3', nome: 'Nintendo Switch', link: '/games/nintendo' },
//             { id: 'sub-4-4', nome: 'Jogos', link: '/games/jogos' },
//             { id: 'sub-4-5', nome: 'Controles', link: '/games/controles' },
//         ],
//     },
//     {
//         id: '5',
//         nome: 'Monitores',
//         link: '/monitores',
//         subCategorias: [
//             { id: 'sub-5-1', nome: 'Monitor Gamer', link: '/monitores/gamer' },
//             { id: 'sub-5-2', nome: 'Monitor Profissional', link: '/monitores/profissional' },
//             { id: 'sub-5-3', nome: 'Suportes', link: '/monitores/suportes' },
//         ],
//     },
//     {
//         id: '6',
//         nome: 'Cadeiras e Mesas',
//         link: '/moveis',
//         subCategorias: [
//             { id: 'sub-6-1', nome: 'Cadeira Gamer', link: '/moveis/cadeira-gamer' },
//             { id: 'sub-6-2', nome: 'Cadeira de Escritório', link: '/moveis/cadeira-escritorio' },
//             { id: 'sub-6-3', nome: 'Mesa Gamer', link: '/moveis/mesa-gamer' },
//         ],
//     },
// ];

// --- 3. O Componente do Menu ---

export default function DepartmentMenu(props: { categorias: Categoria[] }) {
  // Estado para controlar qual Categoria está sendo "hoverada" (mouse em cima)
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | null>(null);

  // Função chamada ao passar o mouse sobre uma categoria da lista principal
  const lidarComEntradaMouseCategoria = (categoria: Categoria) => {
    setCategoriaAtiva(categoria);
  };

  // Função chamada quando o mouse sai da área do menu completo
  const lidarComSaidaMouse = () => {
    setCategoriaAtiva(null);
  };

  return (
    // `group` permite que o submenu apareça quando fazemos hover neste container pai
    <div className="relative group" onMouseLeave={lidarComSaidaMouse}>

      {/* O Botão Principal "Todas as Categorias" */}
      <button className="flex h-full items-center gap-2 border border-secondary rounded-sm px-6 py-1.5 text-xs font-bold text-secondary transition-colors cursor-pointer hover:bg-gray-50">
        <FaBars />
        <p>Departamentos</p>
      </button>

      {/* O Container do Mega Menu (escondido por padrão, aparece no hover do grupo) */}
      <div className="absolute left-0 top-full z-50 hidden bg-white shadow-xl border border-gray-100 group-hover:flex">

        {/* COLUNA 1: Lista das Categorias Principais */}
        <div className="w-64 border-r border-gray-200 bg-white py-2">
          <ul className="max-h-[500px] overflow-y-auto">
            {props.categorias.map((categoria) => (
              <li key={categoria.id}>
                <a
                  href={categoria.link}
                  onMouseEnter={() => lidarComEntradaMouseCategoria(categoria)}
                  className={`flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors ${categoriaAtiva?.id === categoria.id ? 'bg-primary text-white' : ''
                    }`}
                >
                  <span className="font-medium">{categoria.nome}</span>
                  {/* Mostra a seta apenas se houver subcategorias */}
                  {categoria.subCategorias.length > 0 && <FaChevronRight size={10} />}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUNA 2: Subcategorias ou Banner */}
        {/* Esta área tem largura fixa ou flexível dependendo do design, coloquei w-72 */}
        <div className="w-72 bg-gray-50 min-h-full">

          {/* CASO 1: Usuário está com o mouse em cima de uma categoria */}
          {categoriaAtiva ? (
            <div className="p-4">
              <div className="mb-3 pb-2 border-b border-gray-200">
                <a href={categoriaAtiva.link} className="text-sm font-bold text-primary hover:underline">
                  Ver tudo em {categoriaAtiva.nome}
                </a>
              </div>

              <ul className="space-y-2">
                {categoriaAtiva.subCategorias.map((sub) => (
                  <li key={sub.id}>
                    <a
                      href={sub.link}
                      className="block text-sm text-gray-600 hover:text-secondary hover:translate-x-1 transition-all"
                    >
                      {sub.nome}
                    </a>
                  </li>
                ))}
                {categoriaAtiva.subCategorias.length === 0 && (
                  <li className="text-xs text-gray-400 italic">
                    Nenhuma subcategoria encontrada.
                  </li>
                )}
              </ul>
            </div>
          ) : (
            /* CASO 2: Nenhum hover ativo (Estado Inicial) - Mostra um Banner ou Destaques */
            <div className="p-4 flex flex-col items-center justify-center h-full text-center opacity-70">
              {/* Placeholder para uma imagem ou ícone de destaque */}
              <div className="mb-4">
                <img
                  src="https://placehold.co/200x150/EEE/31343C?text=Ofertas"
                  alt="Destaque"
                  className="rounded-md"
                />
              </div>
              <p className="text-sm font-medium text-gray-500">
                Selecione uma categoria para ver mais opções.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}