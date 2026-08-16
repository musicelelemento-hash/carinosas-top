"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Crown, Flame, MapPin, X } from "lucide-react";
import { sound } from "@/lib/soundEngine";

interface ActivityItem {
  id: string;
  type: "online" | "vip_pass" | "verified_4k" | "booking";
  name: string;
  location: string;
  message: string;
  timeAgo: string;
}

const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "online",
    name: "Mariana",
    location: "El Poblado, Medellín 🇨🇴",
    message: "se ha conectado en vivo",
    timeAgo: "Hace 1 min"
  },
  {
    id: "2",
    type: "vip_pass",
    name: "Socio VIP #8402",
    location: "Brickell, Miami 🇺🇸",
    message: "activó Pase Diamante Alpha",
    timeAgo: "Hace 3 min"
  },
  {
    id: "3",
    type: "verified_4k",
    name: "Valentina",
    location: "La Carolina, Quito 🇪🇨",
    message: "verificó su Bóveda 4K",
    timeAgo: "Hace 5 min"
  },
  {
    id: "4",
    type: "online",
    name: "Fiorella",
    location: "San Isidro, Lima 🇵🇪",
    message: "disponible para Cenas VIP",
    timeAgo: "Hace 2 min"
  },
  {
    id: "5",
    type: "vip_pass",
    name: "Socio VIP #1938",
    location: "Punta Pacífica, Panamá 🇵🇦",
    message: "desbloqueó Bóveda Secreta",
    timeAgo: "Hace 4 min"
  },
  {
    id: "6",
    type: "verified_4k",
    name: "Paulina",
    location: "Polanco, CDMX 🇲🇽",
    message: "actualizó Book de Fotos 4K",
    timeAgo: "Hace 6 min"
  },
  {
    id: "7",
    type: "booking",
    name: "Carolina",
    location: "Salamanca, Madrid 🇪🇸",
    message: "agendó cita VIP confirmada",
    timeAgo: "Hace 8 min"
  }
];

export default function LiveActivityToast() {
  const [currentActivity, setCurrentActivity] = useState<ActivityItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    let index = 0;

    // Show first toast after 4 seconds
    const initialTimer = setTimeout(() => {
      setCurrentActivity(SAMPLE_ACTIVITIES[0]);
      setIsVisible(true);
    }, 4000);

    // Interval to cycle every 18 seconds
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        index = (index + 1) % SAMPLE_ACTIVITIES.length;
        setCurrentActivity(SAMPLE_ACTIVITIES[index]);
        setIsVisible(true);
      }, 800);
    }, 18000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (!currentActivity || isDismissed) return null;

  const getIcon = () => {
    switch (currentActivity.type) {
      case "online":
        return <Flame size={14} className="text-emerald-400 fill-current animate-pulse" />;
      case "vip_pass":
        return <Crown size={14} className="text-brand-gold fill-current" />;
      case "verified_4k":
        return <ShieldCheck size={14} className="text-blue-400" />;
      default:
        return <Sparkles size={14} className="text-brand-pink" />;
    }
  };

  return (
    <div
      className={`fixed bottom-20 md:bottom-8 left-4 md:left-8 z-[90] max-w-sm transition-all duration-700 pointer-events-auto ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-95 pointer-events-none"
      }`}
    >
      <div className="glass-obsidian border border-brand-gold/30 rounded-2xl p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center gap-3 relative group">
        
        {/* Glow indicator */}
        <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-serif font-bold text-white truncate">
              {currentActivity.name}
            </span>
            <span className="text-[9px] text-white/40">· {currentActivity.timeAgo}</span>
          </div>

          <p className="text-[10px] text-white/70 truncate mt-0.5">
            {currentActivity.message}
          </p>

          <div className="flex items-center gap-1 mt-1 text-[8px] text-brand-gold/80 font-bold uppercase tracking-wider">
            <MapPin size={9} />
            <span className="truncate">{currentActivity.location}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors"
        >
          <X size={12} />
        </button>

      </div>
    </div>
  );
}
