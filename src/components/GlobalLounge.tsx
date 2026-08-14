"use client";

import React from "react";
import Image from "next/image";
import { Plane, Star, MapPin, ChevronRight, Globe } from "lucide-react";

const TRAVELERS = [
  {
    id: "t1",
    name: "Valentina",
    origin: "Colombia",
    location: "Quito / GYE",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    rating: "4.9",
    status: "Arriving Tomorrow"
  },
  {
    id: "t2",
    name: "Alessandra",
    origin: "Venezuela",
    location: "Manta / Salinas",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400",
    rating: "5.0",
    status: "Available Now"
  },
  {
    id: "t3",
    name: "Isabella",
    origin: "Brasil",
    location: "Cuenca",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
    rating: "4.8",
    status: "Touring June"
  }
];

export default function GlobalLounge() {
  return (
    <section className="py-20 bg-gradient-to-b from-brand-black to-brand-black/95 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 animate-pulse">
            <Globe className="text-brand-gold" size={18} />
            <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.4em]">International Travelers</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tighter italic">
            Global <span className="text-brand-gold">Lounge</span>
          </h2>
          <p className="text-brand-white/40 text-xs uppercase tracking-widest max-w-md">
            Modelos internacionales en gira exclusiva por las principales ciudades de Ecuador. 
            Disponibilidad limitada y reserva anticipada.
          </p>
        </div>
        
        <button className="group flex items-center gap-3 glass-premium px-8 py-4 rounded-full border border-white/5 hover:border-brand-gold transition-all text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-brand-gold">
          Explorar Tours
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex gap-8 overflow-x-auto no-scrollbar px-6 md:px-[calc((100vw-1280px)/2)] lg:px-[calc((100vw-1440px)/2)] pb-10">
        {TRAVELERS.map((model) => (
          <div key={model.id} className="flex-shrink-0 w-[320px] md:w-[400px] group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/5 group-hover:border-brand-gold/30 transition-all duration-700">
              <Image 
                src={model.image} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-[5s] brightness-90 group-hover:brightness-100" 
                alt={model.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
              
              {/* Traveling Status Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-brand-gold/20 backdrop-blur-xl border border-brand-gold/40 px-4 py-2 rounded-full">
                <Plane size={12} className="text-brand-gold animate-bounce-subtle" />
                <span className="text-[9px] text-brand-gold font-black uppercase tracking-widest">{model.status}</span>
              </div>

              {/* Identity Info */}
              <div className="absolute bottom-10 left-10 right-10 space-y-4">
                 <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-3xl font-serif text-white italic">{model.name}</h4>
                      <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase font-black tracking-widest mt-1">
                        <MapPin size={10} className="text-brand-gold" />
                        {model.location}
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex flex-col items-center">
                       <Star size={12} className="text-brand-gold fill-brand-gold" />
                       <span className="text-[10px] text-white font-black mt-1">{model.rating}</span>
                    </div>
                 </div>
                 
                 <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Procedencia</span>
                    <span className="text-[10px] text-brand-gold font-black uppercase tracking-widest">{model.origin}</span>
                 </div>
              </div>
            </div>
          </div>
        ))}

        {/* See More Card */}
        <div className="flex-shrink-0 w-[320px] md:w-[400px] flex items-center justify-center">
           <div className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-6 glass-premium rounded-[3rem] border border-brand-gold/10 group hover:border-brand-gold/40 transition-all cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                 <Globe size={40} className="animate-spin-slow" />
              </div>
              <div className="text-center">
                 <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.4em] block mb-2">Join the Club</span>
                 <h4 className="text-2xl font-serif text-white italic">Ver Todas las Viajeras</h4>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
