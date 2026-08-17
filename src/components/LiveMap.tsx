"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { 
  ChevronRight, 
  Zap, 
  Radar, 
  ShieldCheck, 
  MessageCircle, 
  X, 
  MapPin, 
  Star, 
  Navigation, 
  LocateFixed, 
  Sparkles, 
  Lock, 
  Unlock,
  Crosshair,
  Volume2,
  CheckCircle2,
  Compass
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import LiveMapAnimator from "./LiveMapAnimator";
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
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((m) => m.Circle),
  { ssr: false }
);

interface MapModel {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  plan_type: string;
  images: string[];
  sector?: string;
  whatsapp?: string;
  age?: number;
  rate?: number;
  distanceKm?: number;
}

interface LiveMapProps {
  currentCountry?: Country;
  userLocation?: { countryId: string; provinceId: string | null; cantonId: string | null; cantonName: string | null } | null;
}

export default function LiveMap({ currentCountry, userLocation }: LiveMapProps = {}) {
  const activeCountry = currentCountry || getCountryById("ecuador");
  const cityPresets = activeCountry.mapPresets || getCountryById("ecuador").mapPresets;
  const initialCityKey = Object.keys(cityPresets)[0] || "Quito";

  const [models, setModels] = useState<MapModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>(initialCityKey);
  const [selectedModel, setSelectedModel] = useState<MapModel | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [mapTarget, setMapTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);
  const [activeRadius, setActiveRadius] = useState<"1km" | "3km" | "5km" | "all">("5km");
  
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
    import("leaflet").then((leaflet) => setL(leaflet.default || leaflet));
  }, []);

  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase
        .from("models")
        .select("id, name, city, lat, lng, plan_type, images, sector, whatsapp, age")
        .not("lat", "is", null);
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
  const fallbackPreset = cityPresets[selectedCity] || Object.values(cityPresets)[0] || { center: [-0.1807, -78.4678] as [number, number], zoom: 13, label: selectedCity };

  const cityModels: MapModel[] = useMemo(() => {
    const dbCityModels = models.filter(
      (m) => m.city?.toLowerCase().includes(selectedCity?.toLowerCase()) || (m.sector && m.sector.toLowerCase().includes(selectedCity?.toLowerCase()))
    );

    if (dbCityModels.length > 0) return dbCityModels;

    return [
      {
        id: `live-${selectedCity}-1`,
        name: `Valentina S.`,
        city: selectedCity,
        sector: `${selectedCity} Zona VIP Élite`,
        lat: fallbackPreset.center[0] + 0.0035,
        lng: fallbackPreset.center[1] + 0.0042,
        plan_type: "VIP Elite",
        images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"],
        whatsapp: "593987654321",
        age: 23,
        rate: 130,
        distanceKm: 0.8
      },
      {
        id: `live-${selectedCity}-2`,
        name: `Camila R.`,
        city: selectedCity,
        sector: `${selectedCity} Suites 5★`,
        lat: fallbackPreset.center[0] - 0.0045,
        lng: fallbackPreset.center[1] - 0.0035,
        plan_type: "Diamante",
        images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"],
        whatsapp: "593987654322",
        age: 24,
        rate: 150,
        distanceKm: 1.2
      },
      {
        id: `live-${selectedCity}-3`,
        name: `Luciana M.`,
        city: selectedCity,
        sector: `${selectedCity} Centro Residencial`,
        lat: fallbackPreset.center[0] + 0.0062,
        lng: fallbackPreset.center[1] - 0.0048,
        plan_type: "VIP Elite",
        images: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"],
        whatsapp: "593987654323",
        age: 22,
        rate: 120,
        distanceKm: 1.6
      },
      {
        id: `live-${selectedCity}-4`,
        name: `Elena V.`,
        city: selectedCity,
        sector: `${selectedCity} Plaza VIP`,
        lat: fallbackPreset.center[0] - 0.0028,
        lng: fallbackPreset.center[1] + 0.0065,
        plan_type: "Oro",
        images: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"],
        whatsapp: "593987654324",
        age: 25,
        rate: 140,
        distanceKm: 2.1
      }
    ];
  }, [models, selectedCity, fallbackPreset]);

  // Radius filtering (meters)
  const radiusMeters = useMemo(() => {
    switch (activeRadius) {
      case "1km": return 1200;
      case "3km": return 3200;
      case "5km": return 5500;
      case "all": return 18000;
    }
  }, [activeRadius]);

  const displayMapModels = useMemo(() => {
    if (activeRadius === "all") return cityModels;
    // Filter by approx distance
    const maxKm = activeRadius === "1km" ? 1.5 : activeRadius === "3km" ? 3.5 : 6.0;
    return cityModels.filter(m => (m.distanceKm || 1.0) <= maxKm);
  }, [cityModels, activeRadius]);

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
    if (model.lat && model.lng) {
      const coords: [number, number] = [model.lat, model.lng];
      setMapTarget({ center: coords, zoom: 16 });
    }
  };

  // Custom Avatar Marker Icon Factory
  const createAvatarIcon = (imgUrl: string, isSelected: boolean) => {
    if (!L) return undefined;
    return new L.DivIcon({
      html: `<div class="relative group cursor-pointer">
        <div class="absolute -inset-2 rounded-full ${isSelected ? 'bg-[#FF0062]/50 animate-ping' : 'bg-[#D4AF37]/35 animate-pulse'} blur-sm"></div>
        <div class="relative w-11 h-11 rounded-full p-[2px] ${isSelected ? 'bg-gradient-to-tr from-[#FF0062] to-[#FF80A0] scale-110 shadow-[0_0_25px_rgba(255,0,98,0.8)]' : 'bg-gradient-to-tr from-[#D4AF37] via-[#FFF1C2] to-[#AA7C11] shadow-[0_0_18px_rgba(212,175,55,0.65)]'} transition-transform duration-300">
          <img src="${imgUrl}" alt="VIP" class="w-full h-full object-cover rounded-full" />
          <div class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black"></div>
        </div>
      </div>`,
      className: "custom-avatar-pin",
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  };

  const initialCenter = (cityPresets[initialCityKey] || Object.values(cityPresets)[0] || { center: [-0.1807, -78.4678] }).center;

  return (
    <section className="relative w-full overflow-hidden bg-[#08080C] border-y border-[#D4AF37]/20" id="geo-radar-live">
      
      {/* ── TOP TACTICAL HUD BAR ── */}
      <div className="relative z-30 px-4 sm:px-6 py-4 bg-[#0A0A0F]/90 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,168,67,0.3)]">
              <Radar size={20} className="animate-spin-slow text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.3em] block">
                  Geo-Radar 4K Táctico
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live GPS
                </span>
              </div>
              <span className="text-xs text-white/60 font-light">
                Detección de suites y acompañantes verificadas en {activeCountry.name}
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
                    ? "bg-gradient-to-r from-[#D4AF37] via-[#FFF1C2] to-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_20px_rgba(212,168,67,0.4)] scale-105"
                    : "glass-dark border-white/10 text-white/50 hover:text-white hover:border-[#D4AF37]/40"
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
              <span className="text-[9px] px-2.5 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] font-bold border border-[#D4AF37]/35 shadow-sm">
                {displayMapModels.length} Modelos en Rango
              </span>
            </div>

            {/* Range Selector Buttons in Sidebar */}
            <div className="space-y-1.5">
              <span className="text-[8px] text-white/40 uppercase font-black tracking-widest block">Radio de Proximidad:</span>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl glass-dark border border-white/10">
                {(["1km", "3km", "5km", "all"] as const).map((rad) => (
                  <button
                    key={rad}
                    onClick={() => {
                      sound.playSubtleClick();
                      setActiveRadius(rad);
                    }}
                    className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                      activeRadius === rad
                        ? "bg-[#D4AF37] text-black shadow-md font-black"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {rad === "all" ? "Todo" : rad}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro HUD Telemetry */}
            <div className="grid grid-cols-2 gap-2 text-[10px] p-3 rounded-2xl glass-dark border border-white/5">
              <div>
                <span className="text-white/40 block text-[8px] uppercase tracking-wider">Discreción</span>
                <span className="text-emerald-400 font-mono font-bold">100% Blindada</span>
              </div>
              <div>
                <span className="text-white/40 block text-[8px] uppercase tracking-wider">Llegada a Suite</span>
                <span className="text-[#D4AF37] font-bold">5-12 min</span>
              </div>
            </div>
          </div>
          
          {/* List of Models */}
          <div className="flex-1 divide-y divide-white/5 overflow-y-auto">
            {displayMapModels.length === 0 ? (
              <div className="p-10 text-center space-y-2 text-white/40 text-xs">
                <MapPin size={24} className="mx-auto text-[#D4AF37]/40" />
                <p>No hay modelos en el radio de {activeRadius} en {selectedCity}.</p>
                <button
                  onClick={() => setActiveRadius("all")}
                  className="text-[10px] text-[#D4AF37] hover:underline block mx-auto mt-2 cursor-pointer"
                >
                  Ampliar a toda la ciudad
                </button>
              </div>
            ) : (
              displayMapModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className={`w-full p-4 text-left flex items-center gap-3.5 transition-all hover:bg-white/5 group relative cursor-pointer ${
                    selectedModel?.id === model.id ? 'bg-[#D4AF37]/10 border-l-4 border-[#D4AF37]' : ''
                  }`}
                >
                  {/* Photo with status indicator */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-[#D4AF37]/50 transition-all shadow-md">
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
                      <h4 className="text-white font-serif text-base font-bold group-hover:text-[#D4AF37] transition-colors truncate">
                        {model.name}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-[#D4AF37]">
                        ${model.rate || 130}/h
                      </span>
                    </div>
                    
                    <p className="text-[9px] text-white/50 uppercase tracking-wider font-bold truncate">
                      {model.age ? `${model.age} Años · ` : ''}{model.sector || 'Zona Exclusiva'}
                    </p>

                    <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-bold">
                      <span>🟢 En Línea</span>
                      <span className="text-white/30">·</span>
                      <span className="text-[#D4AF37]">A ~ {model.distanceKm || 1.2} km</span>
                    </div>
                  </div>

                  <ChevronRight size={15} className={`text-white/20 group-hover:text-[#D4AF37] transition-all ${selectedModel?.id === model.id ? 'translate-x-1 text-[#D4AF37]' : ''}`} />
                </button>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3.5 border-t border-white/10 bg-black/40 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] block font-mono">
              🔒 Privacidad & Discreción 100% Blindada
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

              {/* Dynamic Range Circle Halo */}
              {fallbackPreset && activeRadius !== "all" && (
                <Circle
                  center={fallbackPreset.center}
                  radius={radiusMeters}
                  pathOptions={{
                    color: "#D4AF37",
                    fillColor: "#D4AF37",
                    fillOpacity: 0.05,
                    weight: 1.5,
                    dashArray: "6 10"
                  }}
                />
              )}

              {/* Verified Models Avatar Pins with Sonar Pulse */}
              {displayMapModels.map((model) => (
                model.lat && model.lng && (
                  <Marker
                    key={model.id}
                    position={[model.lat, model.lng]}
                    icon={createAvatarIcon(
                      model.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                      selectedModel?.id === model.id
                    )}
                    eventHandlers={{ click: () => handleModelSelect(model) }}
                  >
                    <Popup className="premium-map-popup">
                       <div className="p-4 w-60 space-y-3 bg-[#0c0c10] text-white rounded-2xl border border-[#D4AF37]/35 shadow-2xl">
                           <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black relative">
                              <Image 
                                src={model.images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800'} 
                                alt={model.name} 
                                fill 
                                className="object-cover" 
                              />
                              <div className="absolute top-2 right-2 bg-[#D4AF37] text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase shadow-md">
                                4K VIP
                              </div>
                           </div>
                          <div>
                             <h5 className="text-white font-serif text-lg italic font-bold">{model.name}</h5>
                             <p className="text-[9px] text-white/50 uppercase tracking-wider font-bold mt-0.5">
                               {model.age ? `${model.age} Años · ` : ''}{model.sector || model.city}
                             </p>
                          </div>
                          <a 
                             href={`https://wa.me/${model.whatsapp || '593987654321'}?text=${encodeURIComponent(`Hola ${model.name}, te vi en el Radar GPS de Cariñosas.top (${model.city}). Deseo consultar tu disponibilidad hoy.`)}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="block w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FFE088] text-black text-[10px] font-black uppercase text-center rounded-xl tracking-wider hover:brightness-110 transition-all shadow-lg"
                          >
                             Contactar WhatsApp
                          </a>
                       </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          )}

          {/* ── 360° TACTICAL RADAR SWEEP BEAM OVERLAY ── */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
            {/* Rotating Conic Beam */}
            <div className="w-[580px] h-[580px] rounded-full radar-sweep-beam opacity-45 pointer-events-none" />
            {/* Concentric Reticle Rings */}
            <div className="absolute w-[460px] h-[460px] rounded-full border border-[#D4AF37]/15 pointer-events-none" />
            <div className="absolute w-[280px] h-[280px] rounded-full border border-emerald-500/10 pointer-events-none" />
            <div className="absolute w-[120px] h-[120px] rounded-full border border-[#D4AF37]/20 pointer-events-none" />
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
                  : "bg-black/80 border-[#D4AF37]/40 text-[#D4AF37] backdrop-blur-md hover:border-[#D4AF37]"
              }`}
              title={isMapInteractive ? "Mapa Desbloqueado: Mueve el mapa con 1 dedo" : "Mapa Bloqueado: Desliza la página libremente sin trabas"}
            >
              {isMapInteractive ? <Unlock size={11} /> : <Lock size={11} />}
              <span>{isMapInteractive ? "Navegación Mapa: ON" : "Scroll Libre: ON"}</span>
            </button>

            {/* Range Selector Pills for Mobile & Fullscreen */}
            <div className="flex items-center gap-1 p-1 rounded-full glass-obsidian border border-white/10 shadow-xl backdrop-blur-xl">
              {(["1km", "3km", "5km", "all"] as const).map((rad) => (
                <button
                  key={rad}
                  onClick={() => {
                    sound.playSubtleClick();
                    setActiveRadius(rad);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeRadius === rad
                      ? "bg-[#D4AF37] text-black shadow-md"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {rad === "all" ? "Todo" : rad}
                </button>
              ))}
            </div>
          </div>

          {/* Touch Notice Toast when locked */}
          {showTouchNotice && !isMapInteractive && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full glass-obsidian border border-[#D4AF37]/50 text-white text-[10px] font-medium tracking-wide shadow-2xl animate-in fade-in duration-200 pointer-events-none">
              💡 Pulsa <strong className="text-[#D4AF37]">Scroll Libre</strong> arriba para mover el mapa
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
                        ? "border-[#D4AF37] bg-black/90 shadow-[0_0_25px_rgba(212,168,67,0.4)] scale-102"
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
                        <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-serif font-bold text-sm truncate">{model.name}</h4>
                          <span className="text-[9px] font-mono font-bold text-[#D4AF37]">${model.rate || 130}/h</span>
                        </div>
                        <span className="text-[8px] text-white/50 uppercase tracking-wider truncate block">
                          {model.sector || model.city}
                        </span>
                        <span className="text-[8px] text-emerald-400 font-bold block">
                          📍 A ~ {model.distanceKm || 1.2} km
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${model.whatsapp || '593987654321'}?text=${encodeURIComponent(`Hola ${model.name}, te vi en el Radar GPS de Cariñosas.top (${model.city}). Deseo consultar tu disponibilidad hoy.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFE088] text-black font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-md hover:brightness-110 transition-all"
                    >
                      <MessageCircle size={11} fill="currentColor" />
                      <span>WhatsApp VIP</span>
                    </a>
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
