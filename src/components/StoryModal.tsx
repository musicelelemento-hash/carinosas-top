"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Heart, MessageCircle, Send } from "lucide-react";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  modelName: string;
}

export default function StoryModal({ isOpen, onClose, imageUrl, modelName }: StoryModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(onClose, 15000); // 15s story
      return () => {
        document.body.style.overflow = 'unset';
        clearTimeout(timer);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black backdrop-blur-3xl flex items-center justify-center p-0 md:p-10 animate-in fade-in zoom-in-95 duration-300">
      <div className="relative w-full max-w-[450px] aspect-[9/16] bg-brand-black md:rounded-3xl overflow-hidden shadow-2xl shadow-brand-pink/20">
        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 z-50 flex gap-1 px-4">
          <div className="h-[2px] bg-white/30 flex-1 rounded-full overflow-hidden">
            <div className="h-full bg-brand-gold animate-story-progress" />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-0 right-0 z-50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border-2 border-brand-pink overflow-hidden">
                <Image src={imageUrl} alt={modelName} width={40} height={40} className="object-cover" />
             </div>
             <div>
                <p className="text-white font-bold text-sm text-shadow">{modelName}</p>
                <p className="text-white/60 text-[10px] uppercase font-black tracking-widest">Hace 2 horas</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <Image 
          src={imageUrl} 
          alt="Story content" 
          fill 
          className="object-cover"
          priority
        />

        {/* Verification Tag */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 z-40">
           <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.5em] whitespace-nowrap">Momento Real · Sin Filtros</span>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between gap-6">
           <div className="flex-1 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 text-white/60 text-sm">
             Responder a {modelName}...
           </div>
           <div className="flex items-center gap-6 text-white/80">
              <Heart size={24} className="hover:text-brand-pink transition-colors cursor-pointer" />
              <Send size={24} className="hover:text-brand-gold transition-colors cursor-pointer" />
           </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes story-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-story-progress {
          animation: story-progress 15s linear forwards;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
