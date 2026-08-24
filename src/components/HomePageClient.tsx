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
import { Sliders, LayoutGrid, Film, Radio, MapPin } from "lucide-react";
import { type Country, getCountryById } from "@/lib/countries";

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
}

export default function HomePageClient({ initialModels }: HomePageClientProps) {
  const router = useRouter();
  const [displayModels, setDisplayModels] = React.useState<HomePageModel[]>(initialModels);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = React.useState(false);
  const { showGateway, location, handleEnter, resetLocation } = useLocationGateway();

  const currentCountry = React.useMemo(() => {
    return getCountryById(location?.countryId);
  }, [location?.countryId]);

  // When location changes or canton is picked, optionally prioritize models in that location
  React.useEffect(() => {
    if (location?.cantonName) {
      const cantonClean = location.cantonName.split(" ")[0].toLowerCase();
      const matched = initialModels.filter(m =>
        m.location.toLowerCase().includes(cantonClean) ||
        (m.sector && m.sector.toLowerCase().includes(cantonClean))
      );
      if (matched.length > 0) {
        setDisplayModels(matched);
      } else {
        setDisplayModels(initialModels);
      }
    } else {
      setDisplayModels(initialModels);
    }
  }, [location, initialModels]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          const sampleCities = Object.keys(currentCountry.mapPresets || {});
          const city1 = sampleCities[0] || (currentCountry.name === "Ecuador" ? "Quito" : "Medellín");
          const city2 = sampleCities[1] || (currentCountry.name === "Ecuador" ? "Guayaquil" : "Bogotá");
          const city3 = sampleCities[2] || (currentCountry.name === "Ecuador" ? "Cuenca" : "Cartagena");

          const extraModels: HomePageModel[] = [
            { id: Math.random().toString(), name: 'Elena', age: 22, location: city1, imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', plan_type: 'Premium', is_online: true, is_verified_4k: true },
            { id: Math.random().toString(), name: 'Sofía', age: 23, location: city2, imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800', isBoosted: true, plan_type: 'VIP Elite', is_online: true, is_verified_4k: true },
            { id: Math.random().toString(), name: 'Gabriela', age: 25, location: city3, imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=800', plan_type: 'Diamante', is_online: false, is_verified_4k: true },
          ];
          setDisplayModels(prev => [...prev, ...extraModels]);
          setIsLoading(false);
        }, 1500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, currentCountry]);

  const [activeTag, setActiveTag] = React.useState<string>("");

  const handleSelectTag = (tagKey: string) => {
    setActiveTag(tagKey);
    if (!tagKey) {
      setDisplayModels(initialModels);
      return;
    }
    const clean = tagKey.toLowerCase();
    let filtered: HomePageModel[] = [];

    if (clean === "vip") {
      filtered = initialModels.filter(m =>
        m.isBoosted ||
        m.plan_type === 'VIP Elite' ||
        m.plan_type === 'Diamante' ||
        m.plan_type === 'Oro'
      );
    } else if (clean === "verificada") {
      filtered = initialModels.filter(m => m.is_verified_4k);
    } else {
      filtered = initialModels.filter(m =>
        (m.tags && m.tags.some(t => t.toLowerCase().includes(clean))) ||
        (m.description && m.description.toLowerCase().includes(clean)) ||
        (m.sector && m.sector.toLowerCase().includes(clean)) ||
        (m.location && m.location.toLowerCase().includes(clean)) ||
        (m.name && m.name.toLowerCase().includes(clean))
      );
    }

    setDisplayModels(filtered.length > 0 ? filtered : initialModels);
  };

  const [isReelsOpen, setIsReelsOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'reels' | 'feed' | 'map'>('grid');
  const [desktopTab, setDesktopTab] = React.useState<'cerca' | 'online' | 'nuevas' | 'top'>('cerca');

  React.useEffect(() => {
    const openReels = () => setIsReelsOpen(true);
    window.addEventListener("open-reels-feed", openReels);
    return () => window.removeEventListener("open-reels-feed", openReels);
  }, []);

  const handleLocationSearch = (locName: string) => {
    if (!locName || locName === "Todas las Ciudades") {
      setDisplayModels(initialModels);
      return;
    }
    const clean = locName.toLowerCase().trim();
    const matched = initialModels.filter(m =>
      m.location.toLowerCase().includes(clean) ||
      (m.sector && m.sector.toLowerCase().includes(clean)) ||
      m.name.toLowerCase().includes(clean) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(clean))) ||
      (m.description && m.description.toLowerCase().includes(clean))
    );

    if (matched.length > 0) {
      setDisplayModels(matched);
    } else if (["pasaje", "santa rosa", "puerto bolívar", "huaquillas", "arenillas"].some(c => clean.includes(c))) {
      const elOroModels = initialModels.filter(m =>
        m.location.toLowerCase().includes("machala") ||
        (m.sector && m.sector.toLowerCase().includes("puerto"))
      );
      setDisplayModels(elOroModels.length > 0 ? elOroModels : initialModels);
    } else {
      setDisplayModels(initialModels);
    }
  };

  const handleDesktopTab = (tab: 'cerca' | 'online' | 'nuevas' | 'top') => {
    setDesktopTab(tab);
    if (tab === 'cerca') {
      if (location?.cantonName) {
        const cantonClean = location.cantonName.split(" ")[0].toLowerCase();
        const matched = initialModels.filter(m =>
          m.location.toLowerCase().includes(cantonClean) ||
          (m.sector && m.sector.toLowerCase().includes(cantonClean))
        );
        setDisplayModels(matched.length > 0 ? matched : initialModels);
      } else {
        setDisplayModels(initialModels);
      }
    } else if (tab === 'online') {
      const onlineModels = initialModels.filter(m => m.is_online);
      setDisplayModels(onlineModels.length > 0 ? onlineModels : initialModels);
    } else if (tab === 'nuevas') {
      const sortedNewest = [...initialModels].sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return b.id.localeCompare(a.id);
      });
      setDisplayModels(sortedNewest);
    } else if (tab === 'top') {
      handleSelectTag('vip');
    }
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

        <div id="collection">
          <div className="lg:hidden">
            <MobileHomeFeed models={displayModels} />
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
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    {[
                      { id: 'cerca' as const, label: 'Cerca de mí' },
                      { id: 'online' as const, label: 'En línea' },
                      { id: 'nuevas' as const, label: 'Nuevas' },
                      { id: 'top' as const, label: 'Top semana' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleDesktopTab(t.id)}
                        className="px-3.5 py-2 rounded-full text-[13px] font-semibold transition-colors"
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
                    <span className="w-[7px] h-[7px] rounded-full bg-brand-pink block om-breathe" />
                    <span>{displayModels.length} en línea ahora</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 lg:gap-x-[18px] lg:gap-y-[18px]">
                  {displayModels.map((model) => (
                    <ProfileCard key={model.id} {...model} />
                  ))}
                </div>

                {isLoading && (
                  <div className="mt-20 flex justify-center py-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-2 border-brand-gold/10 rounded-full" />
                        <div className="absolute inset-0 border-t-2 border-brand-gold rounded-full animate-spin" />
                      </div>
                      <span className="text-[10px] text-brand-gold/60 italic font-mono uppercase tracking-widest">Cargando más perfiles...</span>
                    </div>
                  </div>
                )}
              </section>

              {/* ── RADAR EN VIVO: panel fijo a la derecha ── */}
              <aside id="mapa" className="lg:sticky lg:top-16">
                <LiveMap variant="panel" currentCountry={currentCountry} userLocation={location} />
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
        />

        <Footer />
      </main>
    </>
  );
}
