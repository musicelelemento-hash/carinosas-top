"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import StoryModal from "./StoryModal";
import MobileReelsFeed from "./MobileReelsFeed";
import { Flame } from "lucide-react";
import { getActiveStoriesAction, type StoryItem } from "@/app/actions/stories";

interface StoryCardItem {
  id: string;
  modelId: string;
  name: string;
  age: number;
  city: string;
  sector: string;
  avatar: string;
  story: string;
  mediaType: "image" | "video";
  audioName?: string;
  whatsapp?: string;
  isOnline: boolean;
  isVerified: boolean;
  createdAt: string;
}
export default function StoriesBar() {
  const [storiesList, setStoriesList] = useState<StoryCardItem[]>([]);
  const [activeStory, setActiveStory] = useState<StoryCardItem | null>(null);
  const [isReelsOpen, setIsReelsOpen] = useState(false);

  useEffect(() => {
    async function loadLiveStories() {
      try {
        const liveStories = await getActiveStoriesAction();
        if (liveStories) {
          const mapped: StoryCardItem[] = liveStories.map((s: StoryItem) => ({
            id: s.id,
            modelId: s.model_id,
            name: s.model_name || "Modelo VIP",
            age: s.model_age || 0,
            city: s.model_city || "",
            sector: s.model_sector || "",
            avatar: s.media_url,
            story: s.media_url,
            mediaType: s.media_type,
            whatsapp: s.model_whatsapp,
            isOnline: Boolean(s.model_is_online),
            isVerified: Boolean(s.model_is_verified || s.model_is_verified_4k),
            createdAt: s.created_at,
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

          {storiesList.length === 0 && (
            <span className="text-xs text-white/45">No hay historias activas por ahora.</span>
          )}

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
