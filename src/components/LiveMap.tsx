"use client";

import React, { useState, useEffect } from "react";
import { Crown, Navigation, ZoomIn, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Dynamic import for Leaflet to avoid SSR issues in Next.js
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + Next.js
let L: any = null;
if (typeof window !== 'undefined') {
  L = require('leaflet');
}

export default function LiveMap() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase
        .from('models')
        .select('id, name, city, lat, lng, plan_type, images, sector')
        .not('lat', 'is', null);
      
      if (data && !error) setModels(data);
      setLoading(false);
    }
    fetchLocations();

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => console.log("User denied location")
      );
    }
  }, []);

  const customIcon = L ? new L.DivIcon({
    html: `<div class="p-2 rounded-full backdrop-blur-md border bg-brand-gold/20 border-brand-gold/40 shadow-gold animate-in fade-in zoom-in duration-500"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg></div>`,
    className: 'custom-div-icon',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  }) : null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 overflow-hidden">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-3 text-brand-gold text-[10px] font-black uppercase tracking-[0.4em]">
            <Navigation size={14} className="animate-pulse" />
            Live Access Ecuador
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-white leading-tight">
            Mapa de <span className="text-brand-gold">Proximidad VIP</span>
          </h2>
          <p className="text-brand-white/40 text-sm md:text-base leading-relaxed">
            Visualiza en tiempo real a las modelos más exclusivas cerca de tu ubicación. Discrección garantizada mediante nuestro sistema de geocodificación enmascarada.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-brand-gold/10 border border-brand-gold/20 px-6 py-3 rounded-2xl">
           <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
           <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">
             {loading ? <Loader2 size={10} className="animate-spin" /> : `${models.length} Modelos Encontradas`}
           </span>
        </div>
      </div>

      <div className="relative w-full aspect-[21/9] bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl z-0">
        {!loading && typeof window !== 'undefined' && (
          <MapContainer 
            center={userLocation || [-1.8312, -78.1834]} 
            zoom={userLocation ? 13 : 7} 
            scrollWheelZoom={false}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {models.map(model => (
              <Marker 
                key={model.id} 
                position={[model.lat, model.lng]} 
                icon={customIcon}
              >
                <Popup className="premium-popup">
                  <div className="text-center p-2 min-w-[120px]">
                    <p className="font-serif text-brand-gold mb-1 text-sm">{model.name}</p>
                    <p className="text-[9px] text-white font-black uppercase tracking-widest mb-1">{model.city}</p>
                    {model.sector && (
                      <p className="text-[8px] text-brand-gold/60 italic border-t border-white/10 pt-1 mt-1 font-medium">{model.sector}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

            {userLocation && (
              <Marker position={userLocation} icon={L ? new L.DivIcon({
                html: `<div class="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_#3B82F6] animate-pulse"></div><div class="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 border border-blue-500/20 rounded-full animate-ping"></div>`,
                className: 'user-location-icon',
                iconSize: [16, 16],
              }) : null} />
            )}
          </MapContainer>
        )}

        {/* Dynamic Design Overlay */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-brand-black/20 z-10" />
      </div>

      <style jsx global>{`
        .leaflet-container { background: #050505 !important; }
        .premium-popup .leaflet-popup-content-wrapper { background: rgba(10, 10, 10, 0.8) !important; backdrop-filter: blur(10px); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 1rem; color: white; }
        .premium-popup .leaflet-popup-tip { background: rgba(10, 10, 10, 0.8) !important; border: 1px solid rgba(212, 175, 55, 0.2); }
      `}</style>
    </section>
  );
}
