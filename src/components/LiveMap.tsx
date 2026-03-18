"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navigation, Loader2, MapPin, ChevronRight, Star, Users, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

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

// FlyToHandler - renders inside MapContainer so useMap works safely
const FlyToHandler = ({ target }: { target: { center: [number, number]; zoom: number } | null }) => {
  // We handle FlyTo inside the component that has access to useMap
  // but react-leaflet's useMap requires being a child of MapContainer.
  // Since we are using dynamic imports, we'll define a local component for it.
  return null; 
};

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

  // Dynamic useMap component
  const MapNavigation = dynamic(
    () => import("react-leaflet").then((m) => {
      const { useMap } = m;
      return function Nav({ target }: { target: { center: [number, number]; zoom: number } | null }) {
        const map = useMap();
        useEffect(() => {
          if (target) {
            map.flyTo(target.center, target.zoom, { animate: true, duration: 1.5 });
          }
        }, [target, map]);
        return null;
      };
    }),
    { ssr: false }
  );

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
      {/* Premium Header */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-[10px] text-brand-gold font-black uppercase tracking-[0.4em]">
              <Zap size={14} className="animate-pulse" />
              Proximity Live Dashboard
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tighter italic">
              Elite <span className="text-brand-gold">Discovery</span>
            </h2>
            <p className="text-brand-white/40 text-xs uppercase tracking-[0.3em] font-black max-w-sm">
              Encuentra compañía premium a pocos minutos de tu ubicación actual.
            </p>
          </div>

          <div className="flex gap-3">
             <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl flex flex-col items-center">
                <span className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Activas</span>
                <span className="text-2xl font-serif text-brand-gold">{models.length}</span>
             </div>
             <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl flex flex-col items-center">
                <span className="text-[8px] text-white/30 uppercase font-black tracking-widest mb-1">Cercanas</span>
                <span className="text-2xl font-serif text-brand-pink">{cityModels.length}</span>
             </div>
          </div>
        </div>

        {/* City Filter Layout */}
        <div className="mt-12 flex gap-3 overflow-x-auto no-scrollbar pb-4">
          {Object.entries(ECUADOR_CITIES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => handleCitySelect(key)}
              className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 active:scale-95 ${
                selectedCity === key
                  ? "bg-brand-gold text-brand-black border-brand-gold shadow-[0_15px_30px_rgba(212,175,55,0.2)]"
                  : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
              }`}
            >
              <MapPin size={12} />
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Experience */}
      <div className="flex flex-col lg:flex-row h-[70vh] min-h-[600px] border-t border-white/5">
        
        {/* === Sidebar (Uber style) === */}
        <div className="w-full lg:w-96 bg-brand-black border-r border-white/5 overflow-y-auto custom-scrollbar z-20">
          <div className="sticky top-0 bg-brand-black/90 backdrop-blur-md p-6 border-b border-white/5 z-10">
             <div className="flex items-center justify-between">
                <span className="text-[10px] text-brand-gold font-black uppercase tracking-widest">Modelos en {selectedCity}</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {cityModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className={`w-full p-6 text-left flex items-center gap-4 transition-all hover:bg-white/5 group ${
                  selectedModel?.id === model.id ? 'bg-brand-gold/10' : ''
                }`}
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-brand-gold/50 transition-colors">
                  <img src={model.images?.[0]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-white font-serif text-lg leading-tight">{model.name}</h4>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest font-black truncate">
                    {model.age} Años · {model.sector || 'Exclusivo'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-brand-gold font-black uppercase tracking-widest">A 5 min de distancia</span>
                  </div>
                </div>
                <ChevronRight size={16} className={`text-white/20 group-hover:text-brand-gold transition-all ${selectedModel?.id === model.id ? 'translate-x-1 text-brand-gold' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* === MAP ENGINE === */}
        <div className="flex-1 relative z-10">
          {!loading && typeof window !== "undefined" && (
            <MapContainer
              center={initialCenter}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-full"
              zoomControl={false}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              
              <MapNavigation target={mapTarget} />

              {/* User marker */}
              {userLocation && userIcon && (
                <Marker position={userLocation} icon={userIcon} />
              )}

              {/* Models */}
              {models.map((model) => (
                model.lat && model.lng && (
                  <Marker
                    key={model.id}
                    position={[model.lat, model.lng]}
                    icon={selectedModel?.id === model.id ? selectedIcon : goldIcon}
                    eventHandlers={{ click: () => handleModelSelect(model) }}
                  >
                    <Popup className="premium-map-popup">
                       <div className="p-3 w-48 space-y-3">
                          <div className="aspect-video rounded-xl overflow-hidden bg-brand-black">
                             <img src={model.images?.[0]} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <h5 className="text-brand-gold font-serif text-lg">{model.name}</h5>
                             <p className="text-[8px] text-white/50 uppercase tracking-widest font-black">{model.age} Años · {model.city}</p>
                          </div>
                          <a href={`/profile/${model.id}`} className="block w-full py-2 bg-brand-gold text-brand-black text-[10px] font-black uppercase text-center rounded-lg tracking-widest">Ver Perfil VIP</a>
                       </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          )}

          {/* Vignette elements */}
          <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-8 right-8 z-30 glass-premium px-6 py-4 rounded-3xl border-brand-gold/20 flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Sincronización</span>
                <span className="text-[10px] text-brand-gold font-black uppercase tracking-widest">Satélite Activo</span>
             </div>
             <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
             </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container { background: #050505 !important; }
        .premium-map-popup .leaflet-popup-content-wrapper {
          background: rgba(10, 10, 12, 0.95) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 1.5rem;
          color: white;
          padding: 0;
          overflow: hidden;
        }
        .premium-map-popup .leaflet-popup-content { margin: 0; width: auto !important; }
        .premium-map-popup .leaflet-popup-tip { background: rgba(10, 10, 12, 0.95); }
        
        .live-pin { position: relative; width: 32px; height: 32px; }
        .pin-pulse { position: absolute; inset: 0; background: #D4AF37; border-radius: 50%; opacity: 0.4; animation: pinPulse 2s infinite; }
        .pin-core { position: absolute; inset: 10px; background: #D4AF37; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #D4AF37; }
        
        .live-pin-selected { position: relative; width: 44px; height: 44px; }
        .pin-pulse-red { position: absolute; inset: 0; background: #FF006E; border-radius: 50%; opacity: 0.6; animation: pinPulse 1s infinite; }
        .pin-core-red { position: absolute; inset: 12px; background: #FF006E; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 20px #FF006E; }

        @keyframes pinPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 10px; }
      `}</style>
    </section>
  );
}
