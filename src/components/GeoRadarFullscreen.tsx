"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  SlidersHorizontal,
  EyeOff
} from "lucide-react";
import LiveMap from "@/components/LiveMap";
import { getCountryById } from "@/lib/countries";

export default function GeoRadarFullscreen() {
  const [activeRadius, setActiveRadius] = useState<string>("5km");
  const [hidden, setHidden] = useState(false);
  const ecuador = getCountryById("ecuador");

  return (
    <div className="min-h-screen bg-[#08080C] text-white pt-20 pb-12 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 w-full flex-1 flex flex-col space-y-4">

        {/* ── TOP RADAR CONTROLS ── */}
        <div className="glass-obsidian border border-brand-gold/30 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/70 hover:text-white shrink-0"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-white block">Cerca de ti</span>
              <span className="text-[12px] font-mono text-white/45 block mt-0.5">
                {ecuador.mapPresets ? Object.keys(ecuador.mapPresets)[0] : "Machala"} · {activeRadius === "all" ? "toda la ciudad" : activeRadius}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveRadius((r) => (r === "5km" ? "1km" : "5km"))}
              className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white shrink-0"
              title="Ajustar radio"
            >
              <SlidersHorizontal size={17} />
            </button>
            <button
              onClick={() => setHidden((v) => !v)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${hidden ? 'bg-brand-gold text-brand-black border-brand-gold' : 'bg-white/[0.06] border-white/[0.08] text-white'}`}
              title={hidden ? "Volver a ser visible" : "Ocultarme del radar"}
            >
              <EyeOff size={17} />
            </button>
          </div>
        </div>

        {/* ── FULL MAP RADAR CONTAINER ── */}
        <div className="flex-1 rounded-3xl overflow-hidden glass-obsidian border border-white/10 min-h-[600px] shadow-2xl relative">
          <LiveMap currentCountry={ecuador} />
        </div>

      </div>
    </div>
  );
}
