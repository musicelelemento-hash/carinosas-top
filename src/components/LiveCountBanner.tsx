"use client";

import React, { useState, useEffect } from "react";
import { getPopularCities } from "@/lib/cities";

const TICKER_ITEMS = [
  "✦ VERIFICACIÓN 4K ACTIVA",
  "✦ 100% DISCRECIÓN GARANTIZADA",
  "✦ PERFILES AUDITADOS EN TIEMPO REAL",
  "✦ ACCESO ELITE · ECUADOR",
  "✦ RESPONSE TIME SUB-5 MIN",
  "✦ ZERO DIGITAL FOOTPRINT",
  "✦ CURATED SELECTION · MEMBERS ONLY",
  "✦ QUITO · GUAYAQUIL · CUENCA · MANTA",
];

export default function LiveCountBanner() {
  const [count, setCount] = useState(42);
  const [cityIndex, setCityIndex] = useState(0);
  const [prevCount, setPrevCount] = useState(42);
  const [flip, setFlip] = useState(false);
  const popularCities = getPopularCities();

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        const next = Math.max(38, Math.min(prev + delta, 56));
        if (next !== prev) {
          setPrevCount(prev);
          setFlip(true);
          setTimeout(() => setFlip(false), 400);
        }
        return next;
      });
      setCityIndex(prev => (prev + 1) % popularCities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [popularCities.length]);

  const currentCity = popularCities[cityIndex].name;
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full relative overflow-hidden z-40" style={{ background: 'linear-gradient(90deg, #060608 0%, #0E0E0A 50%, #060608 100%)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>

      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), rgba(201,168,76,1), rgba(201,168,76,0.6), transparent)' }} />

      {/* Moving shimmer overlay */}
      <div className="absolute inset-0 animate-shimmer-gold pointer-events-none" />

      <div className="flex items-stretch h-[44px]">

        {/* Left badge: LIVE */}
        <div className="flex-shrink-0 flex items-center gap-3 px-6 border-r border-brand-gold/10"
          style={{ background: 'linear-gradient(90deg, rgba(232,0,90,0.08), transparent)' }}
        >
          <div className="live-dot" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/90 whitespace-nowrap">Live Now</span>
        </div>

        {/* Center: count */}
        <div className="flex-shrink-0 flex items-center gap-3 px-6 border-r border-brand-gold/10">
          <span className={`text-base font-serif font-bold transition-all duration-300 gold-text-mask ${flip ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
            style={{ transform: flip ? 'translateY(-6px)' : 'translateY(0)', transition: 'transform 0.3s ease, opacity 0.3s ease' }}
          >
            {count}
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40 whitespace-nowrap">
            Modelos en{' '}
            <span className="text-brand-gold/70 transition-all duration-500">{currentCity}</span>
          </span>
        </div>

        {/* Ticker */}
        <div className="flex-1 overflow-hidden flex items-center ticker-wrap">
          <div className="ticker-inner flex items-center gap-12 text-[9px] font-black uppercase tracking-[0.35em] text-brand-gold/30 whitespace-nowrap">
            {tickerContent.map((item, i) => (
              <span key={i} className="hover:text-brand-gold/60 transition-colors cursor-default">{item}</span>
            ))}
          </div>
        </div>

        {/* Right badge: ALTA DEMANDA */}
        <div className="flex-shrink-0 flex items-center gap-2 px-6 border-l border-brand-gold/10"
          style={{ background: 'linear-gradient(270deg, rgba(232,0,90,0.06), transparent)' }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-brand-pink/70">• Alta Demanda</span>
        </div>
      </div>

      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)' }} />
    </div>
  );
}
