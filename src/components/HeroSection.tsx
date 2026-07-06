"use client";

import React, { useState, useRef, useEffect } from "react";
import { getProvinces, getCitiesByProvince } from "@/lib/cities";
import { Search, ChevronDown, Gem } from "lucide-react";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 noise-overlay">

      {/* ── CINEMATIC BACKGROUND ── */}
      <div className="absolute inset-0 -z-30" style={{ background: '#060608' }} />

      {/* Grid lines */}
      <div className="absolute inset-0 -z-20 grid-lines opacity-100" />

      {/* Video */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 z-10" style={{
          background: 'linear-gradient(to bottom, #060608 0%, rgba(6,6,8,0.3) 30%, rgba(6,6,8,0.2) 60%, #060608 100%)'
        }} />
        <div className="absolute inset-0 z-10" style={{
          background: 'linear-gradient(to right, rgba(6,6,8,0.8) 0%, transparent 40%, transparent 60%, rgba(6,6,8,0.8) 100%)'
        }} />
        <video
          autoPlay muted loop playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.18, filter: 'grayscale(60%) contrast(1.2) brightness(0.8)' }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-expensive-watch-detail-32431-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── FLOATING ORBS ── */}
      <div className="absolute top-[20%] left-[5%] w-[600px] h-[600px] -z-10 pointer-events-none animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] -z-10 pointer-events-none animate-blob animation-delay-2000"
        style={{ background: 'radial-gradient(circle, rgba(232,0,90,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] -z-10 pointer-events-none animate-orb-float"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.025) 0%, transparent 60%)', filter: 'blur(40px)' }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className={`max-w-7xl mx-auto px-6 w-full text-center z-10 space-y-16 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 px-7 py-2.5 rounded-full glass-gold">
            <Gem size={12} className="text-brand-gold" />
            <span className="label-xs text-brand-gold/90">
              El Estándar Dorado en Ecuador
            </span>
            <div className="w-1 h-1 rounded-full bg-brand-gold/50" />
            <span className="label-xs text-brand-gold/55">Est. 2024</span>
          </div>
        </div>

        {/* ── TITLE ── */}
        <div className="space-y-6">
          <h1 className="font-serif font-bold leading-[0.88] tracking-[-0.02em] select-none">
            <span className="block" style={{
              fontSize: 'clamp(4.5rem, 14vw, 13rem)',
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.75) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              CARIÑOSAS
            </span>
            <span className="block" style={{
              fontSize: 'clamp(4.5rem, 14vw, 13rem)',
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #F5E0A0 0%, #C9A84C 30%, #9A7B35 55%, #C9A84C 75%, #F5E0A0 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer-gold 5s linear infinite',
            }}>
              .TOP
            </span>
          </h1>

          {/* Subtitle */}
          <div className="flex flex-col items-center gap-5 max-w-lg mx-auto">
            <div className="divider-gold w-24" />
            <p className="label-sm text-white/55">
              El Máximo Estándar en Compañía de Élite
            </p>
            <div className="divider-gold w-24" />
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-10 mt-2">
            {[
              { value: '500+', label: 'Perfiles Verificados' },
              { value: '4K', label: 'Fotos Ultra HD' },
              { value: '24/7', label: 'Disponibilidad' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="font-serif text-3xl font-bold text-brand-gold leading-none">{value}</span>
                <span className="label-xs text-white/45">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="max-w-4xl mx-auto">
          {/* Container */}
          <div className="relative rounded-[2rem] p-[1px]"
            style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.4), rgba(201,168,76,0.08), rgba(201,168,76,0.3))',
              boxShadow: '0 0 80px rgba(201,168,76,0.06), 0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            <div className="rounded-[calc(2rem-1px)] overflow-hidden"
              style={{ background: 'rgba(14,14,18,0.95)', backdropFilter: 'blur(30px)' }}
            >
              <div className="flex flex-col md:flex-row items-stretch">

                {/* Location dropdown */}
                <div className="flex-1 relative" ref={locationRef}>
                  <button
                    onClick={() => { setIsLocationOpen(!isLocationOpen); setIsCategoryOpen(false); }}
                    className="w-full flex flex-col items-start px-8 py-6 text-left hover:bg-white/5 transition-colors group/loc outline-none"
                  >
                    <span className="label-xs text-brand-gold/65 mb-1.5">Localidad</span>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-serif text-xl text-white leading-none">{selectedLocationName}</span>
                      <ChevronDown size={14} className={`text-brand-gold/55 group-hover/loc:text-brand-gold transition-all duration-300 ml-3 ${isLocationOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                    </div>
                  </button>

                  {isLocationOpen && (
                    <div className="absolute top-full left-0 mt-3 w-full md:w-[480px] rounded-[1.8rem] p-5 z-50 no-scrollbar overflow-y-auto max-h-[340px]"
                      style={{ background: 'rgba(10,10,14,0.98)', backdropFilter: 'blur(40px)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 40px 80px rgba(0,0,0,0.9)' }}
                    >
                      <div className="space-y-5">
                        <button
                          onClick={() => { setSelectedLocation(""); setSelectedLocationName("Todas las Ciudades"); setIsLocationOpen(false); }}
                          className={`w-full text-left py-2.5 px-5 rounded-2xl text-[9px] uppercase tracking-[0.4em] font-black transition-all ${!selectedLocation ? 'bg-brand-gold text-brand-black' : 'text-white/40 hover:text-white hover:bg-white/4'}`}
                        >
                          Todas las Ciudades
                        </button>
                        {provinces.map(prov => (
                          <div key={prov} className="space-y-2">
                            <span className="text-[8px] text-brand-gold/50 font-black uppercase tracking-[0.3em] px-3 block border-l border-brand-gold/20 ml-2">{prov}</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {getCitiesByProvince(prov).map(city => (
                                <button
                                  key={city.id}
                                  onClick={() => { setSelectedLocation(city.id); setSelectedLocationName(city.name); setIsLocationOpen(false); }}
                                  className={`text-left py-2.5 px-4 rounded-xl text-[9px] font-bold transition-all ${selectedLocation === city.id ? 'bg-brand-gold text-brand-black font-black' : 'text-white/40 hover:text-white hover:bg-white/4'}`}
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
                <div className="hidden md:block w-[1px] my-4" style={{ background: 'rgba(201,168,76,0.08)' }} />

                {/* Category dropdown */}
                <div className="flex-1 relative" ref={categoryRef}>
                  <button
                    onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsLocationOpen(false); }}
                    className="w-full flex flex-col items-start px-8 py-6 text-left hover:bg-white/5 transition-colors group/cat outline-none"
                  >
                    <span className="label-xs text-brand-gold/65 mb-1.5">Categoría</span>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-serif text-xl text-white leading-none">{selectedCategoryName}</span>
                      <ChevronDown size={14} className={`text-brand-gold/55 group-hover/cat:text-brand-gold transition-all duration-300 ml-3 ${isCategoryOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                    </div>
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 mt-3 w-full rounded-[1.8rem] p-4 z-50"
                      style={{ background: 'rgba(10,10,14,0.98)', backdropFilter: 'blur(40px)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 40px 80px rgba(0,0,0,0.9)' }}
                    >
                      <div className="flex flex-col gap-1.5">
                        {[
                          { id: 'todas', name: 'Explorar Todo', sub: 'Todos los perfiles' },
                          { id: 'mujeres', name: 'Modelos Élite', sub: 'Selección premium' },
                          { id: 'trans', name: 'Modelos Trans', sub: 'Identidades diversas' },
                          { id: 'clubes', name: 'Clubes Exclusivos', sub: 'Experiencias en grupo' },
                        ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => { setSelectedCategory(cat.id); setSelectedCategoryName(cat.name); setIsCategoryOpen(false); }}
                            className={`w-full text-left py-3 px-5 rounded-xl transition-all flex items-center justify-between group/opt ${selectedCategory === cat.id ? 'bg-brand-gold' : 'hover:bg-white/4'}`}
                          >
                            <span className={`text-[9px] font-black uppercase tracking-[0.35em] ${selectedCategory === cat.id ? 'text-brand-black' : 'text-white/50 group-hover/opt:text-white'}`}>
                              {cat.name}
                            </span>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${selectedCategory === cat.id ? 'text-brand-black/50' : 'text-white/20'}`}>
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
                  <button className="btn-gold flex items-center gap-3 px-10 py-4 rounded-[1.5rem] w-full md:w-auto justify-center">
                    <Search size={16} strokeWidth={2.5} />
                    <span>Buscar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {[
              { label: 'VERCACE', city: 'Quito Norte' },
              { label: 'ELITE QUITO', city: 'González Suárez' },
              { label: 'DIAMOND GYE', city: 'Samborondón' },
              { label: 'VIP MANTA', city: 'Manta Centro' },
            ].map(({ label, city }, i) => (
              <button
                key={label}
                className="group flex items-center gap-2.5 px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/6 border border-white/8 hover:border-brand-gold/35"
                style={{ animationDelay: `${600 + i * 80}ms`, opacity: 0, animation: `fadeInUp 0.6s ease forwards ${600 + i * 80}ms` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/35 group-hover:bg-brand-gold group-hover:scale-125 transition-all duration-300" />
                <span className="label-xs text-white/50 group-hover:text-brand-gold/85 transition-colors duration-300">
                  {label}
                </span>
                <span className="label-xs text-white/25 group-hover:text-white/45 transition-colors hidden sm:block">
                  · {city}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-45 hover:opacity-80 transition-opacity duration-700 cursor-pointer group">
        <span className="text-[11px] font-serif italic text-white uppercase tracking-[0.5em]">Desliza para Descubrir</span>
        <div className="relative w-[1px] h-14 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-gold to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full bg-white/30 -translate-y-full group-hover:translate-y-[200%] transition-transform duration-1200 ease-in-out" />
        </div>
        <div className="w-1 h-1 rounded-full bg-brand-gold/50 animate-bounce" />
      </div>

    </section>
  );
}
