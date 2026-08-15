"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, MapPin, Globe, Sparkles, ArrowRight, CheckCircle, ShieldCheck, Lock, Gem } from "lucide-react";
import { COUNTRIES, type Country, type Province, type Canton, REGION_COLORS } from "@/lib/countries";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

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

// ─── Region color helper ──────────────────────────────────────
function regionColor(region?: string): string {
  if (!region) return "#D4A843";
  return REGION_COLORS[region] || "#D4A843";
}

// ─── LUXURY VIP PORTAL DOOR ANIMATION ──────────────────────────
function DoorAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");

  useEffect(() => {
    // Fire double champagne gold stardust burst
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#D4A843', '#FFE088', '#F5E0A0', '#AA7C11', '#FFFFFF'],
        ticks: 200,
        gravity: 0.8,
        shapes: ['circle', 'square'],
      });
    } catch {
      // safe fallback
    }

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
        animate={{ opacity: phase === "opening" ? 1 : 0, scale: phase === "opening" ? 2.5 : 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[800px] h-[800px] rounded-full bg-radial from-[#D4A843]/40 via-[#FFE088]/15 to-transparent blur-3xl" />
      </motion.div>

      {/* Central Holographic Iris Vault HUD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: phase === "closed" ? 1 : phase === "opening" ? [1, 1, 0] : 0,
          scale: phase === "opening" ? 1.3 : 1,
          rotate: phase === "opening" ? 180 : 0
        }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className="absolute z-30 flex flex-col items-center justify-center gap-4 text-center pointer-events-none"
      >
        {/* Rotating Outer Ring */}
        <div className="relative w-36 h-36 rounded-full border-2 border-dashed border-brand-gold/60 flex items-center justify-center shadow-[0_0_50px_rgba(212,168,67,0.5)]">
          {/* Inner Glowing Core */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#D4A843] via-[#FFE088] to-[#9A7830] p-1 shadow-[0_0_40px_rgba(212,168,67,0.7)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#08080C] flex items-center justify-center">
              <ShieldCheck size={36} className="text-brand-gold animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.4em] block">
            ACCESO VIP CONCEDIDO
          </span>
          <span className="text-[8px] text-white/50 uppercase tracking-widest block font-mono">
            IDENTIDAD BLINDADA · CIFRADO AES-256
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
        {/* Door decorations */}
        <div className="absolute inset-0 flex items-center justify-end pr-10 pointer-events-none">
          <div className="flex flex-col items-end gap-5 opacity-40">
            <div className="h-px w-48 bg-gradient-to-l from-brand-gold to-transparent" />
            <div className="h-px w-28 bg-gradient-to-l from-brand-gold to-transparent" />
            <div className="h-px w-48 bg-gradient-to-l from-brand-gold to-transparent" />
          </div>
        </div>
        {/* Center gold line */}
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
        {/* Door decorations */}
        <div className="absolute inset-0 flex items-center justify-start pl-10 pointer-events-none">
          <div className="flex flex-col items-start gap-5 opacity-40">
            <div className="h-px w-48 bg-gradient-to-r from-brand-gold to-transparent" />
            <div className="h-px w-28 bg-gradient-to-r from-brand-gold to-transparent" />
            <div className="h-px w-48 bg-gradient-to-r from-brand-gold to-transparent" />
          </div>
        </div>
        {/* Center gold line */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(212,168,67,0.8), rgba(255,224,136,1), rgba(212,168,67,0.8), transparent)" }}
        />
      </div>
    </div>
  );
}

// ─── STEP 1: COUNTRY SELECTOR ─────────────────────────────────
function CountryStep({
  onSelect,
}: {
  onSelect: (country: Country) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-gold mb-4">
          <Globe size={12} className="text-brand-gold" />
          <span className="label-xs text-brand-gold/90">Selecciona tu País</span>
        </div>
        <h1 className="font-serif font-bold text-5xl md:text-7xl text-white leading-none tracking-tight">
          ¿Desde dónde{" "}
          <span
            className="italic"
            style={{
              background: "linear-gradient(135deg, #F8E5AE 0%, #D4A843 40%, #9A7830 70%, #D4A843 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer-gold 5s linear infinite",
            }}
          >
            nos visitas?
          </span>
        </h1>
        <p className="body-base text-white/45 max-w-md mx-auto">
          Encontraremos las más exclusivas cerca de ti
        </p>
      </div>

      {/* Country Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {COUNTRIES.map((country, i) => {
          const isHovered = hoveredId === country.id;
          return (
            <motion.button
              key={country.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(country)}
              onMouseEnter={() => setHoveredId(country.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative rounded-2xl overflow-hidden group cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-gold shadow-lg"
              style={{
                aspectRatio: "3/4",
              }}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={country.image}
                  alt={country.name}
                  fill
                  className="object-cover transition-all duration-700"
                  style={{
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                    filter: isHovered
                      ? "brightness(0.45) saturate(1.2)"
                      : "brightness(0.35) saturate(0.9)",
                  }}
                />
              </div>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to top, ${country.available ? "rgba(8,8,12,0.96)" : "rgba(8,8,12,0.97)"} 0%, rgba(8,8,12,0.5) 50%, transparent 100%)`,
                }}
              />

              {/* Accent border on hover */}
              <div
                className="absolute inset-0 rounded-2xl transition-all duration-400"
                style={{
                  border: isHovered
                    ? `1px solid ${country.accentColor}55`
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isHovered
                    ? `0 0 40px ${country.accentColor}22, inset 0 0 20px ${country.accentColor}08`
                    : "none",
                }}
              />

              {/* PRÓXIMAMENTE badge */}
              {!country.available && (
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full label-xs"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  Próximamente
                </div>
              )}

              {/* Available badge */}
              {country.available && (
                <div
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(212,168,67,0.15)",
                    border: "1px solid rgba(212,168,67,0.35)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                  <span className="label-xs text-brand-gold">Activo</span>
                </div>
              )}

              {/* Flag + Name */}
              <div className="absolute inset-x-0 bottom-0 p-5 space-y-2">
                <div className="text-4xl leading-none" role="img" aria-label={country.name}>
                  {country.flag}
                </div>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                  {country.name}
                </h3>
                <p
                  className="label-xs transition-all duration-300"
                  style={{ color: isHovered ? country.accentColor : "rgba(255,255,255,0.4)" }}
                >
                  {country.tagline}
                </p>

                {/* Enter arrow — appears on hover */}
                <div
                  className="flex items-center gap-2 mt-1 transition-all duration-400"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateY(0)" : "translateY(6px)",
                  }}
                >
                  <span className="label-xs text-white/70">
                    {country.available ? "Seleccionar" : "Ver más pronto"}
                  </span>
                  <ArrowRight size={11} className="text-white/70" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 2: PROVINCE SELECTOR ────────────────────────────────
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

  // Group by region
  const grouped = country.provinces.reduce<Record<string, Province[]>>((acc, p) => {
    const key = p.region || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/45 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="label-xs">Cambiar País</span>
        </button>

        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl">{country.flag}</span>
          <div>
            <p className="label-xs text-brand-gold/70 mb-0.5">{country.name}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-none">
              Elige tu{" "}
              <span className="italic" style={{
                background: "linear-gradient(135deg, #F8E5AE, #D4A843)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Provincia
              </span>
            </h2>
          </div>
        </div>
        <div className="divider-gold w-32 mt-4" />
      </div>

      {/* Coming soon overlay for non-Ecuador */}
      {!country.available ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="text-8xl">{country.flag}</div>
          <div className="text-center space-y-3">
            <h3 className="font-serif text-3xl text-white">Próximamente en {country.name}</h3>
            <p className="body-base text-white/45 max-w-sm mx-auto">
              Estamos expandiendo nuestra red. Pronto podrás encontrar las mejores cariñosas en tu país.
            </p>
          </div>
          <div
            className="flex items-center gap-3 px-6 py-3 rounded-xl"
            style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.25)" }}
          >
            <Sparkles size={14} className="text-brand-gold" />
            <span className="label-xs text-brand-gold/80">Notificaciones disponibles pronto</span>
          </div>
        </div>
      ) : (
        /* Province groups */
        <div className="space-y-8">
          {Object.entries(grouped).map(([region, provinces]) => (
            <div key={region}>
              {/* Region label */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: regionColor(region) }}
                />
                <span
                  className="label-xs"
                  style={{ color: regionColor(region) + "BB" }}
                >
                  {region}
                </span>
                <div className="flex-1 h-px" style={{ background: regionColor(region) + "22" }} />
              </div>

              {/* Province buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {provinces.map((province, i) => {
                  const isHovered = hoveredId === province.id;
                  const rColor = regionColor(province.region);
                  return (
                    <button
                      key={province.id}
                      onClick={() => onSelect(province)}
                      onMouseEnter={() => setHoveredId(province.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="relative rounded-xl p-4 text-left transition-all duration-300 outline-none"
                      style={{
                        background: isHovered
                          ? `rgba(${rColor === "#D4A843" ? "212,168,67" : rColor === "#3B82F6" ? "59,130,246" : "34,197,94"},0.1)`
                          : "rgba(255,255,255,0.04)",
                        border: isHovered
                          ? `1px solid ${rColor}50`
                          : "1px solid rgba(255,255,255,0.08)",
                        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                        boxShadow: isHovered ? `0 8px 30px ${rColor}18` : "none",
                        animation: `fadeInUp 0.4s ease forwards ${i * 30}ms`,
                        opacity: 0,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="font-serif text-base leading-tight transition-colors duration-300"
                          style={{ color: isHovered ? "#FFFFFF" : "rgba(255,255,255,0.75)" }}
                        >
                          {province.name}
                        </span>
                        <ArrowRight
                          size={12}
                          style={{
                            color: isHovered ? rColor : "transparent",
                            transition: "all 0.3s ease",
                            flexShrink: 0,
                            marginTop: "3px",
                          }}
                        />
                      </div>
                      <span className="label-xs mt-1.5 block" style={{ color: rColor + "70" }}>
                        {province.cantons.length} cantones
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STEP 3: CANTON SELECTOR ──────────────────────────────────
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
  const rColor = regionColor(province.region);
  const popularCantons = province.cantons.filter((c) => c.isPopular);
  const otherCantons = province.cantons.filter((c) => !c.isPopular);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/45 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="label-xs">Cambiar Provincia</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{country.flag}</span>
          <div className="flex items-center gap-2">
            <span className="label-xs text-white/35">{country.name}</span>
            <span className="text-white/20">·</span>
            <span className="label-xs" style={{ color: rColor + "AA" }}>{province.region}</span>
          </div>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-none mb-1">
          {province.name}
        </h2>
        <p className="body-sm text-white/40">Elige tu cantón o ciudad</p>
        <div className="divider-gold w-24 mt-4" />
      </div>

      {/* Popular cantons */}
      {popularCantons.length > 0 && (
        <div className="mb-8">
          <p className="label-xs text-brand-gold/60 mb-4">⭐ Más populares</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularCantons.map((canton) => {
              const isSel = selectedCanton?.id === canton.id;
              const isHov = hoveredId === canton.id;
              return (
                <button
                  key={canton.id}
                  onClick={() => setSelectedCanton(canton)}
                  onMouseEnter={() => setHoveredId(canton.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative rounded-xl p-4 text-left transition-all duration-300 outline-none"
                  style={{
                    background: isSel
                      ? `linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.08))`
                      : isHov
                      ? "rgba(212,168,67,0.1)"
                      : "rgba(255,255,255,0.05)",
                    border: isSel
                      ? "1px solid rgba(212,168,67,0.55)"
                      : isHov
                      ? "1px solid rgba(212,168,67,0.3)"
                      : "1px solid rgba(255,255,255,0.09)",
                    transform: isSel ? "scale(1.02)" : "scale(1)",
                    boxShadow: isSel ? "0 8px 30px rgba(212,168,67,0.15)" : "none",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg text-white font-semibold">
                      {canton.name}
                    </span>
                    {isSel && <CheckCircle size={16} className="text-brand-gold" />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={9} className="text-brand-gold/50" />
                    <span className="label-xs text-brand-gold/55">{province.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Other cantons */}
      {otherCantons.length > 0 && (
        <div className="mb-10">
          <p className="label-xs text-white/30 mb-4">Todos los cantones</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {otherCantons.map((canton) => {
              const isSel = selectedCanton?.id === canton.id;
              const isHov = hoveredId === canton.id;
              return (
                <button
                  key={canton.id}
                  onClick={() => setSelectedCanton(canton)}
                  onMouseEnter={() => setHoveredId(canton.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="rounded-lg px-3.5 py-2.5 text-left transition-all duration-200 outline-none"
                  style={{
                    background: isSel
                      ? "rgba(212,168,67,0.15)"
                      : isHov
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(255,255,255,0.03)",
                    border: isSel
                      ? "1px solid rgba(212,168,67,0.4)"
                      : "1px solid rgba(255,255,255,0.07)",
                    color: isSel ? "#D4A843" : isHov ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                  }}
                >
                  <span className="body-sm font-medium">{canton.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA - Entrar */}
      <div className="flex flex-col items-center gap-4">
        {selectedCanton && (
          <p className="label-xs text-brand-gold/70">
            ✓ Seleccionaste: <strong className="text-brand-gold">{selectedCanton.name}</strong>
          </p>
        )}
        <button
          onClick={() => selectedCanton && onSelect(selectedCanton)}
          disabled={!selectedCanton}
          className="relative group overflow-hidden px-12 py-5 rounded-2xl font-bold text-base tracking-[0.18em] uppercase transition-all duration-300"
          style={
            selectedCanton
              ? {
                  background: "linear-gradient(135deg, #E8BC50 0%, #D4A843 50%, #BC8E2C 100%)",
                  color: "#0A0808",
                  boxShadow: "0 8px 40px rgba(212,168,67,0.45), 0 2px 8px rgba(0,0,0,0.4)",
                  transform: "scale(1)",
                }
              : {
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "not-allowed",
                }
          }
        >
          {/* Shimmer */}
          {selectedCanton && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-in-out" />
          )}
          <span className="relative z-10 flex items-center gap-3">
            <span>🚪</span>
            {selectedCanton ? "Entrar al Placer" : "Elige un cantón primero"}
            {selectedCanton && <ArrowRight size={18} />}
          </span>
        </button>

        {/* Skip */}
        <button
          onClick={() => onSelect({ id: "all", name: "Todas las ciudades" })}
          className="label-xs text-white/25 hover:text-white/50 transition-colors"
        >
          Explorar todo {province.name} →
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

  // Background image based on step
  const bgImage =
    step === "country"
      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1920"
      : step === "province" || step === "canton"
      ? selected.country.image
      : selected.country.image;

  return (
    <>
      {/* ── DOOR ANIMATION ── */}
      {showDoor && <DoorAnimation onComplete={handleDoorComplete} />}

      {/* ── MAIN GATEWAY ── */}
      <div
        className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
        style={{ background: "#08080C" }}
      >
        {/* Ambient background image */}
        <div className="absolute inset-0 transition-all duration-1000">
          <Image
            src={bgImage}
            alt="background"
            fill
            className="object-cover transition-all duration-1500"
            style={{
              filter: "brightness(0.12) saturate(0.7)",
              transform: "scale(1.05)",
            }}
            priority
          />
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 grid-lines opacity-30" />

        {/* Radial gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,168,67,0.07) 0%, transparent 60%)",
          }}
        />

        {/* Top gold line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,168,67,0.6), rgba(212,168,67,0.9), rgba(212,168,67,0.6), transparent)",
          }}
        />

        {/* ── LOGO ── */}
        <div className="relative z-10 flex items-center justify-center pt-8 pb-4 shrink-0">
          <div className="flex items-baseline gap-0">
            <span
              className="font-serif font-bold text-3xl tracking-[0.08em]"
              style={{
                background:
                  "linear-gradient(135deg, #F8E5AE 0%, #D4A843 40%, #9A7830 65%, #D4A843 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              CARIÑOSAS
            </span>
            <span className="font-serif font-bold text-3xl text-white/90 tracking-[0.08em]">
              .TOP
            </span>
          </div>
        </div>

        {/* ── STEP INDICATOR ── */}
        <div className="relative z-10 flex justify-center mb-6 shrink-0">
          <div className="flex items-center gap-2">
            {(["country", "province", "canton"] as const).map((s, i) => {
              const isActive = step === s || (step === "entering" && i <= 2);
              const isPast =
                (step === "province" && i === 0) ||
                (step === "canton" && i <= 1) ||
                step === "entering";
              return (
                <React.Fragment key={s}>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-400"
                    style={{
                      background: isPast
                        ? "linear-gradient(135deg, #D4A843, #9A7830)"
                        : isActive
                        ? "rgba(212,168,67,0.2)"
                        : "rgba(255,255,255,0.06)",
                      border: isActive || isPast
                        ? "1px solid rgba(212,168,67,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {isPast ? (
                      <CheckCircle size={12} className="text-[#08080C]" />
                    ) : (
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: isActive ? "#D4A843" : "rgba(255,255,255,0.3)" }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                  {i < 2 && (
                    <div
                      className="w-12 h-px transition-all duration-400"
                      style={{
                        background: isPast
                          ? "rgba(212,168,67,0.6)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── STEP CONTENT WITH FRAMER MOTION ── */}
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar py-4 flex items-start justify-center">
          <AnimatePresence mode="wait">
            {step === "country" && (
              <motion.div
                key="country"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <CountryStep onSelect={handleSelectCountry} />
              </motion.div>
            )}

            {(step === "province" || (step === "entering" && !selected.canton)) && (
              <motion.div
                key="province"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
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
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
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
        </div>

        {/* ── BOTTOM TAGLINE ── */}
        <div className="relative z-10 text-center py-5 shrink-0">
          <p className="label-xs text-white/20">
            🔒 Discreción total · +18 · Solo adultos
          </p>
        </div>

        {/* Bottom gold line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,168,67,0.3), rgba(212,168,67,0.5), rgba(212,168,67,0.3), transparent)",
          }}
        />
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
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLocation(JSON.parse(saved));
        setShowGateway(false);
      } else {
        setShowGateway(true);
      }
    } catch {
      setShowGateway(true);
    }
  }, []);

  const handleEnter = useCallback(
    (loc: { countryId: string; provinceId: string | null; cantonId: string | null; cantonName: string | null }) => {
      setLocation(loc);
      setShowGateway(false);
    },
    []
  );

  const resetLocation = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLocation(null);
    setShowGateway(true);
  }, []);

  return { showGateway, location, handleEnter, resetLocation };
}
