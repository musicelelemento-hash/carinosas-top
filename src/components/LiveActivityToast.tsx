"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Crown, Flame, MapPin, X } from "lucide-react";

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
    location: "El Poblado, Medellín",
    message: "disponible para citas VIP",
    timeAgo: "Hace 1 min"
  },
  {
    id: "2",
    type: "vip_pass",
    name: "Socio VIP #8402",
    location: "Samborondón, Guayaquil",
    message: "activó Pase Diamante Alpha",
    timeAgo: "Hace 3 min"
  },
  {
    id: "3",
    type: "verified_4k",
    name: "Valentina",
    location: "La Carolina, Quito",
    message: "verificó su Bóveda 4K",
    timeAgo: "Hace 5 min"
  },
  {
    id: "4",
    type: "online",
    name: "Fiorella",
    location: "San Isidro, Lima",
    message: "disponible para Cenas VIP",
    timeAgo: "Hace 2 min"
  },
  {
    id: "5",
    type: "vip_pass",
    name: "Socio VIP #1938",
    location: "Punta Pacífica, Panamá",
    message: "desbloqueó Bóveda Secreta",
    timeAgo: "Hace 4 min"
  },
  {
    id: "6",
    type: "verified_4k",
    name: "Paulina",
    location: "Polanco, CDMX",
    message: "actualizó Book de Fotos 4K",
    timeAgo: "Hace 6 min"
  },
  {
    id: "7",
    type: "booking",
    name: "Carolina",
    location: "Salamanca, Madrid",
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
    let autoDismissTimer: NodeJS.Timeout | null = null;

    // Show first toast after 3.5 seconds
    const initialTimer = setTimeout(() => {
      setCurrentActivity(SAMPLE_ACTIVITIES[0]);
      setIsVisible(true);

      // Auto-dismiss in strictly 3 seconds
      autoDismissTimer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }, 3500);

    // Cycle every 14 seconds (3s display + 11s interval gap)
    const interval = setInterval(() => {
      index = (index + 1) % SAMPLE_ACTIVITIES.length;
      setCurrentActivity(SAMPLE_ACTIVITIES[index]);
      setIsVisible(true);

      if (autoDismissTimer) clearTimeout(autoDismissTimer);
      autoDismissTimer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      if (autoDismissTimer) clearTimeout(autoDismissTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (!currentActivity || isDismissed) return null;

  const getIcon = () => {
    switch (currentActivity.type) {
      case "online":
        return <Flame size={13} className="text-emerald-400 fill-current animate-pulse" />;
      case "vip_pass":
        return <Crown size={13} className="text-[#D4AF37] fill-current" />;
      case "verified_4k":
        return <ShieldCheck size={13} className="text-[#D4AF37]" />;
      default:
        return <Sparkles size={13} className="text-[#FF0062]" />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-4 md:top-6 right-4 md:right-6 z-[100] max-w-[340px] w-full transition-all duration-500 pointer-events-auto ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
      }`}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div 
        className="rounded-2xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-center gap-3 relative group border border-[#D4AF37]/35"
        style={{
          background: "rgba(12, 12, 18, 0.88)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {/* Glow indicator icon */}
        <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-serif font-bold text-white truncate">
              {currentActivity.name}
            </span>
            <span className="text-[8px] text-white/40 font-mono">· {currentActivity.timeAgo}</span>
          </div>

          <p className="text-[10px] text-white/80 truncate leading-tight mt-0.5">
            {currentActivity.message}
          </p>

          <div className="flex items-center gap-1 mt-0.5 text-[8px] text-[#D4AF37] font-bold uppercase tracking-wider">
            <MapPin size={9} />
            <span className="truncate">{currentActivity.location}</span>
          </div>
        </div>

        {/* Manual Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setIsDismissed(true);
          }}
          className="text-white/40 hover:text-white transition-colors p-1"
          aria-label="Cerrar notificación"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
