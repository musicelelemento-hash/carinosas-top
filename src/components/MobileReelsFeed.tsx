"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Heart, 
  Flame, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  ChevronUp, 
  ChevronDown,
  Crown
} from "lucide-react";

interface ReelItem {
  id: string;
  name: string;
  age: number;
  city: string;
  sector: string;
  rate: string;
  imageUrl: string;
  description: string;
  hasAudio: boolean;
  tags: string[];
}

const REEL_ITEMS: ReelItem[] = [
  {
    id: "r-machala-1",
    name: "Valeria",
    age: 22,
    city: "Machala",
    sector: "Puerto Bolívar / Centro VIP",
    rate: "$120/h",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1080",
    description: "Hermosa y cariñosa en Machala. Trato de novios real, masajes relajantes y total discreción para ejecutivos.",
    hasAudio: true,
    tags: ["MachalaVIP", "PuertoBolívar", "TratoDeNovios", "4KReal"]
  },
  {
    id: "r1",
    name: "Valentina",
    age: 22,
    city: "Quito",
    sector: "La Carolina VIP",
    rate: "$150/h",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1080",
    description: "Cenas exclusivas y momentos de alto nivel en hoteles 5★ en Quito Norte y Cumbayá.",
    hasAudio: true,
    tags: ["Elegante", "Hotel5★", "Bóveda4K", "QuitoVIP"]
  },
  {
    id: "r2",
    name: "Alessandra",
    age: 24,
    city: "Guayaquil",
    sector: "Samborondón VIP",
    rate: "$180/h",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1080",
    description: "Presencia impecable y atención preferencial para caballeros distinguidos en Samborondón y Puerto Santa Ana.",
    hasAudio: true,
    tags: ["TratoVIP", "AltaGama", "4KVerified", "Samborondón"]
  },
  {
    id: "r3",
    name: "Isabella",
    age: 23,
    city: "Cuenca",
    sector: "El Vergel / Centro",
    rate: "$140/h",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1080",
    description: "Universitaria sofisticada. Conexión auténtica y compañía sin prisa en Cuenca.",
    hasAudio: true,
    tags: ["Universitaria", "Sutil", "MasajeRelax", "CuencaVIP"]
  },
  {
    id: "r4",
    name: "Scarlett",
    age: 23,
    city: "Santo Domingo",
    sector: "Zona Rosa / Los Rosales",
    rate: "$110/h",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1080",
    description: "Acompañante VIP en Santo Domingo. Bellísima, apasionada y discreta para momentos inolvidables.",
    hasAudio: true,
    tags: ["SantoDomingo", "ZonaRosa", "Elite4K"]
  },
  {
    id: "r5",
    name: "Sofía",
    age: 25,
    city: "Manta",
    sector: "Plaza del Sol / Barbasquillo",
    rate: "$160/h",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1080",
    description: "Acompañamiento exclusivo frente al mar con total discreción en suites y yates.",
    hasAudio: true,
    tags: ["PlayaVIP", "Yates", "Barbasquillo", "4KHD"]
  }
];

interface MobileReelsFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileReelsFeed({ isOpen, onClose }: MobileReelsFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [viewersCount, setViewersCount] = useState(842);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setViewersCount(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") handleNext();
      if (e.key === "ArrowUp") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const currentReel = REEL_ITEMS[currentIndex];

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setLikedMap(prev => ({ ...prev, [currentReel.id]: true }));
      setShowHeartAnim(true);
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate([20, 50, 20]); } catch {}
      }
      setTimeout(() => setShowHeartAnim(false), 800);
    }
    lastTapRef.current = now;
  };

  const handleNext = () => {
    if (currentIndex < REEL_ITEMS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (diff > 50) {
      handleNext(); // Swiped UP
    } else if (diff < -50) {
      handlePrev(); // Swiped DOWN
    }
    setTouchStartY(null);
  };

  const handleContactWhatsApp = () => {
    const text = encodeURIComponent(`Hola ${currentReel.name}, te vi en el Modo Reels 4K de Cariñosas.top (Ciudad: ${currentReel.city}, Sector: ${currentReel.sector}). Deseo consultar tu disponibilidad.`);
    window.open(`https://wa.me/593987654321?text=${text}`, "_blank");
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[160] bg-black flex flex-col justify-between overflow-hidden animate-in fade-in duration-300 select-none"
    >
      
      {/* ── TOP ACTION BAR ── */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 pt-6 sm:p-5 sm:pt-8 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-obsidian border border-brand-gold/40 text-brand-gold text-[9px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(212,168,67,0.2)]">
            <Flame size={12} className="text-brand-pink fill-brand-pink animate-pulse" />
            <span>Reels 4K en Vivo</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full glass-dark border border-white/10 text-[9px] font-mono text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{viewersCount} viendo</span>
          </div>

          <span className="text-[10px] text-white/50 font-mono hidden sm:inline">
            {currentIndex + 1}/{REEL_ITEMS.length}
          </span>
        </div>

        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full glass-dark border border-white/20 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── MAIN FULL-SCREEN MEDIA CONTAINER ── */}
      <div 
        onClick={handleDoubleTap}
        className="relative w-full h-full flex-1 overflow-hidden"
      >
        <Image
          src={currentReel.imageUrl}
          alt={currentReel.name}
          fill
          priority
          className="object-cover brightness-95"
        />

        {/* Ambient Dark Gradient for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/20" />

        {/* Double Tap Floating Heart Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-in zoom-in-50 duration-300">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-pink to-brand-gold flex items-center justify-center shadow-[0_0_60px_rgba(255,0,98,0.8)] scale-125 animate-bounce">
              <Heart size={60} className="fill-white text-white" />
            </div>
          </div>
        )}

        {/* ── RIGHT FLOATING ACTION COLUMN ── */}
        <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center gap-5">
          
          {/* Like Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setLikedMap(prev => ({ ...prev, [currentReel.id]: !prev[currentReel.id] }));
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full glass-dark border border-white/10 flex items-center justify-center transition-all ${
              likedMap[currentReel.id] ? 'bg-brand-pink border-brand-pink text-white shadow-[0_0_20px_rgba(255,0,98,0.5)]' : 'text-white'
            }`}>
              <Heart size={22} className={likedMap[currentReel.id] ? 'fill-white' : ''} />
            </div>
            <span className="text-[9px] text-white/80 font-bold uppercase">Me Gusta</span>
          </button>

          {/* Voice Greeting Audio Toggle */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsAudioActive(!isAudioActive);
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-12 h-12 rounded-full glass-dark border border-white/10 flex items-center justify-center text-brand-gold transition-all ${
              isAudioActive ? 'bg-brand-gold text-brand-black shadow-[0_0_25px_rgba(212,168,67,0.6)] animate-pulse' : ''
            }`}>
              {isAudioActive ? <Volume2 size={22} /> : <VolumeX size={22} />}
            </div>
            <span className="text-[9px] text-white/80 font-bold uppercase">
              {isAudioActive ? 'Escuchando' : 'Voz HD'}
            </span>

            {/* Equalizer animation bars */}
            {isAudioActive && (
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="w-1 h-3 bg-brand-gold rounded-full animate-bounce" />
                <span className="w-1 h-5 bg-brand-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-2 bg-brand-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="w-1 h-4 bg-brand-gold rounded-full animate-bounce [animation-delay:0.1s]" />
              </div>
            )}
          </button>

          {/* Share */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({ title: `Perfil 4K de ${currentReel.name}`, url: window.location.href });
              }
            }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white">
              <Share2 size={20} />
            </div>
            <span className="text-[9px] text-white/80 font-bold uppercase">Compartir</span>
          </button>

          {/* Next Navigation Arrow */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="w-12 h-12 rounded-full bg-brand-gold text-brand-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <ChevronDown size={24} />
          </button>
        </div>

        {/* ── BOTTOM METADATA & BOOKING SHEET ── */}
        <div className="absolute bottom-5 inset-x-4 z-20 space-y-3">
          
          <div className="space-y-1.5 pr-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif text-white italic font-bold">{currentReel.name}</span>
              <span className="text-sm text-white/70">, {currentReel.age}</span>
              <div className="bg-brand-gold text-brand-black text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-md">
                <ShieldCheck size={10} /> 4K VERIFIED
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-brand-gold font-bold uppercase tracking-wider">
              <MapPin size={11} /> {currentReel.sector} · {currentReel.city}
              <span className="text-white/40">|</span>
              <span className="text-white font-serif italic text-sm">{currentReel.rate}</span>
            </div>

            <p className="text-xs text-white/85 line-clamp-2 leading-relaxed font-medium">
              &quot;{currentReel.description}&quot;
            </p>

            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {currentReel.tags.map(t => (
                <span key={t} className="text-[8px] px-2.5 py-0.5 rounded-full glass-dark border border-white/10 text-white/70 font-mono">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons & Swipe Up Hint */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleContactWhatsApp}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] hover:brightness-110 text-brand-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(212,168,67,0.5)] flex items-center justify-center gap-2"
              >
                <MessageCircle size={15} fill="currentColor" />
                <span>Chatear por WhatsApp Directo</span>
              </button>
            </div>

            {/* Swipe up hint */}
            <div className="flex items-center justify-center gap-1 text-[8px] font-mono uppercase tracking-[0.25em] text-white/40 pt-1">
              <span>Desliza para siguiente</span>
              <ChevronUp size={10} className="animate-bounce" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
