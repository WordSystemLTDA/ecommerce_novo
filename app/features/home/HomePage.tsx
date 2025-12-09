import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Header from "~/components/header";

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useEffect, useState } from 'react';

import { FaChevronDown, FaChevronUp, FaList, FaTh } from "react-icons/fa";

import sign from 'jwt-encode';
import { useNavigate } from "react-router";
import Footer from "~/components/footer";
import LazySection from "~/components/lazy_section";
import { PriceRangeSlider } from "~/components/price_range_slider";
import { ProductCard } from "~/components/ProductCard";
import { SkeletonCategoryCard } from "~/components/skeleton_category_card";
import { SkeletonProductCard } from "~/components/skeleton_product_card";
import { useProduto } from "~/features/produto/context/ProdutoContext";
import type { Categoria } from "../categoria/types";
import type { Banner } from "../produto/types";
import { useHome } from "./context/HomeContext";
import { getBanners } from "~/services/bannerService";

export function HomePage() {
  const { isFiltering, filteredProducts, activeFilters, applyFilters, filterOptions } = useHome();
  const navigate = useNavigate();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [secondaryBanners, setSecondaryBanners] = useState<Banner[]>([]);
  const [sectionCategories, setSectionCategories] = useState<Record<string, number | null>>({});

  useEffect(() => {
    getBanners('Principal').then(setBanners);
    getBanners('Secundario').then(setSecondaryBanners);
  }, []);

  const pos0Banners = secondaryBanners.filter(b => b.tipo_de_banner === 2);
  const pos1Banners = secondaryBanners.filter(b => b.tipo_de_banner === 3);
  const pos2Banners = secondaryBanners.filter(b => b.tipo_de_banner === 4);

  const handleSectionCategoryClick = (sectionId: string, category: Categoria) => {
    const catId = Number(category.id);
    setSectionCategories(prev => {
      const current = prev[sectionId];
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
            images={banners}
          />

          <div className="flex flex-col lg:flex-row mt-4 lg:mt-5 mx-0 lg:ml-10 mb-10 w-full">
            <Sidebar />

            <main className="flex-1 w-full bg-background-dark min-w-0">
              <FilterToolbar />

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-4 lg:px-12 mb-2 mt-4">
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
                <LazySection>
                  <CarouselBannersSecundarios
                    id="promocoes"
                    filtros="blackfriday"
                    globalFilters={activeFilters}
                    selectedCategoryId={sectionCategories['promocoes']}
                  />
                </LazySection>
              </section>


              <div className="flex flex-col md:flex-row gap-4 lg:gap-10 mx-4 lg:mx-12">
                <Swiper
                  modules={[EffectFade, Navigation, Autoplay]}
                  spaceBetween={40}
                  slidesPerView={2}
                  loop={true}
                  effect="fade"
                  autoplay={{ delay: 5000 }}
                  className="w-full"
                >
                  {pos0Banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                      <img src={banner.imagemUrl} className="w-full" />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Swiper
                  modules={[EffectFade, Navigation, Autoplay]}
                  spaceBetween={40}
                  slidesPerView={2}
                  loop={true}
                  effect="fade"
                  autoplay={{ delay: 5000 }}
                  className="w-full"
                >
                  {pos1Banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                      <img src={banner.imagemUrl} className="w-full" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-4 lg:px-12 mb-2 mt-4">
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
                <LazySection>
                  <CarouselBannersSecundarios
                    id="maisprocurados"
                    filtros="maisprocurados"
                    globalFilters={activeFilters}
                    selectedCategoryId={sectionCategories['maisprocurados']}
                  />
                </LazySection>
              </section>

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-4 lg:px-12 mb-2 mt-4">
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

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-4 lg:px-12 mb-2 mt-4">
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

              <div className="flex gap-4 lg:gap-10 mx-4 lg:mx-12 my-10">
                <Swiper
                  modules={[EffectFade, Navigation, Autoplay]}
                  spaceBetween={10}
                  slidesPerView={1}
                  loop={true}
                  effect="fade"
                  autoplay={{ delay: 5000 }}
                  className="w-full"
                >
                  {pos2Banners.map((banner, index) => (
                    <SwiperSlide key={index}>
                      <img src={banner.imagemUrl} className="w-full" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <hr className="my-2 border-gray-200" />

              <section className="my-8">
                <div className="flex flex-row justify-between items-end relative w-full mx-auto px-4 lg:px-12 mb-2">
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
                <div className="flex flex-row justify-between items-end relative w-full mx-auto px-4 lg:px-12 mb-2">
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
                <div className="flex flex-row justify-between items-end relative w-full mx-auto px-4 lg:px-12 mb-2">
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

  const prevButtonId = 'main-banner-prev';
  const nextButtonId = 'main-banner-next';

  return (
    <div className="relative group w-full">
      <Swiper
        className="main-banner-carousel"
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        slidesPerView={1}
        loop={true}
        autoplay={{
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
  let navigate = useNavigate();

  return (
    <div
      className={`border px-4 py-2 rounded-sm text-center w-auto cursor-pointer transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'border-primary hover:bg-gray-50'}`}
      onClick={() => {
        navigate('/categoria/' + categoria.id);
      }}
    >
      <img src={categoria.imagem} className="h-33 w-53 object-contain" />
      <p>{categoria.nome}</p>
    </div>
  );
}

export function MarcaCardComImagem({ categoria, onClick, isSelected }: CategoriaCardProps) {
  let navigate = useNavigate();

  return (
    <div
      // className={`border px-4 py-2  rounded-sm text-center w-auto cursor-pointer transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'border-primary hover:bg-gray-50'}`}
      className="flex flex-col h-full border border-gray-200 text-center rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow group"
      onClick={() => {
        navigate('/marcas/' + categoria.id);
      }}
    >
      <img src={categoria.imagem} className="h-42 w-80 object-contain" />
      <p>{categoria.nome}</p>
    </div>
  );
}


export function CarouselBannersSecundarios({ id, filtros, globalFilters, selectedCategoryId }: { id: string, filtros: string, globalFilters?: any, selectedCategoryId?: number | null }) {
  const prevButtonId = `${id}-produto-carousel-prev`;
  const nextButtonId = `${id}-produto-carousel-next`;

  let { listarProdutos, produtos } = useProduto();
  const bannerData = produtos.find((e) => e.id == id);

  useEffect(() => {
    const fetchWithFilters = async () => {
      let finalFilters = globalFilters ? { ...globalFilters } : {};

      if (selectedCategoryId) {
        finalFilters = { ...finalFilters, categorias: [selectedCategoryId] };
      }

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
      <div className="relative w-full mx-auto px-4 lg:px-12">
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
      <div className="mx-4 lg:mx-12">
        <p>Não foi encontrado nenhum produto dispónivel</p>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto px-4 lg:px-12">
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
  const [navState, setNavState] = useState({ isBeginning: true, isEnd: false, isLocked: false });

  let { produtos } = useProduto();
  const bannerData = produtos.find((e) => e.id == id);
  const isLoading = !bannerData;

  const updateNavState = (swiper: any) => {
    setNavState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
      isLocked: swiper.isLocked,
    });
  };

  if (isLoading) {
    return (
      <div className="relative w-full mx-auto px-4 lg:px-12">
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
      <div className="mx-4 lg:mx-12">
        <p>Não foi encontrado nenhuma categoria dispónivel</p>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto px-4 lg:px-12">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.${prevButtonId}`,
          nextEl: `.${nextButtonId}`,
        }}
        loop={false}
        spaceBetween={16}
        slidesPerView={"auto"}
        breakpoints={{
          320: { spaceBetween: 10 },
          768: { spaceBetween: 10 },
          1024: { spaceBetween: 8 }
        }}
        className="select-none"
        onInit={updateNavState}
        onSlideChange={updateNavState}
        onResize={updateNavState}
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

      <div
        className={`${prevButtonId} absolute left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100 ${navState.isBeginning || navState.isLocked ? 'hidden!' : ''}`}
      >
        <SlArrowLeft color="black" size={16} />
      </div>
      <div
        className={`${nextButtonId} absolute right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100 ${navState.isEnd || navState.isLocked ? 'hidden!' : ''}`}
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
      <div className="relative w-full mx-auto px-4 lg:px-12">
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
    <div className="relative w-full mx-auto px-4 lg:px-12">
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
              categoria={categoria as any}
              onClick={onChange}
              isSelected={selectedCategoryId === Number(categoria.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

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
      <div className="relative w-full mx-auto px-4 lg:px-12">
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
    <div className="relative w-full mx-auto px-4 lg:px-12">
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
              categoria={marca as any}
              onClick={onChange}
              isSelected={selectedCategoryId === Number(marca.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

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
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center mx-4 lg:mx-12">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="flex items-center gap-2">
          <label htmlFor="ordenar" className="text-sm font-medium text-gray-700">Ordenar:</label>
          <select
            id="ordenar"
            value={activeFilters.ordenacao}
            onChange={handleSortChange}
            className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
        <button className="p-2 text-gray-600 hover:text-terciary bg-gray-100 rounded cursor-pointer">
          <FaList size={16} />
        </button>
        <button className="p-2 text-terciary bg-gray-100 rounded cursor-pointer">
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
    <aside className="lg:col-span-1 w-full lg:w-64 min-w-[250px]">
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
            <span className="text-sm text-gray-700">Frete Grátis</span>
            <ToggleSwitch
              checked={activeFilters.freteGratis}
              onChange={() => handleToggleChange('freteGratis')}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Promoção</span>
            <ToggleSwitch
              checked={activeFilters.promocao}
              onChange={() => handleToggleChange('promocao')}
            />
          </div>
        </FilterSection>

        <FilterSection title="Preço" defaultOpen={true}>
          {filterOptions.maxPrice != undefined &&
            <PriceRangeSlider
              min={0}
              max={filterOptions.maxPrice || 5000}
              minVal={activeFilters.minPreco}
              maxVal={activeFilters.maxPreco}
              onChange={(min, max) => applyFilters({ ...activeFilters, minPreco: min, maxPreco: max })}
            />
          }
        </FilterSection>
      </div>
    </aside>
  );
};

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = false }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <div
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
      </div>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};

interface CheckboxFilterProps {
  items: { id: number | string; label: string }[];
  selectedValues: (number | string)[];
  onChange: (id: number | string) => void;
  showSearch?: boolean;
}

const CheckboxFilter = ({ items, selectedValues, onChange, showSearch }: CheckboxFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
      {showSearch && (
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}
      {filteredItems.map((item) => (
        <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
          <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedValues.includes(item.id) ? 'bg-terciary border-terciary' : 'border-gray-300 group-hover:border-primary'}`}>
            {selectedValues.includes(item.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">{item.label}</span>
          <input
            type="checkbox"
            className="hidden"
            checked={selectedValues.includes(item.id)}
            onChange={() => onChange(item.id)}
          />
        </label>
      ))}
    </div>
  );
};

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <div
      className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${checked ? 'bg-terciary' : 'bg-gray-300'}`}
      onClick={onChange}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${checked ? 'left-5.5' : 'left-0.5'}`}
      />
    </div>
  );
};