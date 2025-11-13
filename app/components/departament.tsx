import React, { useState } from 'react'
// Importando os ícones que vamos usar
import { FaBars, FaChevronRight } from 'react-icons/fa' // <-- CORREÇÃO: Adicionando /index.js

// --- 1. Definição de Tipos e Dados Falsos (Mock Data) ---
// ... (interfaces e dados permanecem os mesmos) ...
// [Immersive content redacted for brevity.]
interface SubCategory {
  id: string
  name: string
  href: string
}

interface Category {
  id: string
  name: string
  href: string
  subCategories: SubCategory[]
}

interface Department {
  id: string
  name: string
  href: string
  categories: Category[]
}

// Dados de exemplo baseados na sua screenshot
const departmentsData: Department[] = [
  {
    id: '1',
    name: 'Hardware',
    href: '/hardware',
    categories: [
      {
        id: 'cat-1-1',
        name: 'Coolers',
        href: '/hardware/coolers',
        subCategories: [
          { id: 'sub-1-1-1', name: 'Acessórios para Cooler', href: '#' },
          { id: 'sub-1-1-2', name: 'Air Cooler', href: '#' },
          { id: 'sub-1-1-3', name: 'Almofada Térmica', href: '#' },
          { id: 'sub-1-1-4', name: 'FAN', href: '#' },
          { id: 'sub-1-1-5', name: 'Pasta Térmica', href: '#' },
          { id: 'sub-1-1-6', name: 'Water Cooler', href: '#' },
        ],
      },
      {
        id: 'cat-1-2',
        name: 'Disco Rígido (HD)',
        href: '/hardware/hd',
        subCategories: [
          { id: 'sub-1-2-1', name: 'HD Externo', href: '#' },
          { id: 'sub-1-2-2', name: 'HD Interno', href: '#' },
          { id: 'sub-1-2-3', name: 'HD para Servidor', href: '#' },
        ],
      },
      {
        id: 'cat-1-3',
        name: 'Drives',
        href: '/hardware/drives',
        subCategories: [],
      },
      {
        id: 'cat-1-4',
        name: 'Fontes',
        href: '/hardware/fontes',
        subCategories: [
          { id: 'sub-1-4-1', name: 'Fonte ATX', href: '#' },
          { id: 'sub-1-4-2', name: 'Fonte SFX', href: '#' },
        ],
      },
      {
        id: 'cat-1-5',
        name: 'Kit Hardware',
        href: '/hardware/kit',
        subCategories: [],
      },
      {
        id: 'cat-1-6',
        name: 'Memória RAM',
        href: '/hardware/ram',
        subCategories: [
          { id: 'sub-1-6-1', name: 'DDR4', href: '#' },
          { id: 'sub-1-6-2', name: 'DDR5', href: '#' },
        ],
      },
      {
        id: 'cat-1-7',
        name: 'Placa de Vídeo (VGA)',
        href: '/hardware/vga',
        subCategories: [],
      },
      {
        id: 'cat-1-8',
        name: 'Placas-mãe',
        href: '/hardware/mobo',
        subCategories: [],
      },
      {
        id: 'cat-1-9',
        name: 'Processadores',
        href: '/hardware/cpu',
        subCategories: [],
      },
    ],
  },
  {
    id: '2',
    name: 'Periféricos',
    href: '/perifericos',
    categories: [
      {
        id: 'cat-2-1',
        name: 'Mouse',
        href: '/perifericos/mouse',
        subCategories: [
          { id: 'sub-2-1-1', name: 'Mouse Gamer', href: '#' },
          { id: 'sub-2-1-2', name: 'Mouse Sem Fio', href: '#' },
        ],
      },
      {
        id: 'cat-2-2',
        name: 'Teclado',
        href: '/perifericos/teclado',
        subCategories: [
          { id: 'sub-2-2-1', name: 'Teclado Mecânico', href: '#' },
          { id: 'sub-2-2-2', name: 'Kit Teclado e Mouse', href: '#' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Computadores',
    href: '/computadores',
    categories: [],
  },
  {
    id: '4',
    name: 'Games',
    href: '/games',
    categories: [],
  },
  {
    id: '5',
    name: 'Celular & Smartphone',
    href: '/celular',
    categories: [],
  },
  {
    id: '6',
    name: 'TV',
    href: '/tv',
    categories: [],
  },
  // ... Adicione os outros departamentos aqui
]

// --- 2. O Componente do Menu ---

export default function DepartmentMenu() {
  // ... (estados permanecem os mesmos) ...
// [Immersive content redacted for brevity.]
  const [activeDept, setActiveDept] = useState<Department | null>(null)
  const [activeCat, setActiveCat] = useState<Category | null>(null)

  const handleDeptMouseEnter = (dept: Department) => {
    setActiveDept(dept)
    setActiveCat(null) // Reseta a subcategoria ao trocar de departamento
  }

  const handleCatMouseEnter = (cat: Category) => {
    setActiveCat(cat)
  }

  const handleMouseLeave = () => {
    // Ao sair do menu, reseta tudo
    setActiveDept(null)
    setActiveCat(null)
  }


  return (
    // `group` é a mágica do Tailwind
    <div className="relative group">
      
      {/* O Botão "Departamentos" */}
      <button className="flex h-full items-center gap-2 bg-red-600 px-6 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-red-700">
        <FaBars />
        Departamentos
      </button>

      {/* O Container do Mega Menu (escondido por padrão) */}
      <div
        className="absolute left-0 top-full z-50 hidden bg-white shadow-lg group-hover:flex"
        onMouseLeave={handleMouseLeave}
      >
        {/* Container centralizado para o conteúdo do menu 
            --- CORREÇÃO ---
            Removi o "mx-auto w-full max-w-7xl" daqui.
            O 'flex' já é o suficiente.
        */}
        <div className="flex">
          
          {/* Nível 1: Coluna de Departamentos 
              --- CORREÇÃO ---
              Troquei "w-1/3 max-w-xs" por "w-64" (16rem, ou 256px)
          */}
          <div className="w-64 border-r border-gray-200">
            {/* ... (conteúdo da coluna 1) ... */}
            <ul className="max-h-[600px] overflow-y-auto">
              {departmentsData.map((dept) => (
                <li key={dept.id}>
                  <a
                    href={dept.href}
                    onMouseEnter={() => handleDeptMouseEnter(dept)}
                    className={`flex items-center justify-between p-4 text-sm hover:bg-gray-100 hover:text-red-600 ${
                      activeDept?.id === dept.id ? 'bg-gray-100 text-red-600' : ''
                    }`}
                  >
                    {dept.name}
                    {/* Mostra a seta apenas se houver categorias */}
                    {dept.categories.length > 0 && <FaChevronRight size={10} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nível 2: Coluna de Categorias 
              --- CORREÇÃO ---
              Troquei "w-1/3 max-w-xs" por "w-64" (16rem, ou 256px)
          */}
          <div className="w-64 border-r border-gray-200">
            {/* ... (conteúdo da coluna 2) ... */}
            {activeDept && activeDept.categories.length > 0 && (
              <ul className="max-h-[600px] overflow-y-auto">
                <li className="p-4">
                  <a href={activeDept.href} className="text-sm font-bold text-red-600 hover:underline">
                    Ver tudo de {activeDept.name}
                  </a>
                </li>
                {activeDept.categories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={cat.href}
                      onMouseEnter={() => handleCatMouseEnter(cat)}
                      className={`flex items-center justify-between p-4 text-sm hover:bg-gray-100 ${
                        activeCat?.id === cat.id
                          ? 'bg-gray-200 font-semibold' // Destaque diferente
                          : ''
                      }`}
                    >
                      {cat.name}
                      {cat.subCategories.length > 0 && <FaChevronRight size={10} />}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Nível 3: Coluna de Subcategorias 
              --- CORREÇÃO ---
              Troquei "w-1/3 max-w-xs" por "w-64" (16rem, ou 256px)
          */}
          <div className="w-64">
            {/* ... (conteúdo da coluna 3) ... */}
            {activeCat && activeCat.subCategories.length > 0 && (
              <ul className="max-h-[600px] overflow-y-auto">
                <li className="p-4">
                  <a href={activeCat.href} className="text-sm font-bold text-red-600 hover:underline">
                    Ver tudo de {activeCat.name}
                  </a>
                </li>
                {activeCat.subCategories.map((subCat) => (
                  <li key={subCat.id}>
                    <a
                      href={subCat.href}
                      className="block p-4 text-sm hover:bg-gray-100"
                    >
                      {subCat.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            
            {/* Bônus: Banner (como na foto) */}
            {!activeCat && (
              <div className="p-4">
                <img 
                  src="https://placehold.co/400x500/333/FFF?text=Banner+Promocional" 
                  alt="Promoção" 
                  className="h-auto w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}