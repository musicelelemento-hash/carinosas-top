"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import StoryModal from "./StoryModal";
import MobileReelsFeed from "./MobileReelsFeed";
import { Flame } from "lucide-react";
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
    <section className="w-full relative overflow-hidden bg-[#08080B] border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar" style={{ padding: "4px 20px 12px" }}>

          {/* Reels Trigger */}
          <button
            type="button"
            onClick={() => setIsReelsOpen(true)}
            className="flex-shrink-0 flex flex-col items-center gap-2 outline-none cursor-pointer"
          >
            <div className="relative w-[58px] h-[58px] rounded-full flex items-center justify-center border-2 border-brand-pink/60">
              <Flame size={18} className="text-brand-pink" />
            </div>
            <span className="text-[11px] text-white/90 font-medium">Reels</span>
          </button>

          {/* Vertical divider */}
          <div className="flex-shrink-0 h-12 w-[1px] bg-white/[0.1]" />

          {/* Model Stories — bezel oro plano */}
          {storiesList.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => setActiveStory(model)}
              className="flex-shrink-0 flex flex-col items-center gap-2 outline-none cursor-pointer relative"
            >
              <div className="relative w-[58px] h-[58px] rounded-full p-[2px] border-2 border-brand-gold">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-[#08080B]">
                  <Image
                    src={model.avatar}
                    alt={model.name}
                    fill
                    sizes="58px"
                    className="object-cover rounded-full"
                  />
                </div>

                {model.isOnline && (
                  <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-brand-green border-2 border-[#08080B]" />
                )}
              </div>

              <span className="text-[11px] text-white/90 font-medium block leading-tight">
                {model.name}
              </span>
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
