"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Heart, Send, MessageCircle, Sparkles, Volume2, ShieldCheck, Flame, Wine, Gem } from "lucide-react";
import { useRouter } from "next/navigation";
import { incrementStoryViewAction } from "@/app/actions/stories";

export interface StoryData {
  id: string;
  name: string;
  age?: number;
  city: string;
  sector?: string;
  avatar: string;
  story: string;
  audioName?: string;
  whatsapp?: string;
  isOnline?: boolean;
}

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryData | null;
}

export default function StoryModal({ isOpen, onClose, story }: StoryModalProps) {
  const router = useRouter();
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [reactionEffect, setReactionEffect] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const totalSegments = 3;

  useEffect(() => {
    if (isOpen && story) {
      document.body.style.overflow = "hidden";

      // Record live story view metric in database
      if (story.id && !story.id.startsWith("fallback")) {
        incrementStoryViewAction(story.id);
      }

      const interval = setInterval(() => {
        setCurrentSegment((prev) => {
          if (prev >= totalSegments - 1) {
            onClose();
            return 0;
          }
          return prev + 1;
        });
      }, 5000); // 5s per segment = 15s total

      return () => {
        document.body.style.overflow = "unset";
        clearInterval(interval);
      };
    }
  }, [isOpen, story, onClose]);

  if (!isOpen || !story) return null;

  const triggerReaction = (emoji: string) => {
    setReactionEffect(emoji);
    setTimeout(() => setReactionEffect(null), 1200);
  };

  const handleWhatsAppDirect = () => {
    const rawPhone = story.whatsapp || "593987654321";
    const cleanPhone = rawPhone.replace(/\D/g, "");
    const fullPhone = cleanPhone.startsWith("593") ? cleanPhone : `593${cleanPhone.replace(/^0/, "")}`;
    const text = encodeURIComponent(`Hola ${story.name}, vi tu Historia 4K en Cariñosas.top y me gustaría coordinar una cita.`);
    window.open(`https://wa.me/${fullPhone}?text=${text}`, "_blank");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const rawPhone = story.whatsapp || "593987654321";
    const cleanPhone = rawPhone.replace(/\D/g, "");
    const fullPhone = cleanPhone.startsWith("593") ? cleanPhone : `593${cleanPhone.replace(/^0/, "")}`;
    const text = encodeURIComponent(`Hola ${story.name}, vi tu Historia en Cariñosas.top: "${message.trim()}"`);
    window.open(`https://wa.me/${fullPhone}?text=${text}`, "_blank");
    setMessage("");
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[430px] h-full md:h-[92vh] max-h-[860px] bg-[#08080C] md:rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)] border border-white/10 flex flex-col justify-between">
        
        {/* Background Image / Canvas */}
        <div className="absolute inset-0 z-0">
          <Image
            src={story.story}
            alt={story.name}
            fill
            className="object-cover"
            priority
          />
          {/* Obsidian Luxury Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/95 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-transparent z-10" />
        </div>

        {/* Reaction Animated Flying Emoji */}
        {reactionEffect && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-300">
            <span className="text-8xl animate-bounce drop-shadow-[0_0_30px_rgba(212,168,67,0.8)]">
              {reactionEffect}
            </span>
          </div>
        )}

        {/* TOP CONTROLS */}
        <div className="relative z-30 p-5 space-y-3 pt-6 md:pt-5">
          {/* Segmented Progress Bars */}
          <div className="flex gap-1.5 px-1">
            {[...Array(totalSegments)].map((_, idx) => (
              <div key={idx} className="h-1 bg-white/25 flex-1 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className={`h-full bg-brand-gold transition-all duration-300 ${
                    idx < currentSegment
                      ? "w-full"
                      : idx === currentSegment
                      ? "w-full animate-story-segment"
                      : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Model Identity Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              {/* Avatar with spinning gold ring */}
              <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-brand-gold via-white to-brand-pink shadow-[0_0_15px_rgba(212,168,67,0.4)]">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image src={story.avatar} alt={story.name} fill className="object-cover" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-serif text-base leading-none font-bold">{story.name}</span>
                  {story.age && <span className="text-white/60 text-xs font-light">, {story.age}</span>}
                  <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-brand-gold text-brand-black font-black uppercase tracking-wider flex items-center gap-0.5 ml-1">
                    <ShieldCheck size={9} /> 4K
                  </span>
                </div>
                <span className="text-[9px] text-white/50 uppercase font-black tracking-widest mt-0.5">
                  {story.sector || story.city} · Hace 15m
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all active:scale-95"
            >
              <X size={18} />
            </button>
          </div>

          {/* Live Status & Audio Tag Badges */}
          <div className="flex items-center gap-2 pt-1">
            <div className="glass-obsidian px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">Disponible Ahora</span>
            </div>

            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="glass-obsidian px-3 py-1 rounded-full border border-brand-gold/30 flex items-center gap-1.5 hover:border-brand-gold transition-all"
            >
              <Volume2 size={10} className="text-brand-gold animate-pulse" />
              <span className="text-[8px] text-brand-gold font-bold uppercase tracking-wider">
                {story.audioName || `Voz de ${story.name}`}
              </span>
              <div className="flex items-center gap-0.5 h-2 ml-0.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-brand-gold rounded-full"
                    style={{
                      height: isPlayingAudio ? `${i * 3 + 2}px` : "2px",
                      animation: isPlayingAudio ? `soundWave 0.8s ease-in-out infinite alternate ${i * 0.2}s` : "none",
                    }}
                  />
                ))}
              </div>
            </button>
          </div>
        </div>

        {/* MIDDLE WATERMARK */}
        <div className="relative z-20 pointer-events-none px-6 flex justify-end">
          <div className="text-right opacity-30">
            <span className="text-[8px] tracking-[0.4em] font-serif text-brand-gold uppercase font-bold block">Cariñosas.top</span>
            <span className="text-[7px] tracking-[0.2em] text-white/50 uppercase">Ultra 4K Exclusive</span>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="relative z-30 p-5 space-y-3 pb-6 md:pb-6">
          {/* Reaction Emoji Pill Bar */}
          <div className="flex items-center justify-around glass-obsidian py-2 px-4 rounded-full border border-white/10 max-w-[280px] mx-auto">
            {[
              { emoji: "🔥", label: "Fuego" },
              { emoji: "💎", label: "Diamante" },
              { emoji: "🥂", label: "Brindis" },
              { emoji: "❤️", label: "Amor" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => triggerReaction(item.emoji)}
                className="text-xl hover:scale-130 active:scale-95 transition-transform p-1"
                title={item.label}
              >
                {item.emoji}
              </button>
            ))}
          </div>

          {/* Quick Message Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 glass-obsidian rounded-full px-5 py-3 border border-white/15 focus-within:border-brand-gold/50 transition-all flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Mensaje privado a ${story.name}...`}
                className="bg-transparent text-xs text-white placeholder:text-white/40 outline-none w-full"
              />
              {message.trim() && (
                <button type="submit" className="text-brand-gold hover:text-white transition-colors">
                  <Send size={15} />
                </button>
              )}
            </div>
          </form>

          {/* Dual Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleWhatsAppDirect}
              className="flex-1 py-3.5 bg-brand-gold hover:bg-white text-brand-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,168,67,0.3)] active:scale-95"
            >
              <MessageCircle size={15} fill="currentColor" />
              WhatsApp Directo
            </button>
            <button
              onClick={() => {
                onClose();
                router.push(`/profile/${story.id}`);
              }}
              className="px-5 py-3.5 rounded-2xl border border-white/20 glass-obsidian text-white hover:border-brand-gold hover:text-brand-gold text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Ver Perfil
            </button>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes story-segment {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-story-segment {
          animation: story-segment 5s linear forwards;
        }
      `}</style>
    </div>
  );
}
