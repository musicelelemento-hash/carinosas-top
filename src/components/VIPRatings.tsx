"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, Crown, Award, ChevronRight, Sparkles, MessageCircle, CheckCircle2, Lock } from "lucide-react";
import { getVIPReviewsAction, type VIPReviewItem } from "@/app/actions/reviews";
import { sound } from "@/lib/soundEngine";
import { buildConciergeWhatsAppUrl } from "@/lib/whatsapp";

interface Rating {
  id: string;
  user: string;
  tier: string;
  rating: number;
  comment: string;
  city: string;
  date: string;
}

const TIERS = [
  { name: 'Socio Plata', badge: '🥈', perks: 'Catálogo Verificado + WhatsApp Directo', current: false },
  { name: 'Socio Oro', badge: '🥇', perks: 'Prioridad Radar GPS + Notificaciones Nuevas Modelos', current: false },
  { name: 'Socio Diamante', badge: '💎', perks: 'Acceso a Bóveda 4K Privada & Saludo de Voz HD', current: true },
  { name: 'Alpha Founder', badge: '👑', perks: 'Círculo Secreto Total + Concierge Humano 24/7', current: false },
];

interface VIPRatingsProps {
  modelId?: string;
}

export default function VIPRatings({ modelId }: VIPRatingsProps) {
  const [activeTierIndex, setActiveTierIndex] = useState(2); // Diamante
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [conciergeUnavailable, setConciergeUnavailable] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      setReviewsLoading(true);
      try {
        const data = await getVIPReviewsAction(modelId);
        if (data && data.length > 0) {
          const mapped: Rating[] = data.slice(0, 6).map((r) => ({
            id: r.id,
            user: r.author_alias || "Caballero VIP",
            tier: r.tier_badge || "Diamante VIP",
            rating: r.rating || 5,
            comment: r.comment,
            city: r.city || "Ecuador VIP",
            date: new Date(r.created_at).toLocaleDateString("es-EC", { day: "numeric", month: "short" })
          }));
          setReviews(mapped);
        }
      } catch (err) {
        console.warn("VIP reviews live fetch notice:", err);
      } finally {
        setReviewsLoading(false);
      }
    }
    loadReviews();
  }, [modelId]);

  const handleUpgradeTier = (tierName: string) => {
    sound.playGoldChime();
    const url = buildConciergeWhatsAppUrl(`Hola Concierge de Cariñosas.top, deseo solicitar la subida de mi membresía al rango ${tierName}.`);
    if (!url) {
      setConciergeUnavailable(true);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-10">
      
      {/* ── LOYALTY TIER PROGRESSION HUB ── */}
      <div className="glass-obsidian border border-brand-gold/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-brand-gold mb-1">
              <Award size={18} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Programa de Rangos Alpha</span>
            </div>
            <h3 className="text-2xl font-serif text-white italic font-bold">Escala tu Estatus VIP</h3>
          </div>
          <div className="px-4 py-2 rounded-full glass-dark border border-brand-gold/40 text-brand-gold text-[10px] font-black uppercase tracking-wider text-center">
            Nivel: {TIERS[activeTierIndex].name}
          </div>
        </div>
        {conciergeUnavailable && (
          <p role="status" className="mt-3 text-center text-xs text-white/50">El contacto de Concierge no está configurado en este momento.</p>
        )}

        {/* Tier Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TIERS.map((tier, idx) => (
            <button
              key={tier.name}
              onClick={() => {
                sound.playSubtleClick();
                setActiveTierIndex(idx);
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                activeTierIndex === idx
                  ? 'border-brand-gold bg-brand-gold/15 shadow-[0_0_20px_rgba(212,168,67,0.3)]'
                  : 'border-white/10 glass-dark hover:border-white/20'
              }`}
            >
              <div className="text-2xl mb-2">{tier.badge}</div>
              <span className="text-xs font-bold text-white block">{tier.name}</span>
              <p className="text-[8px] text-white/40 leading-relaxed mt-1">{tier.perks}</p>
            </button>
          ))}
        </div>

        {/* Upgrade Action Bar */}
        <div className="p-4 rounded-2xl glass-dark border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-brand-gold" />
            <p className="text-xs text-white/80">
              Desbloquea los beneficios del rango <strong className="text-brand-gold">{TIERS[activeTierIndex].name}</strong>
            </p>
          </div>
          <button
            onClick={() => handleUpgradeTier(TIERS[activeTierIndex].name)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-gold hover:bg-white text-brand-black text-[10px] font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
          >
            <MessageCircle size={14} fill="currentColor" />
            Solicitar Rango VIP
          </button>
        </div>
      </div>

      {/* ── VERIFIED MEMBER REVIEWS ── */}
        <div className="space-y-6">
          {reviewsLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-10 h-10 rounded-full border-2 border-brand-gold/10 rounded-full" />
              <div className="absolute inset-0 border-t-2 border-brand-gold rounded-full animate-spin" />
              <p className="mt-4 text-[10px] text-white/40 italic uppercase tracking-widest">Cargando reseñas verificadas...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full border border-brand-gold/30 bg-brand-gold/5 flex items-center justify-center mb-4">
                <ShieldCheck size={24} className="text-brand-gold" />
              </div>
              <h4 className="text-lg font-serif text-white italic font-bold">Sin reseñas verificadas aún</h4>
              <p className="text-[10px] text-white/50 max-w-sm mx-auto leading-relaxed">
                Las reseñas aparecerán cuando exista una reserva completada que podamos comprobar.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-white italic font-bold">Experiencias Verificadas</h3>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest font-black mt-0.5">Reseñas de citas completadas y comprobadas</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-obsidian border border-brand-gold/30 text-brand-gold text-[9px] font-black uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  Cita comprobada
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="glass-obsidian p-5 rounded-2xl border border-white/10 hover:border-brand-gold/30 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">{r.user}</span>
                        <span className="text-[8px] text-brand-gold font-bold uppercase tracking-wider">{r.tier} · {r.city}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-brand-gold">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-white/70 italic leading-relaxed">&quot;{r.comment}&quot;</p>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[8px] text-white/30 uppercase font-black tracking-widest">
                      <span>Cita Verificada</span>
                      <span>{r.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

    </div>
  );
}
