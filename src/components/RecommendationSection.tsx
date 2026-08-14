"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Flame, 
  MessageCircle, 
  Sliders, 
  Volume2, 
  Zap, 
  Crown,
  Compass
} from "lucide-react";

interface NearbyModel {
  id: string;
  name: string;
  age: number;
  city: string;
  sector: string;
  distance: string;
  responseTime: string;
  matchScore: number;
  rate: string;
  imageUrl: string;
  isOnline: boolean;
  hasAudio: boolean;
  tags: string[];
}

const NEARBY_MODELS: NearbyModel[] = [
  {
    id: "near-1",
    name: "Valentina",
    age: 22,
    city: "Quito",
    sector: "La Carolina VIP",
    distance: "1.2 km",
    responseTime: "2 min",
    matchScore: 99,
    rate: "$120/h",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    isOnline: true,
    hasAudio: true,
    tags: ["Elegante", "Hotel 5★", "Discreción Total"]
  },
  {
    id: "near-2",
    name: "Alessandra",
    age: 24,
    city: "Guayaquil",
    sector: "Samborondón",
    distance: "850 m",
    responseTime: "3 min",
    matchScore: 98,
    rate: "$150/h",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    isOnline: true,
    hasAudio: true,
    tags: ["Trato VIP", "Cena & Eventos", "Bóveda 4K"]
  },
  {
    id: "near-3",
    name: "Isabella",
    age: 23,
    city: "Quito",
    sector: "Cumbayá",
    distance: "2.8 km",
    responseTime: "5 min",
    matchScore: 96,
    rate: "$140/h",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    isOnline: false,
    hasAudio: true,
    tags: ["Universitaria", "Sutil", "Masaje Sensitivo"]
  }
];

export default function RecommendationSection() {
  const [selectedRadius, setSelectedRadius] = useState<'2km' | '5km' | 'all'>('2km');
  const [selectedCity, setSelectedCity] = useState<'all' | 'Quito' | 'Guayaquil'>('all');

  const filteredModels = NEARBY_MODELS.filter(m => {
    if (selectedCity !== 'all' && m.city !== selectedCity) return false;
    if (selectedRadius === '2km' && parseFloat(m.distance) > 2.0) return false;
    return true;
  });

  const handleQuickContact = (model: NearbyModel) => {
    const text = encodeURIComponent(`Hola ${model.name}, te vi en el Radar de Proximidad de Cariñosas.top (Sector: ${model.sector}). Me gustaría consultar tu disponibilidad para una cita.`);
    window.open(`https://wa.me/593987654321?text=${text}`, "_blank");
  };

  return (
    <section className="py-24 px-5 sm:px-6 relative bg-gradient-to-b from-[#08080C] via-[#0D0D12] to-[#08080C] overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-pink/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">

        {/* ── HEADER & CONTROLS ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-obsidian border border-brand-gold/30 text-brand-gold">
              <Compass size={13} className="animate-spin-slow" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Radar de Proximidad Satelital</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white italic tracking-tight">
              Modelos VIP <span className="bg-gradient-to-r from-brand-gold via-white to-brand-gold bg-clip-text text-transparent">Cerca de Ti</span>
            </h2>

            <p className="text-xs text-white/50 max-w-lg leading-relaxed">
              Algoritmo de geolocalización inteligente para conectarte con acompañantes disponibles a pocos minutos de tu ubicación actual.
            </p>
          </div>

          {/* Quick Radius and City Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex p-1 rounded-xl glass-obsidian border border-white/10">
              <button
                onClick={() => setSelectedRadius('2km')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  selectedRadius === '2km' ? 'bg-brand-gold text-brand-black shadow-md' : 'text-white/40 hover:text-white'
                }`}
              >
                &lt; 2 km
              </button>
              <button
                onClick={() => setSelectedRadius('5km')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  selectedRadius === '5km' ? 'bg-brand-gold text-brand-black shadow-md' : 'text-white/40 hover:text-white'
                }`}
              >
                &lt; 5 km
              </button>
              <button
                onClick={() => setSelectedRadius('all')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  selectedRadius === 'all' ? 'bg-brand-gold text-brand-black shadow-md' : 'text-white/40 hover:text-white'
                }`}
              >
                Toda la Zona
              </button>
            </div>

            <div className="flex p-1 rounded-xl glass-obsidian border border-white/10">
              {(['all', 'Quito', 'Guayaquil'] as const).map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                    selectedCity === city ? 'bg-brand-pink text-white shadow-md' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {city === 'all' ? 'Todas' : city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RADAR CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModels.map((model) => (
            <div 
              key={model.id}
              className="group glass-obsidian rounded-[2.5rem] border border-white/10 hover:border-brand-gold/40 p-5 shadow-2xl transition-all duration-500 hover:-translate-y-1.5 relative flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-5">
                <Image
                  src={model.imageUrl}
                  alt={model.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />

                {/* Top Badges */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                  {/* Distance Pill */}
                  <div className="px-3 py-1.5 rounded-full glass-obsidian border border-brand-gold/50 text-brand-gold text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                    <MapPin size={11} className="text-brand-gold" />
                    {model.distance}
                  </div>

                  {/* Match Score Badge */}
                  <div className="px-3 py-1.5 rounded-full bg-brand-pink text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                    <Sparkles size={11} />
                    {model.matchScore}% Match
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 inset-x-4 z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-serif font-bold text-white italic">{model.name}</h3>
                        <span className="text-sm text-white/70">, {model.age}</span>
                        {model.isOnline && (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="En Línea Ahora" />
                        )}
                      </div>
                      <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
                        {model.sector} · {model.city}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[8px] text-white/40 uppercase font-black tracking-widest block">Tarifa</span>
                      <span className="text-base font-serif font-bold text-white">{model.rate}</span>
                    </div>
                  </div>

                  {/* Response Time & Tags */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[8px] text-white/60">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Zap size={10} /> Responde en ~{model.responseTime}
                    </span>
                    <span className="uppercase font-bold tracking-wider">{model.tags[0]}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/profile/valentina"
                  className="flex-1 py-3 rounded-xl glass-dark border border-white/10 hover:border-brand-gold/40 text-center text-[9px] font-black uppercase tracking-widest text-white/80 hover:text-white transition-all"
                >
                  Ver Perfil 4K
                </Link>

                <button
                  onClick={() => handleQuickContact(model)}
                  className="flex-1 py-3 rounded-xl bg-brand-gold hover:bg-white text-brand-black text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(212,168,67,0.3)] flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={13} fill="currentColor" />
                  Agendar Cita
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
