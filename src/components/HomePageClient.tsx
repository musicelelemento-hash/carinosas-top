"use client";

import React from "react";
import HeroSection from "@/components/HeroSection";
import ProfileCard from "@/components/ProfileCard";
import Navbar from "@/components/Navbar";
import RecommendationSection from "@/components/RecommendationSection";
import PanicButton from "@/components/PanicButton";
import AvailabilityChat from "@/components/AvailabilityChat";
import LiveCountBanner from "@/components/LiveCountBanner";
import GhostNotifications from "@/components/GhostNotifications";
import Footer from "@/components/Footer";
import StoriesBar from "@/components/StoriesBar";
import LiveMap from "@/components/LiveMap";
import AIAssistantOverlay from "@/components/AIAssistantOverlay";
import VIPLounge from "@/components/VIPLounge";
import PushPrompt from "@/components/PushPrompt";

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

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          const extraModels = [
            { id: Math.random().toString(), name: 'Elena', age: 22, location: 'Quito', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', plan_type: 'Premium' },
            { id: Math.random().toString(), name: 'Sofía', age: 23, location: 'Manta', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800', isBoosted: true, plan_type: 'VIP Elite' },
            { id: Math.random().toString(), name: 'Gabriela', age: 25, location: 'Cuenca', imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=800', plan_type: 'Diamante' },
          ];
          setDisplayModels(prev => [...prev, ...extraModels]);
          setIsLoading(false);
        }, 1500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  return (
    <main className="min-h-screen bg-mesh pb-0">
      <Navbar />
      
      <LiveCountBanner />
      <StoriesBar />

      <HeroSection />

      <div id="mapa">
        <LiveMap />
      </div>
      
      <RecommendationSection />

      <VIPLounge />

      <section id="collection" className="max-w-7xl mx-auto px-6 py-28">
        {/* Section header */}
        <div className="flex flex-col items-center gap-6 mb-28 relative">
          {/* Background signature */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="font-signature text-[180px] leading-none" style={{ color: 'rgba(201,168,76,0.03)' }}>Collection</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-gold z-10">
            <span className="text-[8px] font-black uppercase tracking-[0.55em] text-brand-gold/60">Curated Human Identity</span>
          </div>

          {/* Title */}
          <h2 className="font-serif font-bold text-5xl md:text-6xl text-center italic leading-none tracking-tight z-10" style={{
            background: 'linear-gradient(135deg, #F5E0A0 0%, #C9A84C 35%, #9A7B35 65%, #C9A84C 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer-gold 6s linear infinite',
          }}>The Collection</h2>

          {/* Divider */}
          <div className="divider-gold w-40 z-10" />
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
              <span className="text-[11px] text-brand-gold/40 uppercase tracking-[0.6em] font-black italic">Expanding the Directory...</span>
            </div>
          </div>
        )}
      </section>

      <PanicButton />
      <AvailabilityChat />
      <GhostNotifications />
      <AIAssistantOverlay />
      <PushPrompt />

      <Footer />
    </main>
  );
}
