import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { gerarSlug } from '~/utils/formatters';
import type { Categoria } from '~/features/categoria/types';

export default function DepartmentMenu(props: { categorias: Categoria[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | null>(null);

  let navigate = useNavigate();

  const menuRef = useRef<HTMLDivElement>(null);

  const lidarComEntradaMouseCategoria = (categoria: Categoria) => {
    setCategoriaAtiva(categoria);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef} onMouseLeave={handleMouseLeave}>

      <button
        onClick={toggleMenu}
        className="flex h-full items-center gap-2 border border-secondary rounded-sm px-6 py-1.5 text-xs font-bold text-secondary transition-colors cursor-pointer hover:opacity-80"
      >
        <FaBars />
        <p>Departamentos</p>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 flex bg-white shadow-xl border border-gray-100">

          <div className="w-64 border-r border-gray-200 bg-white py-2">
            <ul className="max-h-[500px] overflow-y-auto">
              {props.categorias.map((categoria) => (
                <li key={categoria.id}>
                  <a
                    onMouseEnter={() => lidarComEntradaMouseCategoria(categoria)}
                    className={`flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-primary cursor-pointer hover:text-white transition-colors ${categoriaAtiva?.id === categoria.id ? 'bg-primary text-white' : ''
                      }`}

                    onClick={() => navigate(`/categoria/${categoria.id}/${gerarSlug(categoria.nome)}`)}
                  >
                    <span className="font-medium">{categoria.nome}</span>
                    {(categoria.subCategorias?.length > 0) && <FaChevronRight size={10} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-72 bg-gray-50 min-h-full">

            {categoriaAtiva ? (
              <div className="p-4">
                <div className="mb-3 pb-2 border-b border-gray-200">
                  <a href={categoriaAtiva.link} className="text-sm font-bold text-primary hover:underline">
                    Ver tudo em {categoriaAtiva.nome}
                  </a>
                </div>

                <ul className="space-y-2">
                  {(categoriaAtiva.subCategorias || []).map((sub) => (
                    <li key={sub.id}>
                      <a
                        href={sub.link}
                        className="block text-sm text-gray-600 hover:text-secondary hover:translate-x-1 transition-all"
                      >
                        {sub.nome}
                      </a>
                    </li>
                  ))}
                  {(!categoriaAtiva.subCategorias || categoriaAtiva.subCategorias.length === 0) && (
                    <li className="text-xs text-gray-400 italic">
                      Nenhuma subcategoria encontrada.
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="p-4 flex flex-col items-center justify-center h-full text-center opacity-70">
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
      )}
    </div>
  );
}