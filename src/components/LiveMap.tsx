"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { 
  ChevronRight, 
  Radar, 
  MessageCircle, 
  MapPin, 
  Lock, 
  Unlock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import LiveMapAnimator from "./LiveMapAnimator";
import RadarVisual from "./RadarVisual";
import { sound } from "@/lib/soundEngine";
import { type Country, getCountryById } from "@/lib/countries";

// Dynamic imports for leaflet (SSR-safe)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

interface MapModel {
  id: string;
  name: string;
  city: string;
  images: string[];
  sector?: string;
  whatsapp?: string;
  age?: number;
  hourly_rate?: number;
  is_online?: boolean;
}

interface LiveMapProps {
  currentCountry?: Country;
  /** 'full' = sección cockpit completa (comportamiento original). 'panel' = versión compacta para vivir como sidebar fijo junto al grid. */
  variant?: "full" | "panel";
}

export default function LiveMap({ currentCountry, variant = "full" }: LiveMapProps = {}) {
  const activeCountry = currentCountry || getCountryById("ecuador");
  const cityPresets = activeCountry.mapPresets || getCountryById("ecuador").mapPresets;
  const initialCityKey = Object.keys(cityPresets)[0] || "Quito";

  const [models, setModels] = useState<MapModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>(initialCityKey);
  const [selectedModel, setSelectedModel] = useState<MapModel | null>(null);
  const [mapTarget, setMapTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);
  
  // Mobile touch lock state: on small screens, default to false so page scroll is unhindered
  const [isMapInteractive, setIsMapInteractive] = useState<boolean>(true);
  const [showTouchNotice, setShowTouchNotice] = useState<boolean>(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Detect if on mobile on mount to default touch lock
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 1024;
      setIsMapInteractive(!isMobile);
    }
  }, []);

  // Sync selected city when activeCountry changes
  useEffect(() => {
    const presets = activeCountry.mapPresets || getCountryById("ecuador").mapPresets;
    const firstKey = Object.keys(presets)[0] || "Quito";
    setSelectedCity(firstKey);
    const targetPreset = presets[firstKey];
    if (targetPreset) {
      setMapTarget({ center: targetPreset.center, zoom: targetPreset.zoom });
    }
  }, [activeCountry.id]);

  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase
        .from("models")
        .select("id, name, city, images, sector, whatsapp, age, hourly_rate, is_online");
      if (data && !error) setModels(data);
      setLoading(false);
    }
    fetchLocations();

    const currentPreset = cityPresets[selectedCity] || Object.values(cityPresets)[0];
    if (currentPreset) {
      setMapTarget({ center: currentPreset.center, zoom: currentPreset.zoom });
    }
  }, []);

  // Fallback realistic models per city with coordinates
  const cityModels: MapModel[] = useMemo(() => {
    // Public discovery stays at city level; precise coordinates remain private.
    const dbCityModels = models.filter(
      (m) => m.city?.toLowerCase().includes(selectedCity?.toLowerCase()) || (m.sector && m.sector.toLowerCase().includes(selectedCity?.toLowerCase()))
    );

    return dbCityModels;
  }, [models, selectedCity]);

  const displayMapModels = cityModels;

  const handleCitySelect = (cityKey: string) => {
    sound.playSonarPing();
    setSelectedCity(cityKey);
    const city = cityPresets[cityKey];
    if (city) {
      setMapTarget({ center: city.center, zoom: city.zoom });
    }
    setSelectedModel(null);
  };

  const handleModelSelect = (model: MapModel) => {
    sound.playSubtleClick();
    setSelectedModel(model);
  };

  const initialCenter = (cityPresets[initialCityKey] || Object.values(cityPresets)[0] || { center: [-0.1807, -78.4678] }).center;

  if (variant === "panel") {
    return (
      <div className="w-full lg:w-[372px] shrink-0 flex flex-col bg-[#0C0C10] lg:border-l border-white/[0.07]">
        {/* Header */}
        <div className="px-5 py-[18px] border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex flex-col gap-[3px]">
            <span className="text-sm font-bold text-white">Explorar por ciudad</span>
            <span className="font-mono text-[11px] text-white/40">
              {selectedCity} · ubicaciones del perfil
            </span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-white/45">
            <span className="w-1.5 h-1.5 rounded-full bg-white/35" />
            CATÁLOGO
          </span>
        </div>

        {/* Radar decorativo 252px */}
        <div className="relative h-[252px] overflow-hidden">
          <RadarVisual
            size="compact"
            blips={displayMapModels.slice(0, 6).map((m, i) => ({
              id: m.id,
              name: m.name,
              avatar: m.images?.[0],
              live: m.is_online === true,
            }))}
            onSelect={(b) => {
              const model = displayMapModels.find((m) => m.id === b.id);
              if (model) handleModelSelect(model);
            }}
          />
        </div>

        <div className="mt-auto px-5 py-5 border-t border-white/[0.07] text-xs leading-relaxed text-white/45">
          El mapa muestra zonas generales. No publicamos la ubicación exacta de los perfiles.
        </div>

        {/* Links al radar / mapa de pantalla completa */}
        <div className="border-t border-white/[0.07] flex divide-x divide-white/[0.07]">
          <a
            href="/radar"
            className="flex-1 px-5 py-3.5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-white/50 hover:text-brand-gold transition-colors"
          >
            <span>Radar completo</span>
            <ChevronRight size={14} />
          </a>
          <a
            href="/radar?vista=mapa"
            className="flex-1 px-5 py-3.5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-white/50 hover:text-brand-gold transition-colors"
          >
            <span>Ver mapa</span>
            <ChevronRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#08080B] border-y border-[#D4A843]/20" id="geo-radar-live">
      
      {/* ── TOP TACTICAL HUD BAR ── */}
      <div className="relative z-30 px-4 sm:px-6 py-4 bg-[#0A0A0F]/90 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4A843]/15 border border-[#D4A843]/40 flex items-center justify-center text-[#D4A843] shadow-[0_0_20px_rgba(212,168,67,0.3)]">
              <Radar size={20} className="text-[#D4A843]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#D4A843] font-black uppercase tracking-[0.3em] block">
                  Directorio por zona
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/55 text-[8px] font-black uppercase tracking-wider">Catálogo</span>
              </div>
              <span className="text-xs text-white/60 font-light">
                Perfiles disponibles por ciudad en {activeCountry.name}
              </span>
            </div>
          </div>

          {/* City Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full md:w-auto">
            {Object.entries(cityPresets).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleCitySelect(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                  selectedCity === key
                    ? "bg-gradient-to-r from-[#D4A843] via-[#FFF1C2] to-[#D4A843] text-black border-[#D4A843] shadow-[0_0_20px_rgba(212,168,67,0.4)] scale-105"
                    : "glass-dark border-white/10 text-white/50 hover:text-white hover:border-[#D4A843]/40"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── MAIN COCKPIT WORKSPACE (DESKTOP SPLIT + MOBILE COOPERATIVE TOUCH) ── */}
      <div className="flex flex-col lg:flex-row h-[620px] lg:h-[720px] relative">
        
        {/* === SIDEBAR COMPONENT (DESKTOP COCKPIT) === */}
        <div className="hidden lg:flex w-[420px] bg-[#0A0A0F]/95 border-r border-white/10 overflow-y-auto custom-scrollbar z-20 flex-col justify-between backdrop-blur-3xl shrink-0">
          
          {/* Top Header Box */}
          <div className="p-6 border-b border-white/10 space-y-4 bg-black/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">
                  Zona Radar: {selectedCity}
                </span>
              </div>
              <span className="text-[9px] px-2.5 py-1 rounded-full bg-[#D4A843]/15 text-[#D4A843] font-bold border border-[#D4A843]/35 shadow-sm">
                {displayMapModels.length} perfiles en {selectedCity}
              </span>
            </div>

            <p className="text-xs text-white/50">El mapa usa la ciudad y el sector. No muestra puntos exactos de personas.</p>

            {/* Micro HUD Telemetry */}
            <div className="grid grid-cols-2 gap-2 text-[10px] p-3 rounded-2xl glass-dark border border-white/5">
              <div>
                <span className="text-white/40 block text-[8px] uppercase tracking-wider">Ubicación</span>
                <span className="text-emerald-400 font-mono font-bold">Zona aproximada</span>
              </div>
              <div>
                <span className="text-white/40 block text-[8px] uppercase tracking-wider">Distancia</span>
                <span className="text-[#D4A843] font-bold">No se muestra</span>
              </div>
            </div>
          </div>
          
          {/* List of Models */}
          <div className="flex-1 divide-y divide-white/5 overflow-y-auto">
            {displayMapModels.length === 0 ? (
              <div className="p-10 text-center space-y-2 text-white/40 text-xs">
                <MapPin size={24} className="mx-auto text-[#D4A843]/40" />
                <p>No hay perfiles en {selectedCity}.</p>
              </div>
            ) : (
              displayMapModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className={`w-full p-4 text-left flex items-center gap-3.5 transition-all hover:bg-white/5 group relative cursor-pointer ${
                    selectedModel?.id === model.id ? 'bg-[#D4A843]/10 border-l-4 border-[#D4A843]' : ''
                  }`}
                >
                  {/* Photo with status indicator */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-[#D4A843]/50 transition-all shadow-md">
                    <Image 
                      src={model.images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800'} 
                      alt={model.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-serif text-base font-bold group-hover:text-[#D4A843] transition-colors truncate">
                        {model.name}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-[#D4A843]">
                        {model.hourly_rate ? `$${model.hourly_rate}/h` : "Consultar tarifa"}
                      </span>
                    </div>
                    
                    <p className="text-[9px] text-white/50 uppercase tracking-wider font-bold truncate">
                      {model.age ? `${model.age} Años · ` : ''}{model.sector || 'Zona Exclusiva'}
                    </p>

                    <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-bold">
                      {model.is_online && <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        En línea
                      </span>}
                      <span className="text-white/30">·</span>
                      <span className="text-[#D4A843] flex items-center gap-1">
                        <MapPin size={9} />
                        {model.city}
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={15} className={`text-white/20 group-hover:text-[#D4A843] transition-all ${selectedModel?.id === model.id ? 'translate-x-1 text-[#D4A843]' : ''}`} />
                </button>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3.5 border-t border-white/10 bg-black/40 text-center flex items-center justify-center gap-1.5">
            <Lock size={10} className="text-white/40" />
            <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] block font-mono">
              Mapa por ciudad y sector
            </span>
          </div>
        </div>

        {/* === TACTICAL MAP ENGINE & MOBILE OVERLAYS === */}
        <div 
          className="flex-1 relative z-10 overflow-hidden"
          onClick={() => {
            if (!isMapInteractive) {
              setShowTouchNotice(true);
              setTimeout(() => setShowTouchNotice(false), 2500);
            }
          }}
        >
          {!loading && typeof window !== "undefined" && (
            <MapContainer
              center={initialCenter}
              zoom={13}
              scrollWheelZoom={false}
              dragging={isMapInteractive}
              touchZoom={isMapInteractive}
              doubleClickZoom={isMapInteractive}
              className="w-full h-full"
              zoomControl={false}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              
              {mapTarget && <LiveMapAnimator target={mapTarget} />}

            </MapContainer>
          )}

          {/* ── 360° TACTICAL RADAR SWEEP BEAM OVERLAY ── */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
            {/* Rotating Conic Beam */}
            <div className="w-[580px] h-[580px] rounded-full radar-sweep-beam opacity-45 pointer-events-none" />
            {/* Concentric Reticle Rings */}
            <div className="absolute w-[460px] h-[460px] rounded-full border border-[#D4A843]/15 pointer-events-none" />
            <div className="absolute w-[280px] h-[280px] rounded-full border border-emerald-500/10 pointer-events-none" />
            <div className="absolute w-[120px] h-[120px] rounded-full border border-[#D4A843]/20 pointer-events-none" />
          </div>

          {/* Map Vignette Edge Glow */}
          <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_90px_rgba(0,0,0,0.92)]" />

          {/* ── TOP RIGHT MAP CONTROLS (TOUCH LOCK TOGGLE & RADIUS PILLS) ── */}
          <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2 pointer-events-auto">
            
            {/* Mobile Touch Lock / Cooperative Scroll Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playSubtleClick();
                setIsMapInteractive(prev => !prev);
              }}
              className={`px-3 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xl border cursor-pointer ${
                isMapInteractive
                  ? "bg-emerald-500/25 border-emerald-500/60 text-emerald-300 backdrop-blur-md"
                  : "bg-black/80 border-[#D4A843]/40 text-[#D4A843] backdrop-blur-md hover:border-[#D4A843]"
              }`}
              title={isMapInteractive ? "Mapa Desbloqueado: Mueve el mapa con 1 dedo" : "Mapa Bloqueado: Desliza la página libremente sin trabas"}
            >
              {isMapInteractive ? <Unlock size={11} /> : <Lock size={11} />}
              <span>{isMapInteractive ? "Navegación Mapa: ON" : "Scroll Libre: ON"}</span>
            </button>

            <span className="px-3 py-1.5 rounded-full bg-black/70 text-[9px] text-white/70">Zona aproximada</span>
          </div>

          {/* Touch Notice Toast when locked */}
          {showTouchNotice && !isMapInteractive && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full glass-obsidian border border-[#D4A843]/50 text-white text-[10px] font-medium tracking-wide shadow-2xl animate-in fade-in duration-200 pointer-events-none">
              Pulsa <strong className="text-[#D4A843]">Scroll Libre</strong> arriba para mover el mapa
            </div>
          )}

          {/* ── MOBILE HORIZONTAL CAROUSEL (OVER-THE-MAP THUMB DRAWER) ── */}
          <div className="lg:hidden absolute bottom-3 inset-x-3 z-30 pointer-events-auto">
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 px-1">
              {displayMapModels.map((model) => {
                const isSelected = selectedModel?.id === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => handleModelSelect(model)}
                    className={`snap-center flex-shrink-0 w-[240px] p-3 rounded-2xl glass-obsidian border transition-all cursor-pointer shadow-2xl ${
                      isSelected
                        ? "border-[#D4A843] bg-black/90 shadow-[0_0_25px_rgba(212,168,67,0.4)] scale-102"
                        : "border-white/15 bg-[#0A0A0F]/85 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <Image
                          src={model.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
                          alt={model.name}
                          fill
                          className="object-cover"
                        />
                        <div className={`absolute top-0.5 right-0.5 w-2 h-2 rounded-full border border-black ${model.is_online ? "bg-emerald-400" : "bg-white/30"}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-serif font-bold text-sm truncate">{model.name}</h4>
                          <span className="text-[9px] font-mono font-bold text-[#D4A843]">{model.hourly_rate ? `$${model.hourly_rate}/h` : "Consultar tarifa"}</span>
                        </div>
                        <span className="text-[8px] text-white/50 uppercase tracking-wider truncate block">
                          {model.sector || model.city}
                        </span>
                          <span className="text-[8px] text-white/60 font-bold flex items-center gap-1">
                            <MapPin size={8} />
                            Ubicación aproximada
                          </span>
                      </div>
                    </div>

                    {model.whatsapp && <a
                      href={`https://wa.me/${model.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola ${model.name}, vi tu perfil en Cariñosas.top (${model.city}). ¿Tienes disponibilidad?`)}`}
                      target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#D4A843] to-[#FFE088] text-black font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-md hover:brightness-110 transition-all"
                    ><MessageCircle size={11} fill="currentColor" /><span>WhatsApp</span></a>}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
