"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  EyeOff,
  BadgeCheck,
  Compass,
  Map as MapIcon
} from "lucide-react";
import LiveMap from "@/components/LiveMap";
import RadarVisual, { type RadarBlipData } from "@/components/RadarVisual";
import { getCountryById } from "@/lib/countries";

// P0 anti-fachada: sin perfiles geolocalizados reales mostramos el radar vacío,
// en lugar de blips ficticios (Valentina/Camila/Elena) con distancias inventadas.
const FALLBACK_BLIPS: RadarBlipData[] = [];

export default function GeoRadarFullscreen() {
  const [hidden, setHidden] = useState(false);
  const [vista, setVista] = useState<"radar" | "mapa">("radar");
  const blips = FALLBACK_BLIPS;
  const ecuador = getCountryById("ecuador");
  const nearest = blips[0];

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("vista") === "mapa") {
      setVista("mapa");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#08080B] text-white pt-20 pb-12 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 w-full flex-1 flex flex-col space-y-4">

        {/* ── TOP RADAR CONTROLS ── */}
        <div className="bg-[#101014] border border-white/[0.1] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/70 hover:text-white shrink-0"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-white block">Cerca de ti</span>
              <span className="text-[12px] font-mono text-white/45 block mt-0.5">
                {ecuador.mapPresets ? Object.keys(ecuador.mapPresets)[0] : "Ecuador"} · zonas generales
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Toggle Radar / Mapa */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <button
                onClick={() => setVista("radar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${vista === "radar" ? "bg-brand-gold text-brand-black" : "text-white/60"}`}
              >
                <Compass size={13} /> Radar
              </button>
              <button
                onClick={() => setVista("mapa")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${vista === "mapa" ? "bg-brand-gold text-brand-black" : "text-white/60"}`}
              >
                <MapIcon size={13} /> Mapa
              </button>
            </div>

            <button
              onClick={() => setHidden((v) => !v)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${hidden ? 'bg-brand-gold text-brand-black border-brand-gold' : 'bg-white/[0.06] border-white/[0.08] text-white'}`}
              title={hidden ? "Mostrar radar" : "Ocultar radar"}
            >
              <EyeOff size={17} />
            </button>
          </div>
        </div>

        {vista === "radar" ? (
          /* ── RADAR DECORATIVO (calcado del mockup screenRadar) ── */
          <div className="flex-1 rounded-3xl overflow-hidden border border-white/[0.1] min-h-[600px] relative">
            <RadarVisual size="full" blips={hidden ? [] : blips} />
            {blips.length === 0 && !hidden && (
              <p className="absolute inset-x-6 bottom-8 text-center text-sm text-white/60">
                Por privacidad, mostramos ciudades y sectores, no puntos exactos de personas.
              </p>
            )}

            {nearest && !hidden && (
              <div className="absolute left-0 right-0 bottom-4 px-4">
                <div
                  className="max-w-md mx-auto rounded-[18px] p-3.5 flex items-center gap-3"
                  style={{ background: "rgba(16,16,20,.94)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.09)" }}
                >
                  <Image
                    src={nearest.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"}
                    alt={nearest.name}
                    width={54}
                    height={54}
                    className="rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-lg font-bold text-white truncate">{nearest.name}</span>
                      <BadgeCheck size={15} className="text-brand-gold shrink-0" />
                    </div>
                    <span className="text-[13px] text-white/55">A {nearest.km} · 3 min</span>
                  </div>
                  <button className="px-4 py-3 rounded-xl bg-brand-gold text-brand-black font-bold text-[14px] shrink-0">
                    Escribir
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── MAPA REAL (Leaflet) ── */
          <div className="flex-1 rounded-3xl overflow-hidden border border-white/[0.1] min-h-[600px] relative">
            <LiveMap currentCountry={ecuador} />
          </div>
        )}

      </div>
    </div>
  );
}
