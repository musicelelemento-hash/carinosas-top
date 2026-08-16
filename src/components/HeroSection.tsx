"use client";

import React, { useState, useRef, useEffect } from "react";
import { type Country, getCountryById } from "@/lib/countries";
import { 
  Search, 
  ChevronDown, 
  Gem, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  LocateFixed, 
  X,
  Flame,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  currentCountry?: Country;
  onSelectLocation?: (locationName: string) => void;
  onSelectTag?: (tag: string) => void;
  activeTag?: string;
}

const ECUADOR_CITIES_SUGGESTIONS = [
  { name: "Machala", province: "El Oro", label: "Machala VIP · Capital Bananera", isPopular: true },
  { name: "Pasaje", province: "El Oro", label: "Pasaje · El Oro", isPopular: true },
  { name: "Puerto Bolívar", province: "El Oro", label: "Puerto Bolívar · Machala Costa", isPopular: true },
  { name: "Santa Rosa", province: "El Oro", label: "Santa Rosa · El Oro", isPopular: true },
  { name: "Huaquillas", province: "El Oro", label: "Huaquillas · Frontera Sur", isPopular: false },
  { name: "Arenillas", province: "El Oro", label: "Arenillas · El Oro", isPopular: false },
  { name: "Guayaquil", province: "Guayas", label: "Guayaquil · Samborondón / Urdesa", isPopular: true },
  { name: "Quito", province: "Pichincha", label: "Quito · La Carolina / Cumbayá", isPopular: true },
  { name: "Cuenca", province: "Azuay", label: "Cuenca · El Vergel / Centro", isPopular: true },
  { name: "Santo Domingo", province: "Santo Domingo", label: "Santo Domingo · Zona Rosa", isPopular: true },
  { name: "Ambato", province: "Tungurahua", label: "Ambato · Ficoa", isPopular: true },
  { name: "Manta", province: "Manabí", label: "Manta · Barbasquillo VIP", isPopular: true },
  { name: "Salinas", province: "Santa Elena", label: "Salinas · Chipipe / San Lorenzo", isPopular: false },
];

export default function HeroSection({ currentCountry, onSelectLocation, onSelectTag, activeTag }: HeroSectionProps = {}) {
  const activeCountry = currentCountry || getCountryById("ecuador");
  
  // Search and Location States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Machala");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentTag, setCurrentTag] = useState(activeTag || "");
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered City Suggestions based on typing
  const filteredSuggestions = ECUADOR_CITIES_SUGGESTIONS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCityPick = (cityName: string) => {
    setSelectedCity(cityName);
    setSearchTerm("");
    setIsSearchFocused(false);
    onSelectLocation?.(cityName);

    const collectionEl = document.getElementById("collection");
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGPSDetect = () => {
    setIsLocatingGPS(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocatingGPS(false);
          // Default to Machala or detected zone
          handleCityPick("Machala");
        },
        () => {
          setIsLocatingGPS(false);
          handleCityPick("Machala");
        },
        { timeout: 3000 }
      );
    } else {
      setIsLocatingGPS(false);
      handleCityPick("Machala");
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-6 noise-overlay bg-[#08080C]" id="search-box-hero">

      {/* ── CINEMATIC BACKGROUND ── */}
      <div className="absolute inset-0 -z-30 bg-[#08080C]" />
      <div className="absolute inset-0 -z-20 grid-lines opacity-60" />

      {/* Video Overlay */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <video
          autoPlay muted loop playsInline
          className="w-full h-full object-cover grayscale contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-expensive-watch-detail-32431-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] -z-10 pointer-events-none rounded-full bg-brand-gold/5 blur-[100px]" />
      <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] -z-10 pointer-events-none rounded-full bg-brand-pink/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full text-center z-10 space-y-6">

        {/* ── TOP BADGE & LOGO ── */}
        <div className="flex flex-col items-center gap-2.5">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full glass-obsidian border border-brand-gold/40 shadow-[0_0_25px_rgba(212,168,67,0.2)]"
          >
            <Gem size={13} className="text-brand-gold animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-brand-gold">
              Directorio de Ultra Lujo · Ecuador
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">En Vivo</span>
          </motion.div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight select-none">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              CARIÑOSAS
            </span>
            <span className="italic text-gold-shimmer ml-2 drop-shadow-[0_0_30px_rgba(212,168,67,0.4)]">
              .TOP
            </span>
          </h1>

          <p className="text-[10px] sm:text-xs text-white/70 uppercase tracking-[0.25em] font-medium max-w-lg">
            Catálogo 4K Inmediato · Modelos Verificadas en {activeCountry.name}
          </p>
        </div>

        {/* ── HIGH-SPEED SMART SEARCH BAR (DIRECTO AL GRANO) ── */}
        <div className="max-w-3xl mx-auto relative" ref={searchContainerRef}>
          <div className="relative rounded-full p-[1px] bg-gradient-to-r from-brand-gold/50 via-white/20 to-brand-gold/50 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <div className="rounded-full glass-obsidian backdrop-blur-3xl p-2 pl-5 flex items-center gap-3">
              
              {/* Search Icon / Map Pin */}
              <MapPin size={18} className="text-brand-gold shrink-0 animate-pulse" />

              {/* Direct Instant Input */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchFocused(true);
                  // Live filter parent if text typed
                  if (e.target.value.trim().length > 1) {
                    onSelectLocation?.(e.target.value.trim());
                  }
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Escribe tu cantón o ciudad (Machala, Pasaje, Santa Rosa, GYE...)..."
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder:text-white/40 font-medium"
              />

              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    onSelectLocation?.("");
                  }}
                  className="text-white/40 hover:text-white p-1"
                >
                  <X size={14} />
                </button>
              )}

              {/* 1-Tap GPS Auto-Detect Button */}
              <button
                onClick={handleGPSDetect}
                disabled={isLocatingGPS}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-full glass-dark border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-black text-[9px] font-black uppercase tracking-wider transition-all"
                title="Detectar mi cantón más cercano con GPS"
              >
                <LocateFixed size={12} className={isLocatingGPS ? "animate-spin" : ""} />
                <span>{isLocatingGPS ? "Localizando..." : "GPS"}</span>
              </button>

              {/* Direct Search Action Button */}
              <button
                onClick={() => {
                  if (searchTerm.trim()) {
                    handleCityPick(searchTerm.trim());
                  } else {
                    const el = document.getElementById("collection");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-6 sm:px-8 py-3 rounded-full bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(212,168,67,0.4)] shrink-0 flex items-center gap-1.5"
              >
                <Search size={14} strokeWidth={3} />
                <span className="hidden sm:inline">Ver Chicas</span>
              </button>
            </div>
          </div>

          {/* ── LIVE SEARCH DROPDOWN SUGGESTIONS (ANIMATED) ── */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-3xl p-3 z-50 glass-obsidian border border-brand-gold/40 shadow-[0_30px_70px_rgba(0,0,0,0.95)] max-h-[280px] overflow-y-auto no-scrollbar text-left space-y-1"
              >
                <div className="px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.3em] text-brand-gold/70 border-b border-white/5 flex items-center justify-between">
                  <span>Cantones & Ciudades Disponibles</span>
                  <span>Selección Inmediata</span>
                </div>

                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCityPick(city.name)}
                      className="w-full px-4 py-2.5 rounded-2xl text-left transition-all flex items-center justify-between hover:bg-brand-gold hover:text-brand-black group/city"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-brand-gold group-hover/city:text-brand-black" />
                        <div>
                          <span className="font-bold text-xs text-white group-hover/city:text-brand-black block">
                            {city.name}
                          </span>
                          <span className="text-[9px] text-white/50 group-hover/city:text-brand-black/70 block">
                            {city.label}
                          </span>
                        </div>
                      </div>

                      {city.isPopular && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-gold/20 group-hover/city:bg-black/20 text-brand-gold group-hover/city:text-brand-black text-[8px] font-black uppercase">
                          VIP
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => handleCityPick(searchTerm)}
                    className="w-full px-4 py-3 rounded-2xl text-left bg-white/5 hover:bg-brand-gold hover:text-brand-black transition-all"
                  >
                    <span className="text-xs font-bold block">Buscar &quot;{searchTerm}&quot; en todo Ecuador</span>
                    <span className="text-[9px] text-white/50 block">Filtrar catálogo inmediatamente</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── ACTIVE LOCATION CONFIRMATION STATUS BADGE ── */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-dark border border-brand-gold/30 text-[10px] text-white/80 font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mostrando modelos en: <strong className="text-brand-gold font-bold">{selectedCity || "Machala (El Oro)"}</strong></span>
          {selectedCity !== "Todas las Ciudades" && (
            <button
              onClick={() => {
                setSelectedCity("Todas las Ciudades");
                onSelectLocation?.("");
              }}
              className="text-white/40 hover:text-brand-gold ml-1"
              title="Ver todo Ecuador"
            >
              (Ver todo)
            </button>
          )}
        </div>

        {/* ── INSTANT CITY & CANTON PILLS (1-TAP DIRECT GRAIN) ── */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar py-1 px-2">
            {[
              { id: "all", label: "🌐 Todo Ecuador", val: "" },
              { id: "machala", label: "📍 Machala VIP", val: "Machala" },
              { id: "pasaje", label: "📍 Pasaje", val: "Pasaje" },
              { id: "pto-bolivar", label: "📍 Puerto Bolívar", val: "Puerto Bolívar" },
              { id: "santa-rosa", label: "📍 Santa Rosa", val: "Santa Rosa" },
              { id: "guayaquil", label: "📍 Guayaquil", val: "Guayaquil" },
              { id: "quito", label: "📍 Quito", val: "Quito" },
              { id: "cuenca", label: "📍 Cuenca", val: "Cuenca" },
              { id: "manta", label: "📍 Manta", val: "Manta" },
              { id: "santo-domingo", label: "📍 Sto. Domingo", val: "Santo Domingo" },
            ].map((pill) => {
              const isActive = (pill.val === "" && selectedCity === "Todas las Ciudades") || selectedCity === pill.val;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    if (pill.val === "") {
                      setSelectedCity("Todas las Ciudades");
                      onSelectLocation?.("");
                    } else {
                      setSelectedCity(pill.val);
                      onSelectLocation?.(pill.val);
                    }
                    const collectionEl = document.getElementById("collection");
                    if (collectionEl) {
                      collectionEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`whitespace-nowrap flex-shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-brand-gold via-[#FFE088] to-brand-gold text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.5)] scale-105"
                      : "glass-obsidian border border-white/10 hover:border-brand-gold/50 text-white/70 hover:text-brand-gold hover:bg-white/5"
                  }`}
                >
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Special Category Pills */}
          <div className="flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-2">
            {[
              { id: "top-vip", label: "🔥 TOP VIP", val: "vip" },
              { id: "verificadas", label: "⭐ Verificadas 4K", val: "verificada" },
              { id: "culonas", label: "🍑 Culonas", val: "culona" },
              { id: "tetonas", label: "🍒 Tetonas", val: "tetona" },
              { id: "masajes", label: "💆 Masajes", val: "masaje" },
              { id: "video-360", label: "🔞 Vídeo 360°", val: "video" },
              { id: "novios", label: "🤝 Trato de Novios", val: "novios" },
            ].map((pill) => {
              const isActive = currentTag === pill.val;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    const newTag = currentTag === pill.val ? "" : pill.val;
                    setCurrentTag(newTag);
                    onSelectTag?.(newTag);
                    const collectionEl = document.getElementById("collection");
                    if (collectionEl) {
                      collectionEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`whitespace-nowrap flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-brand-pink text-white shadow-[0_0_15px_rgba(255,0,98,0.4)]"
                      : "glass-dark border border-white/10 hover:border-brand-pink/40 text-white/60 hover:text-white"
                  }`}
                >
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
