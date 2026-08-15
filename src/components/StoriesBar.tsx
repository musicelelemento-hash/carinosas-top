"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import StoryModal from "./StoryModal";
import MobileReelsFeed from "./MobileReelsFeed";
import { Flame, Sparkles } from "lucide-react";
import { getActiveStoriesAction, type StoryItem } from "@/app/actions/stories";

interface StoryCardItem {
  id: string;
  name: string;
  age: number;
  city: string;
  sector: string;
  avatar: string;
  story: string;
  audioName?: string;
  whatsapp?: string;
  isOnline: boolean;
}

const FALLBACK_STORIES: StoryCardItem[] = [
  { 
    id: '1', 
    name: 'Valentina S.', 
    age: 24,
    city: 'Quito', 
    sector: 'Quito Norte (Hotel 5★)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', 
    story: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200', 
    audioName: 'Voz de Valentina',
    whatsapp: '593987654321',
    isOnline: true
  },
  { 
    id: '2', 
    name: 'Camila R.', 
    age: 22,
    city: 'Guayaquil', 
    sector: 'Samborondón',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', 
    story: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200',
    audioName: 'Voz de Camila',
    whatsapp: '593987654322',
    isOnline: true
  },
  { 
    id: '3', 
    name: 'Luciana M.', 
    age: 25,
    city: 'Cuenca', 
    sector: 'Centro Histórico',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', 
    story: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
    audioName: 'Voz de Luciana',
    whatsapp: '593987654323',
    isOnline: true
  },
  { 
    id: '4', 
    name: 'Elena V.', 
    age: 23,
    city: 'Manta', 
    sector: 'Plaza del Sol',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 
    story: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200',
    audioName: 'Voz de Elena',
    whatsapp: '593987654324',
    isOnline: true
  },
  { 
    id: '5', 
    name: 'Sofía K.', 
    age: 26,
    city: 'Salinas', 
    sector: 'Chipipe VIP',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', 
    story: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1200',
    audioName: 'Voz de Sofía',
    whatsapp: '593987654325',
    isOnline: true
  },
];

export default function StoriesBar() {
  const [storiesList, setStoriesList] = useState<StoryCardItem[]>(FALLBACK_STORIES);
  const [activeStory, setActiveStory] = useState<StoryCardItem | null>(null);
  const [isReelsOpen, setIsReelsOpen] = useState(false);

  useEffect(() => {
    async function loadLiveStories() {
      try {
        const liveStories = await getActiveStoriesAction();
        if (liveStories && liveStories.length > 0) {
          const mapped: StoryCardItem[] = liveStories.map((s: StoryItem) => ({
            id: s.id,
            name: s.model_name || "Modelo VIP",
            age: 22,
            city: "Ecuador VIP",
            sector: s.caption || "Disponible 4K",
            avatar: s.media_url,
            story: s.media_url,
            audioName: `Historia de ${s.model_name || 'Modelo'}`,
            isOnline: true
          }));
          setStoriesList(mapped);
        }
      } catch (err) {
        console.warn("Live stories fetch notice:", err);
      }
    }
    loadLiveStories();
  }, []);

  return (
    <section className="w-full relative overflow-hidden bg-[#0A0A0F]/80 backdrop-blur-2xl border-b border-brand-gold/15">
      {/* Top Hairline Gold Glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-5 overflow-x-auto no-scrollbar py-4">

          {/* LIVE badge & Reels Trigger */}
          <button
            type="button"
            onClick={() => setIsReelsOpen(true)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group outline-none cursor-pointer"
          >
            <div className="relative w-[68px] h-[68px] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border-2 border-dashed border-brand-pink/60 bg-brand-pink/10 shadow-[0_0_15px_rgba(255,0,98,0.2)]">
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-pink border-2 border-black pulse-crimson" />
              <div className="text-center">
                <Flame size={18} className="text-brand-pink fill-brand-pink mx-auto mb-0.5 animate-pulse" />
                <span className="text-[7px] text-white font-black uppercase tracking-wider block">REELS 4K</span>
              </div>
            </div>
            <span className="text-[10px] text-brand-pink font-bold group-hover:text-white uppercase tracking-wider transition-colors">
              🔥 Ver Reels
            </span>
          </button>

          {/* Vertical divider */}
          <div className="flex-shrink-0 h-12 w-[1px] bg-white/10" />

          {/* Model Stories with Beveled Rotating Gold Bezel */}
          {storiesList.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => setActiveStory(model)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group outline-none cursor-pointer relative"
            >
              {/* Rotating Bezel container */}
              <div className="relative w-[68px] h-[68px] rounded-full p-[2px] bg-gradient-to-tr from-[#D4A843] via-[#FFE088] to-[#9A7830] group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(212,168,67,0.25)] group-hover:shadow-[0_0_25px_rgba(212,168,67,0.5)]">
                
                {/* Inner Black Gap */}
                <div className="w-full h-full rounded-full p-[2px] bg-[#08080C] overflow-hidden relative">
                  <Image
                    src={model.avatar}
                    alt={model.name}
                    fill
                    sizes="68px"
                    className="object-cover rounded-full group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                </div>

                {/* Soundwave badge for audio preview */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/90 border border-brand-gold/40 text-[7px] text-brand-gold font-bold flex items-center gap-0.5 shadow-md">
                  <span className="w-0.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
                  <span className="w-0.5 h-2.5 bg-brand-gold rounded-full animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-brand-gold rounded-full animate-pulse delay-150" />
                </div>

                {/* Live Neon Crimson Dot */}
                <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
              </div>

              {/* Name & City */}
              <div className="text-center">
                <span className="text-[11px] text-white/90 group-hover:text-brand-gold font-medium block leading-tight transition-colors">
                  {model.name}
                </span>
                <span className="text-[8px] text-brand-gold/70 uppercase tracking-widest font-black block mt-0.5">
                  {model.city}
                </span>
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <StoryModal
          isOpen={Boolean(activeStory)}
          story={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}

      {/* Full-Screen 4K Reels Feed Modal */}
      <MobileReelsFeed
        isOpen={isReelsOpen}
        onClose={() => setIsReelsOpen(false)}
      />
    </section>
  );
}
