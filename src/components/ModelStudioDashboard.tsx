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
import { sound } from "@/lib/soundEngine";

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
  const [isAddingTour, setIsAddingTour] = useState(false);

  // Metrics
  const stats = {
    weeklyViews: 2480,
    whatsappClicks: 142,
    estimatedEarnings: 142 * 0.18 * hourlyRate, // ~25 bookings * $150 = $3,750
    vaultUnlocks: 38,
    vaultEarnings: 38 * vaultRate, // 38 * $35 = $1,330
    rankingPosition: isBoosted ? "#1 Destacada 4K VIP" : "#3 en Catálogo Top"
  };

  const METRICS = [
    { label: "Visitas Esta Semana", val: stats.weeklyViews.toLocaleString(), icon: Eye, color: "text-brand-gold", change: "+28% vs la semana anterior" },
    { label: "Contactos WhatsApp", val: String(stats.whatsappClicks), icon: MessageCircle, color: "text-emerald-400", change: "Alta intención de reserva" },
    { label: "Ingresos Estimados", val: `$${Math.round(stats.estimatedEarnings).toLocaleString()} USD`, icon: DollarSign, color: "text-brand-gold", change: `Basado en tarifa de $${hourlyRate}/h` },
    { label: "Bóveda 4K Desbloqueos", val: String(stats.vaultUnlocks), icon: Lock, color: "text-brand-pink", change: `$${stats.vaultEarnings} USD generados` }
  ];

  const handleAddTour = () => {
    if (!newTourCity.trim()) return;
    sound.playSubtleClick();
    const newTour: TourSchedule = {
      id: Date.now().toString(),
      city: newTourCity,
      countryFlag: newTourCity.includes("Medellín") || newTourCity.includes("Bogotá") ? "🇨🇴" : "🇪🇨",
      dates: newTourDates || "Próximamente",
      status: "upcoming"
    };
    setTours([...tours, newTour]);
    setNewTourCity("");
    setIsAddingTour(false);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(15); } catch {}
    }
  };

  const handleDeleteTour = (id: string) => {
    sound.playSubtleClick();
    setTours(tours.filter(t => t.id !== id));
  };

  const handleBoost = () => {
    sound.playGoldChime();
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

  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText("https://carinosas.top/profile/valentina-vip");
      setCopiedLink(true);
      sound.playGoldChime();
      if ("vibrate" in navigator) {
        try { navigator.vibrate(15); } catch {}
      }
      setTimeout(() => setCopiedLink(false), 1500);
    }
  };

  const handleSaveSettings = () => {
    sound.playGoldChime();
    setSavedSuccess(true);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(20); } catch {}
    }
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-12 space-y-8">
      
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
            <p className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
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
              { id: "offline", label: "⚪ Pausa", color: "text-[#A1A1AA]" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  sound.playSubtleClick();
                  setAvailability(st.id as AvailabilityState);
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                  availability === st.id
                    ? "bg-white/15 text-white border border-white/20 shadow-md"
                    : "text-[#A1A1AA] hover:text-white"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Boost Button */}
          <button
            onClick={handleBoost}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
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

      {/* ── METRICS STRIP ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <div key={i} className="glass-obsidian border border-white/10 rounded-3xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-black tracking-widest">{m.label}</span>
              <m.icon size={16} className={m.color} />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white">{m.val}</div>
            <span className="text-[9px] text-emerald-400 font-bold font-mono block">{m.change}</span>
          </div>
        ))}
      </div>

      {/* ── EARNINGS ESTIMATOR & ANALYTICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Earnings Card */}
        <div className="glass-obsidian border border-brand-gold/30 rounded-[2.5rem] p-6 sm:p-8 space-y-4 relative overflow-hidden bg-gradient-to-br from-[#121218] to-[#0a0a0f]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-brand-gold uppercase font-black tracking-[0.2em] flex items-center gap-1.5">
              <DollarSign size={13} /> Facturación Estimada (Este Mes)
            </span>
            <span className="text-[8px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-mono">100% Directo</span>
          </div>
          <div className="text-3xl font-serif font-bold text-brand-gold">${Math.round(stats.estimatedEarnings).toLocaleString()} USD</div>
          <p className="text-xs text-[#A1A1AA]">Calculado en base a {stats.whatsappClicks} contactos por WhatsApp generados desde tu perfil.</p>
        </div>

        {/* Vault Card */}
        <div className="glass-obsidian border border-brand-pink/30 rounded-[2.5rem] p-6 sm:p-8 space-y-4 relative overflow-hidden bg-gradient-to-br from-[#140e12] to-[#0a0a0f]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-brand-pink uppercase font-black tracking-[0.2em] flex items-center gap-1.5">
              <Lock size={13} /> Ingresos por Bóveda 4K
            </span>
            <span className="text-[8px] bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded-full font-mono">Pasivo</span>
          </div>
          <div className="text-3xl font-serif font-bold text-brand-pink">${stats.vaultEarnings} USD</div>
          <p className="text-[10px] text-[#A1A1AA]">{stats.vaultUnlocks} pases vendidos (${vaultRate} c/u)</p>
        </div>

        {/* Quick Action Share */}
        <div className="glass-obsidian border border-white/10 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-serif font-bold text-white">Tu Enlace VIP Directo</h3>
            <p className="text-xs text-[#A1A1AA] mt-1">Comparte tu enlace oficial verificado con clientes de confianza.</p>
          </div>
          <div className="flex items-center gap-2">
            <input 
              readOnly 
              value="https://carinosas.top/profile/valentina-vip"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-[#A1A1AA] outline-none"
            />
            <button 
              onClick={handleCopyLink}
              title={copiedLink ? "¡Copiado!" : "Copiar enlace VIP"}
              className="p-2 rounded-xl bg-brand-gold text-brand-black hover:bg-white transition-all cursor-pointer flex items-center justify-center min-w-[36px]"
            >
              {copiedLink ? <Check size={16} className="text-brand-black animate-in zoom-in" /> : <Share2 size={16} />}
            </button>
          </div>
        </div>

      </div>

      {/* ── TOURS / GIRAS MANAGER ── */}
      <div className="glass-obsidian border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-gold mb-1">
              <Globe size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">Agenda de Giras VIP</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white italic">Ciudades & Disponibilidad de Viaje</h3>
            <p className="text-xs text-[#A1A1AA]">Notifica a los socios VIP cuándo estarás disponible en su ciudad.</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAddingTour(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold text-brand-gold hover:text-brand-black border border-brand-gold/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Programar Gira</span>
            </button>
          </div>
        </div>

        {/* Add Tour Drawer */}
        {isAddingTour && (
          <div className="p-5 rounded-2xl glass-dark border border-brand-gold/40 space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Nueva Ciudad en tu Calendario</span>
              <button onClick={() => setIsAddingTour(false)} className="text-[#A1A1AA] hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#A1A1AA] uppercase font-bold block mb-1">Ciudad / Sector</label>
                <input 
                  type="text" 
                  value={newTourCity}
                  onChange={(e) => setNewTourCity(e.target.value)}
                  placeholder="Ej: Cuenca (Hotel Oro Verde)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#A1A1AA] outline-none focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#A1A1AA] uppercase font-bold block mb-1">Fechas</label>
                <input 
                  type="text" 
                  value={newTourDates}
                  onChange={(e) => setNewTourDates(e.target.value)}
                  placeholder="Ej: 10 - 15 Septiembre"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#A1A1AA] outline-none focus:border-brand-gold"
                />
              </div>
            </div>
            <button 
              onClick={handleAddTour}
              className="px-6 py-2 rounded-xl bg-brand-gold text-brand-black font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Confirmar Fechas en Catálogo
            </button>
          </div>
        )}

        {/* Tour List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tours.map((t) => (
            <div key={t.id} className="p-4 rounded-2xl glass-dark border border-white/10 flex items-center justify-between group hover:border-brand-gold/40 transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{t.countryFlag}</span>
                  <span className="text-xs font-bold text-white">{t.city}</span>
                </div>
                <span className="text-[10px] text-brand-gold font-mono flex items-center gap-1">
                  <Calendar size={10} /> {t.dates}
                </span>
              </div>
              <button 
                onClick={() => handleDeleteTour(t.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-[#A1A1AA] hover:text-rose-400 transition-all cursor-pointer"
                title="Eliminar gira"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* ── SETTINGS: RATES & VAULT MANAGEMENT ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Hourly Rates */}
        <div className="glass-obsidian border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-white italic">Configuración de Tarifas</h3>
            <p className="text-xs text-[#A1A1AA]">Ajusta tu tarifa por hora reflejada en el catálogo y calculadora.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-[#A1A1AA]">Tarifa por Hora:</span>
              <span className="text-2xl font-serif font-bold text-brand-gold">${hourlyRate} USD</span>
            </div>

            <input
              type="range"
              min="80"
              max="500"
              step="10"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
              style={{
                background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((hourlyRate - 80) / (500 - 80)) * 100}%, #27272A ${((hourlyRate - 80) / (500 - 80)) * 100}%, #27272A 100%)`
              }}
            />

            <div className="flex justify-between text-[10px] font-mono text-[#A1A1AA]">
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
            <p className="text-xs text-[#A1A1AA]">Precio por desbloqueo ilimitado a tu contenido privado.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-[#A1A1AA]">Precio del Pase VIP:</span>
              <span className="text-2xl font-serif font-bold text-brand-pink">${vaultRate} USD</span>
            </div>

            <input
              type="range"
              min="15"
              max="100"
              step="5"
              value={vaultRate}
              onChange={(e) => setVaultRate(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-pink"
              style={{
                background: `linear-gradient(to right, #FF006E 0%, #FF006E ${((vaultRate - 15) / (100 - 15)) * 100}%, #27272A ${((vaultRate - 15) / (100 - 15)) * 100}%, #27272A 100%)`
              }}
            />

            <div className="flex justify-between text-[10px] font-mono text-[#A1A1AA]">
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
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4A843] via-[#FFE088] to-[#AA7C11] text-brand-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(212,168,67,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          Guardar Configuración
        </button>
      </div>

    </div>
  );
}
