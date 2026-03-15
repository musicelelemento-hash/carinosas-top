"use client";

import React, { useState } from "react";
import Image from "next/image";
import StoryModal from "./StoryModal";

const STORIES = [
  { id: '1', name: 'Valentina', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200' },
  { id: '2', name: 'Camila', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200' },
  { id: '3', name: 'Luciana', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200' },
  { id: '4', name: 'Elena', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200' },
  { id: '5', name: 'Sofía', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', story: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1200' },
];

export default function StoriesBar() {
  const [activeStory, setActiveStory] = useState<typeof STORIES[0] | null>(null);

  return (
    <section className="w-full bg-brand-black/40 backdrop-blur-md border-b border-white/5 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
          {/* Real Moment Label */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-brand-pink/20 flex items-center justify-center border-2 border-dashed border-brand-pink/50">
              <span className="text-[10px] text-brand-pink font-black uppercase text-center rotate-[-15deg]">LIVE<br/>NOW</span>
            </div>
            <span className="text-[10px] text-brand-white/40 font-black uppercase tracking-widest">Stories</span>
          </div>

          {/* Stories List */}
          {STORIES.map((story) => (
            <button
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group outline-none"
            >
              <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-brand-gold via-brand-pink to-brand-gold animate-gradient-spin">
                <div className="p-[2px] rounded-full bg-brand-black">
                   <div className="w-14 h-14 rounded-full overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                      <Image 
                        src={story.avatar} 
                        alt={story.name} 
                        fill 
                        className="object-cover"
                      />
                   </div>
                </div>
              </div>
              <span className="text-[10px] text-brand-white/70 font-bold tracking-tight group-hover:text-brand-gold transition-colors">{story.name}</span>
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

      <style jsx global>{`
        @keyframes gradient-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-gradient-spin {
          animation: gradient-spin 4s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
