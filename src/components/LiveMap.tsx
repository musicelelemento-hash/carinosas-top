"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navigation, Loader2, MapPin, ChevronRight, Star, Users, Zap, MessageSquare, Heart, Radar, ShieldCheck } from "lucide-react";
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
  Quito:         { center: [-0.1807, -78.4678], zoom: 13, label: "Quito" },
  Guayaquil:     { center: [-2.1894, -79.8891], zoom: 13, label: "Guayaquil" },
  Cuenca:        { center: [-2.9001, -79.0059], zoom: 13, label: "Cuenca" },
  Manta:         { center: [-0.9621, -80.7127], zoom: 13, label: "Manta" },
  Machala:       { center: [-3.2581, -79.9161], zoom: 13, label: "Machala" },
  "Santo Domingo": { center: [-0.2520, -79.1714], zoom: 13, label: "Sto. Domingo" },
  Ambato:        { center: [-1.2417, -78.6197], zoom: 13, label: "Ambato" },
  Loja:          { center: [-3.9931, -79.2042], zoom: 13, label: "Loja" },
  Pasaje:        { center: [-3.3283, -79.8067], zoom: 14, label: "Pasaje" },
};

export default function LiveMap() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("Quito");
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [L, setL] = useState<any>(null);
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
          setUserLocation(coords);
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

  const handleModelSelect = (model: any) => {
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
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })
    : null;

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

  const userIcon = L
    ? new L.DivIcon({
        html: `<div class="user-pin"><div class="user-pulse"></div><div class="user-core"></div></div>`,
        className: "user-loc-icon",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })
    : null;

  const initialCenter = ECUADOR_CITIES.Quito.center;

  return (
    <section className="relative w-full overflow-hidden bg-brand-black">
      {/* Floating Tactical Overlay */}
      <div className="absolute top-28 left-10 z-30 pointer-events-none hidden md:block">
        <div className="glass-premium border-brand-gold/10 p-8 rounded-[2.5rem] space-y-6 max-w-sm pointer-events-auto shadow-[0_40px_80px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 border border-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold shadow-gold overflow-hidden relative">
              <Radar size={24} className="animate-spin-slow opacity-20 absolute" />
              <Zap size={20} className="animate-pulse relative z-10" />
            </div>
            <div>
              <h2 className="text-3xl font-serif text-white italic leading-none">Elite <span className="text-brand-gold">Proximity</span></h2>
              <p className="text-[9px] text-brand-white/40 uppercase font-black tracking-[0.3em] mt-2">Active Satellite Sync</p>
            </div>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/40">
                <span>System Status</span>
                <span className="text-brand-gold">Operational</span>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-brand-gold w-3/4 animate-pulse" />
             </div>
          </div>

          <div className="flex gap-6 pt-4 border-t border-white/5">
             <div className="flex flex-col">
                <span className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Total Online</span>
                <span className="text-3xl font-serif text-brand-gold leading-none">{models.length}</span>
             </div>
             <div className="flex flex-col border-l border-white/10 pl-6">
                <span className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Local Verified</span>
                <span className="text-3xl font-serif text-white leading-none">{cityModels.length}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Compact City Filters */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-5xl px-6 pointer-events-none">
        <div className="flex gap-3 p-2.5 glass-premium border-white/5 rounded-[2.5rem] overflow-x-auto no-scrollbar pointer-events-auto shadow-2xl backdrop-blur-3xl">
          {Object.entries(ECUADOR_CITIES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => handleCitySelect(key)}
              className={`flex-shrink-0 px-6 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-700 ${
                selectedCity === key
                  ? "bg-white text-brand-black border-white shadow-lg"
                  : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/20"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Experience Container */}
      <div className="flex flex-col lg:flex-row h-screen pt-24 lg:pt-0">
        
        {/* === SIDEBAR COMPONENT (Curated List) === */}
        <div className="w-full lg:w-[400px] bg-brand-black/95 border-r border-white/5 overflow-y-auto custom-scrollbar z-20 backdrop-blur-3xl">
          <div className="sticky top-0 bg-brand-black/80 backdrop-blur-2xl p-8 border-b border-white/5 z-10 space-y-2">
             <div className="flex items-center justify-between">
                <span className="text-[11px] text-brand-gold font-black uppercase tracking-[0.4em]">Curated in {selectedCity}</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                   <span className="text-[8px] text-white/40 font-black uppercase">Live Now</span>
                </div>
             </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {cityModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className={`w-full p-8 text-left flex items-center gap-6 transition-all duration-500 hover:bg-white/5 group relative overflow-hidden ${
                  selectedModel?.id === model.id ? 'bg-brand-gold/5' : ''
                }`}
              >
                {selectedModel?.id === model.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold" />
                )}
                
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-brand-gold/40 transition-all duration-500">
                  <img src={model.images?.[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent" />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                     <h4 className="text-white font-serif text-xl leading-none group-hover:text-brand-gold transition-colors">{model.name}</h4>
                     {model.plan_type === 'VIP Elite' && <ShieldCheck size={14} className="text-brand-gold" />}
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black truncate">
                    {model.age} Years · {model.sector || 'Exclusive Zone'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">5 min arrival window</span>
                  </div>
                </div>
                <ChevronRight size={18} className={`text-white/10 group-hover:text-brand-gold transition-all duration-500 ${selectedModel?.id === model.id ? 'translate-x-2' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* === TACTICAL MAP ENGINE === */}
        <div className="flex-1 relative z-10">
          {!loading && typeof window !== "undefined" && (
            <MapContainer
              center={initialCenter}
              zoom={13}
              scrollWheelZoom={true}
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
                    icon={selectedModel?.id === model.id ? selectedIcon : goldIcon}
                    eventHandlers={{ click: () => handleModelSelect(model) }}
                  >
                    <Popup className="premium-map-popup">
                       <div className="p-4 w-60 space-y-4">
                          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-brand-black border border-white/5 relative">
                             <img src={model.images?.[0]} className="w-full h-full object-cover" />
                             <div className="absolute top-3 right-3 bg-brand-gold text-brand-black text-[8px] font-black px-2 py-1 rounded-full uppercase">Verified</div>
                          </div>
                          <div>
                             <h5 className="text-white font-serif text-2xl italic leading-none">{model.name}</h5>
                             <p className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-black mt-2">{model.age} Años · Ecuador</p>
                          </div>
                          <button 
                             onClick={(e) => { e.stopPropagation(); window.location.href = `/profile/${model.id}`; }}
                             className="block w-full py-4 bg-white text-brand-black text-[10px] font-black uppercase text-center rounded-xl tracking-[0.3em] hover:bg-brand-gold transition-all duration-500 shadow-xl"
                          >
                             Access Profile
                          </button>
                       </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          )}

          {/* Map Vignette & Controls */}
          <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)]" />
          
          <div className="absolute bottom-12 right-12 z-30 flex flex-col items-end gap-6 text-right animate-in fade-in duration-1000">
             <div className="glass-premium px-8 py-5 rounded-[2rem] border-white/5 space-y-1">
                <span className="text-[9px] text-white/30 uppercase font-black tracking-widest block">Satellite Encryption</span>
                <span className="text-[11px] text-brand-gold font-black uppercase tracking-[0.4em]">AES-256 SECURED</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Active Members</span>
                   <span className="text-lg font-serif text-white italic">Elite Access Only</span>
                </div>
                <div className="w-12 h-12 rounded-2xl border border-brand-gold/30 flex items-center justify-center bg-brand-gold/5 backdrop-blur-xl">
                   <div className="w-3 h-3 rounded-full bg-brand-gold animate-ping" />
                </div>
             </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container { background: #050505 !important; }
        .premium-map-popup .leaflet-popup-content-wrapper {
          background: rgba(5, 5, 5, 0.95) !important;
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 2.5rem;
          color: white;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.9);
        }
        .premium-map-popup .leaflet-popup-content { margin: 0; width: auto !important; }
        .premium-map-popup .leaflet-popup-tip { background: rgba(5, 5, 5, 0.95); border: 1px solid rgba(255, 255, 255, 0.05); }
        
        .live-pin { position: relative; width: 32px; height: 32px; }
        .pin-pulse { position: absolute; inset: 0; background: #D4AF37; border-radius: 50%; opacity: 0.4; animation: pinPulse 2.5s infinite; }
        .pin-core { position: absolute; inset: 10px; background: #D4AF37; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px #D4AF37; }
        
        .live-pin-selected { position: relative; width: 44px; height: 44px; }
        .pin-pulse-red { position: absolute; inset: 0; background: #FFFFFF; border-radius: 50%; opacity: 0.6; animation: pinPulse 1.2s infinite; }
        .pin-core-red { position: absolute; inset: 14px; background: #FFFFFF; border-radius: 50%; border: 3px solid #D4AF37; box-shadow: 0 0 30px rgba(255,255,255,0.8); }

        @keyframes pinPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3.5); opacity: 0; }
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.3); }
      `}</style>
    </section>
  );
}
