"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Radar, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Compass, 
  SlidersHorizontal,
  Crown,
  LocateFixed
} from "lucide-react";
import LiveMap from "@/components/LiveMap";
import { getCountryById } from "@/lib/countries";

export default function GeoRadarFullscreen() {
  const [activeRadius, setActiveRadius] = useState<string>("5km");
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
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="font-serif text-lg sm:text-xl font-bold text-white">Geo-Radar 4K en Tiempo Real</h1>
              </div>
              <span className="text-[10px] text-brand-gold font-mono block mt-0.5">
                14 Modelos Verificadas con GPS Activo en Machala & Ecuador
              </span>
            </div>
          </div>

          {/* Radius Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <span className="text-[9px] uppercase font-bold text-white/40 mr-1 hidden sm:inline">Radio:</span>
            {[
              { id: "1km", label: "1 km" },
              { id: "5km", label: "5 km" },
              { id: "10km", label: "10 km" },
              { id: "all", label: "Toda la Ciudad" },
            ].map((rad) => (
              <button
                key={rad.id}
                onClick={() => setActiveRadius(rad.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeRadius === rad.id
                    ? 'bg-brand-gold text-brand-black shadow-md'
                    : 'glass-dark border border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {rad.label}
              </button>
            ))}
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
