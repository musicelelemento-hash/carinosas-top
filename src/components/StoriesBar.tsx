"use client";

import React, { useState } from "react";
import Image from "next/image";
import StoryModal from "./StoryModal";

const STORIES = [
  { id: '1', name: 'Valentina', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200', city: 'Quito' },
  { id: '2', name: 'Camila', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200', city: 'Guayaquil' },
  { id: '3', name: 'Luciana', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200', city: 'Cuenca' },
  { id: '4', name: 'Elena', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200', city: 'Manta' },
  { id: '5', name: 'Sofía', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1200', city: 'Salinas' },
];

export default function StoriesBar() {
  const [activeStory, setActiveStory] = useState<typeof STORIES[0] | null>(null);

  return (
    <section className="w-full relative overflow-hidden"
      style={{
        background: 'rgba(10,10,14,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.1), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-5">

          {/* LIVE badge */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2 mr-2">
            <div className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center"
              style={{ border: '1.5px dashed rgba(232,0,90,0.35)', background: 'rgba(232,0,90,0.06)' }}
            >
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(232,0,90,0.8)] live-dot" />
              <span className="text-[10px] text-brand-pink font-bold uppercase text-center leading-tight tracking-wider">EN<br/>VIVO</span>
            </div>
            <span className="label-xs text-white/45">Historias</span>
          </div>

          {/* Vertical divider */}
          <div className="flex-shrink-0 h-12 w-[1px]" style={{ background: 'rgba(255,255,255,0.05)' }} />

          {/* Stories */}
          {STORIES.map((story, i) => (
            <button
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group outline-none"
              style={{ animationDelay: `${i * 60}ms`, animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}
            >
              {/* Ring container */}
              <div className="relative w-[66px] h-[66px] rounded-full flex items-center justify-center">
                {/* Spinning gradient ring */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-[-50%] animate-gradient-spin"
                    style={{
                      background: 'conic-gradient(from 0deg, #C9A84C, #F5E0A0, #E8005A, #C9A84C)',
                      opacity: 0.8,
                    }}
                  />
                </div>
                {/* Inner black ring */}
                <div className="absolute inset-[2.5px] rounded-full z-10"
                  style={{ background: '#060608' }}
                />
                {/* Photo */}
                <div className="absolute inset-[5px] rounded-full overflow-hidden z-20 group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={story.avatar}
                    alt={story.name}
                    fill
                    className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                  />
                </div>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: '0 0 20px rgba(201,168,76,0.3), inset 0 0 20px rgba(201,168,76,0.05)' }}
                />
              </div>

              {/* Name */}
              <span className="text-[10px] text-white/60 font-bold uppercase tracking-[0.25em] group-hover:text-brand-gold transition-colors duration-300">
                {story.name}
              </span>
              {/* City */}
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">
                {story.city}
              </span>
            </button>
          ))}
        </div>
      </div>

      <StoryModal
        isOpen={!!activeStory}
        onClose={() => setActiveStory(null)}
        imageUrl={activeStory?.story || ""}
        modelName={activeStory?.name || ""}
      />
    </section>
  );
}
