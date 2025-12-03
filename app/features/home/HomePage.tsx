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

import { useNavigate } from "react-router";
import Footer from "~/components/footer";
import LazySection from "~/components/lazy_section";
import RatingStars from "~/components/rating_stars";
import { useProduto } from "~/features/produto/context/ProdutoContext";
import { currencyFormatter, gerarSlug } from "~/utils/formatters";
import type { Categoria } from "../categoria/types";
import type { Banner, Produto } from "../produto/types";
import { SkeletonProductCard } from "~/components/skeleton_product_card";
import { SkeletonCategoryCard } from "~/components/skeleton_category_card";
import { PriceRangeSlider } from "~/components/price_range_slider";

const mockMarcas = [
  'ISIPlayer', '5+', 'Acer', 'Adata', 'AERO COOL', 'AFOX', 'AINIX', 'AMD', 'AOC', 'Apple'
];

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
  return (
    <div>
      <Header />

      <main className="flex items-center justify-center pt-0 pb-0">
        <div className={`flex-1 flex flex-col items-center gap-0 min-h-0 w-full`}>
          <CarouselBannersPrincipais
            images={mockBanners}
          />

          <div className="flex mt-5 ml-10">
            <Sidebar />

            <main className="max-w-387 mx-auto w-full bg-background-dark">
              <FilterToolbar />

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2 mt-4">
                <p className="text-xl font-bold">PROMOÇÕES</p>
                <p className="text-sm">VER TODOS</p>
              </div>

              <LazySection>
                <CarouselCategoria id='maisprocurados' onChange={() => { }} />
              </LazySection>

              <section className="my-8">
                {/* Lazy Loading aplicado nos componentes abaixo da dobra */}
                <LazySection>
                  <CarouselBannersSecundarios id="blackfriday" filtros="blackfriday" />
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
                <p className="text-sm">VER TODOS</p>
              </div>

              <LazySection>
                <CarouselCategoria id='maisprocurados' onChange={() => { }} />
              </LazySection>

              <section className="my-8">
                {/* Lazy Loading aplicado nos componentes abaixo da dobra */}
                <LazySection>
                  <CarouselBannersSecundarios id="blackfriday" filtros="blackfriday" />
                </LazySection>
              </section>

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2 mt-4">
                <p className="text-xl font-bold">DEPARTAMENTOS</p>
                <p className="text-sm">VER TODOS</p>
              </div>

              <LazySection>
                <CarouselCategoriaComImagem id='maisprocurados' onChange={() => { }} />
              </LazySection>

              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2 mt-4">
                <p className="text-xl font-bold">MARCAS</p>
                <p className="text-sm">VER TODOS</p>
              </div>

              <LazySection>
                <CarouselMarcaComImagem id='maisprocurados' onChange={() => { }} />
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
                  <p className="text-sm">VER TODOS</p>
                </div>

                <LazySection>
                  <CarouselCategoria id='maisprocurados' onChange={() => { }} />
                </LazySection>

                <section className="my-4">
                  <LazySection>
                    <CarouselBannersSecundarios id="maisprocurados" filtros="maisprocurados" />
                  </LazySection>
                </section>
              </section>

              <hr className="my-2 border-gray-200" />

              <section className="my-8">
                <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2">
                  <p className="text-xl font-bold">ACABARAM DE CHEGAR</p>
                  <p className="text-sm">VER TODOS</p>
                </div>

                <LazySection>
                  <CarouselCategoria id="novos" onChange={() => { }} />
                </LazySection>

                <section className="my-4">
                  <LazySection>
                    <CarouselBannersSecundarios id='novos' filtros="order_by=recente" />
                  </LazySection>
                </section>
              </section>

              <hr className="my-2 border-gray-200" />

              <section className="my-8">
                <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2">
                  <p className="text-xl font-bold">MAIS VENDIDOS</p>
                </div>

                <LazySection>
                  <CarouselCategoria id="maisvendidos" onChange={() => { }} />
                </LazySection>

                <section className="my-4">
                  <LazySection>
                    <CarouselBannersSecundarios id='maisvendidos' filtros="maisvendidos" />
                  </LazySection>
                </section>
              </section>
            </main>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

// ===================================================================
// 4. BANNER PRINCIPAL (REESCRITO COM SWIPER)
// ===================================================================

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
}

export function CategoriaCard({ categoria }: CategoriaCardProps) {
  let navigate = useNavigate();

  return (
    <div
      className="border border-primary px-4 py-2 rounded-sm text-center w-auto cursor-pointer"
      onClick={() => navigate('/categorias')}
    >
      <p>{categoria.nome}</p>
    </div>
  );
}

export function CategoriaCardComImagem({ categoria }: CategoriaCardProps) {
  let navigate = useNavigate();

  return (
    <div
      className="border border-primary px-4 py-2 rounded-sm text-center w-auto cursor-pointer"
      onClick={() => navigate('/categorias')}
    >
      <img src="https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fstatic.kabum.com.br%2Fconteudo%2Fcategorias%2FCOMPUTADORES_1731081639.png&w=256&q=75" />
      <p>{categoria.nome}</p>
    </div>
  );
}

export function MarcaCardComImagem({ categoria }: CategoriaCardProps) {
  let navigate = useNavigate();

  return (
    <div
      className="border border-primary px-4 py-2 rounded-sm text-center w-auto cursor-pointer"
      onClick={() => navigate('/categorias')}
    >
      <img src="https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fthemes.kabum.com.br%2Fbrandpage%2F41749558360.png&w=384&q=75" />
      <p>{categoria.nome}</p>
    </div>
  );
}

// ===================================================================
// 5. CARD DE PRODUTO (Nenhuma mudança)
// ===================================================================

interface ProductCardProps {
  produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
  let navigate = useNavigate();

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => {
      navigate(`/produto/${produto.id}/${gerarSlug(produto.atributos.nome)}`);
    }}>
      <div className="relative">
        {/* {produto.estaDestacado && (
          <span className="absolute top-2 left-2 bg-primary text-white text-medium-tiny font-bold px-2 py-1 rounded-xl">
            MELHOR PREÇO
          </span>
        )} */}

        <div className="absolute top-2 right-2 group-hover:opacity-0 opacity-100 transition-opacity p-1">
          {produto.atributos.avaliacao !== undefined && (
            <div className="flex items-center gap-0.5">
              <RatingStars rating={produto.atributos.avaliacao} variant="tiny" />
              <span className="text-tiny text-gray-400">({produto.atributos.avaliacao.toFixed(0)})</span>
            </div>
          )}
        </div>

        <div className="flex absolute top-2 right-2 group-hover:opacity-100 opacity-0 transition-opacity gap-2 p-1 z-10 cursor-auto">
          <MdFavoriteBorder size={20} color="gray" className="cursor-pointer" />
          <MdOutlineAddShoppingCart size={20} color="gray" className="cursor-pointer" />
        </div>

        {/* Mantive comentado conforme o original, mas adicionei loading="lazy" caso descomente */}
        <img src={produto.atributos.fotos.m[0]} alt={produto.atributos.nome} className="w-full h-48 object-contain p-4" loading="lazy" />
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex-1">
          <h3 className="text-sm text-gray-600 font-bold mb-2 h-10 overflow-hidden text-ellipsis">
            {produto.atributos.nome}
          </h3>

          <div className="flex justify-between">
            {produto.atributos.precoAntigo && (
              <span className="text-xs text-gray-500 line-through">
                {currencyFormatter.format(produto.atributos.precoAntigo)}
              </span>
            )}
            {produto.atributos.estoque <= 100 && (
              <span className="text-tiny text-gray-600">
                Restam {produto.atributos.estoque} unid.
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-primary">
              {currencyFormatter.format(produto.atributos.preco)}
            </span>
            {produto.atributos.precoAntigo && (
              <span className="text-xs font-bold text-terciary bg-green-100 px-1 py-0.5 rounded">
                {Math.round(((produto.atributos.precoAntigo - produto.atributos.preco) / produto.atributos.precoAntigo) * 100)}% OFF
              </span>
            )}
          </div>

          <span className="text-xs text-gray-600 block">
            À vista no PIX
          </span>
          {produto.atributos.parcelaMaxima && (
            <span className="text-xs text-gray-600 mt-1 block">
              ou até <span className="font-bold">{produto.atributos.parcelaMaxima}</span>
            </span>
          )}
        </div>
        <button className="mt-4 w-full bg-primary text-white font-bold text-xs py-2 rounded-sm flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer z-11">
          <span className="flex items-center">
            <span className="inline-block w-0 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:w-5 group-hover:mr-2 transition-all">
              <FaShoppingCart size={18} aria-hidden />
            </span>
            COMPRAR
          </span>
        </button>
      </div>
    </div>
  );
}

// ===================================================================
// 6. CARROSSEL SECUNDÁRIO (Swiper - Nenhuma mudança)
// ===================================================================

export function CarouselBannersSecundarios({ id, filtros }: { id: string, filtros: string }) {
  const prevButtonId = `${id}-produto-carousel-prev`;
  const nextButtonId = `${id}-produto-carousel-next`;

  let { listarProdutos, produtos } = useProduto();
  const bannerData = produtos.find((e) => e.id == id);
  const isLoading = !bannerData;

  useEffect(() => {
    if (isLoading) {
      listarProdutos(id, filtros);
    }
  }, []);

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
      <div>
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
}

export function CarouselCategoria({ id, onChange }: CarouselCategoriaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;

  let { produtos } = useProduto();
  const bannerData = produtos.find((e) => e.id == id);
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
      <div>
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
            <CategoriaCard categoria={categoria} />
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

export function CarouselCategoriaComImagem({ id, onChange }: CarouselCategoriaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;

  let { produtos } = useProduto();
  const bannerData = produtos.find((e) => e.id == id);
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
      <div>
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
            <CategoriaCardComImagem categoria={categoria} />
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

export function CarouselMarcaComImagem({ id, onChange }: CarouselCategoriaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;

  let { produtos } = useProduto();
  const bannerData = produtos.find((e) => e.id == id);
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
      <div>
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
            <MarcaCardComImagem categoria={categoria} />
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

const FilterToolbar = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center mx-12">
    <div className="flex items-center gap-4 mb-4 md:mb-0">
      <div className="flex items-center gap-2">
        <label htmlFor="ordenar" className="text-sm font-medium text-gray-700">Ordenar:</label>
        <select id="ordenar" className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
          <option>Mais procurados</option>
          <option>Mais recentes</option>
          <option>Menor preço</option>
          <option>Maior preço</option>
        </select>
      </div>

      {/* <div className="flex items-center gap-2">
                <label htmlFor="exibir" className="text-sm font-medium text-gray-700">Exibir:</label>
                <select id="exibir" className="appearance-none border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
                    <option>20 por página</option>
                    <option>40 por página</option>
                    <option>60 por página</option>
                </select>
            </div> */}
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

const Sidebar = () => (
  <aside className="lg:col-span-1">
    <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
      <FilterSection title="Departamentos">
        <CheckboxFilter items={mockMarcas} showSearch={true} />
      </FilterSection>

      <FilterSection title="Marcas" defaultOpen={true}>
        <CheckboxFilter items={mockMarcas} showSearch={true} />
      </FilterSection>

      <FilterSection title="Cores" defaultOpen={true}>
        <CheckboxFilter items={mockMarcas} showSearch={true} />
      </FilterSection>

      <FilterSection title="Tamanhos" defaultOpen={true}>
        <CheckboxFilter items={mockMarcas} showSearch={true} />
      </FilterSection>

      <FilterSection title="" defaultOpen={true}>
        <div>
          Frete Grátis
          <input type="checkbox" />
        </div>
        <div>
          Promoções Ativa
          <input type="checkbox" />
        </div>
      </FilterSection>

      <FilterSection title="Preços" defaultOpen={true}>
        <PriceRangeSlider />
      </FilterSection>
    </div>
  </aside>
);

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

const PriceFilter = () => (
  <PriceRangeSlider />
);

const CheckboxFilter = ({ items, showSearch = false }: { items: string[], showSearch?: boolean }) => (
  <div className="space-y-3">
    {showSearch && (
      <input
        type="search"
        placeholder="Buscar"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
    )}
    <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
      {items.map((item) => (
        <label key={item} className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-orange-500" />
          {item}
        </label>
      ))}
    </div>
    <button className="text-xs text-primary hover:text-orange-700">Ver mais</button>
  </div>
);
