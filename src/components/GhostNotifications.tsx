"use client";

import React, { useState, useEffect } from "react";
import { Crown, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

const CITIES = ["Samborondón", "Cumbayá", "Quito Norte", "Guayaquil Plaza", "Cuenca VIP", "Manta 5★"];
const MODELS = ["Valentina", "Camila", "Luciana", "Alessandra", "Isabella", "Antonella", "Scarlett"];
const ACTIONS = [
  "acaba de verificar disponibilidad 4K con",
  "inició una conversación privada con",
  "reservó una experiencia VIP con"
];

export default function GhostNotifications() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({ city: "", model: "", action: "" });

  useEffect(() => {
    const showNotification = () => {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const model = MODELS[Math.floor(Math.random() * MODELS.length)];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      setData({ city, model, action });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5500);
    };

    const initialDelay = Math.random() * 8000 + 4000;
    const timer = setTimeout(() => {
      showNotification();
      const interval = setInterval(showNotification, 25000); // Every 25 seconds
      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[85] animate-in slide-in-from-left-6 duration-700 ease-out">
      <div className="glass-obsidian border border-brand-gold/40 rounded-2xl p-4 pr-8 flex items-center gap-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] max-w-[340px] relative">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-brand-gold/15 flex items-center justify-center border border-brand-gold/40 shadow-[0_0_15px_rgba(212,168,67,0.2)]">
            <Crown size={18} className="text-brand-gold fill-brand-gold animate-pulse" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-400 rounded-full p-0.5 border-2 border-black">
            <CheckCircle2 size={8} className="text-black" />
          </div>
        </div>
        
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-[8px] text-brand-gold font-black uppercase tracking-[0.25em]">Actividad en Vivo</p>
          </div>
          <p className="text-xs text-white/90 leading-tight">
            Cliente de <strong className="text-white">{data.city}</strong> {data.action} <span className="text-brand-gold font-serif italic font-bold">{data.model}</span>.
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
