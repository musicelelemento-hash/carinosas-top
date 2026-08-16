"use client";

import React, { useState } from "react";
import { 
  X, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  MapPin, 
  Check, 
  Flame, 
  Lock 
} from "lucide-react";
import { sound } from "@/lib/soundEngine";

interface FilterValues {
  maxRate?: number;
  onlyOnline?: boolean;
  only4K?: boolean;
  onlyVIP?: boolean;
  category?: string;
}

interface MobileFiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters?: FilterValues;
  onApplyFilters?: (filters: {
    maxRate: number;
    onlyOnline: boolean;
    only4K: boolean;
    onlyVIP: boolean;
    category: string;
  }) => void;
}

export default function MobileFiltersSheet({
  isOpen,
  onClose,
  initialFilters,
  onApplyFilters
}: MobileFiltersSheetProps) {
  const [maxRate, setMaxRate] = useState<number>(initialFilters?.maxRate ?? 200);
  const [onlyOnline, setOnlyOnline] = useState<boolean>(initialFilters?.onlyOnline ?? false);
  const [only4K, setOnly4K] = useState<boolean>(initialFilters?.only4K ?? true);
  const [onlyVIP, setOnlyVIP] = useState<boolean>(initialFilters?.onlyVIP ?? false);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters?.category ?? "Todas");

  React.useEffect(() => {
    if (initialFilters) {
      if (initialFilters.maxRate !== undefined) setMaxRate(initialFilters.maxRate);
      if (initialFilters.onlyOnline !== undefined) setOnlyOnline(initialFilters.onlyOnline);
      if (initialFilters.only4K !== undefined) setOnly4K(initialFilters.only4K);
      if (initialFilters.onlyVIP !== undefined) setOnlyVIP(initialFilters.onlyVIP);
      if (initialFilters.category !== undefined) setSelectedCategory(initialFilters.category);
    }
  }, [initialFilters, isOpen]);

  if (!isOpen) return null;

  const categories = ["Todas", "Cena VIP", "Hotel 5★", "Masaje Relax", "Viajes & Giras", "Universitaria"];

  const handleApply = () => {
    sound.playGoldChime();
    if (onApplyFilters) {
      onApplyFilters({
        maxRate,
        onlyOnline,
        only4K,
        onlyVIP,
        category: selectedCategory
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Modal */}
      <div className="relative w-full max-w-lg glass-obsidian border-t border-brand-gold/40 rounded-t-[3rem] p-6 pb-10 shadow-[0_-20px_80px_rgba(0,0,0,0.95)] space-y-6 z-10 animate-in slide-in-from-bottom duration-300">
        
        {/* Top Drag Handle Indicator */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-brand-gold" />
            <h3 className="text-xl font-serif text-white italic font-bold">Filtros Táctiles VIP</h3>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white/40 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        {/* 1. Max Rate Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60 font-bold uppercase tracking-wider">Tarifa Máxima por Hora:</span>
            <span className="text-base font-serif font-bold text-brand-gold">${maxRate} USD</span>
          </div>

          <input
            type="range"
            min="60"
            max="300"
            step="10"
            value={maxRate}
            onChange={(e) => setMaxRate(Number(e.target.value))}
            className="w-full accent-brand-gold h-2 bg-white/10 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[8px] text-white/30 uppercase font-black tracking-widest">
            <span>$60 / h</span>
            <span>$150 / h</span>
            <span>$300+ / h</span>
          </div>
        </div>

        {/* 2. Fast Toggle Switches */}
        <div className="space-y-2.5">
          <span className="text-[9px] text-white/40 uppercase font-black tracking-widest block">Condiciones Rápidas:</span>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Online Toggle */}
            <button
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                onlyOnline ? 'border-emerald-400 bg-emerald-500/15 text-emerald-400' : 'border-white/10 glass-dark text-white/60'
              }`}
            >
              <span className="text-[10px] font-bold">🟢 En Línea Ahora</span>
              {onlyOnline && <Check size={12} />}
            </button>

            {/* 4K Verified Toggle */}
            <button
              onClick={() => setOnly4K(!only4K)}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                only4K ? 'border-brand-gold bg-brand-gold/15 text-brand-gold' : 'border-white/10 glass-dark text-white/60'
              }`}
            >
              <span className="text-[10px] font-bold">✨ Solo 4K Verified</span>
              {only4K && <Check size={12} />}
            </button>
          </div>
        </div>

        {/* 3. Category Chips */}
        <div className="space-y-2.5">
          <span className="text-[9px] text-white/40 uppercase font-black tracking-widest block">Tipo de Encuentro:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-pink text-white shadow-md'
                    : 'glass-dark border border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Apply Action Button */}
        <button
          onClick={handleApply}
          className="w-full py-4 rounded-2xl bg-brand-gold hover:bg-white text-brand-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_35px_rgba(212,168,67,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          Aplicar Filtros & Ver Modelos
        </button>

      </div>

    </div>
  );
}
