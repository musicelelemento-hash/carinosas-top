"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Flame, 
  Sparkles, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  PlusCircle, 
  Share2, 
  Heart,
  Eye,
  CheckCircle2
} from "lucide-react";

interface ClassifiedAd {
  id: string;
  name: string;
  city: string;
  sector: string;
  country: string;
  age: number;
  rate: number;
  headline: string;
  timeAgo: string;
  imageUrl: string;
  whatsapp: string;
  isLiveNow: boolean;
  hasAudio: boolean;
  tags: string[];
  likesCount: number;
}

const SAMPLE_CLASSIFIEDS: ClassifiedAd[] = [
  {
    id: "ad-1",
    name: "Valentina VIP",
    city: "Quito",
    sector: "La Carolina",
    country: "🇪🇨",
    age: 23,
    rate: 120,
    headline: "Disponible hoy para cena elegante en Cumbayá o suite ejecutiva. Fotos 100% reales.",
    timeAgo: "Hace 4 min",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    whatsapp: "593987654321",
    isLiveNow: true,
    hasAudio: true,
    tags: ["La Carolina", "Cena VIP", "Hotel 5★"],
    likesCount: 142
  },
  {
    id: "ad-2",
    name: "Mariana Paisa",
    city: "Medellín",
    sector: "El Poblado / Provenza",
    country: "🇨🇴",
    age: 22,
    rate: 180,
    headline: "Musa paisa en Provenza. Atención exclusiva para caballeros de alto perfil y giras.",
    timeAgo: "Hace 8 min",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    whatsapp: "573001234567",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Provenza", "Paisa", "Giras"],
    likesCount: 230
  },
  {
    id: "ad-3",
    name: "Fiorella",
    city: "Lima",
    sector: "Miraflores / San Isidro",
    country: "🇵🇪",
    age: 24,
    rate: 150,
    headline: "Compañía de alto nivel en San Isidro Golf. Total discreción y encanto natural.",
    timeAgo: "Hace 12 min",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    whatsapp: "51987654321",
    isLiveNow: true,
    hasAudio: false,
    tags: ["San Isidro", "Miraflores", "Bóveda 4K"],
    likesCount: 98
  },
  {
    id: "ad-4",
    name: "Valeria",
    city: "Ciudad de Panamá",
    sector: "Punta Pacífica",
    country: "🇵🇦",
    age: 23,
    rate: 220,
    headline: "Disponible para eventos en yate privado y cenas de negocios en Punta Pacífica.",
    timeAgo: "Hace 15 min",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    whatsapp: "50761234567",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Punta Pacífica", "Yates VIP", "Discreción"],
    likesCount: 310
  }
];

export default function LiveClassifiedsFeed() {
  const [ads, setAds] = useState<ClassifiedAd[]>(SAMPLE_CLASSIFIEDS);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const handleLike = (id: string) => {
    const next = new Set(likedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(15); } catch {}
      }
    }
    setLikedIds(next);
  };

  const toggleAudio = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(20); } catch {}
      }
    }
  };

  return (
    <section id="clasificados-express" className="py-20 px-4 md:px-12 max-w-[1700px] mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Tablón de Clasificados Exprés en Vivo</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-white italic">
            Clasificados <span className="text-brand-gold">Dopamina 4K</span>
          </h2>
          
          <p className="text-xs text-white/50">
            Publicaciones instantáneas y actualizadas en tiempo real por las modelos verificadas.
          </p>
        </div>

        {/* Action Button: Post Fast Ad */}
        <Link
          href="/registro"
          className="px-6 py-3.5 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-widest shadow-[0_10px_35px_rgba(212,168,67,0.4)] transition-all flex items-center gap-2.5 self-start md:self-auto shrink-0 group"
        >
          <PlusCircle size={16} className="group-hover:rotate-90 transition-transform" />
          <span>Publicar Anuncio Exprés</span>
        </Link>
      </div>

      {/* Grid of Dopamine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ads.map((ad) => {
          const isLiked = likedIds.has(ad.id);
          const isPlaying = playingAudioId === ad.id;

          return (
            <div
              key={ad.id}
              className="glass-obsidian border border-brand-gold/25 rounded-3xl overflow-hidden p-5 shadow-2xl flex flex-col justify-between space-y-4 group hover:border-brand-gold hover:scale-[1.02] transition-all duration-500"
            >
              {/* Card Top: Image & Overlay Badges */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={ad.imageUrl}
                  alt={ad.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-black text-[9px] font-black uppercase tracking-wider shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    En Línea
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white/80 font-bold border border-white/10">
                    {ad.country} {ad.timeAgo}
                  </span>
                </div>

                {/* Bottom Overlay Info on Photo */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                    <span className="text-base font-serif font-bold text-white block leading-tight drop-shadow-md">
                      {ad.name}, {ad.age}
                    </span>
                    <span className="text-[10px] text-white/80 flex items-center gap-1">
                      <MapPin size={10} className="text-brand-gold" />
                      {ad.sector}, {ad.city}
                    </span>
                  </div>

                  <span className="text-sm font-mono font-bold text-brand-gold bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-brand-gold/30">
                    ${ad.rate}/h
                  </span>
                </div>
              </div>

              {/* Card Body: Headline & Chips */}
              <div className="space-y-3">
                <p className="text-xs text-white/80 leading-relaxed font-light line-clamp-2">
                  &ldquo;{ad.headline}&rdquo;
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {ad.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full glass-dark border border-white/10 text-white/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Audio Note & Heart Actions */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                
                {/* Audio Trigger if available */}
                {ad.hasAudio && (
                  <button
                    type="button"
                    onClick={() => toggleAudio(ad.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                      isPlaying
                        ? "bg-brand-pink text-white animate-pulse"
                        : "glass-dark border border-brand-pink/40 text-brand-pink hover:bg-brand-pink/15"
                    }`}
                  >
                    {isPlaying ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    <span>{isPlaying ? "Pausar Voz" : "Escuchar Voz"}</span>
                  </button>
                )}

                {/* Heart Like */}
                <button
                  type="button"
                  onClick={() => handleLike(ad.id)}
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full transition-colors ml-auto ${
                    isLiked ? "text-rose-400" : "text-white/40 hover:text-white"
                  }`}
                >
                  <Heart size={13} className={isLiked ? "fill-current text-rose-500" : ""} />
                  <span>{ad.likesCount + (isLiked ? 1 : 0)}</span>
                </button>
              </div>

              {/* WhatsApp Booking Direct Button */}
              <a
                href={`https://wa.me/${ad.whatsapp}?text=${encodeURIComponent(`Hola ${ad.name}, vi tu clasificado exprés en Cariñosas.top (${ad.sector}, ${ad.city}). Deseo consultar tu disponibilidad hoy.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={15} fill="currentColor" />
                <span>Contactar por WhatsApp</span>
              </a>

            </div>
          );
        })}
      </div>

    </section>
  );
}
