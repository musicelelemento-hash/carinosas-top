"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plane, Star, MapPin, ChevronRight, Globe, Clock, ShieldCheck, Sparkles, MessageCircle, Calendar } from "lucide-react";

interface TourModel {
  id: string;
  name: string;
  origin: string;
  flag: string;
  currentCity: string;
  hotel: string;
  image: string;
  rating: string;
  arrivingIn: string;
  availableDates: string;
  spotsLeft: number;
  rate: string;
}

const TOURING_MODELS: TourModel[] = [
  {
    id: "t1",
    name: "Valentina",
    origin: "Medellín, Colombia",
    flag: "🇨🇴",
    currentCity: "Quito VIP",
    hotel: "Swissôtel 5★",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600",
    rating: "4.9",
    arrivingIn: "Mañana 14:00",
    availableDates: "15 - 20 Agosto",
    spotsLeft: 2,
    rate: "$200/h"
  },
  {
    id: "t2",
    name: "Alessandra",
    origin: "Caracas, Venezuela",
    flag: "🇻🇪",
    currentCity: "Guayaquil / Samborondón",
    hotel: "Hotel Oro Verde 5★",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600",
    rating: "5.0",
    arrivingIn: "Disponible Ahora",
    availableDates: "14 - 18 Agosto",
    spotsLeft: 1,
    rate: "$250/h"
  },
  {
    id: "t3",
    name: "Isabella",
    origin: "São Paulo, Brasil",
    flag: "🇧🇷",
    currentCity: "Cuenca & Manta",
    hotel: "Manta Suite Privada",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600",
    rating: "4.8",
    arrivingIn: "En 3 Días",
    availableDates: "18 - 25 Agosto",
    spotsLeft: 3,
    rate: "$180/h"
  }
];

export default function GlobalLounge() {
  const [selectedCity, setSelectedCity] = useState<'all' | 'Quito' | 'Guayaquil' | 'Cuenca' | 'Manta' | 'Salinas'>('all');

  const filteredTour = TOURING_MODELS.filter(m => {
    if (selectedCity === 'all') return true;
    return m.currentCity.toLowerCase().includes(selectedCity.toLowerCase());
  });

  const handleBookTour = (model: TourModel) => {
    const text = encodeURIComponent(`Hola Concierge de Cariñosas.top, deseo reservar un cupo exclusivo para la gira internacional de ${model.name} (${model.origin}) en ${model.currentCity} (${model.availableDates}).`);
    window.open(`https://wa.me/593987654321?text=${text}`, "_blank");
  };

  return (
    <section className="py-28 bg-gradient-to-b from-[#08080C] via-[#0B0B10] to-[#08080C] overflow-hidden relative" id="global-lounge">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 space-y-12 relative z-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-obsidian border border-brand-gold/30 text-brand-gold">
              <Globe size={14} className="animate-spin-slow" />
              <span className="text-[9px] font-black uppercase tracking-[0.35em]">Giras Internacionales 4K</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight italic">
              Global <span className="bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-clip-text text-transparent">Lounge VIP</span>
            </h2>

            <p className="text-xs text-white/50 max-w-lg leading-relaxed font-serif italic">
              Modelos internacionales de alto perfil en gira exclusiva por los mejores hoteles de Ecuador. Cupos limitados con reserva previa.
            </p>
          </div>

          {/* City Filter Tabs */}
          <div className="flex flex-wrap p-1.5 rounded-2xl glass-obsidian border border-white/10 gap-1">
            {(['all', 'Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Salinas'] as const).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                  selectedCity === city
                    ? 'bg-brand-gold text-brand-black shadow-[0_0_15px_rgba(212,168,67,0.4)]'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {city === 'all' ? 'Todas las Giras' : city}
              </button>
            ))}
          </div>
        </div>

        {/* ── TOURING CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredTour.map((model) => (
            <div 
              key={model.id}
              className="group glass-obsidian rounded-[2.5rem] border border-white/10 hover:border-brand-gold/50 p-6 shadow-2xl transition-all duration-700 hover:-translate-y-2 flex flex-col justify-between"
            >
              
              {/* Photo & Arrival Ribbon */}
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6">
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[4s] brightness-90 group-hover:brightness-100"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />

                {/* Arrival Countdown Ribbon */}
                <div className="absolute top-4 left-4 bg-brand-gold/90 text-brand-black px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <Plane size={11} className="rotate-45" />
                  {model.arrivingIn}
                </div>

                {/* Spots Left Alert */}
                <div className="absolute top-4 right-4 bg-brand-pink/90 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                  {model.spotsLeft} Cupos VIP
                </div>

                {/* Floating Bottom Card Info */}
                <div className="absolute bottom-4 inset-x-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{model.flag}</span>
                        <h4 className="text-2xl font-serif text-white italic font-bold">{model.name}</h4>
                      </div>
                      <span className="text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
                        {model.origin}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[7px] text-white/40 uppercase font-black tracking-widest block">Tarifa Gira</span>
                      <span className="text-base font-serif font-bold text-white">{model.rate}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl glass-dark border border-white/10 flex items-center justify-between text-[8px] text-white/80">
                    <span className="flex items-center gap-1 font-bold">
                      <MapPin size={10} className="text-brand-gold" /> {model.hotel}
                    </span>
                    <span className="flex items-center gap-1 text-brand-gold font-bold">
                      <Calendar size={10} /> {model.availableDates}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => handleBookTour(model)}
                className="w-full py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(212,168,67,0.3)] flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} fill="currentColor" />
                <span>Reservar Cupo VIP de Gira</span>
              </button>

            </div>
          ))}
        </div>

        {/* ── FOOTER SEAL ── */}
        <div className="p-6 rounded-3xl glass-obsidian border border-brand-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 flex items-center justify-center text-brand-gold border border-brand-gold/30">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Garantía de Pasaporte & Verificación Internacional</span>
              <span className="text-[9px] text-white/50 uppercase tracking-widest">Todas las modelos en gira cuentan con documentación y fotos 100% auditadas.</span>
            </div>
          </div>

          <a
            href="https://wa.me/593987654321?text=Hola%2C%20deseo%20consultar%20el%20calendario%20completo%20de%20giras%20internacionales."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl glass-dark border border-brand-gold/40 text-brand-gold hover:text-white text-[9px] font-black uppercase tracking-wider transition-all"
          >
            Consultar Calendario Completo →
          </a>
        </div>

      </div>
    </section>
  );
}
