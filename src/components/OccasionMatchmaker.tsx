"use client";

import React, { useState } from "react";
import { 
  Wine, 
  Hotel, 
  Sailboat, 
  Plane, 
  HeartHandshake, 
  Sparkles, 
  Check, 
  ArrowRight 
} from "lucide-react";

export interface OccasionCategory {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  tagKeyword: string;
  accentColor: string;
}

const OCCASIONS: OccasionCategory[] = [
  {
    id: "dinner",
    name: "Cena Romántica VIP",
    tagline: "Restaurantes de lujo y etiqueta",
    icon: <Wine size={20} />,
    tagKeyword: "Cena",
    accentColor: "from-amber-500/20 to-brand-gold/10"
  },
  {
    id: "hotel",
    name: "Suite Hotel 5 Estrellas",
    tagline: "Discreción absoluta y confort",
    icon: <Hotel size={20} />,
    tagKeyword: "Hotel",
    accentColor: "from-purple-500/20 to-pink-500/10"
  },
  {
    id: "yacht",
    name: "Yates & Eventos Privados",
    tagline: "Fiestas exclusivas en alta mar",
    icon: <Sailboat size={20} />,
    tagKeyword: "Yate",
    accentColor: "from-cyan-500/20 to-blue-500/10"
  },
  {
    id: "travel",
    name: "Acompañante de Viaje",
    tagline: "Giras de negocios y escapadas",
    icon: <Plane size={20} />,
    tagKeyword: "Giras",
    accentColor: "from-emerald-500/20 to-teal-500/10"
  },
  {
    id: "massage",
    name: "Masaje Terapéutico & Relax",
    tagline: "Sesiones de desconexión total",
    icon: <HeartHandshake size={20} />,
    tagKeyword: "Masaje",
    accentColor: "from-rose-500/20 to-red-500/10"
  }
];

interface OccasionMatchmakerProps {
  activeOccasion?: string | null;
  onSelectOccasion: (tagKeyword: string | null) => void;
}

export default function OccasionMatchmaker({
  activeOccasion,
  onSelectOccasion
}: OccasionMatchmakerProps) {
  const [selected, setSelected] = useState<string | null>(activeOccasion || null);

  const handleSelect = (occ: OccasionCategory) => {
    if (selected === occ.tagKeyword) {
      setSelected(null);
      onSelectOccasion(null);
    } else {
      setSelected(occ.tagKeyword);
      onSelectOccasion(occ.tagKeyword);
    }
  };

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto px-4 md:px-12 my-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-brand-gold" />
          <h3 className="text-sm md:text-base font-serif text-white italic font-bold">
            Concierge por Ocasión Especial
          </h3>
        </div>

        {selected && (
          <button
            onClick={() => { setSelected(null); onSelectOccasion(null); }}
            className="text-[10px] text-brand-gold uppercase tracking-wider font-bold hover:underline self-start"
          >
            Mostrar Todas las Ocasiones ✕
          </button>
        )}
      </div>

      {/* 5 Cards Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {OCCASIONS.map((occ) => {
          const isCurrent = selected === occ.tagKeyword;
          return (
            <button
              key={occ.id}
              type="button"
              onClick={() => handleSelect(occ)}
              className={`p-5 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group ${
                isCurrent
                  ? "border-brand-gold bg-brand-gold/20 shadow-[0_0_35px_rgba(212,168,67,0.35)] scale-[1.03]"
                  : "border-brand-gold/20 glass-obsidian hover:border-brand-gold/50 hover:scale-[1.01]"
              }`}
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />

              {/* Top Icon */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  isCurrent ? "bg-brand-gold text-brand-black shadow-lg" : "glass-dark border border-brand-gold/30 text-brand-gold group-hover:bg-brand-gold/15"
                }`}>
                  {occ.icon}
                </div>

                {isCurrent && (
                  <span className="w-5 h-5 rounded-full bg-brand-gold text-brand-black flex items-center justify-center text-xs shadow-md">
                    <Check size={12} />
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="space-y-1">
                <h4 className="text-xs font-serif font-bold text-white group-hover:text-brand-gold transition-colors leading-snug">
                  {occ.name}
                </h4>
                <p className="text-[9px] text-white/40 leading-tight">
                  {occ.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
