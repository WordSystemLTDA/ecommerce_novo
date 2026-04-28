import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Header from "~/components/header";

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useEffect, useMemo, useState } from 'react';

import sign from 'jwt-encode';
import { BsLightningChargeFill } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdLocalFireDepartment, MdNewReleases, MdTrendingUp, MdWorkspacePremium } from "react-icons/md";
import { useNavigate } from "react-router";
import FilterToolbar from "~/components/filter_toolbar";
import FilterSidebar from "~/components/FilterSidebar";
import Footer from "~/components/footer";
import LazySection from "~/components/lazy_section";
import { OptimizedImage } from "~/components/OptimizedImage";
import { ProductCard } from "~/components/ProductCard";
import { SectionHeader } from "~/components/SectionHeader";
import { SkeletonBanner, SkeletonImageCard, SkeletonMainBanner } from "~/components/skeleton_banner";
import { SkeletonCategoryCard } from "~/components/skeleton_category_card";
import { SkeletonProductCard } from "~/components/skeleton_product_card";
import { useAuth } from "~/features/auth/context/AuthContext";
import { useIsMobile } from "~/hooks/useIsMobile";
import { gerarSlug } from "~/utils/formatters";
import type { Categoria } from "../categoria/types";
import type { Marca } from "../marca/types";
import type { Banner } from "../produto/types";
import { MobileFilterDrawer } from "./components/MobileFilterDrawer";
import { useHome } from "./context/HomeContext";

interface TrustBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}

function TrustBadge({ icon, title, description, accent }: TrustBadgeProps) {
  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-3 lg:p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] lift-hover">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 lg:h-11 lg:w-11 shrink-0 items-center justify-center rounded-xl border ${accent}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
          <p className="text-xs text-slate-500 truncate hidden sm:block">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { isFiltering, filteredProducts, activeFilters, applyFilters, filterOptions, produtos, sectionCategories, setSectionCategories, sectionMarcas, setSectionMarcas, banners, secondaryBanners, isInitialDataLoaded, isLoadingSidebarFilters } = useHome();
  const navigate = useNavigate();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // const isMobile = useIsMobile();

  const pos0Banners = useMemo(() => secondaryBanners.filter(b => b.tipo_de_banner === 2), [secondaryBanners]);
  const pos1Banners = useMemo(() => secondaryBanners.filter(b => b.tipo_de_banner === 3), [secondaryBanners]);
  const pos2Banners = useMemo(() => secondaryBanners.filter(b => b.tipo_de_banner === 4), [secondaryBanners]);
  const canLoadImages = isInitialDataLoaded;

  // const pos0BannersSemFiltro = secondaryBanners.filter(b => b.tipo_de_banner === 2);
  // const pos1BannersSemFiltro = secondaryBanners.filter(b => b.tipo_de_banner === 3);
  // const pos2BannersSemFiltro = secondaryBanners.filter(b => b.tipo_de_banner === 4);

  // const pos0Banners = (pos0BannersSemFiltro ?? []).filter((v) => {
  //   if (isMobile) {
  //     return v.paraCelular === 'Sim';
  //   } else {
  //     // Assume que se não for 'Sim', é para desktop (ou verifique se existe 'Não')
  //     return v.paraCelular !== 'Sim';
  //   }
  // });

  // const pos1Banners = (pos1BannersSemFiltro ?? []).filter((v) => {
  //   if (isMobile) {
  //     return v.paraCelular === 'Sim';
  //   } else {
  //     // Assume que se não for 'Sim', é para desktop (ou verifique se existe 'Não')
  //     return v.paraCelular !== 'Sim';
  //   }
  // });

  // const pos2Banners = (pos2BannersSemFiltro ?? []).filter((v) => {
  //   if (isMobile) {
  //     return v.paraCelular === 'Sim';
  //   } else {
  //     // Assume que se não for 'Sim', é para desktop (ou verifique se existe 'Não')
  //     return v.paraCelular !== 'Sim';
  //   }
  // });

  const handleSectionCategoryClick = (sectionId: string, category: Categoria) => {
    const catId = Number(category.id);
    setSectionCategories(prev => {
      const current = prev[sectionId];
      return { ...prev, [sectionId]: current === catId ? null : catId };
    });
  };

  const handleSectionMarcaClick = (sectionId: string, marca: Marca) => {
    const catId = Number(marca.id);
    setSectionMarcas(prev => {
      const current = prev[sectionId];
      return { ...prev, [sectionId]: current === catId ? null : catId };
    });
  };

  const handleVerTodosClick = () => {
    navigate('/categoria/1/hardware');
  };

  return (
    <div className="bg-main-bg min-h-screen relative">
      <Header />

      <main className="w-full">
        {banners && banners.length > 0 ? (
          <CarouselBannersPrincipais images={banners} canLoadImages={canLoadImages} />
        ) : (
          <SkeletonMainBanner />
        )}

        <div className="max-w-387 mx-auto px-0 mb-8 lg:mt-4 lg:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-1">
              <FilterSidebar
                filterOptions={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={applyFilters}
                isLoading={isLoadingSidebarFilters}
                className="hidden lg:block"
              />
            </div>

            <div className="lg:col-span-4">
              <FilterToolbar totalProdutos={produtos?.length ?? 0} onOpenMobileFilter={() => setIsMobileFilterOpen(true)} />

              <ProductSection
                id="promocoes"
                title="Promoções"
                eyebrow="Ofertas relâmpago"
                description="Aproveite descontos por tempo limitado"
                icon={<BsLightningChargeFill size={20} />}
                accent="rose"
                filtros="promocoes"
                selectedCategoryId={sectionCategories['promocoes']}
                onCategoryChange={handleSectionCategoryClick}
                onLinkClick={handleVerTodosClick}
              />

              <ProductSection
                id="maisprocurados"
                title="Tendências do momento"
                eyebrow="Mais procurados"
                description="O que todo mundo está olhando"
                icon={<MdTrendingUp size={22} />}
                accent="terciary"
                filtros="maisprocurados"
                selectedCategoryId={sectionCategories['maisprocurados']}
                onCategoryChange={handleSectionCategoryClick}
                onLinkClick={handleVerTodosClick}
              />

              {(secondaryBanners.length === 0) ? (
                <section className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <SkeletonBanner />
                    <SkeletonBanner />
                  </div>
                </section>
              ) : (pos0Banners.length > 0 || pos1Banners.length > 0) && (
                <section className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {pos0Banners.length > 0 && (
                      <Swiper
                        modules={[EffectFade, Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={true}
                        effect="fade"
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="w-full overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                      >
                        {pos0Banners.map((banner, index) => (
                          <SwiperSlide key={index} className="h-auto!">
                            <div className="relative h-40 md:h-[200px] lg:h-40 bg-primary/8 overflow-hidden">
                              <OptimizedImage
                                src={banner.imagemUrl}
                                className="w-full h-full object-cover"
                                alt={`Banner promocional ${index + 1}`}
                                allowNetworkLoad={canLoadImages}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}

                    {pos1Banners.length > 0 && (
                      <Swiper
                        modules={[EffectFade, Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={true}
                        effect="fade"
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        className="w-full overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                      >
                        {pos1Banners.map((banner, index) => (
                          <SwiperSlide key={index} className="h-auto!">
                            <div className="relative h-40 md:h-[200px] lg:h-40 bg-primary/8 overflow-hidden">
                              <OptimizedImage
                                src={banner.imagemUrl}
                                className="w-full h-full object-cover"
                                alt={`Banner promocional ${index + 1}`}
                                allowNetworkLoad={canLoadImages}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                  </div>
                </section>
              )}

              <section className="mt-10">
                <SectionHeader
                  eyebrow="Navegue por"
                  title="Departamentos"
                  description="Encontre exatamente o que procura"
                  icon={<HiOutlineSparkles size={20} />}
                  accent="primary"
                  onLinkClick={handleVerTodosClick}
                />
                <LazySection forceVisible={true}>
                  <CarouselCategoriaComImagem
                    id='maisprocurados_img'
                    onChange={(cat) => handleSectionCategoryClick('maisprocurados_img', cat)}
                    selectedCategoryId={sectionCategories['maisprocurados_img']}
                    canLoadImages={canLoadImages}
                  />
                </LazySection>
              </section>

              <section className="mt-10">
                <SectionHeader
                  eyebrow="As que você ama"
                  title="Marcas oficiais"
                  description="Selecionadas com selo de autenticidade"
                  icon={<MdWorkspacePremium size={20} />}
                  accent="amber"
                  onLinkClick={handleVerTodosClick}
                />
                <LazySection forceVisible={true}>
                  <CarouselMarcaComImagem
                    id='marcas'
                    onChange={(marca) => handleSectionMarcaClick('marcas', marca)}
                    selectedMarcaId={sectionMarcas['marcas']}
                    canLoadImages={canLoadImages}
                  />
                </LazySection>
              </section>

              {secondaryBanners.length === 0 ? (
                <section className="mt-10">
                  <SkeletonBanner aspect="aspect-[21/7]" />
                </section>
              ) : pos2Banners.length > 0 && (
                <section className="mt-10">
                  <Swiper
                    modules={[EffectFade, Navigation, Autoplay]}
                    spaceBetween={10}
                    slidesPerView={1}
                    loop={true}
                    effect="fade"
                    autoplay={{ delay: 7000, disableOnInteraction: false }}
                    className="w-full overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                  >
                    {pos2Banners.map((banner, index) => (
                      <SwiperSlide key={index} className="h-auto!">
                        <div className="relative h-[170px] md:h-[220px] lg:h-[200px] bg-primary/8 overflow-hidden">
                          <OptimizedImage
                            src={banner.imagemUrl}
                            className="w-full h-full object-cover"
                            alt={`Banner destaque ${index + 1}`}
                            allowNetworkLoad={canLoadImages}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
              )}

              <div className="section-divider" />

              <ProductSection
                id="maisprocurados_bottom"
                title="Mais procurados"
                eyebrow="Top da semana"
                description="Os preferidos de quem comprou"
                icon={<MdTrendingUp size={22} />}
                accent="terciary"
                filtros="maisprocurados"
                selectedCategoryId={sectionCategories['maisprocurados_bottom']}
                onCategoryChange={handleSectionCategoryClick}
                onLinkClick={handleVerTodosClick}
              />

              <div className="section-divider" />

              <ProductSection
                id="novos"
                title="Acabaram de chegar"
                eyebrow="Novidades"
                description="Lançamentos fresquinhos no estoque"
                icon={<MdNewReleases size={22} />}
                accent="emerald"
                filtros="order_by=recente"
                selectedCategoryId={sectionCategories['novos']}
                onCategoryChange={handleSectionCategoryClick}
                onLinkClick={handleVerTodosClick}
              />

              <div className="section-divider" />

              <ProductSection
                id="maisvendidos"
                title="Mais vendidos"
                eyebrow="Campeões de venda"
                description="Os mais comprados pelos clientes"
                icon={<MdLocalFireDepartment size={22} />}
                accent="rose"
                filtros="maisvendidos"
                selectedCategoryId={sectionCategories['maisvendidos']}
                onCategoryChange={handleSectionCategoryClick}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        activeFilters={activeFilters}
        filterOptions={filterOptions}
        onApply={applyFilters}
      />
    </div>

  )
}

interface CarouselBannersPrincipaisProps {
  images: Banner[];
  canLoadImages: boolean;
}

export function CarouselBannersPrincipais({ images, canLoadImages }: CarouselBannersPrincipaisProps) {
  // 1. Chama o hook para saber o estado atual
  const isMobile = useIsMobile();

  const prevButtonId = 'main-banner-prev';
  const nextButtonId = 'main-banner-next';

  // 2. Filtra as imagens baseado no estado
  const bannersFiltrados = (images ?? []).filter((v) => {
    if (isMobile) {
      return v.paraCelular === 'Sim';
    } else {
      // Assume que se não for 'Sim', é para desktop (ou verifique se existe 'Não')
      return v.paraCelular !== 'Sim';
    }
  });

  // Enquanto o dispositivo não foi determinado, mostra skeleton
  if (isMobile === null) return <SkeletonMainBanner />;

  // Se não houver banners para o dispositivo, não renderiza nada
  if (bannersFiltrados.length === 0) return null;

  return (
    <div className="relative group w-full h-[200px] md:h-[300px] lg:h-[450px]">
      <Swiper
        className="main-banner-carousel w-full h-full"
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
        {bannersFiltrados.map((image, index) => (
          <SwiperSlide key={index} className="h-full!">
            <OptimizedImage
              src={image.imagemUrl}
              className="w-full h-full object-cover"
              priority={index === 0}
              allowNetworkLoad={canLoadImages}
              alt={`Banner principal ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className={`${prevButtonId} absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-secondary/70 bg-primary/35 hover:bg-primary/80 hover:border-terciary flex justify-center items-center p-3 opacity-0 group-hover:opacity-100 transition-all duration-500`}
      >
        <SlArrowLeft color="white" size={14} />
      </div>
      <div
        className={`${nextButtonId} absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-secondary/70 bg-primary/35 hover:bg-primary/80 hover:border-terciary flex justify-center items-center p-3 opacity-0 group-hover:opacity-100 transition-all duration-500`}
      >
        <SlArrowRight color="white" size={14} />
      </div>
    </div>
  );
};

interface ProductSectionProps {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  icon?: React.ReactNode;
  accent?: 'primary' | 'terciary' | 'rose' | 'amber' | 'emerald';
  filtros: string;
  globalFilters?: any;
  selectedCategoryId?: number | null;
  onCategoryChange: (id: string, category: Categoria) => void;
  onLinkClick?: () => void;
  showCategoryCarousel?: boolean;
}

function ProductSection({
  id,
  title,
  eyebrow,
  description,
  icon,
  accent = 'primary',
  filtros,
  globalFilters,
  selectedCategoryId,
  onCategoryChange,
  onLinkClick,
  showCategoryCarousel = true
}: ProductSectionProps) {
  let { listarProdutos, produtos } = useHome();
  const { cliente } = useAuth();
  const bannerData = produtos.find((e) => e.id == id);
  const hasLoadedEmptyState = !!bannerData && (!bannerData.produtos || bannerData.produtos.length === 0);

  useEffect(() => {
    const fetchWithFilters = async () => {
      let finalFilters = globalFilters ? { ...globalFilters } : {};
      finalFilters['ignore_total'] = true; // Optimize: homepage sections don't need total count
      finalFilters['por_pagina'] = 10; // Optimize: home sections only show ~8 cards in carousel

      // Ensure we ignore global sorting for these curated sections
      delete finalFilters['ordenacao'];
      delete finalFilters['order_by'];

      if (filtros === 'promocoes') {
        finalFilters['promocao'] = 'true';
      } else if (filtros === 'maisvendidos') {
        finalFilters['order_by'] = 'mais_vendidos';
      } else if (filtros === 'maisprocurados') {
        finalFilters['order_by'] = 'mais_procurados';
      } else if (filtros.includes('order_by=')) {
        const parts = filtros.split('=');
        if (parts[1] === 'recente') {
          finalFilters['order_by'] = 'mais_recentes';
        }
      }

      if (selectedCategoryId) {
        finalFilters = { ...finalFilters, categorias: [selectedCategoryId] };
      }

      const token = sign(finalFilters, 'secret');
      const params = new URLSearchParams();
      params.append('filtros', token);

      if (cliente?.id) {
        params.append('id_cliente', cliente.id.toString());
      }

      await listarProdutos(id, params.toString());
    };

    fetchWithFilters();
  }, [globalFilters, selectedCategoryId, filtros]); // Added filtros to deps

  // If loading or has data, render.
  return (
    <section className="my-6 rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-sm py-3 shadow-[0_4px_24px_rgba(15,23,42,0.05)] section-shell fade-in-up">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        icon={icon}
        accent={accent}
        onLinkClick={onLinkClick}
      />

      <LazySection forceVisible={!!bannerData}>
        {showCategoryCarousel && (
          <CarouselCategoria
            id={id}
            onChange={(cat) => onCategoryChange(id, cat)}
            selectedCategoryId={selectedCategoryId}
          />
        )}
      </LazySection>

      <section className="my-4">
        <LazySection forceVisible={!!bannerData}>
          {hasLoadedEmptyState ? (
            <div className="border border-dashed border-primary/20 bg-product-bg px-6 py-10 text-center text-sm text-primary/70">
              Nenhum produto foi encontrado para essa categoria. Escolha outra opção para continuar.
            </div>
          ) : (
            <CarouselBannersSecundarios
              id={id}
              filtros={filtros}
              skipFetch={true}
            />
          )}
        </LazySection>
      </section>
    </section>
  );
}

interface CategoriaCardProps {
  categoria: Categoria;
  onClick?: (categoria: Categoria) => void;
  isSelected?: boolean;
  canLoadImages?: boolean;
}

export function CategoriaCard({ categoria, onClick, isSelected }: CategoriaCardProps) {
  return (
    <div
      className={`border px-4 py-2 rounded-sm text-center w-auto cursor-pointer transition-colors ${isSelected ? 'bg-primary text-white border-primary' : 'border-primary hover:bg-gray-50'}`}
      onClick={() => onClick && onClick(categoria)}
    >
      <p className="max-lg:text-sm lg:text-sm">{categoria.nome}</p>
    </div>
  );
}

export function CategoriaCardComImagem({ categoria, onClick, isSelected, canLoadImages = true }: CategoriaCardProps) {
  let navigate = useNavigate();

  return (
    <div
      className={`flex w-52 flex-col items-center gap-1 px-3 py-3 text-center rounded-2xl cursor-pointer bg-white border border-slate-200 lift-hover ${isSelected ? 'border-primary ring-2 ring-primary/30' : ''}`}
      onClick={() => {
        navigate('/categoria/' + categoria.id);
      }}
    >
      <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-3">
        <OptimizedImage src={categoria.imagem} allowNetworkLoad={canLoadImages} className="h-full w-full object-contain transition-transform duration-300 hover:scale-105" alt={categoria.nome} />
      </div>
      <p className="text-sm font-medium text-slate-700 mt-1 truncate max-w-48">{categoria.nome}</p>
    </div>
  );
}

interface MarcaCardProps {
  marca: Marca;
  onClick?: (marca: Marca) => void;
  isSelected?: boolean;
  canLoadImages?: boolean;
}

function getMarcaPlaceholder(nome: string) {
  const safeName = nome?.trim() || 'Marca';
  const placeholderSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240" role="img" aria-label="Sem imagem para ${safeName}">
      <rect width="480" height="240" fill="#f8fafc" />
      <rect x="24" y="24" width="432" height="192" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
      <path d="M182 124l33-33 27 27 44-44 54 54" fill="none" stroke="#94a3b8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="195" cy="88" r="13" fill="#cbd5e1" />
      <text x="240" y="166" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#475569">Sem imagem</text>
      <text x="240" y="192" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="#0f172a">${safeName}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(placeholderSvg)}`;
}

export function MarcaCardComImagem({ marca, onClick, isSelected, canLoadImages = true }: MarcaCardProps) {
  let navigate = useNavigate();
  const fallbackMarcaImage = getMarcaPlaceholder(marca.nome);

  return (
    <div
      className={`flex h-full w-72 flex-col border border-slate-200 text-center rounded-2xl overflow-hidden bg-white cursor-pointer lift-hover group ${isSelected ? 'ring-2 ring-amber-400/50 border-amber-300' : ''}`}
      onClick={() => {
        navigate(`/marca/${marca.id}/${gerarSlug(marca.nome)}`);
      }}
    >
      <div className="flex h-40 w-full items-center justify-center overflow-hidden bg-slate-50 p-4">
        <OptimizedImage
          src={marca.imagem}
          fallbackSrc={fallbackMarcaImage}
          allowNetworkLoad={canLoadImages}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          alt={marca.nome}
        />
      </div>
      <p className="px-2 py-2 text-sm font-medium text-slate-700 border-t border-slate-100">{marca.nome}</p>
    </div>
  );
}

export function CarouselBannersSecundarios({ id, filtros, globalFilters, selectedCategoryId, skipFetch }: { id: string, filtros: string, globalFilters?: any, selectedCategoryId?: number | null, skipFetch?: boolean }) {
  const prevButtonId = `${id}-produto-carousel-prev`;
  const nextButtonId = `${id}-produto-carousel-next`;

  let { listarProdutos, produtos } = useHome();
  const { cliente } = useAuth();
  const bannerData = produtos.find((e) => e.id == id);

  useEffect(() => {
    if (skipFetch) return; // Added skipFetch

    const fetchWithFilters = async () => {
      let finalFilters = globalFilters ? { ...globalFilters } : {};

      if (filtros === 'promocoes') {
        finalFilters['promocao'] = 'true';
      } else if (filtros === 'maisvendidos') {
        finalFilters['order_by'] = 'mais_vendidos';
      } else if (filtros === 'maisprocurados') {
        finalFilters['order_by'] = 'mais_procurados';
      } else if (filtros.includes('order_by=')) {
        const parts = filtros.split('=');
        if (parts[1] === 'recente') {
          finalFilters['order_by'] = 'mais_recentes';
        }
      }

      if (selectedCategoryId) {
        finalFilters = { ...finalFilters, categorias: [selectedCategoryId] };
      }

      const token = sign(finalFilters, 'secret');
      const params = new URLSearchParams();
      params.append('filtros', token);

      if (cliente?.id) {
        params.append('id_cliente', cliente.id.toString());
      }

      await listarProdutos(id, params.toString());
    };

    fetchWithFilters();
  }, [globalFilters, selectedCategoryId, skipFetch]); // Added skipFetch to deps

  const isLoading = !bannerData;

  if (isLoading) {
    return (
      <div className="relative w-full">
        {/* Mobile Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 lg:hidden px-4 lg:px-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>

        {/* Desktop Swiper Skeleton */}
        <div className="hidden md:block">
          <Swiper
            modules={[Navigation]}
            loop={false}
            spaceBetween={16}
            slidesPerView={5}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 10 },
              1024: { slidesPerView: 3, spaceBetween: 10 },
              1280: { slidesPerView: 4, spaceBetween: 10 },
              1536: { slidesPerView: 5, spaceBetween: 8 }
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
      </div>
    );
  }

  if (!bannerData?.produtos || bannerData.produtos.length === 0) {
    return (
      <div>
        <p>Não foi encontrado nenhum produto disponível</p>
      </div>
    );
  }

  return (
    <div className="relative w-full px-2 lg:px-0">
      {/* Mobile Grid */}
      <div className="grid grid-cols-2 gap-2 md:hidden px-0">
        {bannerData.produtos.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>

      {/* Desktop Swiper */}
      <div className="hidden md:block">
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
            1024: { slidesPerView: 3, spaceBetween: 10 },
            1280: { slidesPerView: 4, spaceBetween: 10 },
            1536: { slidesPerView: 5, spaceBetween: 8 }
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
    </div>
  );
};


interface CarouselCategoriaProps {
  id: string;
  onChange: (category: Categoria) => void;
  selectedCategoryId?: number | null;
  canLoadImages?: boolean;
}

export function CarouselCategoria({ id, onChange, selectedCategoryId }: CarouselCategoriaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;
  const [navState, setNavState] = useState({ isBeginning: true, isEnd: false, isLocked: false });

  let { produtos } = useHome();
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
      <div className="relative w-full">
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
        <p>Não foi encontrado nenhuma categoria disponível</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.${prevButtonId}`,
          nextEl: `.${nextButtonId}`,
        }}
        loop={false}
        spaceBetween={6}
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
        className={`max-lg:hidden ${prevButtonId} absolute left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100 ${navState.isBeginning || navState.isLocked ? 'hidden!' : ''}`}
      >
        <SlArrowLeft color="black" size={16} />
      </div>
      <div
        className={`max-lg:hidden ${nextButtonId} absolute right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100 ${navState.isEnd || navState.isLocked ? 'hidden!' : ''}`}
      >
        <SlArrowRight color="black" size={16} />
      </div>
    </div>
  );
};

export function CarouselCategoriaComImagem({ id, onChange, selectedCategoryId, canLoadImages = true }: CarouselCategoriaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;

  const { filterOptions } = useHome();
  const categorias = filterOptions.categorias;

  if (!categorias || categorias.length <= 0) {
    return (
      <div className="relative w-full">
        <div className="flex gap-3 overflow-hidden px-4 lg:px-0">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonImageCard key={index} width="min-w-[13rem] max-w-[13rem]" height="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
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
              canLoadImages={canLoadImages}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className={`max-lg:hidden ${prevButtonId} absolute left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowLeft color="black" size={16} />
      </div>
      <div
        className={`max-lg:hidden ${nextButtonId} absolute right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowRight color="black" size={16} />
      </div>
    </div>
  );
};

interface CarouselMarcaProps {
  id: string;
  onChange: (marca: Marca) => void;
  selectedMarcaId?: number | null;
  canLoadImages?: boolean;
}

export function CarouselMarcaComImagem({ id, onChange, selectedMarcaId, canLoadImages = true }: CarouselMarcaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;

  const { filterOptions } = useHome();
  const marcas = filterOptions.marcas;

  if (!marcas || marcas.length <= 0) {
    return (
      <div className="relative w-full">
        <div className="flex gap-3 overflow-hidden px-4 lg:px-0">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonImageCard key={index} width="min-w-[20rem] max-w-[20rem]" height="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
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
              marca={marca as any}
              onClick={onChange}
              isSelected={selectedMarcaId === Number(marca.id)}
              canLoadImages={canLoadImages}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className={`max-lg:hidden ${prevButtonId} absolute left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowLeft color="black" size={16} />
      </div>
      <div
        className={`max-lg:hidden ${nextButtonId} absolute right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-gray-300 bg-white shadow-md rounded-full flex justify-center items-center p-2 hover:bg-gray-100`}
      >
        <SlArrowRight color="black" size={16} />
      </div>
    </div>
  );
};


