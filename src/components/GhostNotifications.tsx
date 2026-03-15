"use client";

import React, { useState, useEffect } from "react";
import { Crown, CheckCircle2 } from "lucide-react";

const CITIES = ["Samborondón", "Cumbayá", "Quito Norte", "Guayaquil", "Cuenca VIP", "Manta"];
const MODELS = ["Valentina", "Camila", "Luciana", "Alessandra", "Isabella", "Antonella"];

export default function GhostNotifications() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({ city: "", model: "" });

  useEffect(() => {
    const showNotification = () => {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const model = MODELS[Math.floor(Math.random() * MODELS.length)];
      setData({ city, model });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const initialDelay = Math.random() * 10000 + 5000;
    const timer = setTimeout(() => {
      showNotification();
      setInterval(showNotification, 30000); // Every 30 seconds
    }, initialDelay);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[90] animate-in slide-in-from-left-full duration-700 ease-out">
      <div className="glass-dark border border-brand-gold/30 rounded-2xl p-4 pr-8 flex items-center gap-4 shadow-2xl max-w-[320px]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/30">
            <Crown size={24} className="text-brand-gold" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-brand-pink rounded-full p-1 border-2 border-brand-black">
            <CheckCircle2 size={10} className="text-white" />
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-brand-white/40 font-black uppercase tracking-widest">Cita Agendada</p>
          <p className="text-sm text-brand-white leading-tight">
            Un caballero de <span className="text-brand-gold font-bold">{data.city}</span> acaba de contactar a <span className="text-brand-pink font-bold">{data.model}</span>.
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-white/20 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
