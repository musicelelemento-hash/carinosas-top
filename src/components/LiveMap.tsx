"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navigation, Loader2, MapPin, ChevronRight, Star, Users } from "lucide-react";
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
function FlyToHandler({ target }: { target: { center: [number, number]; zoom: number } | null }) {
  const lastKey = useRef("");
  
  useEffect(() => {
    if (!target) return;
    const key = `${target.center[0].toFixed(4)},${target.center[1].toFixed(4)},${target.zoom}`;
    if (key === lastKey.current) return;
    lastKey.current = key;
  }, [target]);

  return null; // The actual flyTo is handled via mapRef
}

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

    // Try to detect user location for auto city detection
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setMapTarget({ center: coords, zoom: 14 });
        },
        () => {
          // Default to Quito if denied
          setMapTarget({ center: ECUADOR_CITIES.Quito.center, zoom: 13 });
        }
      );
    } else {
      setMapTarget({ center: ECUADOR_CITIES.Quito.center, zoom: 13 });
    }
  }, []);

  // Models in selected city
  const cityModels = models.filter(
    (m) => m.city?.toLowerCase() === selectedCity?.toLowerCase()
  );

  const handleCitySelect = (cityKey: string) => {
    setSelectedCity(cityKey);
    const city = ECUADOR_CITIES[cityKey];
    if (city) {
      setMapTarget({ center: city.center, zoom: city.zoom });
      if (mapRef.current) mapRef.current.flyTo(city.center, city.zoom, { animate: true, duration: 1.5 });
    }
    setSelectedModel(null);
  };

  const handleModelSelect = (model: any) => {
    setSelectedModel(model);
    if (model.lat && model.lng) {
      const coords: [number, number] = [model.lat, model.lng];
      setMapTarget({ center: coords, zoom: 16 });
      if (mapRef.current) mapRef.current.flyTo(coords, 16, { animate: true, duration: 1.2 });
    }
  };

  // Gold pulsing marker icon
  const goldIcon = L
    ? new L.DivIcon({
        html: `<div style="
          position: relative;
          width: 32px; height: 32px;
        ">
          <div style="
            position: absolute; inset: 0;
            background: radial-gradient(circle, rgba(212,175,55,0.8) 0%, rgba(212,175,55,0.1) 70%, transparent 100%);
            border-radius: 50%;
            animation: mapPulse 2s ease-in-out infinite;
          "></div>
          <div style="
            position: absolute; inset: 6px;
            background: #D4AF37;
            border-radius: 50%;
            border: 2px solid #fff3;
            box-shadow: 0 0 12px rgba(212,175,55,0.8);
          "></div>
        </div>`,
        className: "live-model-icon",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })
    : null;

  const selectedIcon = L
    ? new L.DivIcon({
        html: `<div style="
          position: relative; width: 44px; height: 44px;
        ">
          <div style="
            position: absolute; inset: 0;
            background: radial-gradient(circle, rgba(255,0,110,0.6) 0%, transparent 70%);
            border-radius: 50%;
            animation: mapPulse 1s ease-in-out infinite;
          "></div>
          <div style="
            position: absolute; inset: 6px;
            background: #FF006E;
            border-radius: 50%;
            border: 2px solid #fff5;
            box-shadow: 0 0 20px rgba(255,0,110,0.9);
          "></div>
        </div>`,
        className: "live-model-icon-selected",
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      })
    : null;

  const userIcon = L
    ? new L.DivIcon({
        html: `<div style="position: relative; width: 20px; height: 20px;">
          <div style="
            position: absolute; inset: -10px;
            border: 1px solid rgba(59,130,246,0.3);
            border-radius: 50%;
            animation: mapPulse 1.5s ease-in-out infinite;
          "></div>
          <div style="
            position: absolute; inset: 0;
            background: #3B82F6;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px rgba(59,130,246,0.8);
          "></div>
        </div>`,
        className: "user-loc-icon",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })
    : null;

  const initialCenter = ECUADOR_CITIES[selectedCity]?.center || [-0.1807, -78.4678];

  return (
    <section className="relative w-full overflow-hidden" style={{ background: '#050505' }}>
      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-brand-gold text-[10px] font-black uppercase tracking-[0.4em]">
              <Navigation size={14} className="animate-pulse" />
              Live Access Ecuador
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-white leading-tight">
              Mapa de <span className="text-brand-gold">Proximidad VIP</span>
            </h2>
            <p className="text-brand-white/40 text-sm leading-relaxed max-w-lg">
              Explora las modelos más exclusivas cerca de ti. Selecciona una ciudad y navega el mapa para descubrir perfiles verificados.
            </p>
          </div>

          {/* Live count badge */}
          <div className="flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/20 px-5 py-3 rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">
                {loading ? "Cargando..." : `${models.length} Activas`}
              </span>
              <span className="text-[8px] text-brand-white/30 uppercase tracking-widest">En vivo ahora</span>
            </div>
          </div>
        </div>

        {/* City Pills */}
        <div className="flex gap-2 flex-wrap mb-0">
          {Object.entries(ECUADOR_CITIES).map(([key, val]) => {
            const count = models.filter(m => m.city?.toLowerCase() === key.toLowerCase()).length;
            return (
              <button
                key={key}
                onClick={() => handleCitySelect(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                  selectedCity === key
                    ? "bg-brand-gold text-brand-black border-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    : "border-white/10 text-white/40 hover:border-brand-gold/30 hover:text-brand-gold/70"
                }`}
              >
                {val.label}
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                    selectedCity === key ? 'bg-brand-black/20' : 'bg-brand-gold/20 text-brand-gold'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-0 relative" style={{ height: '70vh', minHeight: '500px' }}>
        
        {/* === THE MAP === */}
        <div className="flex-1 relative">
          {!loading && typeof window !== "undefined" && (
            <MapContainer
              center={initialCenter}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-full"
              zoomControl={false}
              style={{ height: '70vh', minHeight: '500px' }}
              ref={mapRef}
            >
              {/* Dark premium tile */}
              <TileLayer
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* Fly-to is handled via mapRef.current.flyTo() calls above */}

              {/* User location */}
              {userLocation && userIcon && (
                <>
                  <Marker position={userLocation} icon={userIcon} />
                  <Circle
                    center={userLocation}
                    radius={800}
                    pathOptions={{
                      color: "#3B82F6",
                      fillColor: "#3B82F6",
                      fillOpacity: 0.04,
                      weight: 1,
                      opacity: 0.3,
                    }}
                  />
                </>
              )}

              {/* Model markers */}
              {models.map((model) =>
                model.lat && model.lng && goldIcon && selectedIcon ? (
                  <Marker
                    key={model.id}
                    position={[model.lat, model.lng]}
                    icon={selectedModel?.id === model.id ? selectedIcon : goldIcon}
                    eventHandlers={{ click: () => handleModelSelect(model) }}
                  >
                    <Popup className="premium-popup">
                      <div className="min-w-[160px] p-1">
                        {model.images?.[0] && (
                          <div className="w-full h-24 rounded-lg overflow-hidden mb-2">
                            <img
                              src={model.images[0]}
                              alt={model.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="font-serif text-brand-gold text-base mb-0.5">{model.name}</p>
                        <p className="text-[9px] text-white/60 font-black uppercase tracking-widest mb-1">
                          {model.age} años · {model.city}
                        </p>
                        {model.sector && (
                          <p className="text-[8px] text-brand-gold/50 italic">{model.sector}</p>
                        )}
                        {model.whatsapp && (
                          <a
                            href={`https://wa.me/593${model.whatsapp.replace(/\D/g, '').replace(/^0/, '')}?text=Hola%20${encodeURIComponent(model.name)}%2C%20vi%20tu%20perfil%20en%20Cariñosas.top`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block w-full text-center bg-brand-gold text-brand-black text-[9px] font-black uppercase tracking-wider py-1.5 rounded-lg"
                          >
                            Contactar
                          </a>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          )}

          {loading && (
            <div className="w-full h-full flex items-center justify-center bg-brand-black">
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={32} className="text-brand-gold animate-spin" />
                <span className="text-[10px] text-brand-gold/50 uppercase font-black tracking-widest">
                  Cargando mapa...
                </span>
              </div>
            </div>
          )}

          {/* Corner vignette overlay */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to right, transparent 70%, #050505 100%), linear-gradient(to bottom, #05050520 0%, transparent 15%, transparent 85%, #050505 100%)'
            }}
          />
        </div>

        {/* === SIDEBAR - Models in this city === */}
        <div className="w-full lg:w-80 bg-[#07070A] border-t lg:border-t-0 lg:border-l border-white/5 overflow-y-auto flex flex-col" style={{ maxHeight: '70vh' }}>
          <div className="p-4 border-b border-white/5 sticky top-0 bg-[#07070A] z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-brand-gold" />
                <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">
                  {selectedCity}
                </span>
              </div>
              <span className="text-[9px] text-white/30 font-black uppercase">
                {cityModels.length} disponibles
              </span>
            </div>
          </div>

          {cityModels.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
              <MapPin size={24} className="text-brand-gold/20" />
              <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                Sin modelos en esta ciudad aún
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {cityModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-all hover:bg-white/5 ${
                    selectedModel?.id === model.id ? "bg-brand-gold/10 border-l-2 border-brand-gold" : ""
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    {model.images?.[0] ? (
                      <img
                        src={model.images[0]}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-gold/10 flex items-center justify-center">
                        <Star size={16} className="text-brand-gold/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-brand-white text-sm truncate">{model.name}</p>
                    <p className="text-[9px] text-brand-gold/60 uppercase font-black tracking-wider truncate">
                      {model.age} años
                      {model.sector && ` · ${model.sector}`}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Disponible</span>
                    </div>
                  </div>

                  <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container { background: #050505 !important; }
        .premium-popup .leaflet-popup-content-wrapper {
          background: rgba(7, 7, 10, 0.95) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 1rem;
          color: white;
          box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.08);
          padding: 4px;
        }
        .premium-popup .leaflet-popup-tip-container { display: none; }
        .premium-popup .leaflet-popup-content { margin: 0; }
        .leaflet-control-zoom {
          border: 1px solid rgba(212,175,55,0.2) !important;
          border-radius: 0.75rem !important;
          overflow: hidden;
          margin: 16px !important;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background: rgba(7,7,10,0.9) !important;
          color: #D4AF37 !important;
          border-bottom: 1px solid rgba(212,175,55,0.15) !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
          background: rgba(212,175,55,0.15) !important;
          color: #D4AF37 !important;
        }
        .live-model-icon, .live-model-icon-selected, .user-loc-icon {
          background: transparent !important;
          border: none !important;
        }
        @keyframes mapPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}
