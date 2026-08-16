"use client";

import React from "react";
import HeroSection from "@/components/HeroSection";
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import RecommendationSection from "@/components/RecommendationSection";
import PanicButton from "@/components/PanicButton";
import LiveCountBanner from "@/components/LiveCountBanner";
import GhostNotifications from "@/components/GhostNotifications";
import Footer from "@/components/Footer";
import StoriesBar from "@/components/StoriesBar";
import LiveMap from "@/components/LiveMap";
import AIAssistantOverlay from "@/components/AIAssistantOverlay";
import VIPLounge from "@/components/VIPLounge";
import GlobalLounge from "@/components/GlobalLounge";
import VIPGuide from "@/components/VIPGuide";
import PushPrompt from "@/components/PushPrompt";
import LocationGateway, { useLocationGateway } from "@/components/LocationGateway";
import MobileFiltersSheet from "@/components/MobileFiltersSheet";
import MobileSpeedDial from "@/components/MobileSpeedDial";
import SecretVaultTeaser from "@/components/SecretVaultTeaser";
import OccasionMatchmaker from "@/components/OccasionMatchmaker";
import LiveActivityToast from "@/components/LiveActivityToast";
import LiveClassifiedsFeed from "@/components/LiveClassifiedsFeed";
import GoldParticles from "@/components/GoldParticles";
import GentlemenClubSection from "@/components/GentlemenClubSection";
import HiddenModelsLounge from "@/components/HiddenModelsLounge";
import PanicDisguise from "@/components/PanicDisguise";
import MobileReelsFeed from "@/components/MobileReelsFeed";
import { Sliders, LayoutGrid, Film, Radio, MapPin, Sparkles, Flame, ShieldCheck } from "lucide-react";
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

          const extraModels = [
            { id: Math.random().toString(), name: 'Elena', age: 22, location: city1, imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', plan_type: 'Premium' },
            { id: Math.random().toString(), name: 'Sofía', age: 23, location: city2, imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800', isBoosted: true, plan_type: 'VIP Elite' },
            { id: Math.random().toString(), name: 'Gabriela', age: 25, location: city3, imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=800', plan_type: 'Diamante' },
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

  return (
    <>
      {/* Location Gateway — shown before home if no location saved */}
      {showGateway && (
        <LocationGateway onEnter={handleEnter} />
      )}

      <main className="min-h-screen bg-[#08080C] text-white selection:bg-brand-gold selection:text-brand-black overflow-x-hidden relative">
        {/* Ambient Interactive Gold Dust Canvas */}
        <GoldParticles />

        <Navbar currentCountry={currentCountry} onChangeLocation={resetLocation} />

        <StoriesBar />

        <HeroSection
          currentCountry={currentCountry}
          activeTag={activeTag}
          onSelectTag={handleSelectTag}
          onSelectLocation={(locName) => {
            if (!locName) {
              setDisplayModels(initialModels);
            } else {
              const clean = locName.split(" ")[0].toLowerCase();
              const filtered = initialModels.filter(m => 
                m.location.toLowerCase().includes(clean) || 
                (m.sector && m.sector.toLowerCase().includes(clean))
              );
              setDisplayModels(filtered.length > 0 ? filtered : initialModels);
            }
          }}
        />

        {/* ── TRI-MODE VIEW SWITCHER BAR (FUSION A + B + C) ── */}
        <div className="sticky top-16 z-30 py-3 backdrop-blur-xl bg-[#08080C]/85 border-y border-white/5 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
            
            {/* Mode buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setViewMode('grid');
                  const el = document.getElementById('collection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-brand-gold text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.4)] scale-105'
                    : 'glass-obsidian border border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <LayoutGrid size={13} />
                <span>Catálogo 4K</span>
              </button>

              {/* TikTok / Reels Mode Trigger */}
              <button
                onClick={() => {
                  setIsReelsOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider glass-obsidian border border-brand-pink/50 text-brand-pink hover:bg-brand-pink/10 transition-all shadow-[0_0_15px_rgba(255,0,98,0.25)] animate-pulse"
              >
                <Film size={13} />
                <span>🎬 Reels Feed (TikTok)</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('feed');
                  const el = document.getElementById('clasificados-feed');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'feed'
                    ? 'bg-brand-gold text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.4)]'
                    : 'glass-obsidian border border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Radio size={13} />
                <span>⚡ En Vivo</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('map');
                  const el = document.getElementById('mapa');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'map'
                    ? 'bg-brand-gold text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.4)]'
                    : 'glass-obsidian border border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <MapPin size={13} />
                <span>🗺️ Geo-Radar</span>
              </button>
            </div>

            {/* Mobile Touch Filters Button */}
            <button
              onClick={() => setIsFiltersSheetOpen(true)}
              className="px-3.5 py-2 rounded-xl glass-obsidian border border-brand-gold/40 text-brand-gold text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-lg"
            >
              <Sliders size={13} />
              <span className="hidden sm:inline">Filtros Táctiles</span>
            </button>
          </div>
        </div>

        {/* ── 1. MAIN COLLECTION GRID (IMMEDIATE FIRST VIEWPORT REWARD) ── */}
        <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-obsidian border border-brand-gold/30 mb-2">
                <Flame size={12} className="text-brand-gold animate-pulse" />
                <span className="text-[8px] uppercase font-black tracking-[0.3em] text-brand-gold">Directorio Selecto {currentCountry.name}</span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-4xl italic text-white">
                Modelos & Acompañantes <span className="text-gold-shimmer">VIP</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block">Disponibles</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-brand-gold">{displayModels.length} Perfiles</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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

        {/* ── 2. LIVE CLASSIFIEDS FEED (HIGH ENGAGEMENT) ── */}
        <div id="clasificados-feed">
          <LiveClassifiedsFeed currentCountry={currentCountry} />
        </div>

        {/* ── 3. GEO-RADAR LIVE MAP ── */}
        <div id="mapa">
          <LiveMap currentCountry={currentCountry} userLocation={location} />
        </div>

        {/* ── 4. RECOMMENDATIONS & OCCASIONS ── */}
        <RecommendationSection currentCountry={currentCountry} />

        <OccasionMatchmaker
          onSelectOccasion={(tagKeyword) => {
            if (!tagKeyword) {
              setDisplayModels(initialModels);
            } else {
              const filtered = initialModels.filter(m => 
                (m.tags && m.tags.some(t => t.toLowerCase().includes(tagKeyword.toLowerCase()))) ||
                (m.description && m.description.toLowerCase().includes(tagKeyword.toLowerCase())) ||
                (m.sector && m.sector.toLowerCase().includes(tagKeyword.toLowerCase()))
              );
              setDisplayModels(filtered.length > 0 ? filtered : initialModels);
            }
          }}
        />

        {/* ── 5. ELITE CLUBS & SECRET VAULT ── */}
        <GentlemenClubSection />
        <HiddenModelsLounge />
        <VIPLounge />
        <SecretVaultTeaser />
        <GlobalLounge />
        <VIPGuide />
        <PanicDisguise />

        {/* ── 6. MOBILE REELS FEED (TIKTOK / REELS OVERLAY) ── */}
        <MobileReelsFeed
          isOpen={isReelsOpen}
          onClose={() => setIsReelsOpen(false)}
        />

        <PanicButton />
        <GhostNotifications />
        <AIAssistantOverlay />
        <PushPrompt />
        <MobileSpeedDial />
        <LiveActivityToast />

        <MobileFiltersSheet
          isOpen={isFiltersSheetOpen}
          onClose={() => setIsFiltersSheetOpen(false)}
        />

        <Footer />
      </main>
    </>
  );
}
