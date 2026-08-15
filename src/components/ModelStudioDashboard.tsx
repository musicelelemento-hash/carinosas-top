"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  TrendingUp,
  Calendar,
  Lock,
  Plus,
  Trash2,
  Share2,
  Check,
  Zap,
  Clock,
  Camera,
  Star
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

type AvailabilityState = "online" | "in_appointment" | "hotel_vip" | "offline";

interface TourSchedule {
  id: string;
  city: string;
  countryFlag: string;
  dates: string;
  status: "active" | "upcoming";
}

export default function ModelStudioDashboard() {
  const [availability, setAvailability] = useState<AvailabilityState>("online");
  const [isBoosted, setIsBoosted] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [vaultRate, setVaultRate] = useState(35);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Touring Cities Management
  const [tours, setTours] = useState<TourSchedule[]>([
    { id: "1", city: "Quito (La Carolina)", countryFlag: "🇪🇨", dates: "15 - 20 Ago", status: "active" },
    { id: "2", city: "Guayaquil (Samborondón)", countryFlag: "🇪🇨", dates: "22 - 27 Ago", status: "upcoming" },
    { id: "3", city: "Medellín (El Poblado)", countryFlag: "🇨🇴", dates: "01 - 07 Sep", status: "upcoming" },
  ]);

  const [newTourCity, setNewTourCity] = useState("Cuenca");
  const [newTourDates, setNewTourDates] = useState("10 - 15 Sep");

  // Metrics
  const stats = {
    weeklyViews: 2480,
    whatsappClicks: 142,
    estimatedEarnings: 142 * 0.18 * hourlyRate, // ~25 bookings * $150 = $3,750
    vaultUnlocks: 38,
    vaultEarnings: 38 * vaultRate, // 38 * $35 = $1,330
    rankingPosition: isBoosted ? "#1 Destacada 4K VIP" : "#3 en Catálogo Top"
  };

  const handleAddTour = () => {
    if (!newTourCity.trim()) return;
    const newTour: TourSchedule = {
      id: Date.now().toString(),
      city: newTourCity,
      countryFlag: newTourCity.includes("Medellín") || newTourCity.includes("Bogotá") ? "🇨🇴" : "🇪🇨",
      dates: newTourDates || "Próximamente",
      status: "upcoming"
    };
    setTours([...tours, newTour]);
    setNewTourCity("");
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(15); } catch {}
    }
  };

  const handleDeleteTour = (id: string) => {
    setTours(tours.filter(t => t.id !== id));
  };

  const handleBoost = () => {
    setIsBoosted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#D4A843', '#FFE088', '#FF006E', '#FFFFFF'],
      });
    } catch {}
  };

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(20); } catch {}
    }
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-white pt-28 pb-20 px-4 md:px-12 max-w-6xl mx-auto space-y-10">
      
      {/* ── TOP VIP PROFILE BANNER ── */}
      <div className="glass-obsidian border border-brand-gold/30 rounded-[2.5rem] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Ambient Gold Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Left: Avatar & Identity */}
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#D4A843] via-[#FFE088] to-[#AA7C11] p-0.5 shadow-[0_0_30px_rgba(212,168,67,0.4)]">
              <div className="w-full h-full rounded-[22px] bg-[#08080C] flex items-center justify-center text-3xl font-serif font-bold text-brand-gold">
                V
              </div>
            </div>
            {/* Live Indicator */}
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#08080C] flex items-center justify-center ${
              availability === "online" ? "bg-emerald-400 animate-pulse" :
              availability === "in_appointment" ? "bg-amber-400" :
              availability === "hotel_vip" ? "bg-brand-gold" : "bg-white/30"
            }`} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-serif font-bold text-white italic">Valentina</h1>
              <span className="text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40">
                VIP Diamante 4K
              </span>
            </div>
            <p className="text-xs text-white/50 flex items-center gap-1.5">
              <MapPin size={12} className="text-brand-gold" />
              <span>La Carolina, Quito · Giras Nacionales & Internacionales</span>
            </p>
          </div>
        </div>

        {/* Right: Availability Toggle & Boost */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          
          {/* Availability State Selector */}
          <div className="p-2 rounded-2xl glass-dark border border-white/10 flex items-center gap-1">
            {[
              { id: "online", label: "🟢 En Línea", color: "text-emerald-400" },
              { id: "in_appointment", label: "🟡 En Cita", color: "text-amber-400" },
              { id: "hotel_vip", label: "👑 Hotel 5★", color: "text-brand-gold" },
              { id: "offline", label: "⚪ Pausa", color: "text-white/40" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setAvailability(st.id as AvailabilityState)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                  availability === st.id
                    ? "bg-white/15 text-white border border-white/20 shadow-md"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Boost Button */}
          <button
            onClick={handleBoost}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
              isBoosted
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] hover:scale-105 active:scale-95 text-brand-black shadow-[0_4px_25px_rgba(212,168,67,0.35)]"
            }`}
          >
            <Rocket size={15} />
            <span>{isBoosted ? "Boost Activo 24h" : "Impulsar Perfil #1"}</span>
          </button>

        </div>
      </div>

      {/* ── 4 KEY REAL-TIME METRICS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* Metric 1: Views */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[10px] uppercase font-bold tracking-widest">Visitas Esta Semana</span>
            <Eye size={16} className="text-brand-gold" />
          </div>
          <div className="text-3xl font-serif font-bold text-white">{stats.weeklyViews.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp size={12} />
            <span>+28% vs la semana anterior</span>
          </p>
        </div>

        {/* Metric 2: WhatsApp Contacts */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[10px] uppercase font-bold tracking-widest">Contactos WhatsApp</span>
            <MessageCircle size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-400">{stats.whatsappClicks}</div>
          <p className="text-[10px] text-white/40 font-mono">Alta intención de reserva</p>
        </div>

        {/* Metric 3: Estimated Earnings */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[10px] uppercase font-bold tracking-widest">Ingresos Estimados</span>
            <DollarSign size={16} className="text-brand-gold" />
          </div>
          <div className="text-3xl font-serif font-bold text-brand-gold">${stats.estimatedEarnings.toLocaleString()} USD</div>
          <p className="text-[10px] text-white/40">Basado en tarifa de ${hourlyRate}/h</p>
        </div>

        {/* Metric 4: Vault Unlocks */}
        <div className="glass-obsidian border border-white/10 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[10px] uppercase font-bold tracking-widest">Bóveda 4K Desbloqueos</span>
            <Lock size={16} className="text-brand-pink" />
          </div>
          <div className="text-3xl font-serif font-bold text-brand-pink">${stats.vaultEarnings} USD</div>
          <p className="text-[10px] text-white/40">{stats.vaultUnlocks} pases vendidos (${vaultRate} c/u)</p>
        </div>

      </div>

      {/* ── SECTION: GIRAS VIP & CALENDARIO INTERCIUDADES ── */}
      <div className="glass-obsidian border border-brand-gold/25 rounded-[2.5rem] p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-brand-gold">
              <Globe size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Giras VIP & Agenda de Viajes</span>
            </div>
            <h2 className="text-2xl font-serif text-white font-bold italic">
              Calendario de Giras Nacionales e Internacionales
            </h2>
            <p className="text-xs text-white/50 font-light">
              Tus clientes sabrán en qué cantón o ciudad estarás para reservar con antelación.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-gold font-mono font-bold">{tours.length} Giras Programadas</span>
          </div>
        </div>

        {/* Active Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="p-5 rounded-2xl glass-dark border border-white/10 flex flex-col justify-between space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tour.countryFlag}</span>
                  <div>
                    <h3 className="font-serif font-bold text-white text-base">{tour.city}</h3>
                    <p className="text-[10px] text-brand-gold font-mono flex items-center gap-1 mt-0.5">
                      <Calendar size={10} />
                      <span>{tour.dates}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTour(tour.id)}
                  className="w-7 h-7 rounded-lg glass-obsidian border border-white/10 flex items-center justify-center text-white/30 hover:text-rose-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[9px]">
                <span className={`font-bold uppercase tracking-wider ${tour.status === "active" ? "text-emerald-400" : "text-white/40"}`}>
                  {tour.status === "active" ? "🟢 En Curso" : "📅 Próximamente"}
                </span>
                <span className="text-white/40 font-mono">Visible en radar</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Tour Bar */}
        <div className="p-4 rounded-2xl glass-dark border border-white/10 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newTourCity}
            onChange={(e) => setNewTourCity(e.target.value)}
            placeholder="Ciudad / Cantón (ej: Cuenca, Manta, Medellín)"
            className="w-full sm:flex-1 glass-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-brand-gold"
          />
          <input
            type="text"
            value={newTourDates}
            onChange={(e) => setNewTourDates(e.target.value)}
            placeholder="Fechas (ej: 10 - 15 Sep)"
            className="w-full sm:w-48 glass-obsidian border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-brand-gold"
          />
          <button
            onClick={handleAddTour}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus size={14} />
            <span>Agregar Gira</span>
          </button>
        </div>

      </div>

      {/* ── SETTINGS: RATES & VAULT MANAGEMENT ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Hourly Rates */}
        <div className="glass-obsidian border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-white italic">Configuración de Tarifas</h3>
            <p className="text-xs text-white/50">Ajusta tu tarifa por hora reflejada en el catálogo y calculadora.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-white/70">Tarifa por Hora:</span>
              <span className="text-2xl font-serif font-bold text-brand-gold">${hourlyRate} USD</span>
            </div>

            <input
              type="range"
              min="80"
              max="500"
              step="10"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-brand-gold cursor-pointer h-2 bg-white/10 rounded-lg"
            />

            <div className="flex justify-between text-[9px] font-mono text-white/40">
              <span>$80 / h</span>
              <span>$250 / h</span>
              <span>$500 / h</span>
            </div>
          </div>
        </div>

        {/* Box 2: Secret Vault Management */}
        <div className="glass-obsidian border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-white italic">Bóveda Secreta 4K</h3>
            <p className="text-xs text-white/50">Precio por desbloqueo ilimitado a tu contenido privado.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-white/70">Precio del Pase VIP:</span>
              <span className="text-2xl font-serif font-bold text-brand-pink">${vaultRate} USD</span>
            </div>

            <input
              type="range"
              min="15"
              max="100"
              step="5"
              value={vaultRate}
              onChange={(e) => setVaultRate(Number(e.target.value))}
              className="w-full accent-brand-pink cursor-pointer h-2 bg-white/10 rounded-lg"
            />

            <div className="flex justify-between text-[9px] font-mono text-white/40">
              <span>$15 USD</span>
              <span>$50 USD</span>
              <span>$100 USD</span>
            </div>
          </div>
        </div>

      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-4 pt-4">
        {savedSuccess && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
            <Check size={14} />
            <span>Cambios guardados en tiempo real</span>
          </span>
        )}
        <button
          onClick={handleSaveSettings}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(212,168,67,0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          Guardar Configuración
        </button>
      </div>

    </div>
  );
}
