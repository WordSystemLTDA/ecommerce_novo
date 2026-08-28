import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Header from "~/components/header";

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { lazy, Suspense, useEffect, useMemo, useState } from 'react';

import sign from 'jwt-encode';
import { BsArrowRepeat, BsLightningChargeFill, BsShieldCheck, BsTruck } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdClose, MdLocalFireDepartment, MdNewReleases, MdOutlineInventory2, MdTrendingUp, MdWorkspacePremium } from "react-icons/md";
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
import { getBannerImageFallback, getBrandImageFallback, getCategoryImageFallback } from "~/utils/imagePlaceholders";
import type { Categoria } from "../categoria/types";
import type { Marca } from "../marca/types";
import type { Banner } from "../produto/types";
import { defaultFilters, useHome, type ActiveFilters, type FilterOptions } from "./context/HomeContext";
import { NormalizedProductImage } from "~/components/NormalizedProductImage";

const MobileFilterDrawer = lazy(() =>
  import('./components/MobileFilterDrawer').then((module) => ({ default: module.MobileFilterDrawer })),
);

interface TrustBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}

function TrustBadge({ icon, title, description, accent }: TrustBadgeProps) {
  return (
    <div className="group relative min-w-0 overflow-hidden border border-primary/10 bg-product-bg p-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-0.5 sm:p-2.5 lg:p-3">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border sm:h-9 sm:w-9 lg:h-10 lg:w-10 ${accent}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 overflow-wrap-anywhere text-[11px] font-semibold leading-tight text-primary sm:text-xs lg:text-sm">{title}</p>
          <p className="hidden truncate text-xs text-primary/60 sm:block">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  return <ModernHomePage />;
}

function ModernHomePage() {
  const {
    activeFilters,
    applyFilters,
    banners,
    filteredProducts,
    filteredTotal,
    searchSuggestion,
    filterOptions,
    isFiltering,
    isInitialDataLoaded,
    isLoadingFilters,
    isLoadingMore,
    isLoadingSidebarFilters,
    loadMoreProducts,
    secondaryBanners,
    sectionCategories,
    sectionMarcas,
    setSectionCategories,
    setSectionMarcas,
  } = useHome();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const pos0Banners = useMemo(() => secondaryBanners.filter((banner) => banner.tipo_de_banner === 2), [secondaryBanners]);
  const pos1Banners = useMemo(() => secondaryBanners.filter((banner) => banner.tipo_de_banner === 3), [secondaryBanners]);
  const pos2Banners = useMemo(() => secondaryBanners.filter((banner) => banner.tipo_de_banner === 4), [secondaryBanners]);
  const activeFilterCount = getActiveFilterCount(activeFilters);

  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleQuickCategory = (categoryId: number) => {
    const isSelected = activeFilters.categorias.includes(categoryId);
    applyFilters({
      ...activeFilters,
      categorias: isSelected ? [] : [categoryId],
    });
    window.setTimeout(scrollToCatalog, 50);
  };

  const handleSectionCategoryClick = (sectionId: string, category: Categoria) => {
    const categoryId = Number(category.id);
    setSectionCategories((current) => ({
      ...current,
      [sectionId]: current[sectionId] === categoryId ? null : categoryId,
    }));
  };

  const handleSectionBrandClick = (sectionId: string, brand: Marca) => {
    const brandId = Number(brand.id);
    setSectionMarcas((current) => ({
      ...current,
      [sectionId]: current[sectionId] === brandId ? null : brandId,
    }));
  };

  return (
    <div className="relative min-h-screen bg-main-bg text-primary">
      <Header />

      <main className="w-full">
        {banners.length > 0 ? (
          <CarouselBannersPrincipais images={banners} canLoadImages={isInitialDataLoaded} />
        ) : isInitialDataLoaded ? (
          <FallbackBannerCard title="Ofertas em destaque" className="h-[220px] md:h-[340px] lg:h-[430px]" />
        ) : (
          <SkeletonMainBanner />
        )}

        {filterOptions.categorias.length > 0 && (
          <nav aria-label="Categorias em destaque" className="border-b border-primary/10 bg-header-bg">
            <div className="page-container flex gap-2 overflow-x-auto py-3 no-scrollbar">
              {filterOptions.categorias.slice(0, 12).map((category) => {
                const categoryId = Number(category.id);
                const selected = activeFilters.categorias.includes(categoryId);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleQuickCategory(categoryId)}
                    className={`shrink-0 border px-4 py-2 text-xs font-medium transition-all duration-300 ${
                      selected
                        ? 'border-primary bg-primary text-secondary'
                        : 'border-primary/15 bg-product-bg text-primary hover:border-terciary hover:text-terciary'
                    }`}
                  >
                    {category.nome}
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        <section className="page-container py-3 sm:py-4 lg:py-5" aria-label="Benefícios da loja">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-1.5 sm:gap-2 lg:grid-cols-4">
            <TrustBadge icon={<BsTruck size={20} />} title="Entrega para todo Brasil" description="Calcule o prazo pelo seu CEP" accent="border-terciary/20 bg-terciary/8 text-terciary" />
            <TrustBadge icon={<BsShieldCheck size={20} />} title="Compra protegida" description="Pagamento seguro e monitorado" accent="border-primary/15 bg-primary/5 text-primary" />
            <TrustBadge icon={<BsArrowRepeat size={20} />} title="Troca facilitada" description="Consulte as regras da loja" accent="border-terciary/20 bg-terciary/8 text-terciary" />
            <TrustBadge icon={<MdOutlineInventory2 size={20} />} title="Estoque atualizado" description="Disponibilidade em tempo real" accent="border-primary/15 bg-primary/5 text-primary" />
          </div>
        </section>

        <section id="catalogo" className="page-container scroll-mt-36 pb-8 lg:pb-14">
          <div className="mb-3 border-y border-primary/10 py-3 sm:py-4 lg:flex lg:items-end lg:justify-between lg:py-5">
            <div>
              <span className="overline-label">Catálogo</span>
              <h1 className="mt-0.5 font-serif text-2xl font-medium tracking-tight text-primary sm:text-3xl">
                {isFiltering ? 'Produtos encontrados' : 'Descubra nossa seleção'}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-primary/60">
                Encontre roupas, calçados e acessórios usando os filtros para chegar mais rápido ao produto ideal.
              </p>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-primary/55 lg:mt-0">
              {filteredTotal || filteredProducts.length} {filteredTotal === 1 ? 'produto' : 'produtos'}
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-5">
            <FilterSidebar
              filterOptions={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={applyFilters}
              isLoading={isLoadingSidebarFilters}
              className="hidden min-w-0 lg:block"
            />

            <div className="min-w-0">
              <FilterToolbar
                totalProdutos={filteredTotal || filteredProducts.length}
                onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
                activeFilterCount={activeFilterCount}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortValue={activeFilters.ordenacao}
                onSortChange={(ordenacao) => applyFilters({ ...activeFilters, ordenacao })}
              />

              <CatalogActiveFilters
                activeFilters={activeFilters}
                filterOptions={filterOptions}
                onChange={applyFilters}
              />

              {isLoadingFilters ? (
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <SkeletonProductCard key={index} />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className={`grid grid-cols-2 items-stretch ${viewMode === 'compact' ? 'gap-1.5 sm:gap-2' : 'gap-1.5 sm:gap-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} produto={product} compact={viewMode === 'compact'} />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-80 flex-col items-center justify-center border border-primary/10 bg-product-bg px-6 text-center">
                  <HiOutlineSparkles size={32} className="text-terciary" />
                  <h2 className="mt-4 font-serif text-2xl font-medium">Nenhum produto encontrado</h2>
                  <p className="mt-2 max-w-md text-sm text-primary/60">Tente remover alguns filtros ou buscar com outras palavras.</p>
                  {searchSuggestion && (
                    <button
                      type="button"
                      onClick={() => applyFilters({ ...defaultFilters, pesquisa: searchSuggestion })}
                      className="mt-4 text-sm font-semibold text-terciary underline underline-offset-4"
                    >
                      Você quis dizer “{searchSuggestion}”?
                    </button>
                  )}
                  <button type="button" onClick={() => applyFilters(defaultFilters)} className="mt-5 border border-primary bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-secondary transition-colors hover:bg-terciary">
                    Limpar filtros
                  </button>
                </div>
              )}

              {filteredProducts.length > 0 && filteredTotal > filteredProducts.length && (
                <div className="mt-4 flex flex-col items-center gap-1.5">
                  <p className="text-center text-xs text-primary/55">Exibindo {filteredProducts.length} de {filteredTotal} produtos</p>
                  <button
                    type="button"
                    onClick={loadMoreProducts}
                    disabled={isLoadingMore}
                    className="min-w-48 border border-primary bg-product-bg px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary hover:text-secondary disabled:cursor-wait disabled:opacity-55"
                  >
                    {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <SecondaryBannerGrid
          leftBanners={pos0Banners}
          rightBanners={pos1Banners}
          canLoadImages={isInitialDataLoaded}
        />

        <div className="page-container pb-8 lg:pb-12">
          <LazySection minHeight={220} className="mt-4 lg:mt-6">
            <section>
              <SectionHeader eyebrow="Navegue por" title="Departamentos" description="Encontre exatamente o que procura" icon={<HiOutlineSparkles size={20} />} accent="primary" onLinkClick={scrollToCatalog} />
              <CarouselCategoriaComImagem
                id="departamentos_home"
                onChange={(category) => handleSectionCategoryClick('departamentos_home', category)}
                selectedCategoryId={sectionCategories.departamentos_home}
                canLoadImages={isInitialDataLoaded}
              />
            </section>
          </LazySection>

          <div className="section-divider" />

          <LazySection minHeight={460}>
            <ProductSection
              id="maisprocurados_home"
              title="Tendências do momento"
              eyebrow="Mais procurados"
              description="O que todo mundo está olhando"
              icon={<MdTrendingUp size={22} />}
              accent="terciary"
              filtros="maisprocurados"
              selectedCategoryId={sectionCategories.maisprocurados_home}
              onCategoryChange={handleSectionCategoryClick}
              onLinkClick={scrollToCatalog}
            />
          </LazySection>

          {pos2Banners.length > 0 ? (
            <LazySection minHeight={220} className="mt-4 lg:mt-6">
              <SecondaryBannerCarousel banners={pos2Banners} canLoadImages={isInitialDataLoaded} className="h-[180px] md:h-[260px]" />
            </LazySection>
          ) : secondaryBanners.length === 0 && (
            <div className="mt-4 lg:mt-6"><FallbackBannerCard title="Destaques da loja" className="h-[150px] md:h-[220px]" /></div>
          )}

          <LazySection minHeight={230} className="mt-4 lg:mt-6">
            <section>
              <SectionHeader eyebrow="As que você ama" title="Marcas em destaque" description="Seleções para todos os estilos" icon={<MdWorkspacePremium size={20} />} accent="amber" onLinkClick={scrollToCatalog} />
              <CarouselMarcaComImagem
                id="marcas_home"
                onChange={(brand) => handleSectionBrandClick('marcas_home', brand)}
                selectedMarcaId={sectionMarcas.marcas_home}
                canLoadImages={isInitialDataLoaded}
              />
            </section>
          </LazySection>

          <div className="section-divider" />

          <LazySection minHeight={460}>
            <ProductSection
              id="novidades_home"
              title="Acabaram de chegar"
              eyebrow="Novidades"
              description="Lançamentos recém-chegados ao estoque"
              icon={<MdNewReleases size={22} />}
              accent="emerald"
              filtros="order_by=recente"
              selectedCategoryId={sectionCategories.novidades_home}
              onCategoryChange={handleSectionCategoryClick}
              onLinkClick={scrollToCatalog}
            />
          </LazySection>

          <div className="section-divider" />

          <LazySection minHeight={460}>
            <ProductSection
              id="maisvendidos_home"
              title="Mais vendidos"
              eyebrow="Preferidos dos clientes"
              description="Produtos que fazem sucesso na loja"
              icon={<MdLocalFireDepartment size={22} />}
              accent="rose"
              filtros="maisvendidos"
              selectedCategoryId={sectionCategories.maisvendidos_home}
              onCategoryChange={handleSectionCategoryClick}
              onLinkClick={scrollToCatalog}
            />
          </LazySection>
        </div>
      </main>

      <Footer />
      {isMobileFilterOpen && (
        <Suspense fallback={null}>
          <MobileFilterDrawer
            isOpen
            onClose={() => setIsMobileFilterOpen(false)}
            activeFilters={activeFilters}
            filterOptions={filterOptions}
            onApply={applyFilters}
          />
        </Suspense>
      )}
    </div>
  );
}

function getActiveFilterCount(filters: ActiveFilters) {
  return filters.marcas.length
    + filters.categorias.length
    + filters.cores.length
    + filters.tamanhos.length
    + Number(filters.minPreco !== undefined || filters.maxPreco !== undefined)
    + Number(filters.freteGratis)
    + Number(filters.promocao)
    + Number(Boolean(filters.pesquisa));
}

interface CatalogActiveFiltersProps {
  activeFilters: ActiveFilters;
  filterOptions: FilterOptions;
  onChange: (filters: ActiveFilters) => void;
}

function CatalogActiveFilters({ activeFilters, filterOptions, onChange }: CatalogActiveFiltersProps) {
  const chips: Array<{ key: string; label: string; remove: () => void }> = [];
  const addArrayChips = (
    type: 'categorias' | 'marcas' | 'cores' | 'tamanhos',
    values: Array<number | string>,
    getLabel: (value: number | string) => string,
  ) => {
    values.forEach((value) => chips.push({
      key: `${type}-${value}`,
      label: getLabel(value),
      remove: () => onChange({ ...activeFilters, [type]: activeFilters[type].filter((item: number | string) => item !== value) }),
    }));
  };

  addArrayChips('categorias', activeFilters.categorias, (value) => filterOptions.categorias.find((item) => Number(item.id) === Number(value))?.nome ?? String(value));
  addArrayChips('marcas', activeFilters.marcas, (value) => filterOptions.marcas.find((item) => Number(item.id) === Number(value))?.nome ?? String(value));
  addArrayChips('cores', activeFilters.cores, (value) => filterOptions.cores.find((item) => Number(item.id) === Number(value))?.nome ?? String(value));
  addArrayChips('tamanhos', activeFilters.tamanhos, (value) => `Tamanho ${value}`);

  if (activeFilters.pesquisa) {
    chips.push({
      key: 'pesquisa',
      label: `Busca: ${activeFilters.pesquisa}`,
      remove: () => onChange({ ...activeFilters, pesquisa: undefined }),
    });
  }

  if (activeFilters.freteGratis) chips.push({ key: 'frete', label: 'Frete grátis', remove: () => onChange({ ...activeFilters, freteGratis: false }) });
  if (activeFilters.promocao) chips.push({ key: 'promocao', label: 'Em promoção', remove: () => onChange({ ...activeFilters, promocao: false }) });
  if (activeFilters.minPreco !== undefined || activeFilters.maxPreco !== undefined) {
    chips.push({
      key: 'preco',
      label: 'Faixa de preço',
      remove: () => onChange({ ...activeFilters, minPreco: undefined, maxPreco: undefined }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-primary/10 pb-4">
      <span className="mr-1 text-xs font-medium uppercase tracking-[0.14em] text-primary/55">Filtros ativos</span>
      {chips.map((chip) => (
        <button key={chip.key} type="button" onClick={chip.remove} className="flex items-center gap-2 border border-primary/15 bg-product-bg px-3 py-1.5 text-xs text-primary transition-colors hover:border-terciary hover:text-terciary">
          {chip.label}<MdClose size={14} />
        </button>
      ))}
      <button type="button" onClick={() => onChange(defaultFilters)} className="px-2 py-1.5 text-xs font-semibold text-terciary hover:underline">
        Limpar tudo
      </button>
    </div>
  );
}

function SecondaryBannerGrid({ leftBanners, rightBanners, canLoadImages }: { leftBanners: Banner[]; rightBanners: Banner[]; canLoadImages: boolean }) {
  if (leftBanners.length === 0 && rightBanners.length === 0) return null;
  return (
    <section className="page-container pb-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {leftBanners.length > 0 && <SecondaryBannerCarousel banners={leftBanners} canLoadImages={canLoadImages} className="h-[190px] md:h-[230px]" />}
        {rightBanners.length > 0 && <SecondaryBannerCarousel banners={rightBanners} canLoadImages={canLoadImages} className="h-[190px] md:h-[230px]" />}
      </div>
    </section>
  );
}

function SecondaryBannerCarousel({ banners, canLoadImages, className }: { banners: Banner[]; canLoadImages: boolean; className: string }) {
  return (
    <Swiper modules={[EffectFade, Autoplay, Pagination]} slidesPerView={1} rewind={banners.length > 1} effect="fade" autoplay={{ delay: 5500, disableOnInteraction: false }} pagination={banners.length > 1 ? { clickable: true } : false} className="w-full overflow-hidden border border-primary/10 bg-primary/5">
      {banners.map((banner, index) => (
        <SwiperSlide key={banner.id}>
          <OptimizedImage src={banner.imagemUrl} fallbackSrc={getBannerImageFallback(`Banner ${index + 1}`)} alt={`Banner promocional ${index + 1}`} allowNetworkLoad={canLoadImages} className={`w-full object-cover ${className}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function LegacyHomePage() {
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
        ) : isInitialDataLoaded ? (
          <FallbackBannerCard
            title="Ofertas em destaque"
            className="h-[200px] md:h-[300px] lg:h-[450px]"
          />
        ) : (
          <SkeletonMainBanner />
        )}

        <div className="page-container mb-8 pt-4 lg:mb-12">
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
              <FilterToolbar
                totalProdutos={produtos?.length ?? 0}
                onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
                sortValue={activeFilters.ordenacao}
                onSortChange={(ordenacao) => applyFilters({ ...activeFilters, ordenacao })}
              />

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
                  {isInitialDataLoaded ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      <FallbackBannerCard title="Promocoes especiais" className="h-40 md:h-[200px] lg:h-40" />
                      <FallbackBannerCard title="Novidades da loja" className="h-40 md:h-[200px] lg:h-40" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      <SkeletonBanner />
                      <SkeletonBanner />
                    </div>
                  )}
                </section>
              ) : (pos0Banners.length > 0 || pos1Banners.length > 0) && (
                <section className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {pos0Banners.length > 0 && (
                      <Swiper
                        modules={[EffectFade, Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        rewind={pos0Banners.length > 1}
                        effect="fade"
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="w-full overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                      >
                        {pos0Banners.map((banner, index) => (
                          <SwiperSlide key={banner.id} className="h-auto!">
                            <div className="relative h-40 md:h-[200px] lg:h-40 bg-primary/8 overflow-hidden">
                              <OptimizedImage
                                src={banner.imagemUrl}
                                fallbackSrc={getBannerImageFallback(`Banner promocional ${index + 1}`)}
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
                        rewind={pos1Banners.length > 1}
                        effect="fade"
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        className="w-full overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                      >
                        {pos1Banners.map((banner, index) => (
                          <SwiperSlide key={banner.id} className="h-auto!">
                            <div className="relative h-40 md:h-[200px] lg:h-40 bg-primary/8 overflow-hidden">
                              <OptimizedImage
                                src={banner.imagemUrl}
                                fallbackSrc={getBannerImageFallback(`Banner promocional ${index + 1}`)}
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
                  {isInitialDataLoaded ? (
                    <FallbackBannerCard title="Destaques selecionados" className="h-[170px] md:h-[220px] lg:h-[200px]" />
                  ) : (
                    <SkeletonBanner aspect="aspect-[21/7]" />
                  )}
                </section>
              ) : pos2Banners.length > 0 && (
                <section className="mt-10">
                  <Swiper
                    modules={[EffectFade, Navigation, Autoplay]}
                    spaceBetween={10}
                    slidesPerView={1}
                    rewind={pos2Banners.length > 1}
                    effect="fade"
                    autoplay={{ delay: 7000, disableOnInteraction: false }}
                    className="w-full overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                  >
                    {pos2Banners.map((banner, index) => (
                      <SwiperSlide key={banner.id} className="h-auto!">
                        <div className="relative h-[170px] md:h-[220px] lg:h-[200px] bg-primary/8 overflow-hidden">
                          <OptimizedImage
                            src={banner.imagemUrl}
                            fallbackSrc={getBannerImageFallback(`Banner destaque ${index + 1}`)}
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

interface FallbackBannerCardProps {
  title: string;
  className: string;
}

function FallbackBannerCard({ title, className }: FallbackBannerCardProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-primary/8 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ${className}`}>
      <OptimizedImage
        src={undefined}
        fallbackSrc={getBannerImageFallback(title)}
        className="h-full w-full object-cover"
        alt={title}
      />
    </div>
  );
}

interface CarouselBannersPrincipaisProps {
  images: Banner[];
  canLoadImages: boolean;
}

function isMobileBanner(banner: Banner) {
  const bannerRecord = banner as Banner & {
    para_celular?: unknown;
    celular?: unknown;
    exibicao?: unknown;
    dispositivo?: unknown;
  };

  const rawValue = String(
    bannerRecord.paraCelular ??
    bannerRecord.para_celular ??
    bannerRecord.celular ??
    bannerRecord.exibicao ??
    bannerRecord.dispositivo ??
    ''
  );

  const normalizedValue = rawValue
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  return ['sim', 's', '1', 'true', 'celular', 'mobile'].includes(normalizedValue);
}

export function CarouselBannersPrincipais({ images, canLoadImages }: CarouselBannersPrincipaisProps) {
  // 1. Chama o hook para saber o estado atual
  const isMobile = useIsMobile();

  const prevButtonId = 'main-banner-prev';
  const nextButtonId = 'main-banner-next';

  // 2. Filtra as imagens baseado no estado
  const bannersFiltrados = (images ?? []).filter((v) => {
    if (isMobile) {
      return isMobileBanner(v) || !(images ?? []).some(isMobileBanner);
    } else {
      // Assume que se não for 'Sim', é para desktop (ou verifique se existe 'Não')
      return !isMobileBanner(v) || !(images ?? []).some((banner) => !isMobileBanner(banner));
    }
  });

  // Enquanto o dispositivo não foi determinado, mostra skeleton
  if (isMobile === null) return <SkeletonMainBanner />;

  const deviceMode = isMobile ? 'mobile' : 'desktop';
  const bannerHeightClass = isMobile
    ? 'h-[128px] min-[400px]:h-[138px] sm:h-[180px]'
    : 'h-[200px] md:h-[300px] lg:h-[450px]';

  // Se não houver banners para o dispositivo, não renderiza nada
  if (bannersFiltrados.length === 0) {
    return (
      <FallbackBannerCard
        title="Ofertas em destaque"
        className={bannerHeightClass}
      />
    );
  }

  return (
    <div className={`relative group w-full ${bannerHeightClass}`}>
      <Swiper
        key={deviceMode}
        className="main-banner-carousel w-full h-full"
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        slidesPerView={1}
        rewind={bannersFiltrados.length > 1}
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
          <SwiperSlide key={image.id} className="h-full!">
            <OptimizedImage
              src={image.imagemUrl}
              fallbackSrc={getBannerImageFallback(`Banner principal ${index + 1}`)}
              className={`${bannerHeightClass} w-full object-cover`}
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
        <SlArrowLeft className="text-secondary" size={14} />
      </div>
      <div
        className={`${nextButtonId} absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer border border-secondary/70 bg-primary/35 hover:bg-primary/80 hover:border-terciary flex justify-center items-center p-3 opacity-0 group-hover:opacity-100 transition-all duration-500`}
      >
        <SlArrowRight className="text-secondary" size={14} />
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
    <section className="section-shell fade-in-up my-4 border-y border-primary/10 bg-product-bg py-3 shadow-[0_4px_24px_rgba(0,0,0,0.035)]">
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

      <section className="my-3">
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
  imagePriority?: boolean;
}

export function CategoriaCard({ categoria, onClick, isSelected }: CategoriaCardProps) {
  return (
    <div
      className={`w-auto cursor-pointer border px-4 py-2 text-center text-xs font-medium transition-colors ${isSelected ? 'border-primary bg-primary text-secondary' : 'border-primary/20 bg-product-bg text-primary hover:border-terciary hover:text-terciary'}`}
      onClick={() => onClick && onClick(categoria)}
    >
      <p className="max-lg:text-sm lg:text-sm">{categoria.nome}</p>
    </div>
  );
}

export function CategoriaCardComImagem({ categoria, onClick, isSelected, canLoadImages = true, imagePriority = false }: CategoriaCardProps) {
  let navigate = useNavigate();
  const categoryImageFallback = getCategoryImageFallback(categoria.nome);
  const categoryImage = typeof categoria.imagem === "string" ? categoria.imagem.trim() : "";
  const hasCategoryImage = categoryImage.length > 0 && !/sem[-_]?foto/i.test(categoryImage);
  const [isImageLoading, setIsImageLoading] = useState(canLoadImages && hasCategoryImage);

  useEffect(() => {
    setIsImageLoading(canLoadImages && hasCategoryImage);
  }, [canLoadImages, categoryImage, hasCategoryImage]);

  return (
    <div
      className={`lift-hover flex w-52 cursor-pointer flex-col items-center gap-1 border bg-product-bg px-3 py-3 text-center ${isSelected ? 'border-terciary ring-1 ring-terciary/30' : 'border-primary/10 hover:border-terciary/50'}`}
      onClick={() => {
        navigate('/categoria/' + categoria.id);
      }}
    >
      <div
        className="relative h-32 w-full overflow-hidden bg-main-bg bg-cover bg-center"
        style={{ backgroundImage: `url("${categoryImageFallback}")` }}
      >
        {isImageLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-main-bg/70" aria-hidden="true">
            <div className="h-8 w-8 animate-pulse rounded-full border border-primary/15 bg-product-bg shadow-sm" />
          </div>
        )}
        <NormalizedProductImage
          src={hasCategoryImage ? categoryImage : undefined}
          fallbackSrc={categoryImageFallback}
          allowNetworkLoad={canLoadImages}
          normalizeContent={false}
          contentInset={12}
          priority={imagePriority}
          timeoutMs={4500}
          isLoading={isImageLoading}
          onLoad={() => setIsImageLoading(false)}
          alt={categoria.nome}
        />
      </div>
      <p className="mt-1 max-w-48 truncate text-sm font-medium text-primary">{categoria.nome}</p>
    </div>
  );
}

interface MarcaCardProps {
  marca: Marca;
  onClick?: (marca: Marca) => void;
  isSelected?: boolean;
  canLoadImages?: boolean;
}

export function MarcaCardComImagem({ marca, onClick, isSelected, canLoadImages = true }: MarcaCardProps) {
  let navigate = useNavigate();
  const fallbackMarcaImage = getBrandImageFallback(marca.nome);
  const shouldNormalizeImage = !!marca.imagem && !/sem[-_]?foto/i.test(marca.imagem);

  return (
    <div
      className={`group lift-hover flex h-full w-72 cursor-pointer flex-col overflow-hidden border bg-product-bg text-center ${isSelected ? 'border-terciary ring-1 ring-terciary/30' : 'border-primary/10 hover:border-terciary/50'}`}
      onClick={() => {
        navigate(`/marca/${marca.id}/${gerarSlug(marca.nome)}`);
      }}
    >
      <div className="relative h-40 w-full overflow-hidden bg-main-bg">
        <NormalizedProductImage
          src={shouldNormalizeImage ? marca.imagem : undefined}
          fallbackSrc={fallbackMarcaImage}
          allowNetworkLoad={canLoadImages}
          normalizeContent={shouldNormalizeImage}
          contentInset={16}
          alt={marca.nome}
        />
      </div>
      <p className="border-t border-primary/8 px-2 py-3 text-sm font-medium text-primary">{marca.nome}</p>
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
            className="product-card-carousel select-none"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <SwiperSlide key={index}>
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
          key={`${id}-${bannerData.filtros}`}
          modules={[Navigation]}
          navigation={{
            prevEl: `.${prevButtonId}`,
            nextEl: `.${nextButtonId}`,
          }}
          rewind={bannerData.produtos.length > 1}
          spaceBetween={16}
          slidesPerView={5}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            768: { slidesPerView: 3, spaceBetween: 10 },
            1024: { slidesPerView: 3, spaceBetween: 10 },
            1280: { slidesPerView: 4, spaceBetween: 10 },
            1536: { slidesPerView: 5, spaceBetween: 8 }
          }}
          className="product-card-carousel select-none"
        >
          {bannerData.produtos.map((produto) => (
            <SwiperSlide key={produto.id}>
              <ProductCard produto={produto} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className={`${prevButtonId} absolute left-3 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border border-primary/15 bg-product-bg p-2 text-primary shadow-md hover:border-terciary hover:text-terciary`}
        >
          <SlArrowLeft size={16} />
        </div>
        <div
          className={`${nextButtonId} absolute right-3 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border border-primary/15 bg-product-bg p-2 text-primary shadow-md hover:border-terciary hover:text-terciary`}
        >
          <SlArrowRight size={16} />
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
      <div className="relative w-full px-4">
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
    <div className="relative w-full px-4">
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
        className={`max-lg:hidden ${prevButtonId} absolute left-3 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border border-primary/15 bg-product-bg p-2 text-primary shadow-md hover:border-terciary hover:text-terciary ${navState.isBeginning || navState.isLocked ? 'hidden!' : ''}`}
      >
        <SlArrowLeft size={16} />
      </div>
      <div
        className={`max-lg:hidden ${nextButtonId} absolute right-3 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border border-primary/15 bg-product-bg p-2 text-primary shadow-md hover:border-terciary hover:text-terciary ${navState.isEnd || navState.isLocked ? 'hidden!' : ''}`}
      >
        <SlArrowRight size={16} />
      </div>
    </div>
  );
};

export function CarouselCategoriaComImagem({ id, onChange, selectedCategoryId, canLoadImages = true }: CarouselCategoriaProps) {
  const prevButtonId = `${id}-category-carousel-prev`;
  const nextButtonId = `${id}-category-carousel-next`;

  const { filterOptions, isLoadingSidebarFilters } = useHome();
  const categorias = filterOptions.categorias;

  useEffect(() => {
    if (!canLoadImages || typeof window === "undefined" || !categorias?.length) return;

    const preloadedImages = categorias
      .slice(0, 8)
      .map((categoria) => (typeof categoria.imagem === "string" ? categoria.imagem.trim() : ""))
      .filter((image) => image.length > 0 && !/sem[-_]?foto/i.test(image))
      .map((image) => {
        const preloadedImage = new Image();
        preloadedImage.decoding = "async";
        preloadedImage.src = image;
        return preloadedImage;
      });

    return () => {
      preloadedImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [canLoadImages, categorias]);

  if (!categorias || categorias.length <= 0) {
    if (!isLoadingSidebarFilters) {
      return (
        <p className="border border-primary/10 bg-product-bg px-4 py-6 text-sm text-primary/55">
          Nenhum departamento disponivel no momento.
        </p>
      );
    }

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
        rewind={categorias.length > 1}
        spaceBetween={16}
        slidesPerView={"auto"}
        breakpoints={{
          320: { spaceBetween: 10 },
          768: { spaceBetween: 10 },
          1024: { spaceBetween: 8 }
        }}
        className="select-none"
      >
        {categorias.map((categoria, index) => (
          <SwiperSlide key={`${id}-${categoria.id}`} className="whitespace-nowrap" style={{ height: 'auto', width: 'auto' }}>
            <CategoriaCardComImagem
              categoria={categoria as any}
              onClick={onChange}
              isSelected={selectedCategoryId === Number(categoria.id)}
              canLoadImages={canLoadImages}
              imagePriority={index < 8}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className={`max-lg:hidden ${prevButtonId} absolute left-3 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border border-primary/15 bg-product-bg p-2 text-primary shadow-md hover:border-terciary hover:text-terciary`}
      >
        <SlArrowLeft size={16} />
      </div>
      <div
        className={`max-lg:hidden ${nextButtonId} absolute right-3 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border border-primary/15 bg-product-bg p-2 text-primary shadow-md hover:border-terciary hover:text-terciary`}
      >
        <SlArrowRight size={16} />
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

  const { filterOptions, isLoadingSidebarFilters } = useHome();
  const marcas = filterOptions.marcas;

  if (!marcas || marcas.length <= 0) {
    if (!isLoadingSidebarFilters) {
      return (
        <p className="border border-primary/10 bg-product-bg px-4 py-6 text-sm text-primary/55">
          Nenhuma marca disponivel no momento.
        </p>
      );
    }

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
        rewind={marcas.length > 1}
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
        className={`max-lg:hidden ${prevButtonId} absolute left-3 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border border-primary/15 bg-product-bg p-2 text-primary shadow-md hover:border-terciary hover:text-terciary`}
      >
        <SlArrowLeft size={16} />
      </div>
      <div
        className={`max-lg:hidden ${nextButtonId} absolute right-3 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border border-primary/15 bg-product-bg p-2 text-primary shadow-md hover:border-terciary hover:text-terciary`}
      >
        <SlArrowRight size={16} />
      </div>
    </div>
  );
};


