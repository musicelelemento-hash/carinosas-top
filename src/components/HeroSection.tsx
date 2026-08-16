"use client";

import React, { useState, useRef, useEffect } from "react";
import { type Country, type Province, getCountryById } from "@/lib/countries";
import { Search, ChevronDown, Gem, Sparkles, ShieldCheck, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  currentCountry?: Country;
  onSelectLocation?: (locationName: string) => void;
  onSelectTag?: (tag: string) => void;
  activeTag?: string;
}

export default function HeroSection({ currentCountry, onSelectLocation, onSelectTag, activeTag }: HeroSectionProps = {}) {
  const activeCountry = currentCountry || getCountryById("ecuador");
  const provinces = activeCountry.provinces || [];
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationName, setSelectedLocationName] = useState("Todas las Ciudades");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedCategoryName, setSelectedCategoryName] = useState("Explorar Todo");
  const [currentTag, setCurrentTag] = useState(activeTag || "");
  const [mounted, setMounted] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) setIsLocationOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) setIsCategoryOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="relative overflow-hidden pt-6 pb-6 noise-overlay bg-[#08080C]">

      {/* ── CINEMATIC BACKGROUND ── */}
      <div className="absolute inset-0 -z-30 bg-[#08080C]" />

      {/* Grid lines */}
      <div className="absolute inset-0 -z-20 grid-lines opacity-60" />

      {/* Video Overlay with Vignette */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <video
          autoPlay muted loop playsInline
          className="w-full h-full object-cover grayscale contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-expensive-watch-detail-32431-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── FLOATING OBSIDIAN ORBS ── */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] -z-10 pointer-events-none rounded-full bg-brand-gold/5 blur-[100px]" />
      <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] -z-10 pointer-events-none rounded-full bg-brand-pink/5 blur-[100px]" />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full text-center z-10 space-y-6">

        {/* Top Header Badge & Micro Title */}
        <div className="flex flex-col items-center gap-3">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full glass-obsidian border border-brand-gold/40 shadow-[0_0_25px_rgba(212,168,67,0.2)]"
          >
            <Gem size={13} className="text-brand-gold animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-brand-gold">
              Directorio de Lujo · Círculo Élite
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
            Acompañamiento VIP & Modelos 4K Verificadas en {activeCountry.name}
          </p>
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="max-w-4xl mx-auto">
          {/* Container */}
          <div className="relative rounded-[2.5rem] p-[1px] bg-gradient-to-r from-brand-gold/40 via-white/10 to-brand-gold/40 shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
            <div className="rounded-[calc(2.5rem-1px)] overflow-hidden glass-obsidian backdrop-blur-3xl">
              <div className="flex flex-col md:flex-row items-stretch">

                {/* Location dropdown */}
                <div className="flex-1 relative" ref={locationRef}>
                  <button
                    onClick={() => { setIsLocationOpen(!isLocationOpen); setIsCategoryOpen(false); }}
                    className="w-full flex flex-col items-start px-8 py-6 text-left hover:bg-white/5 transition-colors group/loc outline-none"
                  >
                    <span className="text-[9px] text-brand-gold uppercase font-black tracking-widest mb-1.5">Localidad</span>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-serif text-xl text-white leading-none italic">{selectedLocationName}</span>
                      <ChevronDown size={14} className={`text-brand-gold/70 group-hover/loc:text-brand-gold transition-all duration-300 ml-3 ${isLocationOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                    </div>
                  </button>

                  {isLocationOpen && (
                    <div className="absolute top-full left-0 mt-3 w-full md:w-[500px] rounded-[2rem] p-5 z-50 no-scrollbar overflow-y-auto max-h-[360px] glass-obsidian border border-brand-gold/30 shadow-[0_40px_80px_rgba(0,0,0,0.95)]">
                      <div className="space-y-4">
                        <button
                          onClick={() => {
                            setSelectedLocation("");
                            setSelectedLocationName(`Todas las Ciudades (${activeCountry.name})`);
                            setIsLocationOpen(false);
                            onSelectLocation?.("");
                          }}
                          className={`w-full text-left py-2.5 px-5 rounded-2xl text-[9px] uppercase tracking-[0.4em] font-black transition-all ${!selectedLocation ? 'bg-brand-gold text-brand-black' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                        >
                          🌐 Todas las Ciudades ({activeCountry.flag} {activeCountry.name})
                        </button>
                        {provinces.map((prov) => (
                          <div key={prov.id} className="space-y-2">
                            <span className="text-[8px] text-brand-gold font-black uppercase tracking-[0.3em] px-3 block border-l border-brand-gold/40 ml-2">
                              {prov.name} {prov.region ? `· ${prov.region}` : ""}
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {prov.cantons.map((canton) => (
                                <button
                                  key={canton.id}
                                  onClick={() => {
                                    setSelectedLocation(canton.id);
                                    setSelectedLocationName(canton.name);
                                    setIsLocationOpen(false);
                                    onSelectLocation?.(canton.name);
                                  }}
                                  className={`text-left py-2 px-3 rounded-xl text-[9px] font-bold transition-all truncate flex items-center justify-between ${selectedLocation === canton.id ? 'bg-brand-gold text-brand-black font-black' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                                  title={canton.name}
                                >
                                  <span className="truncate">{canton.name}</span>
                                  {canton.isPopular && (
                                    <span className="text-[7px] text-brand-gold uppercase tracking-tighter ml-1 shrink-0 font-black">VIP</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="hidden md:block w-[1px] my-4 bg-white/10" />

                {/* Category dropdown */}
                <div className="flex-1 relative" ref={categoryRef}>
                  <button
                    onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsLocationOpen(false); }}
                    className="w-full flex flex-col items-start px-8 py-6 text-left hover:bg-white/5 transition-colors group/cat outline-none"
                  >
                    <span className="text-[9px] text-brand-gold uppercase font-black tracking-widest mb-1.5">Categoría</span>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-serif text-xl text-white leading-none italic">{selectedCategoryName}</span>
                      <ChevronDown size={14} className={`text-brand-gold/70 group-hover/cat:text-brand-gold transition-all duration-300 ml-3 ${isCategoryOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                    </div>
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 mt-3 w-full rounded-[2rem] p-4 z-50 glass-obsidian border border-brand-gold/30 shadow-[0_40px_80px_rgba(0,0,0,0.95)]">
                      <div className="flex flex-col gap-1.5">
                        {[
                          { id: 'todas', name: 'Explorar Todo', sub: 'Todos los perfiles' },
                          { id: 'mujeres', name: 'Modelos Élite 4K', sub: 'Selección premium' },
                          { id: 'trans', name: 'Modelos Trans', sub: 'Identidades diversas' },
                          { id: 'clubes', name: 'Clubes Exclusivos', sub: 'Experiencias en grupo' },
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => { setSelectedCategory(cat.id); setSelectedCategoryName(cat.name); setIsCategoryOpen(false); }}
                            className={`w-full text-left py-3 px-5 rounded-2xl transition-all flex items-center justify-between group/opt ${selectedCategory === cat.id ? 'bg-brand-gold text-brand-black' : 'hover:bg-white/5'}`}
                          >
                            <span className={`text-[9px] font-black uppercase tracking-[0.35em] ${selectedCategory === cat.id ? 'text-brand-black' : 'text-white/70 group-hover/opt:text-white'}`}>
                              {cat.name}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${selectedCategory === cat.id ? 'text-brand-black/70' : 'text-white/30'}`}>
                              {cat.sub}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search button */}
                <div className="p-3 flex items-stretch">
                  <a
                    href="#collection"
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-widest w-full md:w-auto justify-center transition-all shadow-lg shadow-brand-gold/20"
                  >
                    <Search size={16} strokeWidth={2.5} />
                    <span>Buscar</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── FAST FILTER PILLS (SKOKKA-KILLER HIGH-SPEED TAG BAR) ── */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={13} className="text-brand-gold animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold/80">
                Filtros Rápidos Populares
              </span>
            </div>

            {/* Scrollable Pill Tags Bar */}
            <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar py-2 px-2">
              {[
                { id: 'all', label: '🌐 Todo', type: 'all', val: '' },
                { id: 'top-vip', label: '🔥 TOP VIP', type: 'tag', val: 'vip' },
                { id: 'verificadas', label: '⭐ Verificadas 4K', type: 'tag', val: 'verificada' },
                { id: 'machala', label: '📍 Machala', type: 'location', val: 'Machala' },
                { id: 'guayaquil', label: '📍 Guayaquil', type: 'location', val: 'Guayaquil' },
                { id: 'quito', label: '📍 Quito', type: 'location', val: 'Quito' },
                { id: 'cuenca', label: '📍 Cuenca', type: 'location', val: 'Cuenca' },
                { id: 'culonas', label: '🍑 Culonas', type: 'tag', val: 'culona' },
                { id: 'tetonas', label: '🍒 Tetonas', type: 'tag', val: 'tetona' },
                { id: 'masajes', label: '💆 Masajes Eróticos', type: 'tag', val: 'masaje' },
                { id: 'video-360', label: '🔞 Vídeo 360°', type: 'tag', val: 'video' },
                { id: 'novios', label: '🤝 Trato de Novios', type: 'tag', val: 'novios' },
              ].map((pill) => {
                const isActive = currentTag === pill.val || (pill.type === 'location' && selectedLocationName.includes(pill.val));
                return (
                  <button
                    key={pill.id}
                    onClick={() => {
                      if (pill.type === 'all') {
                        setCurrentTag('');
                        setSelectedLocation('');
                        setSelectedLocationName('Todas las Ciudades');
                        onSelectLocation?.('');
                        onSelectTag?.('');
                      } else if (pill.type === 'location') {
                        setCurrentTag('');
                        setSelectedLocation(pill.val);
                        setSelectedLocationName(pill.val);
                        onSelectLocation?.(pill.val);
                      } else {
                        const newTag = currentTag === pill.val ? '' : pill.val;
                        setCurrentTag(newTag);
                        onSelectTag?.(newTag);
                      }
                      
                      const collectionEl = document.getElementById('collection');
                      if (collectionEl) {
                        collectionEl.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-gold via-[#FFE088] to-brand-gold text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.5)] scale-105'
                        : 'glass-obsidian border border-white/10 hover:border-brand-gold/50 text-white/70 hover:text-brand-gold hover:bg-white/5'
                    }`}
                  >
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-700 cursor-pointer">
        <span className="text-[9px] font-serif italic text-white uppercase tracking-[0.4em]">Desliza para Explorar</span>
        <div className="w-1 h-3 rounded-full bg-brand-gold animate-bounce" />
      </div>

    </section>
  );
}
