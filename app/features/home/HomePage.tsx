// --- IMPORTS ---
import { Header } from "~/components/header";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { FaStar } from 'react-icons/fa';
import { MdOutlineAddShoppingCart, MdFavoriteBorder  } from "react-icons/md";

// --- IMPORTS DO SWIPER (OS ÚNICOS NECESSÁRIOS) ---
import { Swiper, SwiperSlide } from 'swiper/react';
// Módulos que vamos usar:
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import { useEffect, useState } from 'react';

import { FaShoppingCart } from "react-icons/fa";

// --- CSS DO SWIPER (IMPORTANTE) ---
import 'swiper/css';
import 'swiper/css/navigation'; // para as setas
import 'swiper/css/pagination'; // para a paginação (pontos/indicadores)
import 'swiper/css/effect-fade'; // para o efeito de banner
import { useNavigate } from "react-router";

// ===================================================================
// 1. DEFINIÇÃO DE TIPO PARA OS PRODUTOS
// ===================================================================
export interface Product {
  id: number | string;
  imageUrl: string;
  title: string;
  rating?: number;
  oldPrice?: number;
  price: number;
  unitsInStock: number;
  installmentsNumber?: number;
  installmentsPlaceholder?: string;
  isHighlight?: boolean;
}

export interface Banner {
  id: number | string;
  imageUrl: string;
  colorHex: string;
}

// ===================================================================
// 2. MOCK DATA (DADOS DE EXEMPLO)
// ===================================================================
const mockProducts: Product[] = [
  {
    id: 1,
    imageUrl: "https://images.kabum.com.br/produtos/fotos/723235/placa-de-video-amd-radeon-rx-7600-gaming-graphics-card-8gb-gddr6-rx-76pmbabfy_1740593267_m.jpg",
    title: "Placa de Vídeo XFX AMD RADEON RX 7600",
    oldPrice: 2070.56,
    price: 1599.99,
    rating: 4.5,
    unitsInStock: 10,
    installmentsNumber: 10,
    installmentsPlaceholder: "10x de R$ 159,99"
  },
  {
    id: 2,
    imageUrl: "https://images.kabum.com.br/produtos/fotos/634676/iphone-16-pro-max-256gb-titanio-branco_1726860075_m.jpg",
    title: "iPhone 16 Pro Max Apple 256GB",
    price: 8499.90,
    rating: 1.5,
    unitsInStock: 10,
    installmentsNumber: 10,
    installmentsPlaceholder: "10x de R$ 944,43"
  },
  {
    id: 3,
    imageUrl: "https://images.kabum.com.br/produtos/fotos/634554/apple-watch-se-gps-case-meia-noite-de-aluminio-44-mm-pulseira-esportiva-meia-noite-m-g-mxek3be-a_1726518516_m.jpg",
    title: "Apple Watch SE GPS, 44 mm",
    price: 2399.90,
    rating: 5,
    unitsInStock: 10,
    installmentsNumber: 10,
    installmentsPlaceholder: "10x de R$ 282,34"
  },
  {
    id: 4,
    imageUrl: "https://images.kabum.com.br/produtos/fotos/371586/teclado-mecanico-gamer-hyperx-alloy-mkw100-rgb-switch-red-full-size-us-preto-4p5e1aa-aba_1722882381_m.jpg",
    title: "Teclado Mecânico Gamer HyperX Alloy",
    oldPrice: 759.00,
    price: 209.99,
    rating: 4,
    unitsInStock: 10,
    isHighlight: true,
    installmentsNumber: 10,
    installmentsPlaceholder: "8x de R$ 25,36",
  },
  {
    id: 5,
    imageUrl: "https://images.kabum.com.br/produtos/fotos/883637/notebook-gamer-gigabyte-a16-intel-core-i7-13620h-16gb-ram-ddr5-rtx-5060-ssd-1tb-gen4-16-wuxga-165hz-w11-home-9rga6i76vhfhjk5us000_1753185331_m.jpg",
    title: "Notebook Gamer Gigabyte A16",
    price: 7999.99,
    rating: 1,
    unitsInStock: 10,
    installmentsNumber: 10,
    installmentsPlaceholder: "10x de R$ 888,88"
  },
  {
    id: 6,
    imageUrl: "https://images.kabum.com.br/produtos/fotos/149989/mouse-sem-fio-gamer-logitech-g-pro-x-superlight-lightspeed-25000-dpi-5-botoes-preto-910-005879_1727272012_m.jpg",
    title: "Mouse Sem Fio Gamer Logitech G PRO X",
    price: 699.90,
    unitsInStock: 10,
    installmentsNumber: 10,
    installmentsPlaceholder: "10x de R$ 77,76"
  }
];

const mockBanners: Banner[] = [
  {
    id: 1,
    imageUrl: "/1762447412.webp",
    colorHex: "#f05802"
  }, // Azul escuro
  {
    id: 2,
    imageUrl: "/1762949636.gif",
    colorHex: "#060709"
  }, // Vermelho
  {
    id: 3,
    imageUrl: "/1762948553.webp",
    colorHex: "#000000"
  }  // Verde
];

// ===================================================================
// 3. COMPONENTE WELCOME
// ===================================================================
export function HomePage() {
  const [dominantColor, setDominantColor] = useState('#000');

  const backgroundStyle = {
    background: `${dominantColor}`,
    transition: 'background 0.8s ease-out' // Transição suave!
  };

  return (
    <main className="flex items-center justify-center pt-0 pb-0">
      <div className={`flex-1 flex flex-col items-center gap-0 min-h-0`} style={backgroundStyle}>
        <Header />

        <main className="max-w-344 bg-background-dark">
          <CarouselBannersPrincipais
            onColorChange={setDominantColor}
            images={mockBanners}
          />

          <section className="my-8">
            <CarouselBannersSecundarios products={mockProducts} />
          </section>

        </main>
      </div>
    </main>
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
    <div className="relative group">
      <Swiper
        // Adicionamos uma classe customizada para podermos estilizar
        // a paginação (indicadores) separadamente de outros carrosséis
        className="main-banner-carousel"
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        // --- Configuração de "Banner" ---
        effect="fade" // Efeito de transição
        slidesPerView={1} // 1 slide por vez
        loop={true} // (infiniteLoop)
        autoplay={{ // (autoPlay)
          delay: 10000,
          disableOnInteraction: false,
        }}
        // 5. O PULO DO GATO!
        //    Quando o slide mudar, atualize o 'currentImageUrl'
        onSlideChange={(swiper) => {
          // 'realIndex' é o índice correto mesmo com o loop
          onColorChange(images[swiper.realIndex].colorHex);
        }}

        // --- Navegação (Setas) ---
        navigation={{
          prevEl: `.${prevButtonId}`,
          nextEl: `.${nextButtonId}`,
        }}

        // --- Paginação (Indicadores) ---
        pagination={{
          clickable: true, // Permite clicar nos "pontos"
          // Não vamos usar renderBullet, é mais fácil estilizar o padrão
        }}
      >
        {images?.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image.imageUrl} className="w-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- Setas Customizadas (mesmo estilo do seu código original) --- */}
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

// ===================================================================
// 5. CARD DE PRODUTO (Nenhuma mudança)
// ===================================================================

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  let navigate = useNavigate();

  const currencyFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 3,
  });

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white cursor-pointer hover:shadow-lg transition-shadow group" onClick={() => {
      navigate(`/product/${product.id}`);
    }}>
      <div className="relative">
        {product.isHighlight && (
          <span className="absolute top-2 left-2 bg-primary text-white text-medium-tiny font-bold px-2 py-1 rounded-xl">
            MELHOR PREÇO
          </span>
        )}

        <div className="absolute top-2 right-2 group-hover:opacity-0 opacity-100 transition-opacity p-1">
          {product.rating !== undefined && (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={8}
                  className={i < Math.round(product.rating ?? 0) ? "text-primary" : "text-gray-300"}
                />
              ))}
              <span className="text-tiny text-gray-400">({product.rating.toFixed(0)})</span>
            </div>
          )}
        </div>

        <div className="flex absolute top-2 right-2 group-hover:opacity-100 opacity-0 transition-opacity gap-2 p-1 z-10 cursor-auto">
          <MdFavoriteBorder size={20} color="gray" className="cursor-pointer" /> 
          <MdOutlineAddShoppingCart size={20} color="gray" className="cursor-pointer" />
        </div>

        <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-contain p-4" />
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex-1">
          <h3 className="text-sm text-gray-600 font-bold mb-2 h-10 overflow-hidden text-ellipsis">
            {product.title}
          </h3>

          <div className="flex justify-between">
            {product.oldPrice && (
              <span className="text-xs text-gray-500 line-through">
                {currencyFormatter.format(product.oldPrice)}
              </span>
            )}
            {product.unitsInStock <= 100 && (
              <span className="text-tiny text-gray-600">
                Restam {product.unitsInStock} unid.
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-primary">
              {currencyFormatter.format(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs font-bold text-green-600 bg-green-100 px-1 py-0.5 rounded">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
              </span>
            )}
          </div>
          
          <span className="text-xs text-gray-600 block">
            À vista no PIX
          </span>
          {product.installmentsPlaceholder && (
            <span className="text-xs text-gray-600 mt-1 block">
              ou até <span className="font-bold">{product.installmentsPlaceholder}</span>
            </span>
          )}
        </div>
        {/* <button className="mt-4 w-full bg-primary text-white font-bold text-sm py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-secondary transition-colors">
          <IoIosFlash size={18} />
          TERMINA EM:
        </button> */}
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

interface CarouselBannersSecundariosProps {
  products: Product[];
}

export function CarouselBannersSecundarios({ products }: CarouselBannersSecundariosProps) {
  const prevButtonId = `product-carousel-prev`;
  const nextButtonId = `product-carousel-next`;

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
        {products.map((product) => (
          <SwiperSlide key={product.id} style={{ height: 'auto' }}>
            <ProductCard product={product} />
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