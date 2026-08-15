"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronRight, Zap, Radar, ShieldCheck, MessageCircle, X, MapPin, Star, Navigation, LocateFixed, Sparkles, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import LiveMapAnimator from "./LiveMapAnimator";

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

// ECUADOR CITY PRESETS
const ECUADOR_CITIES: Record<string, { center: [number, number]; zoom: number; label: string }> = {
  Quito:           { center: [-0.1807, -78.4678], zoom: 13, label: "Quito" },
  Guayaquil:       { center: [-2.1894, -79.8891], zoom: 13, label: "Guayaquil" },
  Cuenca:          { center: [-2.9001, -79.0059], zoom: 13, label: "Cuenca" },
  Manta:           { center: [-0.9621, -80.7127], zoom: 13, label: "Manta" },
  Machala:         { center: [-3.2581, -79.9161], zoom: 13, label: "Machala" },
  "Santo Domingo": { center: [-0.2520, -79.1714], zoom: 13, label: "Sto. Domingo" },
  Ambato:          { center: [-1.2417, -78.6197], zoom: 13, label: "Ambato" },
  Loja:            { center: [-3.9931, -79.2042], zoom: 13, label: "Loja" },
};

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
}

export default function LiveMap() {
  const [models, setModels] = useState<MapModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>("Quito");
  const [selectedModel, setSelectedModel] = useState<MapModel | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [mapTarget, setMapTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);
  const mapRef = useRef<any>(null);

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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setMapTarget({ center: coords, zoom: 14 });
        },
        () => {
          setMapTarget({ center: ECUADOR_CITIES.Quito.center, zoom: 13 });
        }
      );
    } else {
      setMapTarget({ center: ECUADOR_CITIES.Quito.center, zoom: 13 });
    }
  }, []);

  const cityModels = models.filter(
    (m) => m.city?.toLowerCase() === selectedCity?.toLowerCase()
  );

  const handleCitySelect = (cityKey: string) => {
    setSelectedCity(cityKey);
    const city = ECUADOR_CITIES[cityKey];
    if (city) {
      setMapTarget({ center: city.center, zoom: city.zoom });
    }
    setSelectedModel(null);
  };

  const handleModelSelect = (model: MapModel) => {
    setSelectedModel(model);
    if (model.lat && model.lng) {
      const coords: [number, number] = [model.lat, model.lng];
      setMapTarget({ center: coords, zoom: 16 });
    }
  };

  // Gold pulsing marker icon
  const goldIcon = L
    ? new L.DivIcon({
        html: `<div class="live-pin">
          <div class="pin-pulse"></div>
          <div class="pin-core"></div>
        </div>`,
        className: "custom-div-icon",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })
    : null;

  // Red Pulsing active icon
  const selectedIcon = L
    ? new L.DivIcon({
        html: `<div class="live-pin-selected">
          <div class="pin-pulse-red"></div>
          <div class="pin-core-red"></div>
        </div>`,
        className: "custom-div-icon-selected",
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      })
    : null;

  const initialCenter = ECUADOR_CITIES.Quito.center;

  return (
    <section className="relative w-full overflow-hidden bg-[#08080C] border-y border-brand-gold/20">
      
      {/* City Selector Bar */}
      <div className="relative z-30 px-6 py-4 bg-black/60 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
              <Radar size={16} className="animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.25em] block">
                Radar Satelital GPS
              </span>
              <span className="text-xs text-white/50 font-light">
                Modelos verificadas en tiempo real
              </span>
            </div>
          </div>

          {/* City Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {Object.entries(ECUADOR_CITIES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleCitySelect(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${
                  selectedCity === key
                    ? "bg-brand-gold text-brand-black border-brand-gold shadow-[0_0_20px_rgba(212,168,67,0.4)]"
                    : "glass-dark border-white/10 text-white/50 hover:text-white hover:border-white/30"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Container: Split Sidebar + Map */}
      <div className="flex flex-col lg:flex-row h-[750px] relative">
        
        {/* === SIDEBAR COMPONENT (No Overlaps, Clean Typography) === */}
        <div className="w-full lg:w-[420px] bg-[#0A0A0F]/95 border-r border-white/10 overflow-y-auto custom-scrollbar z-20 flex flex-col justify-between backdrop-blur-3xl">
          
          {/* Top Header Box */}
          <div className="p-6 border-b border-white/10 space-y-4 bg-black/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] text-white/70 font-black uppercase tracking-widest">
                  Zona: {selectedCity}
                </span>
              </div>
              <span className="text-[9px] px-2.5 py-1 rounded-full bg-brand-gold/15 text-brand-gold font-bold border border-brand-gold/30">
                {cityModels.length} Disponibles
              </span>
            </div>

            {/* Micro HUD Status */}
            <div className="grid grid-cols-2 gap-2 text-[10px] p-3 rounded-2xl glass-dark border border-white/5">
              <div>
                <span className="text-white/40 block text-[8px] uppercase tracking-wider">Cifrado Satelital</span>
                <span className="text-emerald-400 font-mono font-bold">AES-256 Activo</span>
              </div>
              <div>
                <span className="text-white/40 block text-[8px] uppercase tracking-wider">Tiempo Llegada</span>
                <span className="text-brand-gold font-bold">5-15 min Suite</span>
              </div>
            </div>
          </div>
          
          {/* List of Models */}
          <div className="flex-1 divide-y divide-white/5 overflow-y-auto">
            {cityModels.length === 0 ? (
              <div className="p-10 text-center space-y-2 text-white/40 text-xs">
                <MapPin size={24} className="mx-auto text-brand-gold/40" />
                <p>No hay modelos con GPS activo en este momento en {selectedCity}.</p>
                <p className="text-[10px] text-brand-gold">Selecciona otra ciudad arriba.</p>
              </div>
            ) : (
              cityModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className={`w-full p-5 text-left flex items-center gap-4 transition-all hover:bg-white/5 group relative ${
                    selectedModel?.id === model.id ? 'bg-brand-gold/10 border-l-4 border-brand-gold' : ''
                  }`}
                >
                  {/* Photo with status indicator */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-brand-gold/50 transition-all shadow-md">
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
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-serif text-lg font-bold group-hover:text-brand-gold transition-colors truncate">
                        {model.name}
                      </h4>
                      {model.plan_type === 'VIP Elite' && (
                        <ShieldCheck size={14} className="text-brand-gold shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold truncate">
                      {model.age ? `${model.age} Años · ` : ''}{model.sector || 'Zona Exclusiva'}
                    </p>

                    <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-bold">
                      <span>🟢 Disponible Ahora</span>
                      <span className="text-white/30">·</span>
                      <span className="text-brand-gold">A ~ 1.2 km</span>
                    </div>
                  </div>

                  <ChevronRight size={16} className={`text-white/20 group-hover:text-brand-gold transition-all ${selectedModel?.id === model.id ? 'translate-x-1 text-brand-gold' : ''}`} />
                </button>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 bg-black/40 text-center">
            <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] block">
              Discreción Absoluta · Sin Rastro Bancario
            </span>
          </div>
        </div>

        {/* === TACTICAL MAP ENGINE === */}
        <div className="flex-1 relative z-10">
          {!loading && typeof window !== "undefined" && (
            <MapContainer
              center={initialCenter}
              zoom={13}
              scrollWheelZoom={false}
              dragging={true}
              touchZoom={true}
              doubleClickZoom={true}
              className="w-full h-full grayscale-[0.8] contrast-125"
              zoomControl={false}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              
              {mapTarget && <LiveMapAnimator target={mapTarget} />}

              {/* Verified Models Pins */}
              {models.map((model) => (
                model.lat && model.lng && (
                  <Marker
                    key={model.id}
                    position={[model.lat, model.lng]}
                    icon={(selectedModel?.id === model.id ? selectedIcon : goldIcon) || undefined}
                    eventHandlers={{ click: () => handleModelSelect(model) }}
                  >
                    <Popup className="premium-map-popup">
                       <div className="p-4 w-60 space-y-3 bg-[#0c0c10] text-white rounded-2xl border border-brand-gold/30">
                           <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black relative">
                              <Image 
                                src={model.images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800'} 
                                alt={model.name} 
                                fill 
                                className="object-cover" 
                              />
                              <div className="absolute top-2 right-2 bg-brand-gold text-brand-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                                4K VIP
                              </div>
                           </div>
                          <div>
                             <h5 className="text-white font-serif text-xl italic font-bold">{model.name}</h5>
                             <p className="text-[9px] text-white/50 uppercase tracking-wider font-bold mt-1">
                               {model.age ? `${model.age} Años · ` : ''}{model.sector || model.city}
                             </p>
                          </div>
                          <a 
                             href={`https://wa.me/${model.whatsapp || '593987654321'}?text=${encodeURIComponent(`Hola ${model.name}, te vi en el Radar GPS de Cariñosas.top (${model.city}). Deseo consultar tu disponibilidad hoy.`)}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="block w-full py-2.5 bg-brand-gold text-brand-black text-[10px] font-black uppercase text-center rounded-xl tracking-wider hover:bg-white transition-all shadow-lg"
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

          {/* Map Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

          {/* Top Right Floating HUD on the Map */}
          <div className="absolute top-6 right-6 z-30 pointer-events-none hidden md:block">
            <div className="p-4 rounded-2xl glass-obsidian border border-brand-gold/30 shadow-2xl backdrop-blur-2xl flex items-center gap-4 pointer-events-auto">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                <Sparkles size={18} />
              </div>
              <div className="text-left">
                <span className="text-[8px] text-brand-gold font-black uppercase tracking-widest block">Sincronización Satelital</span>
                <span className="text-xs text-white font-serif italic">100% Cifrado AES-256</span>
              </div>
            </div>
          </div>
          
          {/* Sliding Quick Preview Card for Selected Model */}
          {selectedModel && (
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-sm z-30 animate-in slide-in-from-bottom-6 duration-300 pointer-events-auto">
              <div className="glass-obsidian p-5 rounded-3xl border border-brand-gold/40 shadow-[0_30px_90px_rgba(0,0,0,0.95)] relative space-y-4">
                
                <button
                  onClick={() => setSelectedModel(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all text-xs"
                >
                  <X size={14} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-brand-gold/40 flex-shrink-0">
                    <Image
                      src={selectedModel.images?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800'}
                      alt={selectedModel.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-white font-serif text-xl font-bold truncate">{selectedModel.name}</h4>
                      <span className="text-[8px] px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-bold">VIP</span>
                    </div>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">
                      {selectedModel.sector || selectedModel.city}
                    </p>
                    <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>A ~ 1.2 km de ti</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${selectedModel.whatsapp || '593987654321'}?text=${encodeURIComponent(`Hola ${selectedModel.name}, te vi en el Radar GPS de Cariñosas.top (${selectedModel.city}). Deseo consultar tu disponibilidad hoy.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={15} fill="currentColor" />
                  <span>Contactar en WhatsApp</span>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}
