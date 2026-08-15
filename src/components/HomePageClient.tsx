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
import { Sliders } from "lucide-react";
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

        {/* ── HIGH DOPAMINE LIVE CLASSIFIEDS FEED ── */}
        <LiveClassifiedsFeed currentCountry={currentCountry} />

        <div id="mapa">
          <LiveMap currentCountry={currentCountry} userLocation={location} />
        </div>

        <RecommendationSection currentCountry={currentCountry} />

        {/* ── 5 OCCASIONS CONCIERGE MATCHMAKER ── */}
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

        {/* ── THE GENTLEMEN'S ALPHA CLUB EXPERIENCE ── */}
        <GentlemenClubSection />

        {/* ── SECRET HIDDEN MODELS (NON-PUBLIC) ── */}
        <HiddenModelsLounge />

        <VIPLounge />

        {/* ── SECRET VAULT 4K TEASER ── */}
        <SecretVaultTeaser />

        <GlobalLounge />

        {/* ── DISCREET PANIC DISGUISE MODE (ESC / 1-TAP) ── */}
        <PanicDisguise />

        <section id="collection" className="max-w-7xl mx-auto px-6 py-28">
          {/* Section header */}
          <div className="flex flex-col items-center gap-6 mb-16 relative">
            {/* Background signature */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="font-signature text-[180px] leading-none" style={{ color: 'rgba(212,168,67,0.03)' }}>Collection</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-obsidian border border-brand-gold/30 z-10 shadow-[0_0_20px_rgba(212,168,67,0.2)]">
              <span className="text-[9px] uppercase font-black tracking-[0.3em] text-brand-gold">Directorio Selecto</span>
            </div>

            {/* Title */}
            <h2 className="font-serif font-bold text-5xl md:text-6xl text-center italic leading-none tracking-tight z-10 bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-clip-text text-transparent">
              El Catálogo
            </h2>

            {/* Subtitle */}
            <p className="text-xs text-white/50 uppercase tracking-widest font-bold z-10 text-center">
              Filtra por nivel de exclusividad y discreción
            </p>

            {/* VIP Circle Quick Switch & Mobile Filters Button */}
            <div className="flex flex-wrap items-center justify-center gap-3 z-10">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-obsidian border border-white/10 shadow-2xl">
                <button
                  onClick={() => setDisplayModels(initialModels)}
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-black shadow-md"
                >
                  🌐 Catálogo General
                </button>
                <a
                  href="#vip-lounge"
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-brand-gold hover:text-white transition-colors flex items-center gap-1.5"
                >
                  🔒 Círculo Secreto VIP
                </a>
              </div>

              {/* Mobile Filter Sheet Trigger Button */}
              <button
                onClick={() => setIsFiltersSheetOpen(true)}
                className="md:hidden px-4 py-2.5 rounded-2xl glass-obsidian border border-brand-gold/40 text-brand-gold text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <Sliders size={14} />
                <span>Filtros Táctiles</span>
              </button>
            </div>

            {/* Divider */}
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent z-10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {displayModels.map((model) => (
              <ProfileCard key={model.id} {...model} />
            ))}
          </div>

          {isLoading && (
            <div className="mt-32 flex justify-center py-20">
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-2 border-brand-gold/10 rounded-full" />
                  <div className="absolute inset-0 border-t-2 border-brand-gold rounded-full animate-spin" />
                  <div className="absolute inset-4 border border-brand-gold/20 rounded-full animate-pulse" />
                </div>
                <span className="label-xs text-brand-gold/50 italic">Ampliando el Directorio...</span>
              </div>
            </div>
          )}
        </section>

        <VIPGuide />

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
