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

import { supabase } from "@/lib/supabase";

// In a real app, this would be fetched from Supabase, now we connect it!
const STATIC_MODELS = [
  { id: '1', name: 'Valentina', age: 21, location: 'Quito', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', isBoosted: true },
  { id: '2', name: 'Camila', age: 23, location: 'Guayaquil', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800' },
  { id: '3', name: 'Luciana', age: 22, location: 'Cuenca', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800' },
  { id: '4', name: 'Alessandra', age: 25, location: 'Manta', imageUrl: 'https://images.unsplash.com/photo-1503105391650-704fd6827a88?auto=format&fit=crop&q=80&w=800', isBoosted: true },
  { id: '5', name: 'Isabella', age: 24, location: 'Quito', imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800' },
  { id: '6', name: 'Antonella', age: 26, location: 'Guayaquil', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800' },
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
        // Map Supabase fields to the UI expected format if needed
        const mappedLiveModels = data.map((m: any) => ({
          id: m.id,
          name: m.name,
          age: m.age,
          location: m.sector ? `${m.sector}, ${m.city}` : m.city,
          imageUrl: m.images && m.images[0] ? m.images[0] : STATIC_MODELS[0].imageUrl,
          isBoosted: m.plan_type === 'Diamante',
          description: m.description,
          whatsapp: m.whatsapp,
          sector: m.sector
        }));
        
        // Merge live models with static ones in the beginning for a full directory
        setDisplayModels([...mappedLiveModels, ...STATIC_MODELS]);
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
            { id: Math.random().toString(), name: 'Elena', age: 22, location: 'Quito', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800' },
            { id: Math.random().toString(), name: 'Sofía', age: 23, location: 'Manta', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800', isBoosted: true },
            { id: Math.random().toString(), name: 'Gabriela', age: 25, location: 'Cuenca', imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=800' },
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
      
      {/* Social Proof Header */}
      <LiveCountBanner />

      {/* Instagram-style Stories */}
      <StoriesBar />

      <HeroSection />

      {/* Uber-style Live Map */}
      <LiveMap />
      
      {/* Smart Recommendations */}
      <RecommendationSection />

      {/* Main Directory Grid with Infinite Scroll */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-20 px-4">
          <div className="h-px bg-brand-gold/10 flex-1" />
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-2xl font-serif text-brand-gold uppercase tracking-[0.4em] text-center">ELITE DIRECTORY</h2>
            <span className="text-[10px] text-brand-white/30 uppercase tracking-[0.5em] font-black">Luxury Access Only</span>
          </div>
          <div className="h-px bg-brand-gold/10 flex-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {displayModels.map((model) => (
            <ProfileCard key={model.id} {...model} />
          ))}
        </div>

        {/* Infinite Scroll Loader */}
        {isLoading && (
          <div className="mt-20 flex justify-center py-10 animate-in fade-in duration-500">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-brand-gold/10 border-t-brand-gold rounded-full animate-spin" />
              <span className="text-[10px] text-brand-gold/40 uppercase tracking-[0.4em] font-black">Cargando Élite Adicional...</span>
            </div>
          </div>
        )}
      </section>

      {/* Futuristic Floating Elements */}
      <PanicButton />
      <AvailabilityChat />
      <GhostNotifications />
      <AIAssistantOverlay />

      <Footer />
    </main>
  );
}
