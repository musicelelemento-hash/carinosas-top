"use client";

import React, { useState, useEffect } from "react";
import { Users, Flame } from "lucide-react";

export default function LiveCountBanner() {
  const [count, setCount] = useState(42);
  const [city, setCity] = useState("Quito");

  useEffect(() => {
    const timer = setInterval(() => {
      // Randomly fluctuate between 38 and 54
      setCount(prev => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        return Math.max(38, Math.min(prev + delta, 54));
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-brand-gold/10 border-b border-brand-gold/20 py-2.5 px-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/5 to-transparent animate-shimmer" />
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2 text-brand-gold">
          <Flame size={14} className="animate-pulse" />
          <span className="text-glow">Live Now</span>
        </div>
        <div className="flex items-center gap-3 text-brand-white/80">
          <span className="flex items-center gap-1.5 grayscale opacity-50">
            <Users size={14} />
          </span>
          <span>
            <strong className="text-brand-white text-sm md:text-base">{count}</strong> Modelos Verificadas activas en <span className="text-brand-gold">{city}</span>
          </span>
        </div>
        <div className="hidden md:flex h-4 w-px bg-white/10" />
        <div className="hidden md:block text-brand-pink animate-pulse">
          • Alta Demanda
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 8s infinite linear;
        }
      `}</style>
    </div>
  );
}
