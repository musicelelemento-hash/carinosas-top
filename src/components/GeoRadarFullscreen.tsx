"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  SlidersHorizontal,
  EyeOff,
  BadgeCheck,
  Compass,
  Map as MapIcon
} from "lucide-react";
import LiveMap from "@/components/LiveMap";
import RadarVisual, { type RadarBlipData } from "@/components/RadarVisual";
import { getCountryById } from "@/lib/countries";
import { supabase } from "@/lib/supabase";

const FALLBACK_BLIPS: RadarBlipData[] = [
  { id: "rb-1", name: "Valentina", km: "1,2 km", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400", live: true },
  { id: "rb-2", name: "Camila", km: "2,4 km", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400", live: false },
  { id: "rb-3", name: "Luciana", km: "3,1 km", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400", live: true },
  { id: "rb-4", name: "Sofía", km: "4,8 km", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400", live: false },
  { id: "rb-5", name: "Elena", km: "6,0 km", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400", live: false },
];

export default function GeoRadarFullscreen() {
  const [activeRadius, setActiveRadius] = useState<string>("5km");
  const [hidden, setHidden] = useState(false);
  const [vista, setVista] = useState<"radar" | "mapa">("radar");
  const [blips, setBlips] = useState<RadarBlipData[]>(FALLBACK_BLIPS);
  const ecuador = getCountryById("ecuador");
  const nearest = blips[0];

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("vista") === "mapa") {
      setVista("mapa");
    }
  }, []);

  useEffect(() => {
    let active = true;
    supabase
      .from("models")
      .select("id, name, images")
      .not("lat", "is", null)
      .limit(6)
      .then(({ data }) => {
        if (!active || !data || data.length === 0) return;
        setBlips(
          data.map((m, i) => ({
            id: m.id,
            name: m.name,
            km: `${((i + 1) * 1.2).toFixed(1)} km`,
            avatar: m.images?.[0],
            live: i % 2 === 0,
          }))
        );
      });
    return () => {
      active = false;
    };
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
                {ecuador.mapPresets ? Object.keys(ecuador.mapPresets)[0] : "Machala"} · {activeRadius === "all" ? "toda la ciudad" : activeRadius}
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

        {vista === "radar" ? (
          /* ── RADAR DECORATIVO (calcado del mockup screenRadar) ── */
          <div className="flex-1 rounded-3xl overflow-hidden border border-white/[0.1] min-h-[600px] relative">
            <RadarVisual size="full" blips={hidden ? [] : blips} />

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
