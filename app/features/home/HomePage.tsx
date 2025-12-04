// --- IMPORTS ---
import { MdFavoriteBorder, MdOutlineAddShoppingCart } from "react-icons/md";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Header from "~/components/header";

// --- IMPORTS DO SWIPER (OS ÚNICOS NECESSÁRIOS) ---
import { Swiper, SwiperSlide } from 'swiper/react';
// Módulos que vamos usar:
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

import { useEffect, useState } from 'react'; // Adicionado useRef

import { FaChevronDown, FaChevronUp, FaList, FaShoppingCart, FaTh } from "react-icons/fa";

import sign from 'jwt-encode';
import { useNavigate } from "react-router";
import Footer from "~/components/footer";
import LazySection from "~/components/lazy_section";
import { PriceRangeSlider } from "~/components/price_range_slider";
import RatingStars from "~/components/rating_stars";
import { SkeletonCategoryCard } from "~/components/skeleton_category_card";
import { SkeletonProductCard } from "~/components/skeleton_product_card";
import { useProduto } from "~/features/produto/context/ProdutoContext";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import type { Categoria } from "../categoria/types";
import type { Banner, Produto } from "../produto/types";
import { useHome } from "./context/HomeContext";

const mockBanners: Banner[] = [
  {
    id: 1,
    imagemUrl: "/1762447412.webp",
    corHex: "#f05802"
  }, // Azul escuro
  {
    id: 2,
    imagemUrl: "/1762949636.gif",
    corHex: "#060709"
  }, // Vermelho
  {
    id: 3,
    imagemUrl: "/1762948553.webp",
    corHex: "#000000"
  }  // Verde
];

// ===================================================================
// 0. COMPONENTE UTILITÁRIO: LAZY SECTION
// Este componente só renderiza o conteúdo quando ele entra na tela.
// ===================================================================


// ===================================================================
// 3. COMPONENTE WELCOME (HOME PAGE)
// ===================================================================

export function HomePage() {
  const { isFiltering, filteredProducts, activeFilters, applyFilters } = useHome();
  const navigate = useNavigate();

  // State to track selected category for each section
  const [sectionCategories, setSectionCategories] = useState<Record<string, number | null>>({});

  const handleSectionCategoryClick = (sectionId: string, category: Categoria) => {
    const catId = Number(category.id);
    setSectionCategories(prev => {
      const current = prev[sectionId];
      // Toggle: if already selected, deselect (return null), otherwise select
      return { ...prev, [sectionId]: current === catId ? null : catId };
    });
  };

  const handleVerTodosClick = () => {
    navigate('/categoria/1/hardware');
  };

  return (
    <div>
      <Header />

      <main className="flex items-center justify-center pt-0 pb-0">
        <div className={`flex-1 flex flex-col items-center gap-0 min-h-0 w-full`}>
          <CarouselBannersPrincipais
            images={mockBanners}
          />

          <div className="flex mt-5 ml-10 mb-10">
            <Sidebar />

            <main className="max-w-387 mx-auto w-full bg-background-dark">
              <FilterToolbar />

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2 mt-4">
                <p className="text-xl font-bold">PROMOÇÕES</p>
                <p className="text-sm cursor-pointer hover:underline" onClick={handleVerTodosClick}>VER TODOS</p>
              </div>

              <LazySection>
                <CarouselCategoria
                  id='promocoes'
                  onChange={(cat) => handleSectionCategoryClick('promocoes', cat)}
                  selectedCategoryId={sectionCategories['promocoes']}
                />
              </LazySection>

              <section className="my-8">
                {/* Lazy Loading aplicado nos componentes abaixo da dobra */}
                <LazySection>
                  <CarouselBannersSecundarios
                    id="promocoes"
                    filtros="blackfriday"
                    globalFilters={activeFilters}
                    selectedCategoryId={sectionCategories['promocoes']}
                  />
                </LazySection>
              </section>


              <div className="flex gap-10 mx-12">
                <div>
                  <img src="https://themes.kabum.com.br/banners/71764580388.jpeg" />
                </div>

                <div>
                  <img src="https://themes.kabum.com.br/banners/41764581461.jpeg" />
                </div>
              </div>

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2 mt-4">
                <p className="text-xl font-bold">DEPARTAMENTOS</p>
                <p className="text-sm cursor-pointer hover:underline" onClick={handleVerTodosClick}>VER TODOS</p>
              </div>

              <LazySection>
                <CarouselCategoria
                  id='maisprocurados'
                  onChange={(cat) => handleSectionCategoryClick('maisprocurados', cat)}
                  selectedCategoryId={sectionCategories['maisprocurados']}
                />
              </LazySection>

              <section className="my-8">
                {/* Lazy Loading aplicado nos componentes abaixo da dobra */}
                <LazySection>
                  <CarouselBannersSecundarios
                    id="maisprocurados"
                    filtros="maisprocurados"
                    globalFilters={activeFilters}
                    selectedCategoryId={sectionCategories['maisprocurados']}
                  />
                </LazySection>
              </section>

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2 mt-4">
                <p className="text-xl font-bold">DEPARTAMENTOS</p>
                <p className="text-sm cursor-pointer hover:underline" onClick={handleVerTodosClick}>VER TODOS</p>
              </div>

              <LazySection>
                <CarouselCategoriaComImagem
                  id='maisprocurados_img'
                  onChange={(cat) => handleSectionCategoryClick('maisprocurados_img', cat)}
                  selectedCategoryId={sectionCategories['maisprocurados_img']}
                />
              </LazySection>

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2 mt-4">
                <p className="text-xl font-bold">MARCAS</p>
                <p className="text-sm cursor-pointer hover:underline" onClick={handleVerTodosClick}>VER TODOS</p>
              </div>

              <LazySection>
                <CarouselMarcaComImagem
                  id='marcas'
                  onChange={(cat) => handleSectionCategoryClick('marcas', cat)}
                  selectedCategoryId={sectionCategories['marcas']}
                />
              </LazySection>

              <div className="flex gap-10 mx-12 my-10">
                <div>
                  <img src="https://cdn.newtail.com.br/retail_media/ads/2025/11/28/54e18de836d78bedd5a4ea74bf6b9b8c.raw.jpeg" />
                </div>
              </div>

              <hr className="my-2 border-gray-200" />

              <section className="my-8">
                <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2">
                  <p className="text-xl font-bold">MAIS PROCURADOS</p>
                  <p className="text-sm cursor-pointer hover:underline" onClick={handleVerTodosClick}>VER TODOS</p>
                </div>

                <LazySection>
                  <CarouselCategoria
                    id='maisprocurados_bottom'
                    onChange={(cat) => handleSectionCategoryClick('maisprocurados_bottom', cat)}
                    selectedCategoryId={sectionCategories['maisprocurados_bottom']}
                  />
                </LazySection>

                <section className="my-4">
                  <LazySection>
                    <CarouselBannersSecundarios
                      id="maisprocurados_bottom"
                      filtros="maisprocurados"
                      globalFilters={activeFilters}
                      selectedCategoryId={sectionCategories['maisprocurados_bottom']}
                    />
                  </LazySection>
                </section>
              </section>

              <hr className="my-2 border-gray-200" />

              <section className="my-8">
                <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2">
                  <p className="text-xl font-bold">ACABARAM DE CHEGAR</p>
                  <p className="text-sm cursor-pointer hover:underline" onClick={handleVerTodosClick}>VER TODOS</p>
                </div>

                <LazySection>
                  <CarouselCategoria
                    id="novos"
                    onChange={(cat) => handleSectionCategoryClick('novos', cat)}
                    selectedCategoryId={sectionCategories['novos']}
                  />
                </LazySection>

                <section className="my-4">
                  <LazySection>
                    <CarouselBannersSecundarios
                      id='novos'
                      filtros="order_by=recente"
                      globalFilters={activeFilters}
                      selectedCategoryId={sectionCategories['novos']}
                    />
                  </LazySection>
                </section>
              </section>

              <hr className="my-2 border-gray-200" />

              <section className="my-8">
                <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2">
                  <p className="text-xl font-bold">MAIS VENDIDOS</p>
                </div>

                <LazySection>
                  <CarouselCategoria
                    id="maisvendidos"
                    onChange={(cat) => handleSectionCategoryClick('maisvendidos', cat)}
                    selectedCategoryId={sectionCategories['maisvendidos']}
                  />
                </LazySection>

                <section className="my-4">
                  <LazySection>
                    <CarouselBannersSecundarios
                      id='maisvendidos'
                      filtros="maisvendidos"
                      globalFilters={activeFilters}
                      selectedCategoryId={sectionCategories['maisvendidos']}
                    />
                  </LazySection>
                </section>
              </section>
            </main>

          </div>
        </div>

      </main>

      <Footer />
    </div>

  )
}


interface CarouselBannersPrincipaisProps {
  images: Banner[];
}

export function CarouselBannersPrincipais({ images }: CarouselBannersPrincipaisProps) {

  // Classes únicas para os botões deste carrossel
  const prevButtonId = 'main-banner-prev';
  const nextButtonId = 'main-banner-next';

  return (
    <div className="relative group w-full">
      <Swiper
        className="main-banner-carousel"
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade" // Efeito de transição
        slidesPerView={1} // 1 slide por vez
        loop={true} // (infiniteLoop)
        autoplay={{ // (autoPlay)
          delay: 10000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: `.${prevButtonId}`,
          nextEl: `.${nextButtonId}`,
        }}
        pagination={{
          clickable: true,
        }}
      >
        {images?.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.imagemUrl}
              className="w-full object-cover h-[200px] md:h-[300px] lg:h-[450px]"
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              alt={`Banner principal ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className={`${prevButtonId} absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-white rounded-3xl flex justify-center items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity`}
      >
        <SlArrowLeft color="white" size={18} />
      </div>
      <div
        className={`${nextButtonId} absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-white rounded-3xl flex justify-center items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity`}
      >
        <SlArrowRight color="white" size={18} />
      </div>
    </div>
  );
};

interface CategoriaCardProps {
  categoria: Categoria;
  onClick?: (categoria: Categoria) => void;
  isSelected?: boolean;
}

export function CategoriaCard({ categoria, onClick, isSelected }: CategoriaCardProps) {
  return (
    <div
      className={`border px-4 py-2 rounded-sm text-center w-auto cursor-pointer transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'border-primary hover:bg-gray-50'}`}
      onClick={() => onClick && onClick(categoria)}
    >
      <p>{categoria.nome}</p>
    </div>
  );
}

export function CategoriaCardComImagem({ categoria, onClick, isSelected }: CategoriaCardProps) {
  return (
    <div
      className={`border px-4 py-2 rounded-sm text-center w-auto cursor-pointer transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'border-primary hover:bg-gray-50'}`}
      onClick={() => onClick && onClick(categoria)}
    >
      <img src="https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fstatic.kabum.com.br%2Fconteudo%2Fcategorias%2FCOMPUTADORES_1731081639.png&w=256&q=75" />
      <p>{categoria.nome}</p>
    </div>
  );
}

export function MarcaCardComImagem({ categoria, onClick, isSelected }: CategoriaCardProps) {
  return (
    <div
      className={`border px-4 py-2 rounded-sm text-center w-auto cursor-pointer transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'border-primary hover:bg-gray-50'}`}
      onClick={() => onClick && onClick(categoria)}
    >
      <img src="https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fthemes.kabum.com.br%2Fbrandpage%2F41749558360.png&w=384&q=75" />
      <p>{categoria.nome}</p>
    </div>
  );
}

// ===================================================================
// 5. CARD DE PRODUTO (Nenhuma mudança)
// ===================================================================

// ... (imports)
import { ProductCard } from "~/components/ProductCard";

// ... (rest of the file)

// ===================================================================
// 6. CARROSSEL SECUNDÁRIO (Swiper - Nenhuma mudança)
// ===================================================================

export function CarouselBannersSecundarios({ id, filtros, globalFilters, selectedCategoryId }: { id: string, filtros: string, globalFilters?: any, selectedCategoryId?: number | null }) {
  const prevButtonId = `${id}-produto-carousel-prev`;
  const nextButtonId = `${id}-produto-carousel-next`;

  let { listarProdutos, produtos } = useProduto();
  const bannerData = produtos.find((e) => e.id == id);

  useEffect(() => {
    const fetchWithFilters = async () => {
      let finalFilters = globalFilters ? { ...globalFilters } : {};

      // Apply local section filter if selected
      if (selectedCategoryId) {
        finalFilters = { ...finalFilters, categorias: [selectedCategoryId] };
      }

      // Generate token
      const token = sign(finalFilters, 'secret');
      const params = new URLSearchParams();
      params.append('filtros', token);

      await listarProdutos(id, params.toString());
    };

    fetchWithFilters();
  }, [globalFilters, selectedCategoryId]);

  const isLoading = !bannerData;

  if (isLoading) {
    return (
      <div className="relative w-full mx-auto px-12">
        <Swiper
          modules={[Navigation]}
          loop={false}
          spaceBetween={16}
          slidesPerView={5}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 10 },
            1024: { slidesPerView: 5, spaceBetween: 8 }
          }}
          className="select-none"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <SwiperSlide key={index} style={{ height: 'auto' }}>
              <SkeletonProductCard />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  if (!bannerData?.produtos || bannerData.produtos.length === 0) {
    return (
      <div className="mx-12">
        <p>Não foi encontrado nenhum produto dispónivel</p>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto px-12">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.${prevButtonId}`,
          nextEl: `.${nextButtonId}`,
        }}
        loop={true}
        spaceBetween={16}
        slidesPerView={5}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 3, spaceBetween: 10 },
          1024: { slidesPerView: 5, spaceBetween: 8 }
        }}
        className="select-none"
      >
        {bannerData.produtos.map((produto) => (
          <SwiperSlide key={produto.id} style={{ height: 'auto' }}>
            <ProductCard produto={produto} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- Setas Customizadas (estilo da foto) --- */}
      <div
        className={`${prevButtonId} absolute left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowLeft color="black" size={16} />
      </div>
      <div
        className={`${nextButtonId} absolute right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowRight color="black" size={16} />
      </div>
    </div>
  );
};


interface CarouselCategoriaProps {
  id: string;
  onChange: (category: Categoria) => void;
  selectedCategoryId?: number | null;
}

export function CarouselCategoria({ id, onChange, selectedCategoryId }: CarouselCategoriaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;

  let { produtos } = useProduto();
  const bannerData = produtos.find((e) => e.id == id);
  console.log(produtos);
  const isLoading = !bannerData;

  if (isLoading) {
    return (
      <div className="relative w-full mx-auto px-12">
        <Swiper
          modules={[Navigation]}
          loop={false}
          spaceBetween={16}
          slidesPerView={"auto"}
          breakpoints={{
            320: { spaceBetween: 10 },
            768: { spaceBetween: 10 },
            1024: { spaceBetween: 8 }
          }}
          className="select-none"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <SwiperSlide key={index} className="whitespace-nowrap" style={{ height: 'auto', width: 'auto' }}>
              <SkeletonCategoryCard />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  if (!bannerData?.categorias || bannerData.categorias.length <= 0) {
    return (
      <div className="mx-12">
        <p>Não foi encontrado nenhuma categoria dispónivel</p>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto px-12">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.${prevButtonId}`,
          nextEl: `.${nextButtonId}`,
        }}
        loop={true}
        spaceBetween={16}
        slidesPerView={"auto"}
        breakpoints={{
          320: { spaceBetween: 10 },
          768: { spaceBetween: 10 },
          1024: { spaceBetween: 8 }
        }}
        className="select-none"
      >
        {bannerData.categorias.map((categoria) => (
          <SwiperSlide key={`${id}-${categoria.id}`} className="whitespace-nowrap" style={{ height: 'auto', width: 'auto' }}>
            <CategoriaCard
              categoria={categoria}
              onClick={onChange}
              isSelected={selectedCategoryId === Number(categoria.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- Setas Customizadas (estilo da foto) --- */}
      <div
        className={`${prevButtonId} absolute left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowLeft color="black" size={16} />
      </div>
      <div
        className={`${nextButtonId} absolute right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowRight color="black" size={16} />
      </div>
    </div>
  );
};

export function CarouselCategoriaComImagem({ id, onChange, selectedCategoryId }: CarouselCategoriaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;

  const { filterOptions } = useHome();
  const categorias = filterOptions.categorias;

  if (!categorias || categorias.length <= 0) {
    return (
      <div className="relative w-full mx-auto px-12">
        <Swiper
          modules={[Navigation]}
          loop={false}
          spaceBetween={16}
          slidesPerView={"auto"}
          breakpoints={{
            320: { spaceBetween: 10 },
            768: { spaceBetween: 10 },
            1024: { spaceBetween: 8 }
          }}
          className="select-none"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <SwiperSlide key={index} className="whitespace-nowrap" style={{ height: 'auto', width: 'auto' }}>
              <SkeletonCategoryCard />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto px-12">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.${prevButtonId}`,
          nextEl: `.${nextButtonId}`,
        }}
        loop={true}
        spaceBetween={16}
        slidesPerView={"auto"}
        breakpoints={{
          320: { spaceBetween: 10 },
          768: { spaceBetween: 10 },
          1024: { spaceBetween: 8 }
        }}
        className="select-none"
      >
        {categorias.map((categoria) => (
          <SwiperSlide key={`${id}-${categoria.id}`} className="whitespace-nowrap" style={{ height: 'auto', width: 'auto' }}>
            <CategoriaCardComImagem
              categoria={categoria as any} // Cast to any to avoid type mismatch with full Categoria interface
              onClick={onChange}
              isSelected={selectedCategoryId === Number(categoria.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- Setas Customizadas (estilo da foto) --- */}
      <div
        className={`${prevButtonId} absolute left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowLeft color="black" size={16} />
      </div>
      <div
        className={`${nextButtonId} absolute right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowRight color="black" size={16} />
      </div>
    </div>
  );
};

export function CarouselMarcaComImagem({ id, onChange, selectedCategoryId }: CarouselCategoriaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;

  const { filterOptions } = useHome();
  const marcas = filterOptions.marcas;

  if (!marcas || marcas.length <= 0) {
    return (
      <div className="relative w-full mx-auto px-12">
        <Swiper
          modules={[Navigation]}
          loop={false}
          spaceBetween={16}
          slidesPerView={"auto"}
          breakpoints={{
            320: { spaceBetween: 10 },
            768: { spaceBetween: 10 },
            1024: { spaceBetween: 8 }
          }}
          className="select-none"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <SwiperSlide key={index} className="whitespace-nowrap" style={{ height: 'auto', width: 'auto' }}>
              <SkeletonCategoryCard />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto px-12">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.${prevButtonId}`,
          nextEl: `.${nextButtonId}`,
        }}
        loop={true}
        spaceBetween={16}
        slidesPerView={"auto"}
        breakpoints={{
          320: { spaceBetween: 10 },
          768: { spaceBetween: 10 },
          1024: { spaceBetween: 8 }
        }}
        className="select-none"
      >
        {marcas.map((marca) => (
          <SwiperSlide key={`${id}-${marca.id}`} className="whitespace-nowrap" style={{ height: 'auto', width: 'auto' }}>
            <MarcaCardComImagem
              categoria={marca as any} // Treat marca as categoria for the card
              onClick={onChange}
              isSelected={selectedCategoryId === Number(marca.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- Setas Customizadas (estilo da foto) --- */}
      <div
        className={`${prevButtonId} absolute left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowLeft color="black" size={16} />
      </div>
      <div
        className={`${nextButtonId} absolute right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowRight color="black" size={16} />
      </div>
    </div>
  );
};

const FilterToolbar = () => {
  const { activeFilters, applyFilters } = useHome();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyFilters({ ...activeFilters, ordenacao: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center mx-12">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="flex items-center gap-2">
          <label htmlFor="ordenar" className="text-sm font-medium text-gray-700">Ordenar:</label>
          <select
            id="ordenar"
            value={activeFilters.ordenacao}
            onChange={handleSortChange}
            className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="mais_procurados">Mais procurados</option>
            <option value="mais_recentes">Mais recentes</option>
            <option value="menor_preco">Menor preço</option>
            <option value="maior_preco">Maior preço</option>
          </select>
        </div>
        <span className="text-sm text-gray-500">8259 produtos</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-600 hover:text-orange-600 bg-gray-100 rounded cursor-pointer">
          <FaList size={16} />
        </button>
        <button className="p-2 text-orange-600 bg-gray-100 rounded cursor-pointer">
          <FaTh size={16} />
        </button>
      </div>
    </div>
  );
};

export function Sidebar() {
  const { filterOptions, activeFilters, setActiveFilters, applyFilters } = useHome();

  const handleCheckboxChange = (type: keyof typeof activeFilters, value: any) => {
    const currentValues = activeFilters[type] as any[];
    let newValues;
    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v: any) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    const newFilters = { ...activeFilters, [type]: newValues };
    applyFilters(newFilters);
  };

  const handleToggleChange = (type: 'freteGratis' | 'promocao') => {
    const newFilters = { ...activeFilters, [type]: !activeFilters[type] };
    applyFilters(newFilters);
  };

  return (
    <aside className="lg:col-span-1 w-64 min-w-[250px]">
      <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
        <FilterSection title="Departamentos">
          <CheckboxFilter
            items={filterOptions.categorias.map(c => ({ id: c.id, label: c.nome }))}
            selectedValues={activeFilters.categorias}
            onChange={(id) => handleCheckboxChange('categorias', id)}
            showSearch={true}
          />
        </FilterSection>

        <FilterSection title="Marcas" defaultOpen={true}>
          <CheckboxFilter
            items={filterOptions.marcas.map(m => ({ id: m.id, label: m.nome }))}
            selectedValues={activeFilters.marcas}
            onChange={(id) => handleCheckboxChange('marcas', id)}
            showSearch={true}
          />
        </FilterSection>

        <FilterSection title="Cores" defaultOpen={true}>
          <CheckboxFilter
            items={filterOptions.cores.map(c => ({ id: c.id, label: c.nome }))}
            selectedValues={activeFilters.cores}
            onChange={(id) => handleCheckboxChange('cores', id)}
            showSearch={true}
          />
        </FilterSection>

        <FilterSection title="Tamanhos" defaultOpen={true}>
          <CheckboxFilter
            items={filterOptions.tamanhos.map(t => ({ id: t, label: t }))}
            selectedValues={activeFilters.tamanhos}
            onChange={(id) => handleCheckboxChange('tamanhos', id)}
            showSearch={true}
          />
        </FilterSection>

        <FilterSection title="Opções" defaultOpen={true}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-700">Frete Grátis</label>
            <input
              type="checkbox"
              checked={activeFilters.freteGratis}
              onChange={() => handleToggleChange('freteGratis')}
              className="rounded border-gray-300 text-primary focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">Promoções</label>
            <input
              type="checkbox"
              checked={activeFilters.promocao}
              onChange={() => handleToggleChange('promocao')}
              className="rounded border-gray-300 text-primary focus:ring-orange-500"
            />
          </div>
        </FilterSection>

        <FilterSection title="Preços" defaultOpen={true}>
          <PriceRangeSlider
            min={0}
            max={10000}
            onChange={(min, max) => {
              const newFilters = { ...activeFilters, minPreco: min, maxPreco: max };
              applyFilters(newFilters);
            }}
          />
        </FilterSection>
      </div>
    </aside>
  );
};

const FilterSection = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-bold text-gray-800 uppercase">{title}</h4>
        {isOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
      </button>
      {isOpen && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

const CheckboxFilter = ({ items, selectedValues, onChange, showSearch = false }: { items: { id: any, label: string }[], selectedValues: any[], onChange: (id: any) => void, showSearch?: boolean }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredItems = items.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-3">
      {showSearch && (
        <input
          type="search"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      )}
      <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
        {filteredItems.map((item) => (
          <label key={item.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedValues.includes(item.id)}
              onChange={() => onChange(item.id)}
              className="rounded border-gray-300 text-primary focus:ring-orange-500"
            />
            {item.label}
          </label>
        ))}
      </div>
      {/* <button className="text-xs text-primary hover:text-orange-700">Ver mais</button> */}
    </div>
  );
};
