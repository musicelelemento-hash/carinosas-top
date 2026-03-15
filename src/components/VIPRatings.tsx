"use client";

import React from "react";
import { Star, ShieldCheck } from "lucide-react";

interface Rating {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

const MOCK_RATINGS: Rating[] = [
  { id: '1', user: 'Caballero VIP', rating: 5, comment: 'Excelente atención y puntualidad. Totalmente recomendada. 💎', date: 'Hace 2 días' },
  { id: '2', user: 'Elite Gold', rating: 5, comment: 'Una experiencia de primer nivel en Guayaquil. 🍾', date: 'Hace 1 semana' },
];

export default function VIPRatings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-serif text-brand-gold">Reseñas Verificadas</h3>
        <div className="flex items-center gap-2 text-brand-pink text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck size={16} />
          Solo Miembros VIP
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_RATINGS.map((r) => (
          <div key={r.id} className="glass p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-white/80">{r.user}</span>
              <div className="flex items-center gap-1 text-brand-gold">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={10} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="text-sm text-brand-white/70 italic leading-relaxed">"{r.comment}"</p>
            <p className="text-[10px] text-brand-white/30 mt-3 text-right">{r.date}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl text-center">
        <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-black">
          ¿Deseas dejar una reseña? Contacta al administrador
        </p>
      </div>
    </div>
  );
}
