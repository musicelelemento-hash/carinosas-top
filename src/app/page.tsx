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

import { supabase } from "@/lib/supabase";

const STATIC_MODELS = [
  { id: '1', name: 'Valentina', age: 21, location: 'Quito', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200'], isBoosted: true, plan_type: 'VIP Elite' },
  { id: '2', name: 'Camila', age: 23, location: 'Guayaquil', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200'], plan_type: 'Diamante' },
  { id: '3', name: 'Luciana', age: 22, location: 'Cuenca', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200'], plan_type: 'Premium' },
  { id: '4', name: 'Alessandra', age: 25, location: 'Manta', imageUrl: 'https://images.unsplash.com/photo-1503105391650-704fd6827a88?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1503105391650-704fd6827a88?auto=format&fit=crop&q=80&w=1200'], isBoosted: true, plan_type: 'VIP Elite' },
  { id: '5', name: 'Isabella', age: 24, location: 'Quito', imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1200'], plan_type: 'Anuncio Gratis' },
  { id: '6', name: 'Antonella', age: 26, location: 'Guayaquil', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800', images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200'], plan_type: 'Premium' },
];

export default function Home() {
  const [displayModels, setDisplayModels] = React.useState<any[]>(STATIC_MODELS);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchLiveModels() {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        const mappedLiveModels = data.map((m: any) => ({
          id: m.id,
          name: m.name,
          age: m.age,
          location: m.sector ? `${m.sector}, ${m.city}` : m.city,
          images: m.images && m.images.length > 0 ? m.images : [STATIC_MODELS[0].imageUrl],
          imageUrl: m.images && m.images[0] ? m.images[0] : STATIC_MODELS[0].imageUrl,
          isBoosted: m.plan_type === 'Diamante' || m.plan_type === 'VIP Elite',
          description: m.description,
          whatsapp: m.whatsapp,
          sector: m.sector,
          tags: m.tags,
          plan_type: m.plan_type,
          personal_note: m.personal_note || "Cada encuentro es una historia que merece ser contada con elegancia."
        }));
        
        const allModels = [...mappedLiveModels, ...STATIC_MODELS];
        
        const PLAN_PRIORITY: Record<string, number> = {
          'VIP Elite': 0,
          'Diamante': 1,
          'Premium': 2,
          'Anuncio Gratis': 3,
          'Básico': 3
        };
        
        allModels.sort((a, b) => {
          const pA = PLAN_PRIORITY[a.plan_type as string] ?? 99;
          const pB = PLAN_PRIORITY[b.plan_type as string] ?? 99;
          return pA - pB;
        });

        setDisplayModels(allModels);
      }
    }
    
    fetchLiveModels();
  }, []);

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
    <main className="min-h-screen bg-brand-black pb-0">
      <Navbar />
      
      <LiveCountBanner />
      <StoriesBar />

      <HeroSection />

      <LiveMap />
      
      <RecommendationSection />

      <VIPLounge />

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center gap-6 mb-24 px-4 overflow-hidden">
          <div className="h-[1px] bg-brand-gold/20 flex-1 translate-x-12" />
          <div className="flex flex-col items-center gap-2 relative">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-gold uppercase tracking-[0.5em] text-center italic">The Collection</h2>
            <span className="text-[10px] text-brand-white/30 uppercase tracking-[0.8em] font-black">Curated Human Identity</span>
            <div className="absolute -top-8 text-brand-gold/10 font-signature text-[100px] pointer-events-none select-none -z-10">
               Elite
            </div>
          </div>
          <div className="h-[1px] bg-brand-gold/20 flex-1 -translate-x-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
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
