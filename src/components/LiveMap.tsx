"use client";

import React, { useState, useEffect } from "react";
import { Crown, Navigation, ZoomIn } from "lucide-react";

// Mock locations for premium models in Ecuador
const LOCATIONS = [
  { id: '1', name: 'Valentina', lat: -0.1807, lng: -78.4678, area: 'Quito - Cumbayá', distance: '1.2km' },
  { id: '2', name: 'Camila', lat: -2.1894, lng: -79.8891, area: 'Guayaquil - Samborondón', distance: '3.5km' },
  { id: '3', name: 'Luciana', lat: -2.9001, lng: -79.0059, area: 'Cuenca VIP', distance: '0.8km' },
  { id: '4', name: 'Alessandra', lat: -0.9621, lng: -80.7127, area: 'Manta Puerto', distance: '4.1km' },
  { id: '5', name: 'Isabella', lat: -0.1700, lng: -78.4800, area: 'Quito Norte', distance: '2.4km' },
  { id: '6', name: 'Elena', lat: -3.2581, lng: -79.9161, area: 'Machala Centro', distance: '5.2km' },
  { id: '7', name: 'Sofia', lat: -3.3283, lng: -79.8067, area: 'Pasaje VIP', distance: '2.9km' },
];

export default function LiveMap() {
  const [selected, setSelected] = useState<typeof LOCATIONS[0] | null>(null);

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
            Visualiza en tiempo real a las modelos más exclusivas cerca de tu ubicación. Discreción garantizada mediante nuestro sistema de geocodificación enmascarada.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-brand-gold/10 border border-brand-gold/20 px-6 py-3 rounded-2xl">
           <div className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
           <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">{LOCATIONS.length} Modelos Activas</span>
        </div>
      </div>

      <div className="relative w-full aspect-[21/9] bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
        {/* Mock Map Background (Dark Mode Aesthetic) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                 <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>

        {/* Pulsing Central User Location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
           <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_#3B82F6] animate-pulse" />
           <div className="absolute inset-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 border border-blue-500/20 rounded-full animate-ping" />
        </div>

        {/* Model Icons (👑) */}
        {LOCATIONS.map((loc) => {
          // Semi-random positioning for mock visualization
          const top = `${40 + (loc.lat * 5)}%`;
          const left = `${50 + (loc.lng * 2)}%`;
          const isSelected = selected?.id === loc.id;

          return (
            <div 
              key={loc.id}
              className="absolute z-20 cursor-pointer transition-all duration-500 hover:scale-125"
              style={{ top, left }}
              onClick={() => setSelected(loc)}
            >
              <div className={`p-2 rounded-full backdrop-blur-md border transition-all duration-500 ${isSelected ? 'bg-brand-pink border-white shadow-[0_0_20px_#E91E63]' : 'bg-brand-gold/20 border-brand-gold/40'}`}>
                <Crown size={18} className={isSelected ? 'text-white' : 'text-brand-gold'} />
              </div>

              {/* Quick Preview Card */}
              {isSelected && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 glass-dark border border-brand-gold/30 rounded-2xl p-4 animate-in slide-in-from-bottom-2 fade-in duration-300 pointer-events-none">
                   <div className="flex flex-col gap-2">
                      <p className="text-xs font-serif text-brand-gold">{loc.name}</p>
                      <p className="text-[10px] text-brand-white font-bold uppercase tracking-widest">{loc.area}</p>
                      <div className="flex items-center justify-between mt-2">
                         <span className="text-[9px] text-brand-white/40 font-black">📍 A {loc.distance}</span>
                         <span className="text-[9px] text-brand-pink font-black uppercase">Online</span>
                      </div>
                   </div>
                   <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-brand-gold/30" />
                </div>
              )}
            </div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-4">
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-white/40 hover:text-brand-gold hover:bg-white/10 transition-all shadow-xl">
             <ZoomIn size={20} />
           </button>
           <button className="w-12 h-12 rounded-2xl glass-dark border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:scale-110 transition-all shadow-xl">
             <Navigation size={20} />
           </button>
        </div>
      </div>
    </section>
  );
}
