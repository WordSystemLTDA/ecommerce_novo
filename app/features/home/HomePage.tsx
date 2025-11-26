// --- IMPORTS ---
import { Header } from "~/components/header";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { FaStar } from 'react-icons/fa';
import { MdOutlineAddShoppingCart, MdFavoriteBorder } from "react-icons/md";

// --- IMPORTS DO SWIPER (OS ÚNICOS NECESSÁRIOS) ---
import { Swiper, SwiperSlide } from 'swiper/react';
// Módulos que vamos usar:
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import { useEffect, useState, useRef } from 'react'; // Adicionado useRef

import { FaShoppingCart } from "react-icons/fa";

// --- CSS DO SWIPER (IMPORTANTE) ---
import 'swiper/css';
import 'swiper/css/navigation'; // para as setas
import 'swiper/css/pagination'; // para a paginação (pontos/indicadores)
import 'swiper/css/effect-fade'; // para o efeito de banner
import { useNavigate } from "react-router";
import RatingStars from "~/components/rating_stars";
import Footer from "~/components/footer";
import type { Banner, Produto, Produtos } from "../produto/types";
import type { Categoria } from "../categoria/types";
import { homeService } from "./services/homeService";
import LazySection from "~/components/lazy_section";
import { categoriaService } from "../categoria/services/categoriaService";
import { produtoService } from "../produto/services/produtoService";

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
  const [dominantColor, setDominantColor] = useState('#000');

  const backgroundStyle = {
    background: `${dominantColor}`,
    transition: 'background 0.8s ease-out' // Transição suave!
  };

  return (
    <div>
      <Header />

      <main className="flex items-center justify-center pt-0 pb-0">

        <div className={`flex-1 flex flex-col items-center gap-0 min-h-0`} style={backgroundStyle}>

          <main className="max-w-387 mx-auto w-full bg-background-dark">
            {/* O Banner principal NÃO usa LazySection pois é "Above the Fold" (primeira dobra) */}
            <CarouselBannersPrincipais
              onColorChange={setDominantColor}
              images={mockBanners}
            />

            <div className="flex items-center px-8 w-full h-18 bg-primary">
              <p className="text-xl font-bold text-white">BLACK FRIDAY</p>
            </div>

            <section className="my-8">
              {/* Lazy Loading aplicado nos componentes abaixo da dobra */}
              <LazySection>
                <CarouselBannersSecundarios />
              </LazySection>
            </section>

            <hr className="my-2 border-gray-200" />

            <section className="my-8">
              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2">
                <p className="text-xl font-bold">MAIS PROCURADOS</p>
                <p className="text-sm">VER TODOS</p>
              </div>

              <LazySection>
                <CarouselCategoria nome="MORE" onChange={() => { }} />
              </LazySection>

              <section className="my-4">
                <LazySection>
                  <CarouselBannersSecundarios />
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
                <CarouselCategoria nome="NEW" onChange={() => { }} />
              </LazySection>

              <section className="my-4">
                <LazySection>
                  <CarouselBannersSecundarios />
                </LazySection>
              </section>
            </section>

            <hr className="my-2 border-gray-200" />

            <section className="my-8">
              <div className="flex flex-row justify-between items-end relative w-full mx-auto px-12 mb-2">
                <p className="text-xl font-bold">MAIS VENDIDOS</p>
              </div>

              <section className="my-4">
                <LazySection>
                  <CarouselBannersSecundarios />
                </LazySection>
              </section>
            </section>
          </main>
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
  onColorChange: (color: string) => void;
}

export function CarouselBannersPrincipais({ images, onColorChange }: CarouselBannersPrincipaisProps) {

  // Classes únicas para os botões deste carrossel
  const prevButtonId = 'main-banner-prev';
  const nextButtonId = 'main-banner-next';

  return (
    // O 'relative' é essencial para posicionar as setas
    // O 'group' é útil para mostrar setas no hover (opcional)
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
        onSlideChange={(swiper) => {
          onColorChange(images[swiper.realIndex].corHex);
        }}

        // --- Navegação (Setas) ---
        navigation={{
          prevEl: `.${prevButtonId}`,
          nextEl: `.${nextButtonId}`,
        }}

        // --- Paginação (Indicadores) ---
        pagination={{
          clickable: true,
        }}
      >
        {images?.map((image, index) => (
          <SwiperSlide key={index}>
            {/* IMPLEMENTAÇÃO DE LAZY LOADING NA IMAGEM */}
            {/* A primeira imagem (index 0) carrega 'eager' (rápido) para o LCP. */}
            {/* As outras carregam 'lazy' para economizar banda. */}
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

      {/* --- Setas Customizadas --- */}
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

// ===================================================================
// 5. CARD DE PRODUTO (Nenhuma mudança)
// ===================================================================

interface ProductCardProps {
  produto: Produto;
}

export function ProductCard({ produto }: ProductCardProps) {
  let navigate = useNavigate();

  const currencyFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 3,
  });

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => {
      navigate(`/produto/${produto.id}`);
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


export function CarouselBannersSecundarios() {
  const prevButtonId = `produto-carousel-prev`;
  const nextButtonId = `produto-carousel-next`;

  const [produtos, setProdutos] = useState<Produtos>();

  useEffect(() => {
    const listarCategoriasComSubCategorias = async () => {
      try {
        const { data } = await produtoService.listarProdutos();
        setProdutos(data);
        console.log('Categorias carregadas');
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };

    listarCategoriasComSubCategorias();
  }, []);


  if (produtos == undefined) {
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
          prevEl: `.${prevButtonId}`, // Agora será um seletor válido
          nextEl: `.${nextButtonId}`, // Agora será um seletor válido
        }}
        loop={true}
        spaceBetween={16}
        slidesPerView={5} // Padrão
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 3, spaceBetween: 10 },
          1024: { slidesPerView: 5, spaceBetween: 8 }
        }}
        className="select-none"
      >
        {produtos.produtos.map((produto) => (
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
  nome: string;
  onChange: (category: Categoria) => void;
}

export function CarouselCategoria({ nome, onChange }: CarouselCategoriaProps) {
  const prevButtonId = `${nome}-category-carousel-prev`;
  const nextButtonId = `${nome}-category-carousel-next`;

  const [categorias, setCategorias] = useState<Categoria[]>();

  useEffect(() => {
    const listarCategoriasComSubCategorias = async () => {
      try {
        const { data } = await categoriaService.listarCategorias();
        setCategorias(data);
        console.log('Categorias carregadas');
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };

    listarCategoriasComSubCategorias();
  }, []);


  if (categorias == undefined) {
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
          prevEl: `.${prevButtonId}`, // Agora será um seletor válido
          nextEl: `.${nextButtonId}`, // Agora será um seletor válido
        }}
        loop={true}
        spaceBetween={16}
        slidesPerView={"auto"} // Padrão

        breakpoints={{
          320: { spaceBetween: 10 },
          768: { spaceBetween: 10 },
          1024: { spaceBetween: 8 }
        }}

        className="select-none"
      >
        {categorias.map((categoria) => (
          <SwiperSlide key={`${name}-${categoria.id}`} className="whitespace-nowrap" style={{ height: 'auto', width: 'auto' }}>
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