"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import PanicButton from "@/components/PanicButton";
import Footer from "@/components/Footer";
import StoriesBar from "@/components/StoriesBar";
import LiveMap from "@/components/LiveMap";
import AIAssistantOverlay from "@/components/AIAssistantOverlay";
import LocationGateway, { useLocationGateway } from "@/components/LocationGateway";
import MobileFiltersSheet from "@/components/MobileFiltersSheet";
import MobileReelsFeed from "@/components/MobileReelsFeed";
import TerminalSidebar from "@/components/TerminalSidebar";
import MobileHomeFeed from "@/components/MobileHomeFeed";
import { EmptyState } from "@/components/ui/VisualComponents";
import { Sliders, LayoutGrid, Film, Radio, MapPin } from "lucide-react";
import { getCountryById } from "@/lib/countries";
import { getModelCatalogPageAction } from "@/app/actions/catalog";
import type { ModelCatalogCursor, ModelCatalogFilters } from "@/lib/modelCatalog";

interface HomePageModel {
  id: string;
  name: string;
  age: number;
  location: string;
  imageUrl?: string;
  images?: string[];
  isBoosted?: boolean;
  is_verified_4k?: boolean;
  is_online?: boolean;
  country_code?: string;
  created_at?: string;
  voice_greeting_url?: string;
  description?: string | null;
  whatsapp?: string;
  sector?: string | null;
  tags?: string[] | null;
  plan_type?: string;
  personal_note?: string;
}

interface HomePageClientProps {
  initialModels: HomePageModel[];
  initialCursor: ModelCatalogCursor | null;
  initialHasMore: boolean;
  initialError: boolean;
}

export default function HomePageClient({ initialModels, initialCursor, initialHasMore, initialError }: HomePageClientProps) {
  const router = useRouter();
  const [displayModels, setDisplayModels] = React.useState<HomePageModel[]>(initialModels);
  const [cursor, setCursor] = React.useState<ModelCatalogCursor | null>(initialCursor);
  const [hasMore, setHasMore] = React.useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = React.useState(false);
  const [loadMoreError, setLoadMoreError] = React.useState(initialError ? "No se pudo conectar con el catálogo. Inténtalo de nuevo." : "");
  const [catalogFilters, setCatalogFilters] = React.useState<ModelCatalogFilters>({});
  const requestSequence = React.useRef(0);
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = React.useState(false);
  const { showGateway, location, handleEnter, resetLocation } = useLocationGateway();

  const currentCountry = React.useMemo(() => {
    return getCountryById(location?.countryId);
  }, [location?.countryId]);

  // P0 anti-fachada: se ELIMINÓ la inyección de modelos falsos ("Elena", "Sofía",
  // "Gabriela" con id: Math.random()) que simulaba un scroll infinito con perfiles
  // inexistentes marcados como "verificados 4K". La confianza es el diferenciador
  // del producto; mostrar perfiles falsos la destruye.
  const loadCatalog = React.useCallback(async (filters: ModelCatalogFilters) => {
    const requestId = ++requestSequence.current;
    setIsLoadingCatalog(true);
    setLoadMoreError("");
    try {
      const page = await getModelCatalogPageAction(null, filters);
      if (requestId !== requestSequence.current) return;
      if (page.error) {
        setLoadMoreError("No se pudo cargar el catálogo. Inténtalo de nuevo.");
        return;
      }
      setCatalogFilters(filters);
      setDisplayModels(page.models);
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch {
      if (requestId === requestSequence.current) {
        setLoadMoreError("No se pudieron cargar los perfiles. Inténtalo de nuevo.");
      }
    } finally {
      if (requestId === requestSequence.current) setIsLoadingCatalog(false);
    }
  }, []);

  React.useEffect(() => {
    if (location?.cantonName) {
      void loadCatalog({ city: location.cantonName });
    }
  }, [location?.cantonName, loadCatalog]);

  const [isReelsOpen, setIsReelsOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'reels' | 'feed' | 'map'>('grid');
  const [desktopTab, setDesktopTab] = React.useState<'cerca' | 'online' | 'nuevas' | 'top'>('cerca');
  const canLoadMore = hasMore;

  const loadMore = async () => {
    if (!cursor || !canLoadMore || isLoadingMore || isLoadingCatalog) return;
    setIsLoadingMore(true);
    setLoadMoreError("");
    const requestId = requestSequence.current;
    try {
      const page = await getModelCatalogPageAction(cursor, catalogFilters);
      if (requestId !== requestSequence.current) return;
      if (page.error) {
        setLoadMoreError("No se pudo cargar la siguiente página. Inténtalo de nuevo.");
        return;
      }
      setDisplayModels((current) => [...current, ...page.models]);
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
      if (page.hasMore && !page.nextCursor) {
        setLoadMoreError("No se pudo continuar la carga. Inténtalo de nuevo más tarde.");
        setHasMore(false);
      }
    } catch {
      setLoadMoreError("No se pudo cargar la siguiente página. Inténtalo de nuevo.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  React.useEffect(() => {
    const openReels = () => setIsReelsOpen(true);
    window.addEventListener("open-reels-feed", openReels);
    return () => window.removeEventListener("open-reels-feed", openReels);
  }, []);

  const handleLocationSearch = (locName: string) => {
    if (!locName || locName === "Todas las Ciudades") {
      setDesktopTab("cerca");
      void loadCatalog(location?.cantonName ? { city: location.cantonName } : {});
      return;
    }
    setDesktopTab("cerca");
    void loadCatalog({ query: locName.trim() });
  };

  const handleDesktopTab = (tab: 'cerca' | 'online' | 'nuevas' | 'top') => {
    setDesktopTab(tab);
    if (tab === "online") void loadCatalog({ online: true });
    else if (tab === "top") void loadCatalog({ vip: true });
    else if (tab === "nuevas") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      void loadCatalog({ createdAfter: weekAgo });
    } else void loadCatalog(location?.cantonName ? { city: location.cantonName } : {});
  };

  const handleMobileQuickFilter = (filter: "city" | "online" | "week") => {
    const localCity = location?.cantonName ? { city: location.cantonName } : {};
    if (filter === "online") {
      void loadCatalog({ ...localCity, online: true });
    } else if (filter === "week") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      void loadCatalog({ ...localCity, createdAfter: weekAgo });
    } else {
      void loadCatalog(localCity);
    }
  };

  const handleApplyMobileFilters = (filters: { maxRate: number; onlyOnline: boolean; only4K: boolean; onlyVIP: boolean; category: string }) => {
    setDesktopTab("cerca");
    const next: ModelCatalogFilters = { maxHourlyRate: filters.maxRate };
    if (filters.onlyOnline) next.online = true;
    if (filters.only4K) next.verified4k = true;
    if (filters.onlyVIP) next.vip = true;
    if (filters.category !== "Todas") next.query = filters.category;
    void loadCatalog(next);
  };

  return (
    <>
      {/* Location Gateway — shown before home if no location saved */}
      {showGateway && (
        <LocationGateway onEnter={handleEnter} />
      )}

      <main className="min-h-screen bg-[#08080B] text-white selection:bg-brand-gold selection:text-brand-black overflow-x-hidden relative">
        <Navbar currentCountry={currentCountry} onChangeLocation={resetLocation} onSearch={handleLocationSearch} />

        {/* ── Solo mobile: historias + feed, home = feed (spec) ── */}
        <div className="lg:hidden">
          <StoriesBar />
        </div>

        <section aria-labelledby="home-title" className="mx-auto max-w-7xl px-4 pb-5 pt-7 sm:px-6 lg:pb-8 lg:pt-12">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold/80">
            Directorio · {currentCountry?.name || "Tu zona"}
          </p>
          <h1 id="home-title" className="max-w-3xl text-pretty font-serif text-[32px] font-medium leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Perfiles para conocer. Información para decidir.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
            Compara ubicación, disponibilidad y detalles publicados. Contacta cuando encuentres un perfil que te interese.
          </p>
        </section>

        <div id="collection">
          <div className="lg:hidden">
            <MobileHomeFeed
              models={displayModels}
              onQuickFilter={handleMobileQuickFilter}
              isLoading={isLoadingCatalog}
              error={loadMoreError}
              onRetry={() => void loadCatalog(catalogFilters)}
            />
            {canLoadMore && (
              <div className="flex flex-col items-center gap-3 px-4 py-6">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore || isLoadingCatalog}
                  className="rounded-full border border-brand-gold/50 px-6 py-3 text-sm font-semibold text-brand-gold disabled:opacity-60"
                >
                  {isLoadingMore ? "Cargando perfiles…" : "Cargar más perfiles"}
                </button>
                {loadMoreError && <p role="alert" className="text-center text-sm text-red-300">{loadMoreError}</p>}
              </div>
            )}
          </div>

          {/* ── TERMINAL: sidebar + grid + radar en vivo — solo desktop ── */}
          <div className="hidden lg:flex lg:items-start">
            <TerminalSidebar
              models={displayModels}
              onOpenReels={() => setIsReelsOpen(true)}
              onOpenRadar={() => document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' })}
            />

            <div className="flex-1 min-w-0 lg:pt-6 lg:px-[26px] lg:pb-10 lg:grid lg:grid-cols-[1fr_372px] lg:gap-0 lg:items-start">
              <section>
                {isLoadingCatalog && <p role="status" className="mb-3 text-sm text-white/60">Actualizando perfiles…</p>}
                {loadMoreError && !isLoadingMore && <p role="alert" className="mb-3 text-sm text-red-300">{loadMoreError}</p>}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    {[
                      { id: 'cerca' as const, label: 'En mi ciudad' },
                      { id: 'online' as const, label: 'En línea' },
                      { id: 'nuevas' as const, label: 'Esta semana' },
                      { id: 'top' as const, label: 'VIP' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleDesktopTab(t.id)}
                        aria-pressed={desktopTab === t.id}
                        className="rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors hover:border-brand-gold/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                        style={{
                          background: desktopTab === t.id ? '#D4A843' : 'transparent',
                          color: desktopTab === t.id ? '#08080B' : 'rgba(240,240,236,.72)',
                          border: `1px solid ${desktopTab === t.id ? '#D4A843' : 'rgba(255,255,255,.12)'}`,
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-white/45">
                    <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-emerald-400" />
                    <span>{displayModels.filter(m => m.is_online).length} en línea en esta página</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 lg:gap-x-[18px] lg:gap-y-[18px]">
                {displayModels.length === 0 && isLoadingCatalog ? (
                  <p role="status" className="col-span-full py-12 text-center text-sm text-white/60">Cargando perfiles…</p>
                ) : displayModels.length === 0 && loadMoreError ? (
                  null
                ) : displayModels.length === 0 ? (
                    <EmptyState
                      title="Sin perfiles disponibles aún"
                      subtitle="No hay perfiles que coincidan con esta selección. Prueba otros filtros o cambia de ciudad."
                      action={{
                        label: "Cambiar ciudad",
                        onClick: () => resetLocation(),
                      }}
                    />
                  ) : (
                    displayModels.map((model) => (
                      <ProfileCard key={model.id} {...model} />
                    ))
                  )}
                </div>

                {canLoadMore && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={isLoadingMore || isLoadingCatalog}
                      className="rounded-full border border-brand-gold/50 px-6 py-3 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/10 disabled:cursor-wait disabled:opacity-60"
                    >
                      {isLoadingMore ? "Cargando perfiles…" : "Cargar más perfiles"}
                    </button>
                    {loadMoreError && <p role="alert" className="text-sm text-red-300">{loadMoreError}</p>}
                  </div>
                )}

              </section>

              {/* ── RADAR EN VIVO: panel fijo a la derecha ── */}
              <aside id="mapa" className="lg:sticky lg:top-16">
            <LiveMap variant="panel" currentCountry={currentCountry} />
              </aside>
            </div>
          </div>
        </div>

        {/* ── TRI-MODE VIEW SWITCHER BAR — solo mobile ── */}
        <div className="lg:hidden sticky top-14 z-30 py-3 backdrop-blur-xl bg-[#08080B]/85 border-y border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setViewMode('grid');
                  const el = document.getElementById('collection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-brand-gold text-brand-black'
                    : 'border border-white/[0.1] text-white/70 hover:text-white'
                }`}
              >
                <LayoutGrid size={13} />
                <span>Catálogo</span>
              </button>

              <button
                onClick={() => setIsReelsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border border-brand-pink/50 text-brand-pink transition-colors"
              >
                <Film size={13} />
                <span>Reels</span>
              </button>

              <button
                onClick={() => router.push('/radar')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border border-white/[0.1] text-white/70 hover:text-white transition-colors"
              >
                <Radio size={13} />
                <span>Radar</span>
              </button>

              <button
                onClick={() => router.push('/radar?vista=mapa')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border border-white/[0.1] text-white/70 hover:text-white transition-colors"
              >
                <MapPin size={13} />
                <span>Mapa</span>
              </button>
            </div>

            <button
              onClick={() => setIsFiltersSheetOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-brand-gold/40 text-brand-gold text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
            >
              <Sliders size={13} />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
        </div>

        {/* ── MOBILE REELS FEED (overlay) ── */}
        <MobileReelsFeed
          isOpen={isReelsOpen}
          onClose={() => setIsReelsOpen(false)}
        />

        <PanicButton />
        <AIAssistantOverlay />

          <MobileFiltersSheet
          isOpen={isFiltersSheetOpen}
          onClose={() => setIsFiltersSheetOpen(false)}
          onApplyFilters={handleApplyMobileFilters}
        />

        <Footer />
      </main>
    </>
  );
}
