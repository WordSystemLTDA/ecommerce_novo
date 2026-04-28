import { useEffect, useRef, useState } from 'react';
import { FaBars, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import type { Categoria } from '~/features/categoria/types';
import { gerarSlug } from '~/utils/formatters';

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
        className="flex h-full items-center gap-2 px-6 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-500 cursor-pointer border border-primary bg-secondary text-primary hover:bg-primary hover:text-secondary"
      >
        <FaBars />
        <p>Departamentos</p>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 flex bg-secondary shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-primary/15">

          <div className="w-64 border-r border-primary/10 bg-secondary py-2">
            <ul className="max-h-[500px] overflow-y-auto">
              {props.categorias.map((categoria) => (
                <li key={categoria.id}>
                  <a
                    onMouseEnter={() => lidarComEntradaMouseCategoria(categoria)}
                    className={`flex items-center justify-between px-4 py-3 text-sm text-primary hover:bg-primary/8 cursor-pointer hover:text-primary transition-colors ${categoriaAtiva?.id === categoria.id ? 'bg-primary text-secondary hover:text-secondary' : ''
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

          <div className="w-72 bg-primary/6 min-h-full">

            {categoriaAtiva ? (
              <div className="p-4">
                <div className="mb-3 pb-2 border-b border-primary/15">
                  <a href={categoriaAtiva.nome} className="text-sm font-medium text-primary hover:text-terciary transition-colors duration-300">
                    Ver tudo em {categoriaAtiva.nome}
                  </a>
                </div>

                <ul className="space-y-2">
                  {(categoriaAtiva.subCategorias || []).map((sub) => (
                    <li key={sub.id}>
                      <a
                        href={sub.nome}
                        className="block text-sm text-primary/70 hover:text-terciary hover:translate-x-1 transition-all duration-300"
                      >
                        {sub.nome}
                      </a>
                    </li>
                  ))}
                  {(!categoriaAtiva.subCategorias || categoriaAtiva.subCategorias.length === 0) && (
                    <li className="text-xs text-primary/70 italic">
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
                    className="border border-primary/10"
                  />
                </div>
                <p className="text-sm font-medium text-primary/70">
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