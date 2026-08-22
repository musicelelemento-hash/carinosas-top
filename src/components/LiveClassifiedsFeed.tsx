"use client";

import React, { useState, useTransition, useMemo } from "react";
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
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Country, getCountryById } from "@/lib/countries";

interface ClassifiedAd {
  id: string;
  name: string;
  city: string;
  sector: string;
  country: string;
  countryId: string;
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
    id: "ad-ec-1",
    name: "Valentina VIP",
    city: "Quito",
    sector: "La Carolina / Cumbayá",
    country: "🇪🇨",
    countryId: "ecuador",
    age: 23,
    rate: 120,
    headline: "Disponible hoy para cena elegante en Cumbayá o suite ejecutiva. Fotos 100% reales de alta fidelidad.",
    timeAgo: "Hace 4 min",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    whatsapp: "593987654321",
    isLiveNow: true,
    hasAudio: true,
    tags: ["La Carolina", "Cena VIP", "Hotel 5★"],
    likesCount: 142
  },
  {
    id: "ad-ec-2",
    name: "Alessandra Gold",
    city: "Guayaquil",
    sector: "Samborondón VIP / Puerto Santa Ana",
    country: "🇪🇨",
    countryId: "ecuador",
    age: 24,
    rate: 150,
    headline: "Acompañamiento selecto en Samborondón y suites ejecutivas. Discreción total y trato de primera.",
    timeAgo: "Hace 6 min",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    whatsapp: "593981122334",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Samborondón", "Puerto Santa Ana", "Cena VIP"],
    likesCount: 189
  },
  {
    id: "ad-ec-3",
    name: "Gabriela Rose",
    city: "Cuenca",
    sector: "El Vergel / Centro",
    country: "🇪🇨",
    countryId: "ecuador",
    age: 22,
    rate: 110,
    headline: "Universitaria culta, dulce y encantadora. Disponible para tardes de relax y compañía selecta.",
    timeAgo: "Hace 10 min",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    whatsapp: "593976543210",
    isLiveNow: true,
    hasAudio: false,
    tags: ["Cuenca VIP", "Relax", "Universitaria"],
    likesCount: 95
  },
  {
    id: "ad-ec-4",
    name: "Camila Manta",
    city: "Manta",
    sector: "Plaza del Sol / Barbasquillo",
    country: "🇪🇨",
    countryId: "ecuador",
    age: 23,
    rate: 130,
    headline: "Frente al mar en Barbasquillo. Exclusividad para ejecutivos, viajes de negocios y momentos únicos.",
    timeAgo: "Hace 14 min",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    whatsapp: "593989988776",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Manta Sol", "Barbasquillo", "Playa VIP"],
    likesCount: 164
  },
  {
    id: "ad-ec-5",
    name: "Valeria Oro",
    city: "Machala",
    sector: "Puerto Bolívar / Centro VIP",
    country: "🇪🇨",
    countryId: "ecuador",
    age: 22,
    rate: 120,
    headline: "Hermosa y cariñosa en Machala. Trato de novios real, masajes relajantes y total discreción para ejecutivos.",
    timeAgo: "Hace 2 min",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    whatsapp: "593983344556",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Machala VIP", "Puerto Bolívar", "100% Real"],
    likesCount: 210
  },
  {
    id: "ad-ec-6",
    name: "Carolina Ambato",
    city: "Ambato",
    sector: "Ficoa / Miraflores",
    country: "🇪🇨",
    countryId: "ecuador",
    age: 24,
    rate: 100,
    headline: "Chica dulce y elegante en Ficoa. Excelente trato, masajes sensitivos y compañía de alto nivel.",
    timeAgo: "Hace 18 min",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    whatsapp: "593971239876",
    isLiveNow: true,
    hasAudio: false,
    tags: ["Ambato VIP", "Ficoa", "Trato VIP"],
    likesCount: 88
  },
  {
    id: "ad-ec-7",
    name: "Scarlett Tsáchila",
    city: "Santo Domingo",
    sector: "Zona Rosa / Los Rosales",
    country: "🇪🇨",
    countryId: "ecuador",
    age: 23,
    rate: 110,
    headline: "Acompañante VIP en Santo Domingo. Bellísima, atenta y apasionada, disponible para momentos únicos.",
    timeAgo: "Hace 7 min",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    whatsapp: "593965412398",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Sto Domingo", "Zona Rosa", "Elite 4K"],
    likesCount: 135
  },
  {
    id: "ad-co-1",
    name: "Mariana Paisa",
    city: "Medellín",
    sector: "El Poblado / Provenza",
    country: "🇨🇴",
    countryId: "colombia",
    age: 22,
    rate: 180,
    headline: "Musa paisa en Provenza. Atención exclusiva para caballeros de alto perfil, eventos y giras.",
    timeAgo: "Hace 8 min",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    whatsapp: "573001234567",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Provenza", "Paisa VIP", "Giras"],
    likesCount: 230
  },
  {
    id: "ad-co-2",
    name: "Sofía Chicó",
    city: "Bogotá",
    sector: "Zona T / Parque 93",
    country: "🇨🇴",
    countryId: "colombia",
    age: 24,
    rate: 190,
    headline: "Elegancia capitalina en la Zona T. Disponible para cenas de gala y suites premium.",
    timeAgo: "Hace 11 min",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    whatsapp: "573109876543",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Zona T", "Bogotá VIP", "Parque 93"],
    likesCount: 175
  },
  {
    id: "ad-pe-1",
    name: "Fiorella Miraflores",
    city: "Lima",
    sector: "Miraflores / San Isidro",
    country: "🇵🇪",
    countryId: "peru",
    age: 24,
    rate: 150,
    headline: "Compañía de alto nivel en San Isidro Golf. Total discreción, elegancia y encanto natural.",
    timeAgo: "Hace 12 min",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    whatsapp: "51987654321",
    isLiveNow: true,
    hasAudio: false,
    tags: ["San Isidro", "Miraflores", "Bóveda 4K"],
    likesCount: 98
  },
  {
    id: "ad-pa-1",
    name: "Valeria Pacífica",
    city: "Ciudad de Panamá",
    sector: "Punta Pacífica",
    country: "🇵🇦",
    countryId: "panama",
    age: 23,
    rate: 220,
    headline: "Disponible para eventos en yate privado y cenas de negocios en Punta Pacífica y Costa del Este.",
    timeAgo: "Hace 15 min",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    whatsapp: "50761234567",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Punta Pacífica", "Yates VIP", "Discreción"],
    likesCount: 310
  },
  {
    id: "ad-mx-1",
    name: "Renata Polanco",
    city: "Ciudad de México",
    sector: "Polanco / Roma Norte",
    country: "🇲🇽",
    countryId: "mexico",
    age: 23,
    rate: 200,
    headline: "Atención premium en Polanco y Lomas. Modelo verificada 4K con disponibilidad inmediata.",
    timeAgo: "Hace 18 min",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    whatsapp: "525512345678",
    isLiveNow: true,
    hasAudio: true,
    tags: ["Polanco VIP", "Roma Norte", "Suites CDMX"],
    likesCount: 220
  }
];

interface LiveClassifiedsFeedProps {
  currentCountry?: Country;
}

export default function LiveClassifiedsFeed({ currentCountry }: LiveClassifiedsFeedProps = {}) {
  const activeCountry = currentCountry || getCountryById("ecuador");
  const [filterMode, setFilterMode] = useState<"country" | "all">("country");
  const [isPending, startTransition] = useTransition();
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Memoized filter for 60fps performance on mobile
  const filteredAds = useMemo(() => {
    return SAMPLE_CLASSIFIEDS.filter((ad) => {
      if (filterMode === "country") {
        return ad.countryId === activeCountry.id || ad.country === activeCountry.flag;
      }
      return true;
    });
  }, [filterMode, activeCountry.id, activeCountry.flag]);

  const adsToDisplay = filteredAds.length > 0 ? filteredAds : SAMPLE_CLASSIFIEDS;

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
    <section id="clasificados-express" className="py-24 px-4 md:px-12 max-w-[1700px] mx-auto space-y-10">
      
      {/* Header Bar: Haute Horlogerie / Vogue Styling */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-gold/20 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full glass-obsidian border border-brand-gold/30 text-brand-gold text-[9px] font-black uppercase tracking-[0.3em]">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
            <span>Tablón de Clasificados Exprés · En Vivo</span>
          </div>

          <h2 className="text-3xl md:text-6xl font-serif text-white italic tracking-tight">
            Clasificados <span className="bg-gradient-to-r from-[#F5E0A0] via-[#D4A843] to-[#AA7C11] bg-clip-text text-transparent">Élite 4K</span>
          </h2>
          
          <p className="text-xs text-white/50 font-light max-w-xl">
            Actualizaciones instantáneas en tiempo real directamente por modelos de alta gama con verificación biométrica en {activeCountry.name}.
          </p>

          {/* Country vs Global Toggle Pills */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => startTransition(() => setFilterMode("country"))}
              aria-label={`Filtrar clasificados en ${activeCountry.name}`}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                filterMode === "country"
                  ? "bg-brand-gold text-brand-black border-brand-gold shadow-[0_0_15px_rgba(212,168,67,0.3)]"
                  : "glass-dark border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {activeCountry.flag} En {activeCountry.name} ({SAMPLE_CLASSIFIEDS.filter(a => a.countryId === activeCountry.id || a.country === activeCountry.flag).length})
            </button>
            <button
              onClick={() => startTransition(() => setFilterMode("all"))}
              aria-label="Ver todos los clasificados internacionales"
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                filterMode === "all"
                  ? "bg-brand-gold text-brand-black border-brand-gold shadow-[0_0_15px_rgba(212,168,67,0.3)]"
                  : "glass-dark border-white/10 text-white/50 hover:text-white"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Globe size={11} />
                Internacional ({SAMPLE_CLASSIFIEDS.length})
              </span>
            </button>
          </div>
        </div>

        {/* Action Button: Post Fast Ad */}
        <Link
          href="/registro"
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(212,168,67,0.35)] hover:shadow-[0_15px_45px_rgba(212,168,67,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 self-start md:self-auto shrink-0 group"
        >
          <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-500" />
          <span>Publicar Anuncio Exprés</span>
          <ArrowUpRight size={14} className="opacity-60" />
        </Link>
      </div>

      {/* Grid of Dopamine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adsToDisplay.map((ad, idx) => {
          const isLiked = likedIds.has(ad.id);
          const isPlaying = playingAudioId === ad.id;

          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className="glass-obsidian border border-brand-gold/25 hover:border-brand-gold rounded-[2.5rem] overflow-hidden p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between space-y-4 group transition-colors duration-500 relative"
            >
              {/* Subtle Gold Aura Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

              {/* Card Top: Image & Overlay Badges */}
              <div className="relative aspect-[4/5] rounded-[1.8rem] overflow-hidden border border-white/10">
                <Image
                  src={ad.imageUrl}
                  alt={ad.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-100 contrast-[1.03]"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-black text-[9px] font-black uppercase tracking-wider shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    En Línea
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-white/90 font-bold border border-white/15">
                    {ad.country} {ad.timeAgo}
                  </span>
                </div>

                {/* Bottom Overlay Info on Photo */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                    <span className="text-lg font-serif font-bold text-white block leading-tight drop-shadow-md">
                      {ad.name}, {ad.age}
                    </span>
                    <span className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-brand-gold" />
                      {ad.sector}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-brand-gold bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-brand-gold/30">
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
                      className="text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full glass-dark border border-brand-gold/20 text-brand-gold/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Audio Note & Heart Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                
                {/* Audio Trigger if available */}
                {ad.hasAudio ? (
                  <button
                    type="button"
                    onClick={() => toggleAudio(ad.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95 ${
                      isPlaying
                        ? "bg-brand-gold text-brand-black shadow-[0_0_15px_rgba(212,168,67,0.5)]"
                        : "glass-dark border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/15"
                    }`}
                  >
                    {isPlaying ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    <span>{isPlaying ? "Pausar Saludo" : "Escuchar Voz"}</span>
                    
                    {/* Animated Soundwave bars */}
                    {isPlaying && (
                      <div className="flex items-center gap-0.5 ml-1">
                        <span className="w-0.5 h-3 bg-brand-black animate-pulse rounded-full" />
                        <span className="w-0.5 h-2 bg-brand-black animate-pulse delay-75 rounded-full" />
                        <span className="w-0.5 h-4 bg-brand-black animate-pulse delay-150 rounded-full" />
                      </div>
                    )}
                  </button>
                ) : (
                  <span className="text-[9px] text-white/30 uppercase font-black tracking-wider flex items-center gap-1">
                    <ShieldCheck size={11} className="text-brand-gold" /> Verificada 4K
                  </span>
                )}

                {/* Heart Like */}
                <button
                  type="button"
                  onClick={() => handleLike(ad.id)}
                  className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full transition-transform active:scale-125 ml-auto ${
                    isLiked ? "text-rose-400" : "text-white/40 hover:text-white"
                  }`}
                >
                  <Heart size={13} className={isLiked ? "fill-current text-rose-500" : ""} />
                  <span>{ad.likesCount + (isLiked ? 1 : 0)}</span>
                </button>
              </div>

              {/* Luxury Champagne Gold Contact Button */}
              {(() => {
                const cleanPhone = (ad.whatsapp || "").replace(/\D/g, "");
                const fullPhone = cleanPhone.startsWith("0") 
                  ? `593${cleanPhone.slice(1)}`
                  : (cleanPhone.length === 9 || cleanPhone.length === 10) && !cleanPhone.startsWith("593")
                  ? `593${cleanPhone}`
                  : cleanPhone || "593987654321";

                return (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/${fullPhone}?text=${encodeURIComponent(`Hola ${ad.name}, vi tu clasificado exprés en Cariñosas.top (${ad.sector}, ${ad.city}). Deseo consultar tu disponibilidad hoy.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] hover:brightness-110 text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(212,168,67,0.3)] transition-all duration-300 flex items-center justify-center gap-2.5 group/btn"
                  >
                    <MessageCircle size={15} fill="currentColor" className="group-hover/btn:scale-110 transition-transform" />
                    <span>Contactar en WhatsApp</span>
                  </motion.a>
                );
              })()}

            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
