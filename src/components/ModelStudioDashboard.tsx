"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Flame, 
  Eye, 
  MessageCircle, 
  DollarSign, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Rocket, 
  CheckCircle2, 
  Settings, 
  Globe, 
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

export default function ModelStudioDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [isBoosted, setIsBoosted] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [selectedTouringCity, setSelectedTouringCity] = useState("Miami");
  const [touringCities, setTouringCities] = useState<string[]>(["Quito", "Medellín", "Miami"]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live Simulated Metrics
  const stats = {
    weeklyViews: 1420,
    whatsappClicks: 88,
    estimatedEarnings: 88 * 0.15 * hourlyRate, // ~13 bookings * $150 = $1,980
    rankingPosition: isBoosted ? "#1 Destacada 4K" : "#4 en Catálogo"
  };

  const handleToggleTourCity = (city: string) => {
    if (touringCities.includes(city)) {
      setTouringCities(touringCities.filter(c => c !== city));
    } else {
      setTouringCities([...touringCities, city]);
    }
  };

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(20); } catch {}
    }
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white pt-28 pb-20 px-4 md:px-12 max-w-6xl mx-auto space-y-8">
      
      {/* Header Profile Bar */}
      <div className="glass-obsidian border border-brand-gold/30 rounded-[2.5rem] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Avatar & Info */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-gold to-yellow-600 p-0.5 shadow-[0_0_25px_rgba(212,168,67,0.4)]">
              <div className="w-full h-full rounded-[22px] bg-brand-black flex items-center justify-center text-2xl font-serif font-bold text-brand-gold">
                V
              </div>
            </div>
            {/* Online Badge */}
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-brand-black flex items-center justify-center ${
              isOnline ? "bg-emerald-500" : "bg-white/30"
            }`} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-white">Valentina</h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40">
                VIP Diamante
              </span>
            </div>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <MapPin size={12} className="text-brand-gold" />
              <span>La Carolina, Quito · Giras Internacionales</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Toggle "En Línea" */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl glass-dark border border-white/10 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold block">Estado en Vivo</span>
              <span className={`text-xs font-black uppercase ${isOnline ? "text-emerald-400" : "text-white/40"}`}>
                {isOnline ? "En Línea Ahora 🟢" : "Desconectada ⚪"}
              </span>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                isOnline ? "bg-emerald-500" : "bg-white/20"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isOnline ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>

          <button
            onClick={() => setIsBoosted(true)}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
              isBoosted
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-brand-gold hover:bg-white text-brand-black shadow-[0_4px_25px_rgba(212,168,67,0.35)]"
            }`}
          >
            <Rocket size={15} />
            <span>{isBoosted ? "Boost Activo 24h" : "Impulsar Perfil #1"}</span>
          </button>
        </div>

      </div>

      {/* ── 4 LIVE STATS CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Views */}
        <div className="p-5 rounded-3xl glass-obsidian border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[10px] uppercase tracking-wider font-bold">Visitas al Perfil</span>
            <Eye size={16} className="text-brand-gold" />
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-white">{stats.weeklyViews}</p>
          <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp size={11} /> +24% esta semana
          </span>
        </div>

        {/* Card 2: WhatsApp Clicks */}
        <div className="p-5 rounded-3xl glass-obsidian border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[10px] uppercase tracking-wider font-bold">Clics en WhatsApp</span>
            <MessageCircle size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-white">{stats.whatsappClicks}</p>
          <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp size={11} /> 12 contactos hoy
          </span>
        </div>

        {/* Card 3: Hourly Rate */}
        <div className="p-5 rounded-3xl glass-obsidian border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[10px] uppercase tracking-wider font-bold">Tarifa por Hora</span>
            <DollarSign size={16} className="text-brand-gold" />
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold text-brand-gold">${hourlyRate}/h</p>
          <span className="text-[9px] text-white/40">Tarifa Élite sugerida</span>
        </div>

        {/* Card 4: Ranking */}
        <div className="p-5 rounded-3xl glass-obsidian border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[10px] uppercase tracking-wider font-bold">Posición Radar GPS</span>
            <Crown size={16} className="text-brand-gold" />
          </div>
          <p className="text-xl font-serif font-bold text-white">{stats.rankingPosition}</p>
          <span className="text-[9px] text-brand-gold font-bold">100% Verificado 4K</span>
        </div>

      </div>

      {/* ── SETTINGS: RATE & TOURING CITIES ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Rate Adjuster */}
        <div className="p-6 rounded-3xl glass-obsidian border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <DollarSign size={18} className="text-brand-gold" />
              <span>Ajustar Tarifa de Presentación</span>
            </h3>
            <span className="text-lg font-mono font-bold text-brand-gold">${hourlyRate} USD</span>
          </div>

          <input
            type="range"
            min="80"
            max="400"
            step="10"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full accent-brand-gold bg-white/10 h-2 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[9px] text-white/40">
            <span>$80/h (Básico)</span>
            <span>$200/h (VIP)</span>
            <span>$400/h (Diamante Ultra)</span>
          </div>

          <p className="text-[10px] text-white/50 italic">
            Tu tarifa se actualiza inmediatamente en tu perfil público y en el catálogo internacional.
          </p>
        </div>

        {/* Box 2: International Touring Cities */}
        <div className="p-6 rounded-3xl glass-obsidian border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Globe size={18} className="text-brand-gold" />
              <span>Giras Internacionales Disponibles</span>
            </h3>
            <span className="text-[10px] text-brand-gold uppercase font-bold">{touringCities.length} ciudades</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "Quito 🇪🇨", "Guayaquil 🇪🇨", "Medellín 🇨🇴", "Bogotá 🇨🇴", 
              "Lima 🇵🇪", "Ciudad de Panamá 🇵🇦", "CDMX 🇲🇽", "Cancún 🇲🇽", 
              "Madrid 🇪🇸", "Miami 🇺🇸"
            ].map((city) => {
              const active = touringCities.some(tc => city.includes(tc));
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleToggleTourCity(city.split(" ")[0])}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                    active
                      ? "bg-brand-gold text-brand-black shadow-md"
                      : "glass-dark border border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-white/50 italic">
            Los clientes VIP de estas ciudades podrán reservar tus giras con anticipación.
          </p>
        </div>

      </div>

      {/* Save Button */}
      <div className="text-center pt-2">
        <button
          onClick={handleSaveSettings}
          className="px-10 py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_10px_35px_rgba(212,168,67,0.4)] transition-all transform hover:scale-105 inline-flex items-center gap-2"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 size={16} className="text-emerald-700" />
              <span>¡Cambios Guardados con Éxito!</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Guardar Configuración en Vivo</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
