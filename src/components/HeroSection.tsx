"use client";

import React, { useState, useRef, useEffect } from "react";
import { getProvinces, getCitiesByProvince } from "@/lib/cities";
import { Search, ChevronDown, Gem, Sparkles, ShieldCheck, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSection() {
  const provinces = getProvinces();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationName, setSelectedLocationName] = useState("Todas las Ciudades");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedCategoryName, setSelectedCategoryName] = useState("Explorar Todo");
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-20 noise-overlay bg-[#08080C]">

      {/* ── CINEMATIC BACKGROUND ── */}
      <div className="absolute inset-0 -z-30 bg-[#08080C]" />

      {/* Grid lines */}
      <div className="absolute inset-0 -z-20 grid-lines opacity-100" />

      {/* Video Overlay with Vignette */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#08080C] via-transparent to-[#08080C]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#08080C]/90 via-transparent to-[#08080C]/90" />
        <video
          autoPlay muted loop playsInline
          className="w-full h-full object-cover opacity-15 grayscale contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-expensive-watch-detail-32431-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── FLOATING OBSIDIAN ORBS ── */}
      <motion.div 
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[5%] w-[600px] h-[600px] -z-10 pointer-events-none rounded-full bg-brand-gold/5 blur-[120px]" 
      />
      <motion.div 
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] -z-10 pointer-events-none rounded-full bg-brand-pink/5 blur-[120px]" 
      />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 w-full text-center z-10 space-y-10">

        {/* Live Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-obsidian border border-brand-gold/40 shadow-[0_0_35px_rgba(212,168,67,0.25)] pulse-gold-aura">
            <Gem size={14} className="text-brand-gold animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-gold">
              Directorio de Lujo · Círculo Élite
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">En Vivo</span>
          </div>
        </motion.div>

        {/* ── TITLE ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="space-y-6 relative"
        >
          
          {/* Subtle Ambient Light behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-brand-gold/10 rounded-full blur-[90px] pointer-events-none -z-10" />

          <h1 className="font-serif font-bold leading-[0.88] tracking-[-0.02em] select-none">
            <span className="block text-5xl sm:text-8xl lg:text-[9.5rem] bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
              CARIÑOSAS
            </span>
            <span className="block text-5xl sm:text-8xl lg:text-[9.5rem] italic text-gold-shimmer drop-shadow-[0_0_60px_rgba(212,168,67,0.5)]">
              .TOP
            </span>
          </h1>

          {/* Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-4 max-w-xl mx-auto"
          >
            <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
            <p className="text-xs sm:text-sm text-white/80 uppercase tracking-[0.3em] font-medium">
              El Máximo Círculo de Acompañamiento VIP & Modelos 4K
            </p>
            <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-8 sm:gap-14 pt-3"
          >
            {[
              { value: '500+', label: 'Modelos Verificadas' },
              { value: '4K', label: 'Ultra HD & Audio' },
              { value: '100%', label: 'Discreción Blindada' },
              { value: '24/7', label: 'Concierge Directo' },
            ].map(({ value, label }) => (
              <motion.div 
                key={label} 
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex flex-col items-center gap-1 group cursor-default transition-all"
              >
                <span className="font-serif text-2xl sm:text-4xl font-bold text-brand-gold leading-none">{value}</span>
                <span className="text-[8px] sm:text-[9px] uppercase font-black tracking-widest text-white/40">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-3"
          >
            <motion.a
              href="#collection"
              whileHover={{ scale: 1.05, boxShadow: "0 15px 45px rgba(212,168,67,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] hover:brightness-110 text-brand-black font-black text-[10px] uppercase tracking-[0.25em] transition-all inline-flex items-center gap-2.5 shadow-[0_10px_35px_rgba(212,168,67,0.35)] cursor-pointer"
            >
              <span>Explorar Catálogo 4K</span>
              <span aria-hidden="true" className="animate-bounce">↓</span>
            </motion.a>
          </motion.div>
        </motion.div>

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
                    <div className="absolute top-full left-0 mt-3 w-full md:w-[480px] rounded-[2rem] p-5 z-50 no-scrollbar overflow-y-auto max-h-[340px] glass-obsidian border border-brand-gold/30 shadow-[0_40px_80px_rgba(0,0,0,0.95)]">
                      <div className="space-y-4">
                        <button
                          onClick={() => { setSelectedLocation(""); setSelectedLocationName("Todas las Ciudades"); setIsLocationOpen(false); }}
                          className={`w-full text-left py-2.5 px-5 rounded-2xl text-[9px] uppercase tracking-[0.4em] font-black transition-all ${!selectedLocation ? 'bg-brand-gold text-brand-black' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                        >
                          Todas las Ciudades
                        </button>
                        {provinces.map(prov => (
                          <div key={prov} className="space-y-2">
                            <span className="text-[8px] text-brand-gold font-black uppercase tracking-[0.3em] px-3 block border-l border-brand-gold/40 ml-2">{prov}</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {getCitiesByProvince(prov).map(city => (
                                <button
                                  key={city.id}
                                  onClick={() => { setSelectedLocation(city.id); setSelectedLocationName(city.name); setIsLocationOpen(false); }}
                                  className={`text-left py-2.5 px-4 rounded-xl text-[9px] font-bold transition-all ${selectedLocation === city.id ? 'bg-brand-gold text-brand-black font-black' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                                >
                                  {city.name}
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
                    href="#catalog"
                    className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-widest w-full md:w-auto justify-center transition-all shadow-lg shadow-brand-gold/20"
                  >
                    <Search size={16} strokeWidth={2.5} />
                    <span>Buscar</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Zone Chips */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {[
              { label: 'QUITO NORTE', city: 'La Carolina' },
              { label: 'CUMBAYÁ VIP', city: 'Cumbayá' },
              { label: 'SAMBORONDÓN', city: 'Guayaquil' },
              { label: 'PLAZA DEL SOL', city: 'Manta' },
              { label: 'HOTEL 5★', city: 'Servicio Express' },
            ].map(({ label, city }) => (
              <a
                key={label}
                href="#catalog"
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-obsidian border border-white/10 hover:border-brand-gold/50 text-[9px] text-white/60 hover:text-brand-gold font-bold uppercase tracking-wider transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                <span>{label}</span>
                <span className="text-white/30 hidden sm:inline">· {city}</span>
              </a>
            ))}
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
