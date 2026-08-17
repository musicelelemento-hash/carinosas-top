"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  MapPin, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  Crown,
  Search, 
  Flame, 
  Check
} from "lucide-react";
import { COUNTRIES, type Country, type Province, type Canton, REGION_COLORS } from "@/lib/countries";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { soundFX } from "@/lib/soundFX";

// ─── Types ───────────────────────────────────────────────────
type Step = "country" | "province" | "canton" | "entering";

interface SelectedLocation {
  country: Country;
  province: Province | null;
  canton: Canton | null;
}

interface LocationGatewayProps {
  onEnter: (location: { countryId: string; provinceId: string | null; cantonId: string | null; cantonName: string | null }) => void;
}

const STORAGE_KEY = "carinosas_location_v2";

function triggerHaptic(ms = 15) {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(ms); } catch {}
  }
}

// ─── Region color helper ──────────────────────────────────────
function regionColor(region?: string): string {
  if (!region) return "#D4A843";
  return REGION_COLORS[region] || "#D4A843";
}

// ─── LUXURY VIP PORTAL DOOR ANIMATION ──────────────────────────
function DoorAnimation({ onComplete, countryName, cantonName }: { onComplete: () => void; countryName?: string; cantonName?: string }) {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");

  useEffect(() => {
    // Sound FX: Iris Aperture and Confetti
    try {
      soundFX?.playIrisAperture();
    } catch {}

    // Fire double champagne gold stardust burst
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#D4A843', '#FFE088', '#F5E0A0', '#AA7C11', '#FFFFFF'],
        ticks: 220,
        gravity: 0.75,
        shapes: ['circle', 'square'],
      });
    } catch {}

    triggerHaptic(30);

    const t1 = setTimeout(() => setPhase("opening"), 350);
    const t2 = setTimeout(() => setPhase("open"), 1500);
    const t3 = setTimeout(() => onComplete(), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden pointer-events-none" aria-hidden>
      
      {/* Central Light Beam Burst */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: phase === "opening" ? 1 : 0, scale: phase === "opening" ? 2.8 : 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[900px] h-[900px] rounded-full bg-radial from-[#D4A843]/45 via-[#FFE088]/20 to-transparent blur-3xl" />
      </motion.div>

      {/* Central Holographic Iris Vault HUD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: phase === "closed" ? 1 : phase === "opening" ? [1, 1, 0] : 0,
          scale: phase === "opening" ? 1.35 : 1,
          rotate: phase === "opening" ? 180 : 0
        }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="absolute z-30 flex flex-col items-center justify-center gap-4 text-center pointer-events-none px-6"
      >
        {/* Rotating Outer Ring */}
        <div className="relative w-40 h-40 rounded-full border-2 border-dashed border-brand-gold/70 flex items-center justify-center shadow-[0_0_60px_rgba(212,168,67,0.6)]">
          {/* Inner Glowing Core */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#D4A843] via-[#FFE088] to-[#9A7830] p-1 shadow-[0_0_50px_rgba(212,168,67,0.8)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#08080C] flex items-center justify-center">
              <ShieldCheck size={42} className="text-brand-gold animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs text-brand-gold font-black uppercase tracking-[0.45em] block">
            ACCESO VIP CONCEDIDO
          </span>
          <span className="text-[9px] text-white/70 uppercase tracking-widest block font-mono">
            {cantonName ? `${cantonName} · ` : ""}{countryName || "ECUADOR"} · ENCRIPTADO AES-256
          </span>
        </div>
      </motion.div>

      {/* LEFT VAULT DOOR PANEL */}
      <div
        className="relative w-1/2 h-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0A0A10 0%, #06060A 100%)",
          transform: phase === "opening" || phase === "open" ? "translateX(-100%)" : "translateX(0)",
          transition: phase === "closed" ? "none" : "transform 1.3s cubic-bezier(0.76, 0, 0.24, 1)",
          boxShadow: phase !== "open" ? "10px 0 80px rgba(212,168,67,0.25)" : "none",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-end pr-10 pointer-events-none">
          <div className="flex flex-col items-end gap-5 opacity-40">
            <div className="h-px w-48 bg-gradient-to-l from-brand-gold to-transparent" />
            <div className="h-px w-28 bg-gradient-to-l from-brand-gold to-transparent" />
            <div className="h-px w-48 bg-gradient-to-l from-brand-gold to-transparent" />
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[2px]"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(212,168,67,0.8), rgba(255,224,136,1), rgba(212,168,67,0.8), transparent)" }}
        />
      </div>

      {/* RIGHT VAULT DOOR PANEL */}
      <div
        className="relative w-1/2 h-full overflow-hidden"
        style={{
          background: "linear-gradient(225deg, #0A0A10 0%, #06060A 100%)",
          transform: phase === "opening" || phase === "open" ? "translateX(100%)" : "translateX(0)",
          transition: phase === "closed" ? "none" : "transform 1.3s cubic-bezier(0.76, 0, 0.24, 1)",
          boxShadow: phase !== "open" ? "-10px 0 80px rgba(212,168,67,0.25)" : "none",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-start pl-10 pointer-events-none">
          <div className="flex flex-col items-start gap-5 opacity-40">
            <div className="h-px w-48 bg-gradient-to-r from-brand-gold to-transparent" />
            <div className="h-px w-28 bg-gradient-to-r from-brand-gold to-transparent" />
            <div className="h-px w-48 bg-gradient-to-r from-brand-gold to-transparent" />
          </div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(212,168,67,0.8), rgba(255,224,136,1), rgba(212,168,67,0.8), transparent)" }}
        />
      </div>
    </div>
  );
}

// ─── STEP 1: ULTRA-LUXURY COUNTRY SELECTOR ─────────────────────
function CountryStep({
  onSelect,
}: {
  onSelect: (country: Country) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    const q = searchQuery.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.provinces.some((p) => p.name.toLowerCase().includes(q) || p.cantons.some((k) => k.name.toLowerCase().includes(q)))
    );
  }, [searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-10">
      
      {/* Header with Haute Horlogerie styling */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-obsidian border border-brand-gold/30 shadow-[0_0_25px_rgba(212,168,67,0.2)]"
        >
          <Globe size={14} className="text-brand-gold animate-spin-slow" />
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-brand-gold">
            Directorio Internacional · Círculo Secreto
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight"
        >
          ¿Desde dónde{" "}
          <span
            className="italic text-gold-shimmer"
          >
            nos visitas?
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-white/50 font-light max-w-md mx-auto"
        >
          Selecciona tu país para desbloquear el catálogo 4K y acompañantes verificadas en tu zona
        </motion.p>

        {/* Quick Search Input */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-md mx-auto pt-2"
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar país, provincia o ciudad..."
            className="w-full glass-obsidian border border-brand-gold/30 focus:border-brand-gold rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-white/30 outline-none transition-all shadow-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs px-2"
            >
              ✕
            </button>
          )}
        </motion.div>
      </div>

      {/* Country Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {filteredCountries.map((country, i) => {
          const isHovered = hoveredId === country.id;
          const isEcuador = country.id === "ecuador";

          return (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                triggerHaptic();
                onSelect(country);
              }}
              onMouseEnter={() => {
                setHoveredId(country.id);
                triggerHaptic(8);
              }}
              onMouseLeave={() => setHoveredId(null)}
              className="relative rounded-[2rem] overflow-hidden group cursor-pointer text-left outline-none border transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              style={{
                aspectRatio: "3/4",
                borderColor: isHovered 
                  ? "rgba(212,168,67,0.8)" 
                  : isEcuador 
                  ? "rgba(212,168,67,0.4)" 
                  : "rgba(255,255,255,0.08)",
                boxShadow: isHovered 
                  ? `0 15px 45px ${country.accentColor}33, inset 0 0 25px ${country.accentColor}15` 
                  : "0 10px 30px rgba(0,0,0,0.6)"
              }}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={country.image}
                  alt={country.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  style={{
                    filter: isHovered
                      ? "brightness(0.55) saturate(1.2)"
                      : "brightness(0.38) saturate(0.9)",
                  }}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to top, rgba(8,8,12,0.98) 0%, rgba(8,8,12,0.65) 45%, rgba(8,8,12,0.2) 80%, transparent 100%)`,
                }}
              />

              {/* Top Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                {/* Flag + Dial Code Chip */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-obsidian border border-white/15 shadow-md">
                  <span className="text-base">{country.flag}</span>
                  <span className="text-[10px] font-mono font-bold text-white/80">{country.dialCode}</span>
                </div>

                {/* Status Badge */}
                {isEcuador ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold text-brand-black shadow-[0_0_20px_rgba(212,168,67,0.5)]">
                    <Crown size={11} className="fill-current" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Sede Principal</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-dark border border-brand-gold/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider">VIP Activo</span>
                  </div>
                )}
              </div>

              {/* Bottom Card Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 space-y-2.5 z-10">
                <div className="space-y-1">
                  <span className="text-[9px] text-brand-gold/70 font-mono font-bold uppercase tracking-[0.3em] block">
                    {country.provinces.length} {country.id === "colombia" ? "Departamentos" : "Provincias"}
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-white leading-none group-hover:text-gold-shimmer transition-colors">
                    {country.name}
                  </h3>
                </div>

                <p className="text-[10px] text-white/50 line-clamp-2 leading-relaxed font-light">
                  {country.tagline}
                </p>

                {/* Enter Action Button */}
                <div className="pt-2">
                  <div 
                    className="w-full py-2.5 px-4 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-between border"
                    style={{
                      background: isHovered 
                        ? "linear-gradient(135deg, #D4A843, #FFE088)" 
                        : "rgba(255,255,255,0.06)",
                      color: isHovered ? "#08080C" : "rgba(255,255,255,0.8)",
                      borderColor: isHovered ? "#D4A843" : "rgba(255,255,255,0.12)",
                      boxShadow: isHovered ? "0 4px 20px rgba(212,168,67,0.4)" : "none"
                    }}
                  >
                    <span>Explorar Catálogo</span>
                    <ArrowRight size={12} className={isHovered ? "translate-x-1 transition-transform" : ""} />
                  </div>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

// ─── STEP 2: PROVINCE SELECTOR WITH SEARCH ────────────────────
function ProvinceStep({
  country,
  onSelect,
  onBack,
}: {
  country: Country;
  onSelect: (province: Province) => void;
  onBack: () => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProvinces = useMemo(() => {
    if (!searchQuery.trim()) return country.provinces;
    const q = searchQuery.toLowerCase().trim();
    return country.provinces.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.region && p.region.toLowerCase().includes(q)) ||
        p.cantons.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [country.provinces, searchQuery]);

  // Group by region
  const grouped = useMemo(() => {
    return filteredProvinces.reduce<Record<string, Province[]>>((acc, p) => {
      const key = p.region || "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    }, {});
  }, [filteredProvinces]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-8">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold hover:text-white uppercase tracking-widest transition-colors group self-start"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Cambiar de País</span>
        </button>

        {/* Active Country Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-obsidian border border-brand-gold/30 text-xs text-white">
            <span className="text-lg">{country.flag}</span>
            <span className="font-serif font-bold">{country.name}</span>
            <span className="text-[10px] text-brand-gold font-mono">({country.provinces.length} provincias)</span>
          </div>
        </div>
      </div>

      {/* Title & Filter Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] text-brand-gold uppercase tracking-[0.3em] font-black block">
            Paso 2 · Selección de Zona
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-none">
            Elige tu{" "}
            <span className="italic text-gold-shimmer">
              {country.id === "colombia" ? "Departamento" : "Provincia"}
            </span>
          </h2>
          <p className="text-xs text-white/50 font-light">
            Selecciona la región para desplegar los cantones y sectores con modelos activas
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar provincia o cantón..."
            className="w-full glass-obsidian border border-brand-gold/30 focus:border-brand-gold rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-white/30 outline-none transition-all"
          />
        </div>
      </div>

      {/* Provinces Grouped by Region */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([region, provinces]) => (
          <div key={region} className="space-y-4">
            
            {/* Region label header */}
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: regionColor(region) }}
              />
              <span
                className="text-xs font-black uppercase tracking-[0.25em]"
                style={{ color: regionColor(region) }}
              >
                Región {region}
              </span>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-white/30 font-mono">
                {provinces.length} {country.id === "colombia" ? "deptos" : "provincias"}
              </span>
            </div>

            {/* Provinces Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {provinces.map((province) => {
                const isHovered = hoveredId === province.id;
                const rColor = regionColor(province.region);
                const popularCount = province.cantons.filter(c => c.isPopular).length;

                return (
                  <motion.button
                    key={province.id}
                    whileHover={{ scale: 1.02, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      triggerHaptic();
                      onSelect(province);
                    }}
                    onMouseEnter={() => {
                      setHoveredId(province.id);
                      triggerHaptic(6);
                    }}
                    onMouseLeave={() => setHoveredId(null)}
                    className="relative rounded-2xl p-4 text-left transition-all duration-300 outline-none border flex flex-col justify-between space-y-3 glass-obsidian"
                    style={{
                      background: isHovered
                        ? `linear-gradient(135deg, rgba(212,168,67,0.15), rgba(8,8,12,0.95))`
                        : "rgba(255,255,255,0.03)",
                      borderColor: isHovered ? rColor : "rgba(255,255,255,0.08)",
                      boxShadow: isHovered ? `0 10px 30px ${rColor}25` : "none",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-serif text-base font-bold text-white group-hover:text-brand-gold transition-colors leading-tight">
                        {province.name}
                      </span>
                      <ArrowRight
                        size={13}
                        style={{
                          color: isHovered ? rColor : "rgba(255,255,255,0.2)",
                          transform: isHovered ? "translateX(2px)" : "none",
                          transition: "all 0.2s ease"
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] pt-1">
                      <span className="text-white/40 font-mono font-medium">
                        {province.cantons.length} cantones
                      </span>
                      {popularCount > 0 && (
                        <span className="text-brand-gold font-bold px-2 py-0.5 rounded-full bg-brand-gold/10 border border-brand-gold/20">
                          {popularCount} VIP
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

// ─── STEP 3: CANTON SELECTOR WITH VIP BADGES & FAST ENTRY ─────
function CantonStep({
  country,
  province,
  onSelect,
  onBack,
}: {
  country: Country;
  province: Province;
  onSelect: (canton: Canton) => void;
  onBack: () => void;
}) {
  const [selectedCanton, setSelectedCanton] = useState<Canton | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const popularCantons = useMemo(() => province.cantons.filter((c) => c.isPopular), [province.cantons]);
  const otherCantons = useMemo(() => province.cantons.filter((c) => !c.isPopular), [province.cantons]);

  const filteredPopular = useMemo(() => {
    if (!searchQuery.trim()) return popularCantons;
    const q = searchQuery.toLowerCase().trim();
    return popularCantons.filter((c) => c.name.toLowerCase().includes(q));
  }, [popularCantons, searchQuery]);

  const filteredOthers = useMemo(() => {
    if (!searchQuery.trim()) return otherCantons;
    const q = searchQuery.toLowerCase().trim();
    return otherCantons.filter((c) => c.name.toLowerCase().includes(q));
  }, [otherCantons, searchQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 space-y-8">
      
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold hover:text-white uppercase tracking-widest transition-colors group self-start"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Cambiar {country.id === "colombia" ? "Departamento" : "Provincia"}</span>
        </button>

        {/* Path Indicator */}
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span>{country.flag} {country.name}</span>
          <span>›</span>
          <span className="text-brand-gold font-bold">{province.name}</span>
          {province.region && <span className="text-[10px] text-white/40">({province.region})</span>}
        </div>
      </div>

      {/* Title & Fast Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] text-brand-gold uppercase tracking-[0.3em] font-black block">
            Paso 3 · Ciudad o Cantón Específico
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-none">
            {province.name}
          </h2>
          <p className="text-xs text-white/50 font-light">
            Elige tu cantón o sector para conectar directamente con acompañantes en esa zona
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cantón..."
            className="w-full glass-obsidian border border-brand-gold/30 focus:border-brand-gold rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-white/30 outline-none transition-all"
          />
        </div>
      </div>

      {/* POPULAR CANTONS (24K Gold Highlighted) */}
      {filteredPopular.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-brand-gold animate-pulse" />
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.25em]">
              Zonas de Alto Nivel & Más Populares
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredPopular.map((canton) => {
              const isSel = selectedCanton?.id === canton.id;
              const isHov = hoveredId === canton.id;

              return (
                <motion.button
                  key={canton.id}
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    triggerHaptic();
                    setSelectedCanton(canton);
                  }}
                  onMouseEnter={() => {
                    setHoveredId(canton.id);
                    triggerHaptic(6);
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative rounded-2xl p-4 text-left transition-all duration-300 outline-none border flex items-center justify-between glass-obsidian"
                  style={{
                    background: isSel
                      ? "linear-gradient(135deg, rgba(212,168,67,0.3), rgba(212,168,67,0.1))"
                      : isHov
                      ? "rgba(212,168,67,0.12)"
                      : "rgba(255,255,255,0.04)",
                    borderColor: isSel
                      ? "#D4A843"
                      : isHov
                      ? "rgba(212,168,67,0.5)"
                      : "rgba(212,168,67,0.2)",
                    boxShadow: isSel ? "0 0 35px rgba(212,168,67,0.35)" : "none"
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-bold text-white">
                        {canton.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-brand-gold/70">
                      <MapPin size={10} className="text-brand-gold" />
                      <span>{province.name} VIP</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold font-black uppercase tracking-wider border border-brand-gold/30">
                      VIP
                    </span>
                    {isSel ? (
                      <CheckCircle size={18} className="text-brand-gold fill-brand-gold/20" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ALL OTHER CANTONS */}
      {filteredOthers.length > 0 && (
        <div className="space-y-3.5">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] block">
            Todos los Cantones de {province.name} ({filteredOthers.length})
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredOthers.map((canton) => {
              const isSel = selectedCanton?.id === canton.id;
              const isHov = hoveredId === canton.id;

              return (
                <button
                  key={canton.id}
                  onClick={() => {
                    triggerHaptic();
                    setSelectedCanton(canton);
                  }}
                  onMouseEnter={() => setHoveredId(canton.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 outline-none border flex items-center justify-between"
                  style={{
                    background: isSel
                      ? "rgba(212,168,67,0.2)"
                      : isHov
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.03)",
                    borderColor: isSel ? "#D4A843" : "rgba(255,255,255,0.07)",
                    color: isSel ? "#D4A843" : isHov ? "#FFFFFF" : "rgba(255,255,255,0.65)"
                  }}
                >
                  <span className="text-xs font-medium truncate mr-2">{canton.name}</span>
                  {isSel && <Check size={12} className="text-brand-gold shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA ACTIONS */}
      <div className="flex flex-col items-center gap-4 pt-6 border-t border-white/10">
        <motion.button
          whileHover={{ scale: selectedCanton ? 1.03 : 1 }}
          whileTap={{ scale: selectedCanton ? 0.97 : 1 }}
          onClick={() => selectedCanton && onSelect(selectedCanton)}
          disabled={!selectedCanton}
          className="relative group overflow-hidden px-12 py-4.5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center gap-3 shadow-[0_10px_40px_rgba(212,168,67,0.4)]"
          style={{
            background: selectedCanton
              ? "linear-gradient(135deg, #D4A843 0%, #FFE088 50%, #AA7C11 100%)"
              : "rgba(255,255,255,0.05)",
            color: selectedCanton ? "#08080C" : "rgba(255,255,255,0.25)",
            cursor: selectedCanton ? "pointer" : "not-allowed",
            border: selectedCanton ? "none" : "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <Sparkles size={16} className={selectedCanton ? "text-brand-black fill-current animate-pulse" : ""} />
          <span>{selectedCanton ? `Entrar a ${selectedCanton.name}` : "Selecciona un cantón"}</span>
          <ArrowRight size={14} />
        </motion.button>

        {/* Skip to entire province */}
        <button
          onClick={() => onSelect({ id: "all", name: `Todas las ciudades de ${province.name}` })}
          className="text-[10px] text-brand-gold/70 hover:text-white uppercase tracking-widest font-bold transition-colors"
        >
          🌐 Explorar todo {province.name} directamente →
        </button>
      </div>

    </div>
  );
}

// ─── MAIN GATEWAY COMPONENT ───────────────────────────────────
export default function LocationGateway({ onEnter }: LocationGatewayProps) {
  const [step, setStep] = useState<Step>("country");
  const [selected, setSelected] = useState<SelectedLocation>({
    country: COUNTRIES[0],
    province: null,
    canton: null,
  });
  const [showDoor, setShowDoor] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectCountry = useCallback((country: Country) => {
    setSelected({ country, province: null, canton: null });
    setStep("province");
  }, []);

  const handleSelectProvince = useCallback((province: Province) => {
    setSelected((prev) => ({ ...prev, province }));
    setStep("canton");
  }, []);

  const handleSelectCanton = useCallback(
    (canton: Canton) => {
      setSelected((prev) => ({ ...prev, canton }));
      setShowDoor(true);
      setStep("entering");

      // Save to localStorage
      const location = {
        countryId: selected.country.id,
        provinceId: selected.province?.id ?? null,
        cantonId: canton.id === "all" ? null : canton.id,
        cantonName: canton.id === "all" ? null : canton.name,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    },
    [selected]
  );

  const handleDoorComplete = useCallback(() => {
    const location = {
      countryId: selected.country.id,
      provinceId: selected.province?.id ?? null,
      cantonId: selected.canton?.id ?? null,
      cantonName: selected.canton?.name ?? null,
    };
    onEnter(location);
  }, [selected, onEnter]);

  if (!mounted) return null;

  // Background image based on active selection
  const bgImage =
    step === "country"
      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1920"
      : selected.country.image;

  return (
    <>
      {/* ── DOOR TRANSITION ── */}
      {showDoor && (
        <DoorAnimation 
          onComplete={handleDoorComplete} 
          countryName={selected.country.name} 
          cantonName={selected.canton?.name} 
        />
      )}

      {/* ── MAIN GATEWAY OVERLAY ── */}
      <div className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#08080C]">
        
        {/* Ambient background cinematic visual */}
        <div className="absolute inset-0 transition-all duration-1000">
          <Image
            src={bgImage}
            alt="background"
            fill
            className="object-cover opacity-15 grayscale contrast-125"
            priority
          />
        </div>

        {/* Ambient Grid Lines & Glowing Orbs */}
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-gold/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Top Gold Shimmer Border */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent z-20" />

        {/* ── TOP BAR: LOGO & STEP WIDGET ── */}
        <header className="relative z-20 pt-8 pb-4 px-6 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Logo */}
          <div className="flex items-baseline">
            <span
              className="font-serif font-bold text-2xl md:text-3xl tracking-[0.08em]"
              style={{
                background: "linear-gradient(135deg, #F8E5AE 0%, #D4A843 40%, #9A7830 65%, #D4A843 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              CARIÑOSAS
            </span>
            <span className="font-serif font-bold text-2xl md:text-3xl text-white tracking-[0.08em]">
              .TOP
            </span>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="flex items-center gap-2 p-1.5 rounded-full glass-obsidian border border-white/10 shadow-xl">
            {(["country", "province", "canton"] as const).map((s, i) => {
              const labels = ["1. País", "2. Región", "3. Cantón"];
              const isActive = step === s;
              const isPast =
                (step === "province" && i === 0) ||
                (step === "canton" && i <= 1) ||
                step === "entering";

              return (
                <div
                  key={s}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-brand-gold text-brand-black shadow-md"
                      : isPast
                      ? "text-brand-gold font-bold"
                      : "text-white/30"
                  }`}
                >
                  {isPast ? <Check size={10} className="stroke-[3]" /> : null}
                  <span>{labels[i]}</span>
                </div>
              );
            })}
          </div>

          {/* Adult 18+ Disclaimer Seal */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full glass-dark border border-white/10 text-[9px] text-white/50 uppercase font-mono tracking-wider">
            <Lock size={10} className="text-brand-gold" />
            <span>+18 · Acceso Exclusivo</span>
          </div>
        </header>

        {/* ── STEP CONTENT WITH ANIMATE PRESENCE ── */}
        <main className="relative z-20 flex-1 overflow-y-auto no-scrollbar py-6 flex items-start justify-center">
          <AnimatePresence mode="wait">
            {step === "country" && (
              <motion.div
                key="country"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <CountryStep onSelect={handleSelectCountry} />
              </motion.div>
            )}

            {(step === "province" || (step === "entering" && !selected.canton)) && (
              <motion.div
                key="province"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <ProvinceStep
                  country={selected.country}
                  onSelect={handleSelectProvince}
                  onBack={() => setStep("country")}
                />
              </motion.div>
            )}

            {(step === "canton" || (step === "entering" && selected.canton)) && selected.province && (
              <motion.div
                key="canton"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <CantonStep
                  country={selected.country}
                  province={selected.province}
                  onSelect={handleSelectCanton}
                  onBack={() => setStep("province")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── FOOTER SEAL ── */}
        <footer className="relative z-20 text-center py-4 px-6 shrink-0 border-t border-white/5 bg-[#08080C]/80 backdrop-blur-md">
          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            🔒 Discreción Total Blindada · Verificación Biométrica 4K · Red Élite Iberoamérica
          </p>
        </footer>

      </div>
    </>
  );
}

// ─── Hook: useLocationGateway ──────────────────────────────────
export function useLocationGateway() {
  const [showGateway, setShowGateway] = useState(false);
  const [location, setLocation] = useState<{
    countryId: string;
    provinceId: string | null;
    cantonId: string | null;
    cantonName: string | null;
  }>({
    countryId: "ecuador",
    provinceId: "el-oro",
    cantonId: "machala",
    cantonName: "Machala",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLocation(JSON.parse(saved));
      } else {
        const defaultLoc = {
          countryId: "ecuador",
          provinceId: "el-oro",
          cantonId: "machala",
          cantonName: "Machala",
        };
        setLocation(defaultLoc);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLoc));
      }
      setShowGateway(false);
    } catch {
      setShowGateway(false);
    }
  }, []);

  const handleEnter = useCallback(
    (loc: { countryId: string; provinceId: string | null; cantonId: string | null; cantonName: string | null }) => {
      setLocation(loc);
      setShowGateway(false);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    },
    []
  );

  const resetLocation = useCallback(() => {
    setShowGateway(false);
    // Smooth scroll to search bar instead of blocking popup
    const searchEl = document.getElementById("search-box-hero");
    if (searchEl) {
      searchEl.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return { showGateway, location, handleEnter, resetLocation };
}
